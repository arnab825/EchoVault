import json
from fastapi import APIRouter
from app.database import get_db
from app.services.vector_store import vector_store
from app.services.sample_data_loader import seed_sample_data

router = APIRouter(prefix="/api", tags=["Indexing & Sample Data"])

@router.post("/index/rebuild")
async def rebuild_vector_index():
    """Rebuilds the vector index from all passages currently stored in the database."""
    vector_store.clear()
    count = 0
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT p.id as passage_id, p.passage_text, m.id as memory_id, m.title as memory_title,
                   m.source_type, m.event_date, m.date_precision, m.tags_json
            FROM source_passages p
            JOIN memories m ON p.memory_id = m.id
        """)
        rows = cursor.fetchall()
        for r in rows:
            tags = json.loads(r["tags_json"]) if r["tags_json"] else []
            await vector_store.add_passage(
                passage_id=r["passage_id"],
                memory_id=r["memory_id"],
                memory_title=r["memory_title"],
                source_type=r["source_type"],
                passage_text=r["passage_text"],
                event_date=r["event_date"],
                date_precision=r["date_precision"],
                tags=tags
            )
            count += 1

    return {"message": "Vector index successfully rebuilt.", "indexed_passages": count}

@router.post("/sample-data/seed")
async def seed_synthetic_demo():
    """Seeds the vault with verified synthetic demonstration memories."""
    await seed_sample_data()
    return {"message": "Synthetic demonstration memories and timeline events seeded successfully."}
