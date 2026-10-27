export type SourceType = "document" | "letter" | "photograph" | "recording" | "story" | "note";
export type DatePrecision = "exact" | "month" | "year" | "approximate" | "unknown";
export type ProcessingStatus = "pending" | "processing" | "indexed" | "failed";

export interface SourcePassage {
  id: string;
  memory_id: string;
  passage_text: string;
  page_number?: number | null;
  created_at: string;
}

export interface Memory {
  id: string;
  title: string;
  source_type: SourceType;
  original_filename?: string | null;
  file_path?: string | null;
  content_hash: string;
  extracted_text: string;
  description?: string | null;
  event_date?: string | null;
  date_precision: DatePrecision;
  extraction_method: string;
  processing_status: ProcessingStatus;
  tags: string[];
  collection_ids: string[];
  created_at: string;
  updated_at: string;
  passages?: SourcePassage[];
}

export interface CitationItem {
  citation_index: number;
  memory_id: string;
  memory_title: string;
  passage_id: string;
  passage_excerpt: string;
  source_type: SourceType;
  event_date?: string | null;
  confidence_statement: string;
}

export interface ChatResponse {
  conversation_id: string;
  query: string;
  answer: string;
  has_sufficient_evidence: boolean;
  evidence_status: "grounded" | "insufficient" | "contradictory";
  model_name: string;
  citations: CitationItem[];
  detected_conflicts: string[];
  created_at: string;
}

export interface TimelineEvent {
  id: string;
  memory_id: string;
  title: string;
  description?: string | null;
  event_date?: string | null;
  date_precision: DatePrecision;
  source_type: SourceType;
  has_conflict: boolean;
  conflict_notes?: string | null;
}

export interface Collection {
  id: string;
  title: string;
  description?: string | null;
  memory_ids: string[];
  memory_count: number;
  created_at: string;
  updated_at: string;
}

export interface RemembranceItem {
  id: string;
  name: string;
  relationship?: string | null;
  birth_date?: string | null;
  passing_date?: string | null;
  favorite_quote?: string | null;
  favorite_food_or_music?: string | null;
  reflection: string;
  associated_memory_ids: string[];
  photo_url?: string | null;
  created_at: string;
}

export interface SystemStatus {
  status: string;
  version: string;
  database_connected: boolean;
  total_memories: number;
  total_passages: number;
  total_collections: number;
  total_timeline_events: number;
  total_storage_bytes: number;
  ollama_connected: boolean;
  active_model: string;
  embed_model: string;
  available_models: string[];
  offline_mode_strict: boolean;
}
