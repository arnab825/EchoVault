from fastapi import APIRouter
from app.config import settings
from app.schemas import SettingsUpdate
from app.database import get_db

router = APIRouter(prefix="/api/settings", tags=["Settings"])

@router.get("")
def get_settings():
    """Retrieve current system and model settings."""
    return {
        "ollama_base_url": settings.OLLAMA_BASE_URL,
        "ollama_model": settings.OLLAMA_MODEL,
        "ollama_embed_model": settings.OLLAMA_EMBED_MODEL,
        "offline_mode_strict": settings.OFFLINE_MODE_STRICT,
        "max_upload_size_mb": settings.MAX_UPLOAD_SIZE_BYTES // (1024 * 1024),
        "allowed_extensions": sorted(list(settings.ALLOWED_EXTENSIONS)),
        "database_path": str(settings.DATABASE_PATH),
        "upload_dir": str(settings.UPLOAD_DIR),
        "app_version": settings.VERSION
    }

@router.patch("")
def update_settings(payload: SettingsUpdate):
    """Update runtime settings."""
    with get_db() as conn:
        cursor = conn.cursor()
        if payload.ollama_base_url is not None:
            settings.OLLAMA_BASE_URL = payload.ollama_base_url
            cursor.execute("INSERT OR REPLACE INTO system_config (key, value) VALUES ('ollama_base_url', ?)", (payload.ollama_base_url,))
        if payload.ollama_model is not None:
            settings.OLLAMA_MODEL = payload.ollama_model
            cursor.execute("INSERT OR REPLACE INTO system_config (key, value) VALUES ('ollama_model', ?)", (payload.ollama_model,))
        if payload.ollama_embed_model is not None:
            settings.OLLAMA_EMBED_MODEL = payload.ollama_embed_model
            cursor.execute("INSERT OR REPLACE INTO system_config (key, value) VALUES ('ollama_embed_model', ?)", (payload.ollama_embed_model,))
        if payload.offline_mode_strict is not None:
            settings.OFFLINE_MODE_STRICT = payload.offline_mode_strict
            cursor.execute("INSERT OR REPLACE INTO system_config (key, value) VALUES ('offline_mode_strict', ?)", (str(payload.offline_mode_strict),))
        conn.commit()

    return get_settings()
