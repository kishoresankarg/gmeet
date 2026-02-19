from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import StreamingResponse
from app.models.schemas import (
    MeetingTranscriptRequest,
    MeetingTranscript,
    TranscriptAnalysisRequest,
    TranscriptAnalysisResponse,
    SaveAnalysisRequest,
)
from app.services.claude_service import ClaudeService
from app.services.transcript_service import TranscriptService
from app.services.export_service import ExportService
from app.services.notion_service import NotionService
from app.core.database import get_database
import logging
import uuid
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

claude_service = ClaudeService()
export_service = ExportService()
notion_service = NotionService()


@router.post("/analyze", response_model=TranscriptAnalysisResponse)
async def analyze_transcript(
    request: TranscriptAnalysisRequest,
    db=Depends(get_database),
):
    """Analyze a meeting transcript and extract summary, key points, and action items"""
    try:
        # Analyze using Claude/Gemini
        analysis = await claude_service.analyze_transcript(request.content)

        # Add IDs to action items
        for item in analysis.get("actionItems", []):
            item["id"] = str(uuid.uuid4())
            item["createdAt"] = datetime.utcnow().isoformat()

        logger.info("Successfully analyzed transcript")
        return TranscriptAnalysisResponse(**analysis)
    except Exception as e:
        logger.error(f"Error analyzing transcript: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze transcript")


@router.post("/export/pdf")
async def export_to_pdf(
    request: TranscriptAnalysisRequest,
    db=Depends(get_database),
):
    """Export transcript analysis as PDF"""
    try:
        analysis = await claude_service.analyze_transcript(request.content)

        pdf_bytes = ExportService.export_to_pdf(
            title="Meeting Analysis",
            summary=analysis.get("summary", ""),
            key_points=analysis.get("keyPoints", []),
            action_items=analysis.get("actionItems", []),
        )

        logger.info("Successfully exported PDF")
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=meeting_analysis.pdf"
            },
        )
    except Exception as e:
        logger.error(f"Error exporting to PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export PDF")


@router.post("/export/csv")
async def export_to_csv(
    request: TranscriptAnalysisRequest,
    db=Depends(get_database),
):
    """Export transcript analysis as CSV"""
    try:
        analysis = await claude_service.analyze_transcript(request.content)

        csv_content = ExportService.export_to_csv(
            title="Meeting Analysis",
            summary=analysis.get("summary", ""),
            key_points=analysis.get("keyPoints", []),
            action_items=analysis.get("actionItems", []),
        )

        logger.info("Successfully exported CSV")
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={
                "Content-Disposition": "attachment; filename=meeting_analysis.csv"
            },
        )
    except Exception as e:
        logger.error(f"Error exporting to CSV: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export CSV")


@router.get("/search")
async def search_transcripts(
    q: str = Query(..., min_length=1),
    db=Depends(get_database),
):
    """Search transcripts by keyword in MongoDB"""
    try:
        service = TranscriptService(db)
        results = await service.search_transcripts(q)
        return [MeetingTranscript(**t) for t in results]
    except Exception as e:
        logger.error(f"Error searching transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search transcripts")


@router.get("/filter/date-range")
async def filter_by_date_range(
    from_date: str = Query(...),
    to_date: str = Query(...),
    db=Depends(get_database),
):
    """Filter transcripts by date range from MongoDB"""
    try:
        service = TranscriptService(db)
        results = await service.filter_by_date_range(from_date, to_date)
        return [MeetingTranscript(**t) for t in results]
    except Exception as e:
        logger.error(f"Error filtering transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to filter transcripts")


@router.get("/sort")
async def sort_transcripts(
    sort_by: str = Query("date-newest"),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db=Depends(get_database),
):
    """Sort transcripts from MongoDB"""
    try:
        service = TranscriptService(db)
        results = await service.sort_transcripts(sort_by, skip, limit)
        return [MeetingTranscript(**t) for t in results]
    except Exception as e:
        logger.error(f"Error sorting transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to sort transcripts")


@router.get("", response_model=list[MeetingTranscript])
async def list_transcripts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db=Depends(get_database),
):
    """List all meeting transcripts from MongoDB"""
    try:
        service = TranscriptService(db)
        transcripts = await service.list_transcripts(skip=skip, limit=limit)
        return [MeetingTranscript(**t) for t in transcripts]
    except Exception as e:
        logger.error(f"Error listing transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list transcripts")


@router.post("", response_model=MeetingTranscript)
async def create_transcript(
    request: MeetingTranscriptRequest,
    db=Depends(get_database),
):
    """Create a new meeting transcript and save to MongoDB"""
    try:
        logger.info(f"Creating transcript: {request.title}")
        service = TranscriptService(db)
        transcript = await service.create_transcript(request.title, request.content)
        logger.info(
            f"Successfully created transcript with ID: {transcript.get('id')}"
        )
        return MeetingTranscript(**transcript)
    except Exception as e:
        logger.error(f"Error creating transcript: {str(e)}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Failed to create transcript: {str(e)}"
        )


@router.get("/{transcript_id}", response_model=MeetingTranscript)
async def get_transcript(
    transcript_id: str,
    db=Depends(get_database),
):
    """Get a specific meeting transcript from MongoDB"""
    try:
        logger.info(f"Getting transcript with ID: {transcript_id}")
        service = TranscriptService(db)
        transcript = await service.get_transcript(transcript_id)
        if not transcript:
            logger.warning(f"Transcript not found: {transcript_id}")
            raise HTTPException(
                status_code=404, detail=f"Transcript {transcript_id} not found"
            )
        logger.info(f"Successfully retrieved transcript: {transcript_id}")
        return MeetingTranscript(**transcript)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(
            f"Error getting transcript {transcript_id}: {str(e)}", exc_info=True
        )
        raise HTTPException(
            status_code=500, detail=f"Failed to get transcript: {str(e)}"
        )


@router.post("/{transcript_id}/analyze", response_model=TranscriptAnalysisResponse)
async def analyze_existing_transcript(
    transcript_id: str,
    db=Depends(get_database),
):
    """Analyze an existing transcript and save the summary back to MongoDB"""
    try:
        service = TranscriptService(db)
        transcript = await service.get_transcript(transcript_id)
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")

        # Run AI analysis
        analysis = await claude_service.analyze_transcript(transcript["content"])

        # Add IDs to action items
        for item in analysis.get("actionItems", []):
            item["id"] = str(uuid.uuid4())
            item["createdAt"] = datetime.utcnow().isoformat()

        # Save analysis back to the transcript in MongoDB
        updated = await service.save_analysis(transcript_id, analysis)
        if not updated:
            raise HTTPException(
                status_code=500, detail="Failed to save analysis to database"
            )

        logger.info(f"Analysis saved to transcript {transcript_id} in MongoDB")
        return TranscriptAnalysisResponse(**analysis)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error analyzing transcript {transcript_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to analyze transcript")


@router.put("/{transcript_id}", response_model=MeetingTranscript)
async def update_transcript(
    transcript_id: str,
    request: MeetingTranscriptRequest,
    db=Depends(get_database),
):
    """Update a meeting transcript in MongoDB"""
    try:
        service = TranscriptService(db)
        transcript = await service.update_transcript(
            transcript_id, request.model_dump()
        )
        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")
        return MeetingTranscript(**transcript)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating transcript: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to update transcript")


@router.put("/{transcript_id}/analysis", response_model=MeetingTranscript)
async def save_transcript_analysis(
    transcript_id: str,
    request: SaveAnalysisRequest,
    db=Depends(get_database),
):
    """Save analysis results (summary, key points, action items) to a transcript"""
    try:
        service = TranscriptService(db)
        updated = await service.save_analysis(transcript_id, request.model_dump())
        if not updated:
            raise HTTPException(status_code=404, detail="Transcript not found")
        logger.info(f"Analysis saved to transcript {transcript_id}")
        return MeetingTranscript(**updated)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error saving analysis: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to save analysis")


@router.delete("/{transcript_id}")
async def delete_transcript(
    transcript_id: str,
    db=Depends(get_database),
):
    """Delete a meeting transcript from MongoDB"""
    try:
        service = TranscriptService(db)
        result = await service.delete_transcript(transcript_id)
        if not result:
            raise HTTPException(status_code=404, detail="Transcript not found")
        return {"message": "Transcript deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting transcript: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to delete transcript")


@router.post("/{transcript_id}/export/notion")
async def export_to_notion(
    transcript_id: str,
    db=Depends(get_database),
):
    """Export transcript to Notion"""
    try:
        service = TranscriptService(db)
        transcript = await service.get_transcript(transcript_id)

        if not transcript:
            raise HTTPException(status_code=404, detail="Transcript not found")

        result = await notion_service.export_to_notion(transcript)

        if result and result.get("success"):
            return {
                "message": "Successfully exported to Notion",
                "notion_id": result.get("data", {}).get("id"),
            }
        else:
            logger.warning("Notion export failed or no API key configured")
            return {
                "message": "Export to Notion requires NOTION_API_KEY and NOTION_DATABASE_ID in environment"
            }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error exporting to Notion: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export to Notion")
