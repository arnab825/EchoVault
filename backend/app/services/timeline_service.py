from typing import List, Dict, Any
from app.database import get_db
from app.schemas import TimelineEventOut, DatePrecision, SourceType

def get_timeline_events() -> List[TimelineEventOut]:
    """Retrieve all chronological timeline events ordered by date."""
    events = []
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, memory_id, title, description, event_date, date_precision, source_type, has_conflict, conflict_notes
            FROM timeline_events
            ORDER BY 
                CASE 
                    WHEN event_date IS NULL OR event_date = '' THEN 1
                    ELSE 0
                END,
                event_date ASC
        """)
        rows = cursor.fetchall()
        for r in rows:
            events.append(TimelineEventOut(
                id=r["id"],
                memory_id=r["memory_id"],
                title=r["title"],
                description=r["description"],
                event_date=r["event_date"],
                date_precision=DatePrecision(r["date_precision"]),
                source_type=SourceType(r["source_type"]),
                has_conflict=bool(r["has_conflict"]),
                conflict_notes=r["conflict_notes"]
            ))
    return events
