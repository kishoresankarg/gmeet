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

    async def get_transcript(self, transcript_id: str) -> Optional[dict]:
        """Get transcript by ID"""
        try:
            transcript = await self.collection.find_one({"_id": transcript_id})
            if transcript:
                transcript["id"] = str(transcript.get("_id", transcript_id))
            return transcript
        except Exception as e:
            logger.error(f"Error getting transcript: {str(e)}")
            return None

    async def list_transcripts(self, skip: int = 0, limit: int = 10) -> List[dict]:
        """List all transcripts"""
        cursor = self.collection.find().skip(skip).limit(limit)
        transcripts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            transcripts.append(doc)
        return transcripts

    async def update_transcript(self, transcript_id: str, updates: dict) -> Optional[dict]:
        """Update transcript"""
        try:
            updates["updatedAt"] = datetime.utcnow().isoformat()
            result = await self.collection.find_one_and_update(
                {"_id": transcript_id},
                {"$set": updates},
                return_document=True,
            )
            if result:
                result["id"] = str(result.get("_id", transcript_id))
            return result
        except Exception as e:
            logger.error(f"Error updating transcript: {str(e)}")
            return None

    async def delete_transcript(self, transcript_id: str) -> bool:
        """Delete transcript"""
        try:
            result = await self.collection.delete_one({"_id": transcript_id})
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
            ]
        }
        cursor = self.collection.find(search_filter)
        transcripts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            transcripts.append(doc)
        return transcripts
