import json
from typing import AsyncGenerator
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
import logging

logger = logging.getLogger(__name__)

# Mock database for testing without MongoDB
class MockTranscriptDB:
    def __init__(self):
        self.transcripts = {}
    
    async def create(self, data):
        doc_id = str(len(self.transcripts) + 1)
        self.transcripts[doc_id] = data
        return {**data, "_id": doc_id, "id": doc_id}
    
    async def get(self, doc_id):
        return self.transcripts.get(doc_id)
    
    async def list(self):
        return list(self.transcripts.values())
    
    async def update(self, doc_id, data):
        if doc_id in self.transcripts:
            self.transcripts[doc_id].update(data)
            return self.transcripts[doc_id]
        return None
    
    async def delete(self, doc_id):
        if doc_id in self.transcripts:
            del self.transcripts[doc_id]
            return True
        return False


# Global database instance
mock_db = MockTranscriptDB()


async def get_database():
    """Dependency for database access"""
    return mock_db
