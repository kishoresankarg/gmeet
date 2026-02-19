"""
Utility helpers for request validation and response formatting
"""

from typing import Any, Dict
from datetime import datetime


def format_response(data: Any, message: str = "Success", status: int = 200) -> Dict:
    """Format API response"""
    return {
        "status": "success" if 200 <= status < 300 else "error",
        "message": message,
        "data": data,
        "timestamp": datetime.utcnow().isoformat(),
    }


def format_error(message: str, status: int = 400) -> Dict:
    """Format error response"""
    return {
        "status": "error",
        "message": message,
        "timestamp": datetime.utcnow().isoformat(),
    }
