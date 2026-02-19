from fastapi import APIRouter, HTTPException, Depends, Query
from fastapi.responses import FileResponse, StreamingResponse
from app.models.schemas import (
    MeetingTranscriptRequest,
    MeetingTranscript,
    TranscriptAnalysisRequest,
    TranscriptAnalysisResponse,
)
from app.services.claude_service import ClaudeService
from app.services.transcript_service import TranscriptService
from app.services.export_service import ExportService
from app.core.database import get_database
import logging
import uuid

logger = logging.getLogger(__name__)

router = APIRouter()

claude_service = ClaudeService()
export_service = ExportService()


@router.post("/analyze", response_model=TranscriptAnalysisResponse)
async def analyze_transcript(
    request: TranscriptAnalysisRequest,
    db = Depends(get_database),
):
    """Analyze a meeting transcript and extract summary, key points, and action items"""
    try:
        # Analyze using Claude
        analysis = await claude_service.analyze_transcript(request.content)

        # Add IDs to action items
        from datetime import datetime
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
    db = Depends(get_database),
):
    """Export transcript analysis as PDF"""
    try:
        # Analyze transcript
        analysis = await claude_service.analyze_transcript(request.content)
        
        # Generate PDF
        pdf_bytes = ExportService.export_to_pdf(
            title="Meeting Analysis",
            summary=analysis.get("summary", ""),
            key_points=analysis.get("keyPoints", []),
            action_items=analysis.get("actionItems", [])
        )
        
        logger.info("Successfully exported PDF")
        return StreamingResponse(
            iter([pdf_bytes]),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=meeting_analysis.pdf"}
        )
    except Exception as e:
        logger.error(f"Error exporting to PDF: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export PDF")


@router.post("/export/csv")
async def export_to_csv(
    request: TranscriptAnalysisRequest,
    db = Depends(get_database),
):
    """Export transcript analysis as CSV"""
    try:
        # Analyze transcript
        analysis = await claude_service.analyze_transcript(request.content)
        
        # Generate CSV
        csv_content = ExportService.export_to_csv(
            title="Meeting Analysis",
            summary=analysis.get("summary", ""),
            key_points=analysis.get("keyPoints", []),
            action_items=analysis.get("actionItems", [])
        )
        
        logger.info("Successfully exported CSV")
        return StreamingResponse(
            iter([csv_content]),
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=meeting_analysis.csv"}
        )
    except Exception as e:
        logger.error(f"Error exporting to CSV: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to export CSV")


@router.post("", response_model=MeetingTranscript)
async def create_transcript(
    request: MeetingTranscriptRequest,
    db = Depends(get_database),
):
    """Create a new meeting transcript"""
    try:
        logger.info(f"Creating transcript: {request.title}")
        service = TranscriptService(db)
        transcript = await service.create_transcript(request.title, request.content)
        logger.info(f"Successfully created transcript with ID: {transcript.get('id')}")
        return MeetingTranscript(**transcript)
    except Exception as e:
        logger.error(f"Error creating transcript: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to create transcript: {str(e)}")


@router.get("", response_model=list[MeetingTranscript])
async def list_transcripts(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db = Depends(get_database),
):
    """List all meeting transcripts"""
    try:
        service = TranscriptService(db)
        transcripts = await service.list_transcripts(skip=skip, limit=limit)
        return [MeetingTranscript(**t) for t in transcripts]
    except Exception as e:
        logger.error(f"Error listing transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to list transcripts")


@router.get("/{transcript_id}", response_model=MeetingTranscript)
async def get_transcript(
    transcript_id: str,
    db = Depends(get_database),
):
    """Get a specific meeting transcript"""
    try:
        logger.info(f"Getting transcript with ID: {transcript_id}")
        service = TranscriptService(db)
        transcript = await service.get_transcript(transcript_id)
        if not transcript:
            logger.warning(f"Transcript not found: {transcript_id}")
            raise HTTPException(status_code=404, detail=f"Transcript {transcript_id} not found")
        logger.info(f"Successfully retrieved transcript: {transcript_id}")
        return MeetingTranscript(**transcript)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting transcript {transcript_id}: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Failed to get transcript: {str(e)}")


@router.put("/{transcript_id}", response_model=MeetingTranscript)
async def update_transcript(
    transcript_id: str,
    request: MeetingTranscriptRequest,
    db = Depends(get_database),
):
    """Update a meeting transcript"""
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


@router.delete("/{transcript_id}")
async def delete_transcript(
    transcript_id: str,
    db = Depends(get_database),
):
    """Delete a meeting transcript"""
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


@router.get("/search")
async def search_transcripts(
    q: str = Query(..., min_length=1),
    db = Depends(get_database),
):
    """Search transcripts by keyword"""
    try:
        service = TranscriptService(db)
        results = await service.search_transcripts(q)
        return [MeetingTranscript(**t) for t in results]
    except Exception as e:
        logger.error(f"Error searching transcripts: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to search transcripts")
