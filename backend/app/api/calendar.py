from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Dict, Any
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class SyncRequest(BaseModel):
    token: str
    items: List[Dict[str, Any]]

# Oauth Scopes
SCOPES = ['https://www.googleapis.com/auth/calendar.events']

@router.get("/auth-url")
async def get_auth_url():
    """Generates the Google OAuth2 URL so the user can login."""
    if not settings.GOOGLE_CLIENT_ID or not settings.GOOGLE_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Google API keys not configured in backend")
        
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "project_id": "meetpulse",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uris": ["http://localhost:3000/calendar"]
        }
    }
    
    flow = Flow.from_client_config(
        client_config, 
        scopes=SCOPES,
        redirect_uri="http://localhost:3000/calendar"
    )
    
    auth_url, _ = flow.authorization_url(prompt='consent', access_type='offline')
    return {"auth_url": auth_url}

class CodeExchangeRequest(BaseModel):
    code: str

@router.post("/exchange")
async def exchange_code(req: CodeExchangeRequest):
    """Exchanges the autorization code for an access token."""
    client_config = {
        "web": {
            "client_id": settings.GOOGLE_CLIENT_ID,
            "project_id": "meetpulse",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uris": ["http://localhost:3000/calendar"]
        }
    }
    
    try:
        flow = Flow.from_client_config(
            client_config, 
            scopes=SCOPES,
            redirect_uri="http://localhost:3000/calendar"
        )
        flow.fetch_token(code=req.code)
        credentials = flow.credentials
        return {
            "token": credentials.token,
            "refresh_token": credentials.refresh_token,
            "expires_in": credentials.expiry.isoformat() if credentials.expiry else None
        }
    except Exception as e:
        logger.error(f"Error exchanging token: {e}")
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/sync")
async def sync_calendar(req: SyncRequest):
    """Syncs given items directly to the user's Google Calendar"""
    if not req.token:
        raise HTTPException(status_code=401, detail="Authentication token required")
    
    try:
        creds = Credentials(token=req.token)
        service = build('calendar', 'v3', credentials=creds)
        
        synced_ids = []
        for task in req.items:
            # Construct Event
            from datetime import datetime, timedelta
            deadline = task.get('deadline')
            if deadline:
                try:
                    dt = datetime.strptime(deadline, "%Y-%m-%d")
                    # Fix 2001 bug if backend still processes it
                    if dt.year == 2001:
                        dt = dt.replace(year=datetime.now().year)
                except ValueError:
                    dt = datetime.now() + timedelta(days=1)
            else:
                dt = datetime.now() + timedelta(days=1)
            
            # Start at 9 AM, end at 10 AM
            start_dt = dt.replace(hour=9, minute=0, second=0).isoformat() + '-00:00'
            end_dt = dt.replace(hour=10, minute=0, second=0).isoformat() + '-00:00'

            event = {
                'summary': f"Task: {task.get('description')}",
                'description': f"Priority: {task.get('priority', 'medium').upper()}\\nOwner: {task.get('owner', 'TBD')}",
                'start': {
                    'dateTime': start_dt,
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_dt,
                    'timeZone': 'UTC',
                },
            }
            inserted_event = service.events().insert(calendarId='primary', body=event).execute()
            synced_ids.append(inserted_event.get('htmlLink'))
            
        return {"message": "Successfully synced to Google Calendar", "events": synced_ids}
    except Exception as e:
        logger.error(f"Failed to sync calendar: {e}")
        raise HTTPException(status_code=500, detail=str(e))
