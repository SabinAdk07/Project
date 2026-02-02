from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings
from typing import Optional

# MongoDB client instance
_client: Optional[AsyncIOMotorClient] = None


async def connect_to_mongo():
    """Establish connection to MongoDB"""
    global _client
    try:
        _client = AsyncIOMotorClient(settings.mongodb_url)
        # Verify connection
        await _client.admin.command('ping')
        print(f"✅ Connected to MongoDB at {settings.mongodb_url}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection"""
    global _client
    if _client:
        _client.close()
        print("🔌 MongoDB connection closed")


def get_database():
    """Get database instance"""
    if _client is None:
        raise Exception("Database not initialized. Call connect_to_mongo first.")
    return _client[settings.database_name]


def get_collection(collection_name: str):
    """Get collection from database"""
    db = get_database()
    return db[collection_name]
