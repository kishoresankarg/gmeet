from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class ActionItemRequest(BaseModel):
    description: str
    owner: Optional[str] = None
    deadline: Optional[str] = None
    priority: str = Field(default="medium", pattern="^(high|medium|low)$")
    status: str = Field(default="pending", pattern="^(pending|in-progress|completed)$")


class ActionItem(ActionItemRequest):
    id: str
    createdAt: datetime


class TranscriptAnalysisRequest(BaseModel):
    content: str = Field(..., min_length=10)


class TranscriptAnalysisResponse(BaseModel):
    summary: str
    keyPoints: List[str]
    actionItems: List[ActionItem]
    duration: Optional[int] = None
    participantCount: Optional[int] = None


class MeetingTranscriptRequest(BaseModel):
    title: str = Field(..., min_length=1)
    content: str = Field(..., min_length=10)


class MeetingTranscript(BaseModel):
    id: str
    title: str
    content: str
    createdAt: datetime
    updatedAt: datetime
    summary: Optional[str] = None
    keyPoints: Optional[List[str]] = None
    actionItems: Optional[List[ActionItem]] = None


class SaveAnalysisRequest(BaseModel):
    summary: Optional[str] = None
    keyPoints: Optional[List[str]] = None
    actionItems: Optional[List[dict]] = None


class HealthResponse(BaseModel):
    status: str
    message: str
    version: str
