from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

class SourceType(str, Enum):
    DOCUMENT = "document"
    LETTER = "letter"
    PHOTOGRAPH = "photograph"
    RECORDING = "recording"
    STORY = "story"
    NOTE = "note"

class DatePrecision(str, Enum):
    EXACT = "exact"
    MONTH = "month"
    YEAR = "year"
    APPROXIMATE = "approximate"
    UNKNOWN = "unknown"

class ProcessingStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    INDEXED = "indexed"
    FAILED = "failed"

# --- Memory Schemas ---

class MemoryCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    source_type: SourceType = SourceType.NOTE
    description: Optional[str] = None
    extracted_text: Optional[str] = None
    event_date: Optional[str] = None
    date_precision: DatePrecision = DatePrecision.EXACT
    tags: List[str] = Field(default_factory=list)
    collection_ids: List[str] = Field(default_factory=list)

class MemoryUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    extracted_text: Optional[str] = None
    event_date: Optional[str] = None
    date_precision: Optional[DatePrecision] = None
    tags: Optional[List[str]] = None
    collection_ids: Optional[List[str]] = None

class SourcePassageOut(BaseModel):
    id: str
    memory_id: str
    passage_text: str
    page_number: Optional[int] = None
    created_at: str

class MemoryOut(BaseModel):
    id: str
    title: str
    source_type: SourceType
    original_filename: Optional[str] = None
    file_path: Optional[str] = None
    content_hash: str
    extracted_text: str
    description: Optional[str] = None
    event_date: Optional[str] = None
    date_precision: DatePrecision
    extraction_method: str
    processing_status: ProcessingStatus
    tags: List[str]
    collection_ids: List[str]
    created_at: str
    updated_at: str
    passages: Optional[List[SourcePassageOut]] = None

# --- Search & Chat Schemas ---

class SearchQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500)
    source_types: Optional[List[SourceType]] = None
    tags: Optional[List[str]] = None
    top_k: int = Field(default=5, ge=1, le=20)

class SearchResultItem(BaseModel):
    passage_id: str
    memory_id: str
    memory_title: str
    source_type: SourceType
    event_date: Optional[str] = None
    date_precision: DatePrecision
    passage_text: str
    similarity_score: float

class CitationItem(BaseModel):
    citation_index: int
    memory_id: str
    memory_title: str
    passage_id: str
    passage_excerpt: str
    source_type: SourceType
    event_date: Optional[str] = None
    confidence_statement: str

class ChatRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=1000)
    conversation_id: Optional[str] = None
    top_k: int = Field(default=5, ge=1, le=15)

class ChatResponse(BaseModel):
    conversation_id: str
    query: str
    answer: str
    has_sufficient_evidence: bool
    evidence_status: str  # "grounded", "insufficient", "contradictory"
    model_name: str
    citations: List[CitationItem]
    detected_conflicts: List[str] = Field(default_factory=list)
    created_at: str

# --- Timeline Schemas ---

class TimelineEventOut(BaseModel):
    id: str
    memory_id: str
    title: str
    description: Optional[str] = None
    event_date: Optional[str] = None
    date_precision: DatePrecision
    source_type: SourceType
    has_conflict: bool = False
    conflict_notes: Optional[str] = None

# --- Collection Schemas ---

class CollectionCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = None
    memory_ids: List[str] = Field(default_factory=list)

class CollectionOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    memory_ids: List[str]
    memory_count: int
    created_at: str
    updated_at: str

# --- Remembrance Item Schemas ---

class RemembranceItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    relationship: Optional[str] = None
    birth_date: Optional[str] = None
    passing_date: Optional[str] = None
    favorite_quote: Optional[str] = None
    favorite_food_or_music: Optional[str] = None
    reflection: str
    associated_memory_ids: List[str] = Field(default_factory=list)
    photo_url: Optional[str] = None

class RemembranceItemOut(BaseModel):
    id: str
    name: str
    relationship: Optional[str] = None
    birth_date: Optional[str] = None
    passing_date: Optional[str] = None
    favorite_quote: Optional[str] = None
    favorite_food_or_music: Optional[str] = None
    reflection: str
    associated_memory_ids: List[str]
    photo_url: Optional[str] = None
    created_at: str

# --- System & Settings Schemas ---

class SystemStatusOut(BaseModel):
    status: str
    version: str
    database_connected: bool
    total_memories: int
    total_passages: int
    total_collections: int
    total_timeline_events: int
    total_storage_bytes: int
    ollama_connected: bool
    active_model: str
    embed_model: str
    available_models: List[str]
    offline_mode_strict: bool

class SettingsUpdate(BaseModel):
    ollama_base_url: Optional[str] = None
    ollama_model: Optional[str] = None
    ollama_embed_model: Optional[str] = None
    offline_mode_strict: Optional[bool] = None
