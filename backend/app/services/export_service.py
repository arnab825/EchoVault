import json
import os
import shutil
import zipfile
from datetime import datetime
from pathlib import Path
from app.config import settings
from app.database import get_db
from app.services.vector_store import vector_store

def export_vault_archive() -> Path:
    """Creates a complete, portable ZIP export of the EchoVault archive."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    export_filename = f"echovault_export_{timestamp}.zip"
    export_file_path = settings.EXPORT_DIR / export_filename

    dump_data = {
        "export_metadata": {
            "app": "EchoVault",
            "version": settings.VERSION,
            "exported_at": datetime.utcnow().isoformat(),
            "format_version": "1.0"
        },
        "memories": [],
        "source_passages": [],
        "timeline_events": [],
        "collections": [],
        "remembrance_items": []
    }

    with get_db() as conn:
        cursor = conn.cursor()
        
        # Memories
        cursor.execute("SELECT * FROM memories")
        for r in cursor.fetchall():
            dump_data["memories"].append(dict(r))

        # Passages
        cursor.execute("SELECT * FROM source_passages")
        for r in cursor.fetchall():
            dump_data["source_passages"].append(dict(r))

        # Timeline
        cursor.execute("SELECT * FROM timeline_events")
        for r in cursor.fetchall():
            dump_data["timeline_events"].append(dict(r))

        # Collections
        cursor.execute("SELECT * FROM collections")
        for r in cursor.fetchall():
            dump_data["collections"].append(dict(r))

        # Remembrance
        cursor.execute("SELECT * FROM remembrance_items")
        for r in cursor.fetchall():
            dump_data["remembrance_items"].append(dict(r))

    # Create ZIP
    with zipfile.ZipFile(export_file_path, "w", zipfile.ZIP_DEFLATED) as zipf:
        # Write metadata & database dump
        zipf.writestr("archive_dump.json", json.dumps(dump_data, indent=2))
        
        # Write vector index if exists
        if settings.VECTOR_INDEX_PATH.exists():
            zipf.write(settings.VECTOR_INDEX_PATH, arcname="vector_index.json")

        # Write uploaded files
        if settings.UPLOAD_DIR.exists():
            for root, _, files in os.walk(settings.UPLOAD_DIR):
                for file in files:
                    full_p = Path(root) / file
                    arcname = f"uploads/{file}"
                    zipf.write(full_p, arcname=arcname)

    return export_file_path

def purge_vault_data():
    """Wipes all database records, vector index, and uploaded files. Irreversible."""
    with get_db() as conn:
        cursor = conn.cursor()
        cursor.execute("DELETE FROM messages;")
        cursor.execute("DELETE FROM conversations;")
        cursor.execute("DELETE FROM remembrance_items;")
        cursor.execute("DELETE FROM collection_memories;")
        cursor.execute("DELETE FROM collections;")
        cursor.execute("DELETE FROM timeline_events;")
        cursor.execute("DELETE FROM source_passages;")
        cursor.execute("DELETE FROM memories;")
        conn.commit()

    # Clear vector store
    vector_store.clear()

    # Clear uploads (leave directory)
    if settings.UPLOAD_DIR.exists():
        for item in settings.UPLOAD_DIR.iterdir():
            if item.is_file() and item.name != ".gitkeep":
                try:
                    item.unlink()
                except Exception:
                    pass
