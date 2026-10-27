import os
from fastapi import APIRouter
from app.config import settings
from app.database import get_db
from app.services.ollama_client import ollama_client
from app.services.vector_store import vector_store
from app.schemas import SystemStatusOut

router = APIRouter(prefix="/api", tags=["System & Health"])

@router.get("/health")
def get_health():
    """Liveness probe endpoint."""
    return {"status": "ok", "app": settings.APP_NAME, "version": settings.VERSION}

@router.get("/status", response_model=SystemStatusOut)
async def get_system_status():
    """Comprehensive readiness and runtime status."""
    db_connected = False
    total_memories = 0
    total_passages = 0
    total_collections = 0
    total_timeline_events = 0

    try:
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT count(*) FROM memories")
            total_memories = cursor.fetchone()[0]
            cursor.execute("SELECT count(*) FROM source_passages")
            total_passages = cursor.fetchone()[0]
            cursor.execute("SELECT count(*) FROM collections")
            total_collections = cursor.fetchone()[0]
            cursor.execute("SELECT count(*) FROM timeline_events")
            total_timeline_events = cursor.fetchone()[0]
            db_connected = True
    except Exception:
        db_connected = False

    # Calculate storage size
    storage_bytes = 0
    if settings.DATA_DIR.exists():
        for root, _, files in os.walk(settings.DATA_DIR):
            for f in files:
                try:
                    storage_bytes += os.path.getsize(os.path.join(root, f))
                except Exception:
                    pass

    # Check Ollama
    ollama_info = await ollama_client.check_health()

    return SystemStatusOut(
        status="operational" if db_connected else "degraded",
        version=settings.VERSION,
        database_connected=db_connected,
        total_memories=total_memories,
        total_passages=total_passages,
        total_collections=total_collections,
        total_timeline_events=total_timeline_events,
        total_storage_bytes=storage_bytes,
        ollama_connected=ollama_info.get("connected", False),
        active_model=ollama_info.get("active_model", settings.OLLAMA_MODEL),
        embed_model=ollama_info.get("embed_model", settings.OLLAMA_EMBED_MODEL),
        available_models=ollama_info.get("models", []),
        offline_mode_strict=settings.OFFLINE_MODE_STRICT
    )
