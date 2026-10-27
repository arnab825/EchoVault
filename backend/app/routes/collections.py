import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, HTTPException, status
from app.database import get_db
from app.schemas import CollectionCreate, CollectionOut

router = APIRouter(prefix="/api/collections", tags=["Collections"])

@router.get("", response_model=List[CollectionOut])
def list_collections():
    """List all thematic memory collections."""
    cols = []
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM collections ORDER BY created_at DESC")
        rows = cursor.fetchall()
        for r in rows:
            cursor.execute("SELECT memory_id FROM collection_memories WHERE collection_id = ?", (r["id"],))
            mem_ids = [m[0] for m in cursor.fetchall()]
            cols.append(CollectionOut(
                id=r["id"],
                title=r["title"],
                description=r["description"],
                memory_ids=mem_ids,
                memory_count=len(mem_ids),
                created_at=r["created_at"],
                updated_at=r["updated_at"]
            ))
    return cols

@router.post("", response_model=CollectionOut, status_code=status.HTTP_201_CREATED)
def create_collection(payload: CollectionCreate):
    """Create a new collection."""
    col_id = f"col-{uuid.uuid4().hex[:10]}"
    now = datetime.utcnow().isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO collections (id, title, description, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?)
        """, (col_id, payload.title, payload.description, now, now))

        for mid in payload.memory_ids:
            cursor.execute("""
                INSERT OR IGNORE INTO collection_memories (collection_id, memory_id)
                VALUES (?, ?)
            """, (col_id, mid))

        conn.commit()

        return CollectionOut(
            id=col_id,
            title=payload.title,
            description=payload.description,
            memory_ids=payload.memory_ids,
            memory_count=len(payload.memory_ids),
            created_at=now,
            updated_at=now
        )

@router.get("/{col_id}", response_model=CollectionOut)
def get_collection(col_id: str):
    """Get collection details."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM collections WHERE id = ?", (col_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Collection not found.")

        cursor.execute("SELECT memory_id FROM collection_memories WHERE collection_id = ?", (col_id,))
        mem_ids = [m[0] for m in cursor.fetchall()]

        return CollectionOut(
            id=row["id"],
            title=row["title"],
            description=row["description"],
            memory_ids=mem_ids,
            memory_count=len(mem_ids),
            created_at=row["created_at"],
            updated_at=row["updated_at"]
        )

@router.delete("/{col_id}")
def delete_collection(col_id: str):
    """Delete a collection without deleting the underlying memories."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM collections WHERE id = ?", (col_id,))
        if not cursor.fetchone():
            raise HTTPException(status_code=404, detail="Collection not found.")

        cursor.execute("DELETE FROM collections WHERE id = ?", (col_id,))
        conn.commit()
    return {"message": "Collection deleted successfully.", "id": col_id}
