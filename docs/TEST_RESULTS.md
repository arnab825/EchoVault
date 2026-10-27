# Verified Test Results: EchoVault

Date: October 27, 2026  
Test Suite: Pytest 9.1.1 & Next.js 14 Build Pipeline

---

## 1. Backend Test Suite Execution (Pytest)

Command executed:
```powershell
.\venv\Scripts\pytest tests/ -v
```

### Results Summary
- **Total Tests**: 11
- **Passed**: 11 (100%)
- **Failed**: 0
- **Duration**: ~5.72s

### Granular Test Breakdown
```
tests/test_export.py::test_timeline_retrieval PASSED                     [  9%]
tests/test_export.py::test_archive_export_download PASSED                [ 18%]
tests/test_export.py::test_vault_reset_safety PASSED                     [ 27%]
tests/test_health.py::test_health_check PASSED                           [ 36%]
tests/test_health.py::test_system_status PASSED                          [ 45%]
tests/test_memories.py::test_create_and_get_memory PASSED                [ 54%]
tests/test_memories.py::test_file_upload_and_duplicate_detection PASSED  [ 63%]
tests/test_memories.py::test_path_traversal_defense PASSED               [ 72%]
tests/test_search_rag.py::test_semantic_search_and_rag_citations PASSED  [ 81%]
tests/test_search_rag.py::test_unsupported_question_graceful_uncertainty PASSED [ 90%]
tests/test_search_rag.py::test_contradiction_detection PASSED            [100%]
```

---

## 2. Frontend Production Build Execution (Next.js)

Command executed:
```powershell
npm run build
```

### Results Summary
- **Exit Code**: 0 (Success)
- **Routes Compiled**: 15/15 routes successfully generated.
  - `○ /` (Landing Page)
  - `○ /app` (Archive Dashboard)
  - `○ /app/memories` (Memory Library)
  - `ƒ /app/memories/[id]` (Memory Detail & Source Viewer)
  - `○ /app/import` (Ingestion Workflow)
  - `○ /app/ask` (Conversational AI Search)
  - `○ /app/timeline` (Chronological Timeline)
  - `○ /app/collections` (Collections Overview)
  - `ƒ /app/collections/[id]` (Collection Binder Detail)
  - `○ /app/remembrance` (Remembrance Room)
  - `○ /app/settings` (Diagnostics & Settings)
  - `○ /demo` (Synthetic Guided Demo)
  - `○ /docs` (Documentation Viewer)
  - `○ /privacy` (Privacy Verification)
  - `○ /_not-found` (404 Page)

---

## 3. Container & Podman Desktop Verification
- Podman Version: `6.1.4`
- Status: `backend.Containerfile`, `frontend.Containerfile`, and `compose.yaml` authored and verified syntactically.
- Environment Observation: On Windows with WSL2, the underlying `podman-machine-default` VM has 2GiB RAM; `win-sshproxy.exe` on Windows disconnected during heavy multi-layer image pulls over WSL pipes. Exact run commands and troubleshooting procedures are documented in `docs/PODMAN_SETUP.md`.
