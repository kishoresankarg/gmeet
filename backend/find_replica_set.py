import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

async def get_replica_set_name():
    uri = "mongodb+srv://kishoresankarg23cse_db_user:1234%40sankar@cluster0.1cmrszx.mongodb.net/"
    client = AsyncIOMotorClient(uri)
    try:
        # Pinging will force connection and populate topology
        await client.admin.command('ping')
        description = client.topology_description
        print(f"Topology type: {description.topology_type}")
        for server in description.server_descriptions().values():
            print(f"Server: {server.address}, Replica Set: {server.replica_set_name}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(get_replica_set_name())
