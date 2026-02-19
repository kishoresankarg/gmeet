from datetime import datetime
from typing import List, Optional
from bson import ObjectId
import logging

logger = logging.getLogger(__name__)


class TranscriptService:
    def __init__(self, db):
        self.db = db
        self.collection = db["transcripts"]

    async def create_transcript(self, title: str, content: str) -> dict:
        """Create a new transcript"""
        now = datetime.utcnow().isoformat()
        transcript = {
            "title": title,
            "content": content,
            "createdAt": now,
            "updatedAt": now,
            "summary": None,
            "keyPoints": [],
            "actionItems": [],
        }
        result = await self.collection.insert_one(transcript)
        transcript["id"] = str(result.inserted_id)
        return transcript

    async def save_analysis(self, transcript_id: str, analysis: dict) -> Optional[dict]:
        """Save AI analysis (summary, key points, action items) to a transcript"""
        try:
            obj_id = ObjectId(transcript_id)
        except Exception:
            obj_id = transcript_id

        logger.info(f"save_analysis: Looking for transcript _id={obj_id} (type={type(obj_id)})")

        update_data = {
            "summary": analysis.get("summary"),
            "keyPoints": analysis.get("keyPoints", []),
            "actionItems": analysis.get("actionItems", []),
            "updatedAt": datetime.utcnow().isoformat(),
        }

        # First verify the document exists
        existing = await self.collection.find_one({"_id": obj_id})
        if not existing:
            logger.error(f"save_analysis: Document with _id={obj_id} NOT FOUND in collection")
            # Try string ID as fallback
            existing = await self.collection.find_one({"_id": transcript_id})
            if existing:
                obj_id = transcript_id
                logger.info(f"save_analysis: Found with string _id={transcript_id}")
            else:
                logger.error(f"save_analysis: Document not found with either ObjectId or string")
                return None

        await self.collection.update_one(
            {"_id": obj_id},
            {"$set": update_data},
        )
        result = await self.collection.find_one({"_id": obj_id})
        if result:
            result["id"] = str(result["_id"])
            logger.info(f"save_analysis: Successfully updated transcript {transcript_id}")
        return result

    async def get_transcript(self, transcript_id: str) -> Optional[dict]:
        """Get transcript by ID"""
        try:
            try:
                obj_id = ObjectId(transcript_id)
            except Exception:
                obj_id = transcript_id

            transcript = await self.collection.find_one({"_id": obj_id})
            if transcript:
                transcript["id"] = str(transcript["_id"])
            return transcript
        except Exception as e:
            logger.error(f"Error getting transcript: {str(e)}")
            return None

    async def list_transcripts(self, skip: int = 0, limit: int = 10) -> List[dict]:
        """List all transcripts sorted by newest first"""
        cursor = self.collection.find().sort("createdAt", -1).skip(skip).limit(limit)
        transcripts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            transcripts.append(doc)
        return transcripts

    async def update_transcript(self, transcript_id: str, updates: dict) -> Optional[dict]:
        """Update transcript"""
        try:
            try:
                obj_id = ObjectId(transcript_id)
            except Exception:
                obj_id = transcript_id

            updates["updatedAt"] = datetime.utcnow().isoformat()
            result = await self.collection.find_one_and_update(
                {"_id": obj_id},
                {"$set": updates},
                return_document=True,
            )
            if result:
                result["id"] = str(result["_id"])
            return result
        except Exception as e:
            logger.error(f"Error updating transcript: {str(e)}")
            return None

    async def delete_transcript(self, transcript_id: str) -> bool:
        """Delete transcript"""
        try:
            try:
                obj_id = ObjectId(transcript_id)
            except Exception:
                obj_id = transcript_id

            result = await self.collection.delete_one({"_id": obj_id})
            return result.deleted_count > 0
        except Exception as e:
            logger.error(f"Error deleting transcript: {str(e)}")
            return False

    async def search_transcripts(self, query: str) -> List[dict]:
        """Search transcripts by title or content"""
        search_filter = {
            "$or": [
                {"title": {"$regex": query, "$options": "i"}},
                {"content": {"$regex": query, "$options": "i"}},
                {"summary": {"$regex": query, "$options": "i"}},
            ]
        }
        cursor = self.collection.find(search_filter).sort("createdAt", -1)
        transcripts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            transcripts.append(doc)
        return transcripts

    async def filter_by_date_range(self, from_date: str, to_date: str) -> List[dict]:
        """Filter transcripts by date range"""
        try:
            from_dt = datetime.fromisoformat(from_date)
            to_dt = datetime.fromisoformat(to_date)

            from_iso = from_dt.isoformat()
            to_iso = to_dt.isoformat()

            search_filter = {
                "createdAt": {
                    "$gte": from_iso,
                    "$lte": to_iso,
                }
            }

            cursor = self.collection.find(search_filter).sort("createdAt", -1)
            transcripts = []
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                transcripts.append(doc)
            return transcripts
        except Exception as e:
            logger.error(f"Error filtering by date range: {str(e)}")
            return []

    async def sort_transcripts(self, sort_by: str, skip: int = 0, limit: int = 10) -> List[dict]:
        """Sort transcripts by date or title"""
        try:
            sort_map = {
                "date-newest": ("createdAt", -1),
                "date-oldest": ("createdAt", 1),
                "title-asc": ("title", 1),
                "title-desc": ("title", -1),
            }
            sort_field, sort_order = sort_map.get(sort_by, ("createdAt", -1))

            cursor = self.collection.find().sort(sort_field, sort_order).skip(skip).limit(limit)
            transcripts = []
            async for doc in cursor:
                doc["id"] = str(doc["_id"])
                transcripts.append(doc)
            return transcripts
        except Exception as e:
            logger.error(f"Error sorting transcripts: {str(e)}")
            return []

    async def get_all_with_summary(self) -> List[dict]:
        """Get all transcripts that have summaries"""
        cursor = self.collection.find(
            {"summary": {"$ne": None}}
        ).sort("createdAt", -1)
        transcripts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            transcripts.append(doc)
        return transcripts
