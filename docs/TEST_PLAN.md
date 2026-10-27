# Test Plan: EchoVault

## Test Levels & Methodology

### 1. Backend Automated Testing (Pytest)
- **Health & Readiness**: Verify `/api/health` and `/api/status` report database and system metrics.
- **Request Validation & Ingestion**: Test direct JSON creation, multipart file uploads, allowed file formats, and file size limits.
- **Path Traversal Security**: Verify attempted path traversal attacks (`../../`) are blocked or sanitized.
- **Deduplication**: Verify submitting identical file bytes triggers HTTP 409 Conflict.
- **Extraction & Passage Chunking**: Verify text splitting and page metadata preservation.
- **Vector Retrieval**: Verify cosine similarity correctly ranks relevant passages.
- **RAG Citation Grounding**: Verify answer citations resolve to stored passage IDs and memory records.
- **Graceful Uncertainty**: Verify asking unsupported questions returns honest negative notices.
- **Historical Discrepancies**: Verify conflicting accounts are reported.
- **Timeline & Archive Lifecycle**: Verify chronological sorting, ZIP download, and `DELETE_ALL_MEMORIES` reset.

### 2. Frontend Automated Build Verification (Next.js)
- Run `npm run build` to verify TypeScript type-checking, JSX parsing, Tailwind CSS utility compilation, and static/dynamic route generation for all 15 routes.

### 3. Container & Compose Verification (Podman)
- Author and validate `compose.yaml`, `backend.Containerfile`, and `frontend.Containerfile`.
- Inspect Podman machine status and container connectivity.
