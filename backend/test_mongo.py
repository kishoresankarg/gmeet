import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

mongo_url = os.getenv("MONGODB_URL")
print(f"Connecting to: {mongo_url.split('@')[-1] if '@' in mongo_url else 'local'}")

try:
    client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
    client.admin.command('ping')
    print("Successfully connected to MongoDB Atlas!")
except Exception as e:
    print(f"Connection failed: {e}")
