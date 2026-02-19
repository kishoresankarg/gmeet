import logging
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger(__name__)


class Database:
    client: AsyncIOMotorClient = None
    db = None


async def connect_to_mongo():
    """Initialize MongoDB connection"""
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URL}")
        Database.client = AsyncIOMotorClient(settings.MONGODB_URL)
        Database.db = Database.client[settings.DATABASE_NAME]

        # Verify connection
        await Database.client.admin.command("ping")
        logger.info(f"Connected to MongoDB database: {settings.DATABASE_NAME}")

        # Create indexes for better query performance
        transcripts_collection = Database.db["transcripts"]
        await transcripts_collection.create_index("createdAt")
        await transcripts_collection.create_index("title")
        await transcripts_collection.create_index(
            [("title", "text"), ("content", "text"), ("summary", "text")]
        )
        logger.info("Database indexes created successfully")

    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        raise RuntimeError(f"Could not connect to MongoDB: {str(e)}")


async def close_mongo_connection():
    """Close MongoDB connection"""
    if Database.client:
        Database.client.close()
        logger.info("MongoDB connection closed")


def get_database():
    """Get database instance"""
    if Database.db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return Database.db
