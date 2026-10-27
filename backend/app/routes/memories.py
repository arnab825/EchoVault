import json
import uuid
from datetime import datetime
from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status, Query
from app.config import settings
from app.database import get_db
from app.schemas import MemoryOut, MemoryUpdate, SourceType, DatePrecision, ProcessingStatus, SourcePassageOut
from app.services.file_storage import validate_and_save_file
from app.services.extractor import extract_text_from_file, chunk_text_into_passages
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api/memories", tags=["Memories"])

def parse_memory_row(row) -> MemoryOut:
    return MemoryOut(
        id=row["id"],
        title=row["title"],
        source_type=SourceType(row["source_type"]),
        original_filename=row["original_filename"],
        file_path=row["file_path"],
        content_hash=row["content_hash"],
        extracted_text=row["extracted_text"],
        description=row["description"],
        event_date=row["event_date"],
        date_precision=DatePrecision(row["date_precision"]),
        extraction_method=row["extraction_method"],
        processing_status=ProcessingStatus(row["processing_status"]),
        tags=json.loads(row["tags_json"]),
        collection_ids=json.loads(row["collection_ids_json"]),
        created_at=row["created_at"],
        updated_at=row["updated_at"]
    )

@router.get("", response_model=List[MemoryOut])
def list_memories(
    q: Optional[str] = None,
    source_type: Optional[SourceType] = None,
    tag: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|event_date|title)$"),
    sort_order: str = Query("desc", regex="^(asc|desc)$"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Retrieve memories with filtering, search, and sorting."""
    with get_db() as conn:
        cursor = conn.cursor()
        query_sql = "SELECT * FROM memories WHERE 1=1"
        params = []

        if q:
            query_sql += " AND (title LIKE ? OR description LIKE ? OR extracted_text LIKE ?)"
            term = f"%{q}%"
            params.extend([term, term, term])

        if source_type:
            query_sql += " AND source_type = ?"
            params.append(source_type.value)

        if tag:
            query_sql += " AND tags_json LIKE ?"
            params.append(f"%\"{tag}\"%")

        order_clause = f" ORDER BY {sort_by} {sort_order.upper()}"
        query_sql += order_clause + " LIMIT ? OFFSET ?"
        params.extend([limit, offset])

        cursor.execute(query_sql, params)
        rows = cursor.fetchall()
        return [parse_memory_row(r) for r in rows]

@router.post("", response_model=MemoryOut, status_code=status.HTTP_201_CREATED)
async def create_memory(
    title: str = Form(...),
    source_type: SourceType = Form(SourceType.NOTE),
    description: Optional[str] = Form(None),
    extracted_text: Optional[str] = Form(None),
    event_date: Optional[str] = Form(None),
    date_precision: DatePrecision = Form(DatePrecision.EXACT),
    tags: Optional[str] = Form("[]"),  # JSON array string
    collection_ids: Optional[str] = Form("[]"),  # JSON array string
    file: Optional[UploadFile] = File(None)
):
    """Upload and index a new memory."""
    memory_id = f"mem-{uuid.uuid4().hex[:12]}"
    now = datetime.utcnow().isoformat()
    
    try:
        parsed_tags = json.loads(tags) if tags else []
    except Exception:
        parsed_tags = [t.strip() for t in tags.split(",") if t.strip()] if tags else []

    try:
        parsed_collection_ids = json.loads(collection_ids) if collection_ids else []
    except Exception:
        parsed_collection_ids = []

    content_hash = ""
    file_rel_path = None
    orig_filename = None
    method = "manual_entry"
    final_text = extracted_text or ""

    if file:
        file_bytes = await file.read()
        content_hash, file_rel_path, orig_filename = validate_and_save_file(file, file_bytes)

        # Duplicate detection check
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, title FROM memories WHERE content_hash = ?", (content_hash,))
            existing = cursor.fetchone()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=f"Duplicate file detected: exact content already indexed as memory '{existing['title']}' (ID: {existing['id']})."
                )

        extracted_from_file, method = extract_text_from_file(file_bytes, orig_filename)
        if not final_text:
            final_text = extracted_from_file
    else:
        # Direct text note without file
        content_hash = uuid.uuid4().hex

    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO memories (
                id, title, source_type, original_filename, file_path, content_hash,
                extracted_text, description, event_date, date_precision,
                extraction_method, processing_status, tags_json, collection_ids_json,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            memory_id, title, source_type.value, orig_filename, file_rel_path, content_hash,
            final_text, description, event_date, date_precision.value,
            method, ProcessingStatus.INDEXED.value, json.dumps(parsed_tags), json.dumps(parsed_collection_ids),
            now, now
        ))

        # Passages & Vector Store indexing
        passages = chunk_text_into_passages(final_text)
        for idx, (p_text, page_num) in enumerate(passages):
            p_id = f"{memory_id}-p{idx+1}"
            cursor.execute("""
                INSERT INTO source_passages (
                    id, memory_id, passage_text, page_number, embedding_id, created_at
                ) VALUES (?, ?, ?, ?, ?, ?)
            """, (p_id, memory_id, p_text, page_num, p_id, now))

            await vector_store.add_passage(
                passage_id=p_id,
                memory_id=memory_id,
                memory_title=title,
                source_type=source_type.value,
                passage_text=p_text,
                event_date=event_date,
                date_precision=date_precision.value,
                tags=parsed_tags
            )

        # Timeline Event
        cursor.execute("""
            INSERT INTO timeline_events (
                id, memory_id, title, description, event_date, date_precision, source_type
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            f"time-{memory_id}", memory_id, title, description, event_date, date_precision.value, source_type.value
        ))

        conn.commit()

        cursor.execute("SELECT * FROM memories WHERE id = ?", (memory_id,))
        row = cursor.fetchone()
        return parse_memory_row(row)

@router.get("/{memory_id}", response_model=MemoryOut)
def get_memory(memory_id: str):
    """Retrieve full memory record with its indexed passages."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM memories WHERE id = ?", (memory_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Memory record not found.")

        mem = parse_memory_row(row)

        cursor.execute("SELECT * FROM source_passages WHERE memory_id = ? ORDER BY id ASC", (memory_id,))
        passage_rows = cursor.fetchall()
        mem.passages = [
            SourcePassageOut(
                id=p["id"],
                memory_id=p["memory_id"],
                passage_text=p["passage_text"],
                page_number=p["page_number"],
                created_at=p["created_at"]
            )
            for p in passage_rows
        ]
        return mem

@router.patch("/{memory_id}", response_model=MemoryOut)
async def update_memory(memory_id: str, payload: MemoryUpdate):
    """Update editable metadata of a memory."""
    now = datetime.utcnow().isoformat()
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM memories WHERE id = ?", (memory_id,))
        existing = cursor.fetchone()
        if not existing:
            raise HTTPException(status_code=404, detail="Memory record not found.")

        new_title = payload.title if payload.title is not None else existing["title"]
        new_desc = payload.description if payload.description is not None else existing["description"]
        new_text = payload.extracted_text if payload.extracted_text is not None else existing["extracted_text"]
        new_date = payload.event_date if payload.event_date is not None else existing["event_date"]
        new_precision = payload.date_precision.value if payload.date_precision is not None else existing["date_precision"]
        new_tags = json.dumps(payload.tags) if payload.tags is not None else existing["tags_json"]
        new_cols = json.dumps(payload.collection_ids) if payload.collection_ids is not None else existing["collection_ids_json"]

        cursor.execute("""
            UPDATE memories SET
                title = ?, description = ?, extracted_text = ?, event_date = ?,
                date_precision = ?, tags_json = ?, collection_ids_json = ?, updated_at = ?
            WHERE id = ?
        """, (new_title, new_desc, new_text, new_date, new_precision, new_tags, new_cols, now, memory_id))

        # Update Timeline
        cursor.execute("""
            UPDATE timeline_events SET
                title = ?, description = ?, event_date = ?, date_precision = ?
            WHERE memory_id = ?
        """, (new_title, new_desc, new_date, new_precision, memory_id))

        # If text changed, reindex passages
        if payload.extracted_text is not None:
            cursor.execute("DELETE FROM source_passages WHERE memory_id = ?", (memory_id,))
            vector_store.remove_by_memory_id(memory_id)

            passages = chunk_text_into_passages(new_text)
            for idx, (p_text, page_num) in enumerate(passages):
                p_id = f"{memory_id}-p{idx+1}"
                cursor.execute("""
                    INSERT INTO source_passages (
                        id, memory_id, passage_text, page_number, embedding_id, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?)
                """, (p_id, memory_id, p_text, page_num, p_id, now))

                await vector_store.add_passage(
                    passage_id=p_id,
                    memory_id=memory_id,
                    memory_title=new_title,
                    source_type=existing["source_type"],
                    passage_text=p_text,
                    event_date=new_date,
                    date_precision=new_precision,
                    tags=json.loads(new_tags)
                )

        conn.commit()

        cursor.execute("SELECT * FROM memories WHERE id = ?", (memory_id,))
        return parse_memory_row(cursor.fetchone())

@router.delete("/{memory_id}", status_code=status.HTTP_200_OK)
def delete_memory(memory_id: str):
    """Delete a memory record, its passages, vector embeddings, and underlying file."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM memories WHERE id = ?", (memory_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Memory record not found.")

        # Cascade deletes passages and timeline events
        cursor.execute("DELETE FROM memories WHERE id = ?", (memory_id,))
        conn.commit()

    # Remove from vector store
    vector_store.remove_by_memory_id(memory_id)

    # Remove file from disk if exists
    if row["file_path"]:
        file_disk_path = settings.BASE_DIR / "data" / row["file_path"]
        if file_disk_path.exists():
            try:
                file_disk_path.unlink()
            except Exception:
                pass

    return {"message": "Memory successfully deleted.", "id": memory_id}
