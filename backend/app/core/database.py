import logging

logger = logging.getLogger(__name__)


class MockDatabase:
    """In-memory mock database for testing"""
    def __init__(self):
        self.transcripts = {}
        self.counter = 0
    
    def __getitem__(self, key):
        """Support dict-like access for collections (returns self)"""
        return self
    
    async def insert_one(self, doc):
        self.counter += 1
        doc_id = str(self.counter)
        doc_copy = doc.copy()
        doc_copy["_id"] = doc_id
        self.transcripts[doc_id] = doc_copy
        
        class FakeResult:
            def __init__(self, inserted_id):
                self.inserted_id = inserted_id
        return FakeResult(doc_id)
    
    async def find_one(self, query):
        if "_id" in query:
            doc_id = query["_id"]
            return self.transcripts.get(doc_id)
        return None
    
    def find(self, query=None):
        class MockCursor:
            def __init__(self, items):
                self.items = list(items.values())
                self.skip_n = 0
                self.limit_n = None
            
            def skip(self, n):
                self.skip_n = n
                return self
            
            def limit(self, n):
                self.limit_n = n
                return self
            
            async def __aiter__(self):
                result = self.items[self.skip_n:]
                if self.limit_n:
                    result = result[:self.limit_n]
                for item in result:
                    yield item
        
        return MockCursor(self.transcripts)
    
    async def find_one_and_update(self, query, update, return_document=False):
        if "_id" in query:
            doc_id = query["_id"]
            if doc_id in self.transcripts:
                if "$set" in update:
                    self.transcripts[doc_id].update(update["$set"])
                return self.transcripts[doc_id]
        return None
    
    async def delete_one(self, query):
        if "_id" in query:
            doc_id = query["_id"]
            if doc_id in self.transcripts:
                del self.transcripts[doc_id]
                class FakeResult:
                    deleted_count = 1
                return FakeResult()
        class FakeResult:
            deleted_count = 0
        return FakeResult()


class Database:
    client = None
    db = None


async def connect_to_mongo():
    """Initialize database connection"""
    logger.info("Initializing in-memory database for development")
    Database.db = MockDatabase()
    logger.info("Database ready")


async def close_mongo_connection():
    """Close database connection"""
    logger.info("Closing database connection")


def get_database():
    """Get database instance"""
    if Database.db is None:
        raise RuntimeError("Database not initialized. Call connect_to_mongo first.")
    return Database.db
