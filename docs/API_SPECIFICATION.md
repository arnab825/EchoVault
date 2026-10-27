# REST API Specification: EchoVault

All endpoints communicate using JSON payloads over HTTP, except file upload (`multipart/form-data`) and archive export (`application/zip`).

## Base URL
- Development: `http://localhost:8000`
- Container Network: `http://backend:8000`

---

### System & Health

#### `GET /api/health`
Liveness probe.
- **Response `200 OK`**:
  ```json
  {
    "status": "ok",
    "app": "EchoVault",
    "version": "1.0.0"
  }
  ```

#### `GET /api/status`
Readiness and system metrics.
- **Response `200 OK`**:
  ```json
  {
    "status": "operational",
    "version": "1.0.0",
    "database_connected": true,
    "total_memories": 6,
    "total_passages": 12,
    "total_collections": 1,
    "total_timeline_events": 6,
    "total_storage_bytes": 1048576,
    "ollama_connected": true,
    "active_model": "llama3.2:3b",
    "embed_model": "nomic-embed-text",
    "available_models": ["llama3.2:3b", "qwen2.5:1.5b"],
    "offline_mode_strict": false
  }
  ```

---

### Memories

#### `GET /api/memories`
List memories with filtering, search, and sorting.
- **Query Parameters**:
  - `q` (string, optional): Search keyword.
  - `source_type` (string, optional): `document`, `letter`, `photograph`, `recording`, `story`, `note`.
  - `tag` (string, optional): Specific tag filter.
  - `sort_by` (string, optional): `created_at`, `event_date`, `title`.
  - `sort_order` (string, optional): `asc`, `desc`.
  - `limit` (int, default: 50)
  - `offset` (int, default: 0)

#### `POST /api/memories`
Upload and index a memory (`multipart/form-data`).
- **Form Fields**:
  - `title` (string, required)
  - `source_type` (string, default: `note`)
  - `description` (string, optional)
  - `extracted_text` (string, optional)
  - `event_date` (string, optional)
  - `date_precision` (string, default: `exact`)
  - `tags` (JSON string array, optional)
  - `file` (binary file, optional)
- **Response `201 Created`**: Returns created `MemoryOut` object.
- **Error `409 Conflict`**: Returned if exact duplicate file content is detected.

#### `GET /api/memories/{id}`
Retrieve a memory with its indexed passages.

#### `PATCH /api/memories/{id}`
Update metadata (title, description, tags, text, event date).

#### `DELETE /api/memories/{id}`
Cascade delete a memory, its passages, vector embeddings, and local file.

---

### Retrieval & Conversational Search

#### `POST /api/search`
Dense vector similarity search across passages.
- **Request Body**:
  ```json
  {
    "query": "lantern festival apple buns",
    "top_k": 5,
    "source_types": ["story", "letter"]
  }
  ```
- **Response `200 OK`**: Array of ranked `SearchResultItem` objects.

#### `POST /api/chat`
Evidence-grounded conversational search.
- **Request Body**:
  ```json
  {
    "query": "When was the river lantern festival and what did Aunt Clara bring?",
    "conversation_id": "optional-uuid"
  }
  ```
- **Response `200 OK`**:
  ```json
  {
    "conversation_id": "uuid",
    "query": "When was the river lantern festival...",
    "answer": "According to The Autumn Lantern Walk...",
    "has_sufficient_evidence": true,
    "evidence_status": "grounded",
    "model_name": "Ollama (llama3.2:3b)",
    "citations": [
      {
        "citation_index": 1,
        "memory_id": "mem-sample-01",
        "memory_title": "The Autumn Lantern Walk along the River",
        "passage_id": "mem-sample-01-p1",
        "passage_excerpt": "In the autumn of 1952...",
        "source_type": "story",
        "event_date": "1952-10-15",
        "confidence_statement": "Relevance Score: 88%"
      }
    ],
    "detected_conflicts": [],
    "created_at": "2026-10-27T08:00:00Z"
  }
  ```

---

### Timeline, Collections & Export

#### `GET /api/timeline`
Retrieve all chronological timeline events.

#### `GET /api/collections` & `POST /api/collections`
Manage curated memory collections.

#### `GET /api/export`
Generate and download full standalone `.zip` archive.

#### `DELETE /api/data/reset`
Purge all vault data. Requires body: `{"confirm_phrase": "DELETE_ALL_MEMORIES"}`.
