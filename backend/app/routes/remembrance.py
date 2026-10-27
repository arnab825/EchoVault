import json
import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.database import get_db
from app.schemas import RemembranceItemCreate, RemembranceItemOut

router = APIRouter(prefix="/api/remembrance", tags=["Remembrance Room"])

@router.get("", response_model=List[RemembranceItemOut])
def list_remembrance_items():
    """Retrieve remembrance tributes."""
    items = []
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM remembrance_items ORDER BY created_at DESC")
        rows = cursor.fetchall()
        for r in rows:
            items.append(RemembranceItemOut(
                id=r["id"],
                name=r["name"],
                relationship=r["relationship"],
                birth_date=r["birth_date"],
                passing_date=r["passing_date"],
                favorite_quote=r["favorite_quote"],
                favorite_food_or_music=r["favorite_food_or_music"],
                reflection=r["reflection"],
                associated_memory_ids=json.loads(r["associated_memory_ids_json"]),
                photo_url=r["photo_url"],
                created_at=r["created_at"]
            ))
    return items

@router.post("", response_model=RemembranceItemOut, status_code=status.HTTP_201_CREATED)
def create_remembrance_item(payload: RemembranceItemCreate):
    """Create a digital remembrance tribute."""
    rem_id = f"rem-{uuid.uuid4().hex[:10]}"
    now = datetime.utcnow().isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO remembrance_items (
                id, name, relationship, birth_date, passing_date,
                favorite_quote, favorite_food_or_music, reflection,
                associated_memory_ids_json, photo_url, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            rem_id, payload.name, payload.relationship, payload.birth_date, payload.passing_date,
            payload.favorite_quote, payload.favorite_food_or_music, payload.reflection,
            json.dumps(payload.associated_memory_ids), payload.photo_url, now
        ))
        conn.commit()

        return RemembranceItemOut(
            id=rem_id,
            name=payload.name,
            relationship=payload.relationship,
            birth_date=payload.birth_date,
            passing_date=payload.passing_date,
            favorite_quote=payload.favorite_quote,
            favorite_food_or_music=payload.favorite_food_or_music,
            reflection=payload.reflection,
            associated_memory_ids=payload.associated_memory_ids,
            photo_url=payload.photo_url,
            created_at=now
        )
