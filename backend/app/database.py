import sqlite3
import json
from contextlib import contextmanager
from pathlib import Path
from app.config import settings

def init_db():
    """Initialize the SQLite database with full referential integrity and schema definitions."""
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    cursor = conn.cursor()

    # Memories Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        source_type TEXT NOT NULL,
        original_filename TEXT,
        file_path TEXT,
        content_hash TEXT NOT NULL,
        extracted_text TEXT NOT NULL,
        description TEXT,
        event_date TEXT,
        date_precision TEXT NOT NULL DEFAULT 'exact',
        extraction_method TEXT NOT NULL DEFAULT 'text',
        processing_status TEXT NOT NULL DEFAULT 'indexed',
        tags_json TEXT NOT NULL DEFAULT '[]',
        collection_ids_json TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Source Passages Table (for chunking & citation attribution)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS source_passages (
        id TEXT PRIMARY KEY,
        memory_id TEXT NOT NULL,
        passage_text TEXT NOT NULL,
        page_number INTEGER,
        embedding_id TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
    );
    """)

    # Timeline Events Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS timeline_events (
        id TEXT PRIMARY KEY,
        memory_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        event_date TEXT,
        date_precision TEXT NOT NULL DEFAULT 'exact',
        source_type TEXT NOT NULL,
        has_conflict INTEGER NOT NULL DEFAULT 0,
        conflict_notes TEXT,
        FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
    );
    """)

    # Collections Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    # Collection Memories Join Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS collection_memories (
        collection_id TEXT NOT NULL,
        memory_id TEXT NOT NULL,
        PRIMARY KEY (collection_id, memory_id),
        FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE,
        FOREIGN KEY (memory_id) REFERENCES memories(id) ON DELETE CASCADE
    );
    """)

    # Remembrance Room Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS remembrance_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        relationship TEXT,
        birth_date TEXT,
        passing_date TEXT,
        favorite_quote TEXT,
        favorite_food_or_music TEXT,
        reflection TEXT NOT NULL,
        associated_memory_ids_json TEXT NOT NULL DEFAULT '[]',
        photo_url TEXT,
        created_at TEXT NOT NULL
    );
    """)

    # Conversations & Messages Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        role TEXT NOT NULL,
        content TEXT NOT NULL,
        citations_json TEXT NOT NULL DEFAULT '[]',
        created_at TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    );
    """)

    # App Settings Key-Value Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
    );
    """)

    conn.commit()
    conn.close()

@contextmanager
def get_db():
    """Thread-safe context manager for database operations."""
    conn = sqlite3.connect(settings.DATABASE_PATH, timeout=30.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    try:
        yield conn
    finally:
        conn.close()
