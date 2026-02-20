import os
import httpx
import asyncio
from dotenv import load_dotenv

load_dotenv()

async def make_board_public():
    api_key = os.getenv('TRELLO_API_KEY')
    token = os.getenv('TRELLO_TOKEN')
    board_id = '69975eafb3de2e34bb00aff9' # Full ID from previous step
    
    async with httpx.AsyncClient() as client:
        # Update board visibility to public
        print(f"Attempting to make board {board_id} public for embedding...")
        url = f"https://api.trello.com/1/boards/{board_id}?key={api_key}&token={token}&prefs/permissionLevel=public"
        resp = await client.put(url)
        
        if resp.status_code == 200:
            print("✅ Board is now PUBLIC. The embed should work perfectly!")
        else:
            print(f"❌ Failed to update visibility: {resp.text}")

if __name__ == "__main__":
    asyncio.run(make_board_public())
