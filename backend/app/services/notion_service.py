import os
import httpx
from typing import Optional, Dict, Any
from datetime import datetime

class NotionService:
    """Service for exporting meeting notes to Notion"""
    
    def __init__(self):
        self.api_key = os.getenv('NOTION_API_KEY')
        self.database_id = os.getenv('NOTION_DATABASE_ID')
        self.api_url = 'https://api.notion.com/v1'
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Notion-Version': '2022-06-28',
            'Content-Type': 'application/json',
        }
    
    async def export_to_notion(self, transcript_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Export meeting notes to Notion database
        
        Args:
            transcript_data: Meeting transcript with summary, key points, and action items
            
        Returns:
            Response from Notion API or None if failed
        """
        if not self.api_key or not self.database_id:
            return None
        
        try:
            page_data = self._prepare_notion_page(transcript_data)
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f'{self.api_url}/pages',
                    json=page_data,
                    headers=self.headers
                )
                
                if response.status_code in [200, 201]:
                    return {'success': True, 'data': response.json()}
                else:
                    return {'success': False, 'error': response.text}
        except Exception as e:
            return {'success': False, 'error': str(e)}
    
    def _prepare_notion_page(self, transcript_data: Dict[str, Any]) -> Dict[str, Any]:
        """Prepare page data for Notion API"""
        
        return {
            'parent': {'database_id': self.database_id},
            'properties': {
                'Title': {
                    'title': [
                        {'text': {'content': transcript_data.get('title', 'Untitled Meeting')}}
                    ]
                },
                'Summary': {
                    'rich_text': [
                        {'text': {'content': transcript_data.get('summary', '')}}
                    ]
                },
                'Date': {
                    'date': {
                        'start': datetime.now().isoformat()
                    }
                },
                'Status': {
                    'select': {'name': 'Completed'}
                },
            },
            'children': self._prepare_notion_blocks(transcript_data)
        }
    
    def _prepare_notion_blocks(self, transcript_data: Dict[str, Any]) -> list:
        """Prepare content blocks for Notion page"""
        blocks = []
        
        # Key Points Section
        if transcript_data.get('keyPoints'):
            blocks.append({
                'object': 'block',
                'type': 'heading_2',
                'heading_2': {
                    'rich_text': [{'text': {'content': 'Key Points'}}]
                }
            })
            
            for point in transcript_data['keyPoints']:
                blocks.append({
                    'object': 'block',
                    'type': 'bulleted_list_item',
                    'bulleted_list_item': {
                        'rich_text': [{'text': {'content': point}}]
                    }
                })
        
        # Action Items Section
        if transcript_data.get('actionItems'):
            blocks.append({
                'object': 'block',
                'type': 'heading_2',
                'heading_2': {
                    'rich_text': [{'text': {'content': 'Action Items'}}]
                }
            })
            
            for item in transcript_data['actionItems']:
                description = item.get('description', '')
                owner = item.get('owner', 'Unassigned')
                priority = item.get('priority', 'Medium').upper()
                deadline = item.get('deadline', 'No deadline')
                
                content = f"{description} | Owner: {owner} | Priority: {priority} | Deadline: {deadline}"
                
                blocks.append({
                    'object': 'block',
                    'type': 'bulleted_list_item',
                    'bulleted_list_item': {
                        'rich_text': [{'text': {'content': content}}]
                    }
                })
        
        return blocks
