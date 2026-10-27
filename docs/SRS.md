# Software Requirements Specification (SRS): EchoVault

## 1. Scope
This document specifies the software requirements for EchoVault, a private, local-first AI memory archive for the Hacktoberfest 2026 “Ghost in the Machine” challenge.

## 2. Overall Description
EchoVault ingests multi-format family memories (letters, audio recordings, photographs, documents), indexes them locally, and exposes an evidence-grounded search and exploration interface.

## 3. Specific Requirements

### 3.1 External Interface Requirements
- **Web UI**: Accessible via modern web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile viewports (360px to 1440px+).
- **REST API**: JSON over HTTP/1.1 conforming to OpenAPI 3.0 specification.
- **Local AI Provider**: REST interface conforming to Ollama `/api/generate` and `/api/embeddings` protocols.

### 3.2 Functional Requirements Traceability Matrix

| Req ID | Description | Component | Verification Test |
| :--- | :--- | :--- | :--- |
| **FR-01** | File upload & validation | `backend/services/file_storage.py` | `test_memories.py::test_file_upload_and_duplicate_detection` |
| **FR-02** | Path traversal defense | `backend/services/file_storage.py` | `test_memories.py::test_path_traversal_defense` |
| **FR-03** | PDF & text extraction | `backend/services/extractor.py` | `test_memories.py::test_create_and_get_memory` |
| **FR-04** | Passage chunking | `backend/services/extractor.py` | `test_memories.py::test_create_and_get_memory` |
| **FR-05** | Vector search | `backend/services/vector_store.py` | `test_search_rag.py::test_semantic_search_and_rag_citations` |
| **FR-06** | Conversational citations | `backend/services/rag_service.py` | `test_search_rag.py::test_semantic_search_and_rag_citations` |
| **FR-07** | Graceful uncertainty | `backend/services/rag_service.py` | `test_search_rag.py::test_unsupported_question_graceful_uncertainty` |
| **FR-08** | Historical conflict detection | `backend/services/rag_service.py` | `test_search_rag.py::test_contradiction_detection` |
| **FR-09** | Chronological timeline | `backend/routes/timeline.py` | `test_export.py::test_timeline_retrieval` |
| **FR-10** | Portable archive ZIP export | `backend/services/export_service.py` | `test_export.py::test_archive_export_download` |
| **FR-11** | Vault data purge | `backend/services/export_service.py` | `test_export.py::test_vault_reset_safety` |
| **FR-12** | System readiness & status | `backend/routes/health.py` | `test_health.py::test_system_status` |

### 3.3 Reliability & Availability
- The system must remain fully functional without active internet connectivity.
- SQLite database operates in WAL mode with timeout handling to prevent file locks.
- Server must recover automatically after unclean shutdown without data corruption.

### 3.4 Security Requirements
- Untrusted user uploads must not execute as server-side scripts.
- Memory content must be isolated from prompt template control instructions.
- All destructive operations (purge) require strict confirmation phrases.
