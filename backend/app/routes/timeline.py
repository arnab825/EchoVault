from fastapi import APIRouter
from typing import List
from app.schemas import TimelineEventOut
from app.services.timeline_service import get_timeline_events

router = APIRouter(prefix="/api/timeline", tags=["Timeline"])

@router.get("", response_model=List[TimelineEventOut])
def list_timeline():
    """Retrieve chronological events across all indexed memories."""
    return get_timeline_events()
