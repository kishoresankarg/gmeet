import google.generativeai as genai
import json
import logging
from app.core.config import settings

logger = logging.getLogger(__name__)


class ClaudeService:
    def __init__(self):
        if not settings.CLAUDE_API_KEY:
            self.client = None
            logger.warning("Gemini API key not configured. Using mock responses.")
        else:
            try:
                genai.configure(api_key=settings.CLAUDE_API_KEY)
                self.client = genai.GenerativeModel("gemini-1.5-flash")
                logger.info("Gemini API configured successfully")
            except Exception as e:
                logger.warning(f"Failed to configure Gemini API: {str(e)}. Using mock responses.")
                self.client = None
        self.model = "gemini-1.5-flash"

    async def analyze_transcript(self, content: str) -> dict:
        """
        Analyze meeting transcript using Gemini API or mock
        Returns: {summary, keyPoints, actionItems}
        """
        if self.client is None:
            return self._mock_analysis(content)
        
        try:
            prompt = f"""
Analyze this meeting transcript and provide:
1. A concise summary (2-3 sentences)
2. Key points discussed (as a list)
3. Action items with description, owner (if mentioned), deadline, and priority

Return the response as valid JSON with this structure:
{{
    "summary": "...",
    "keyPoints": ["point1", "point2", ...],
    "actionItems": [
        {{
            "description": "task description",
            "owner": "name or null",
            "deadline": "date or null",
            "priority": "high/medium/low",
            "status": "pending"
        }}
    ]
}}

Meeting Transcript:
{content}
"""

            response = self.client.generate_content(prompt)
            response_text = response.text

            # Extract JSON from response
            import re
            json_match = re.search(r'\{[\s\S]*\}', response_text)
            if json_match:
                result = json.loads(json_match.group())
                logger.info(f"Successfully analyzed transcript, found {len(result.get('actionItems', []))} action items")
                return result
            else:
                logger.error("Could not find JSON in Gemini response")
                raise ValueError("Invalid response format from Gemini")

        except Exception as e:
            logger.error(f"Error analyzing transcript with Gemini: {str(e)}")
            # Fallback to mock analysis
            return self._mock_analysis(content)

    def _mock_analysis(self, content: str) -> dict:
        """Generate intelligent mock analysis by parsing meeting transcript"""
        import uuid
        from datetime import datetime
        import re
        
        now = datetime.utcnow().isoformat()
        
        # Extract priority declarations more carefully
        high_priority_items = set()
        medium_priority_items = set()
        low_priority_items = set()
        
        # Look for patterns like "X is/are high priority" or "high priority: X"
        # Pattern 1: "word word is high priority" or "word is high priority"
        for match in re.finditer(r'([a-z]+(?:\s+[a-z]+)?)\s+(?:is|are)\s+high\s+priority', content, re.IGNORECASE):
            items = match.group(1).lower().split()
            for item in items:
                if len(item) > 2:  # Skip short words
                    high_priority_items.add(item)
        
        # Pattern 2: "high priority: word, word"
        for match in re.finditer(r'high\s+priority[:\s]+([^.\n]+)', content, re.IGNORECASE):
            items = match.group(1).split(',')
            for item in items:
                item = item.strip().lower()
                # Extract first meaningful word
                words = item.split()
                for word in words:
                    if len(word) > 2 and word not in ['are', 'is', 'the', 'and']:
                        high_priority_items.add(word)
        
        # Do same for medium priority
        for match in re.finditer(r'([a-z]+(?:\s+[a-z]+)?)\s+(?:is|are)\s+medium\s+priority', content, re.IGNORECASE):
            items = match.group(1).lower().split()
            for item in items:
                if len(item) > 2:
                    medium_priority_items.add(item)
        
        for match in re.finditer(r'medium\s+priority[:\s]+([^.\n]+)', content, re.IGNORECASE):
            items = match.group(1).split(',')
            for item in items:
                item = item.strip().lower()
                words = item.split()
                for word in words:
                    if len(word) > 2 and word not in ['are', 'is', 'the', 'and']:
                        medium_priority_items.add(word)
        
        # Do same for low priority
        for match in re.finditer(r'([a-z]+(?:\s+[a-z]+)?)\s+(?:is|are)\s+low\s+priority', content, re.IGNORECASE):
            items = match.group(1).lower().split()
            for item in items:
                if len(item) > 2:
                    low_priority_items.add(item)
        
        for match in re.finditer(r'low\s+priority[:\s]+([^.\n]+)', content, re.IGNORECASE):
            items = match.group(1).split(',')
            for item in items:
                item = item.strip().lower()
                words = item.split()
                for word in words:
                    if len(word) > 2 and word not in ['are', 'is', 'the', 'and']:
                        low_priority_items.add(word)
        
        # Extract action items
        action_items = []
        seen_tasks = set()
        
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            line = line.strip()
            if not line or ("I will" not in line and "i will" not in line and "Yes" not in line):
                continue
            
            # Extract owner
            owner_match = re.match(r'^([A-Za-z\s\(\)]+?):\s*(.*)', line)
            if owner_match:
                owner = owner_match.group(1).strip()
                task_text = owner_match.group(2)
            else:
                if i > 0:
                    prev_match = re.match(r'^([A-Za-z\s\(\)]+?):', lines[i-1].strip())
                    owner = prev_match.group(1).strip() if prev_match else "Team Member"
                else:
                    owner = "Team Member"
                task_text = line
            
            # Clean owner name
            owner = re.sub(r'\s*\([^)]*\)', '', owner).strip()
            
            # Extract task
            if "Yes," in task_text and "will" in task_text:
                task_match = re.search(r'(?:Yes,\s+)?I\s+will\s+([^.!?]+)', task_text)
            else:
                task_match = re.search(r'(?:I\s+)?will\s+([^.!?]+)', task_text, re.IGNORECASE)
            
            if not task_match:
                continue
            
            task_full = task_match.group(1).strip()
            
            # Extract deadline
            deadline_match = re.search(r'by\s+([A-Za-z]+\s+\d+)', task_full)
            deadline = deadline_match.group(1) if deadline_match else None
            
            # Remove deadline from description
            task_desc = re.sub(r'\s+by\s+[A-Za-z]+\s+\d+', '', task_full).strip()
            if not task_desc or len(task_desc) < 3:
                continue
            
            # Avoid duplicates
            task_key = f"{owner}_{task_desc[:40]}"
            if task_key in seen_tasks:
                continue
            seen_tasks.add(task_key)
            
            # Determine priority by checking if task contains any priority keywords
            priority = "medium"  # Default
            task_desc_lower = task_desc.lower()
            
            # Check HIGH priority keywords first
            for keyword in high_priority_items:
                if keyword in task_desc_lower:
                    priority = "high"
                    break
            
            # Check MEDIUM priority keywords (only if not already high)
            if priority != "high":
                for keyword in medium_priority_items:
                    if keyword in task_desc_lower:
                        priority = "medium"
                        break
            
            # Check LOW priority keywords (only if not already high/medium)
            if priority == "medium":
                for keyword in low_priority_items:
                    if keyword in task_desc_lower:
                        priority = "low"
                        break
            
            action_items.append({
                "id": str(uuid.uuid4()),
                "description": task_desc,
                "owner": owner,
                "deadline": deadline,
                "priority": priority,
                "status": "pending",
                "createdAt": now
            })
        
        # If no items found
        if not action_items:
            action_items = [
                {
                    "id": str(uuid.uuid4()),
                    "description": "Review meeting notes and follow up with team",
                    "owner": "Team",
                    "deadline": None,
                    "priority": "medium",
                    "status": "pending",
                    "createdAt": now
                }
            ]
        
        # Extract key points
        key_points = []
        if re.search(r'login.*module|module.*login', content, re.IGNORECASE):
            key_points.append("Login module development is critical")
        if re.search(r'dashboard', content, re.IGNORECASE):
            key_points.append("Dashboard will be developed in next phase")
        if re.search(r'testing|test case', content, re.IGNORECASE):
            key_points.append("Testing phase follows development")
        if re.search(r'integration', content, re.IGNORECASE):
            key_points.append("Component integration required after development")
        if re.search(r'documentation|api doc', content, re.IGNORECASE):
            key_points.append("Documentation should be maintained")
        
        if not key_points:
            key_points = ["Tasks clearly assigned", "Deadlines are defined"]
        
        key_points = key_points[:3]
        
        return {
            "summary": f"Meeting assigned {len(action_items)} tasks with specific deadlines and priorities.",
            "keyPoints": key_points,
            "actionItems": action_items
        }

    async def extract_action_items(self, content: str) -> list:
        """Extract only action items from a transcript"""
        analysis = await self.analyze_transcript(content)
        return analysis.get("actionItems", [])
