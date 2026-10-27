# Data Dictionary: EchoVault

## Database Schema (SQLite 3)

### 1. `memories` Table
Primary entity representing a stored memory record.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Unique identifier (e.g. `mem-7f3a9e12b4c8`) |
| `title` | TEXT | NOT NULL | Human-readable title of the memory |
| `source_type` | TEXT | NOT NULL | `document`, `letter`, `photograph`, `recording`, `story`, `note` |
| `original_filename`| TEXT | NULLABLE | Original client filename |
| `file_path` | TEXT | NULLABLE | Relative path in `data/uploads/` |
| `content_hash` | TEXT | NOT NULL | SHA-256 fingerprint for deduplication |
| `extracted_text` | TEXT | NOT NULL | Raw readable text content |
| `description` | TEXT | NULLABLE | Contextual user narrative or note |
| `event_date` | TEXT | NULLABLE | Historical date (ISO-8601 or year string) |
| `date_precision` | TEXT | NOT NULL | `exact`, `month`, `year`, `approximate`, `unknown` |
| `extraction_method`| TEXT | NOT NULL | Method used (`plain_text`, `pdf_extractor`, etc.) |
| `processing_status`| TEXT | NOT NULL | `pending`, `processing`, `indexed`, `failed` |
| `tags_json` | TEXT | NOT NULL | JSON array of string tags (default `[]`) |
| `collection_ids_json`| TEXT| NOT NULL | JSON array of associated collection IDs |
| `created_at` | TEXT | NOT NULL | ISO-8601 creation timestamp |
| `updated_at` | TEXT | NOT NULL | ISO-8601 last update timestamp |

### 2. `source_passages` Table
Bounded text chunks extracted from memories for semantic search and citation attribution.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Passage ID (e.g. `mem-01-p1`) |
| `memory_id` | TEXT | NOT NULL, FK | Foreign key referencing `memories(id)` ON DELETE CASCADE |
| `passage_text` | TEXT | NOT NULL | Substring passage (~400 characters) |
| `page_number` | INTEGER | NULLABLE | Document page number if extracted from PDF |
| `embedding_id` | TEXT | NULLABLE | Index identifier in vector store |
| `created_at` | TEXT | NOT NULL | ISO-8601 timestamp |

### 3. `timeline_events` Table
Chronological event entries linked to memories.

| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | TEXT | PRIMARY KEY | Event ID (e.g. `time-mem-01`) |
| `memory_id` | TEXT | NOT NULL, FK | Foreign key referencing `memories(id)` ON DELETE CASCADE |
| `title` | TEXT | NOT NULL | Event title |
| `description` | TEXT | NULLABLE | Event summary |
| `event_date` | TEXT | NULLABLE | Chronological date string |
| `date_precision` | TEXT | NOT NULL | `exact`, `month`, `year`, `approximate`, `unknown` |
| `source_type` | TEXT | NOT NULL | Format of source memory |
| `has_conflict` | INTEGER | NOT NULL | Boolean flag (0 or 1) indicating historical dispute |
| `conflict_notes` | TEXT | NULLABLE | Details describing conflicting accounts |

### 4. `collections` & `collection_memories` Tables
Thematic groupings of memories.

- `collections`: `id`, `title`, `description`, `created_at`, `updated_at`
- `collection_memories`: `collection_id` (FK), `memory_id` (FK), PRIMARY KEY (`collection_id`, `memory_id`)

### 5. `remembrance_items` Table
Tributes in the digital remembrance room.

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | TEXT | Unique tribute ID |
| `name` | TEXT | Ancestor or loved one name |
| `relationship` | TEXT | Family relation |
| `birth_date` | TEXT | Date or year of birth |
| `passing_date` | TEXT | Date or year of passing |
| `favorite_quote` | TEXT | Memorable saying or wisdom |
| `favorite_food_or_music` | TEXT | Cherished dish, song, or melody |
| `reflection` | TEXT | Detailed heartfelt remembrance reflection |
| `associated_memory_ids_json` | TEXT | JSON array of linked memory IDs |
| `photo_url` | TEXT | Local image asset path if attached |
| `created_at` | TEXT | Timestamp |
