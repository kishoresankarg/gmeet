"""
AI Meeting Notes & Action Item Generator
Backend API
"""

from fastapi import FastAPI, HTTPException, UploadFile, File, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import sys
from pathlib import Path

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Import routers
from app.api import transcripts, health
from app.core.database import connect_to_mongo, close_mongo_connection

# Lifespan context
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up")
    await connect_to_mongo()
    yield
    # Shutdown
    logger.info("Application shutting down")
    await close_mongo_connection()


# Initialize FastAPI app
app = FastAPI(
    title="Meeting Notes Generator API",
    description="API for AI-powered meeting notes analysis",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router)
app.include_router(transcripts.router, prefix="/api/transcripts", tags=["transcripts"])


@app.get("/")
async def root():
    return {
        "message": "AI Meeting Notes Generator API",
        "version": "1.0.0",
        "docs": "/docs",
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
