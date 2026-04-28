"""
AI Meeting Notes & Action Item Generator
Backend API
"""

from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
import sys
from pathlib import Path

# Prometheus
from prometheus_client import Counter, generate_latest

# Add app directory to path
sys.path.insert(0, str(Path(__file__).parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from app.api import transcripts, health, calendar
from app.core.database import connect_to_mongo, close_mongo_connection

# ------------------ PROMETHEUS ------------------
REQUEST_COUNT = Counter("request_count", "Total API Requests")

# Lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application starting up")
    await connect_to_mongo()
    yield
    logger.info("Application shutting down")
    await close_mongo_connection()

# App init
app = FastAPI(
    title="Meeting Notes Generator API",
    version="1.0.0",
    lifespan=lifespan,
)

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(health.router)
app.include_router(transcripts.router, prefix="/api/transcripts")
app.include_router(calendar.router, prefix="/api/calendar")

# ------------------ ROUTES ------------------

@app.get("/")
async def root():
    REQUEST_COUNT.inc()
    return {"message": "API running"}

# 🔥 IMPORTANT: Prometheus endpoint
@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type="text/plain")

# ------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000)