# System Architecture: EchoVault

## Architectural Principles

1. **Air-Gapped by Default**: Data never transits outside the user's workstation.
2. **Deterministic Attribution**: AI answers are anchored directly to stored passage IDs.
3. **Decoupled AI Engine**: The core product is completely independent of any single model provider.
4. **Polyglot Preservation**: Preserves raw files, extracted text, and structured metadata together.

## Structural Decomposition

```
EchoVault/
├── frontend/                     # Next.js 14 Presentation Layer
│   ├── app/                      # App Router Routes & Viewports
│   ├── components/               # Persistent Shell, Navigation, Citation Panels
│   └── lib/                      # API Client, TypeScript Domain Models
│
├── backend/                      # FastAPI Application Server
│   ├── app/
│   │   ├── main.py               # Server Lifecycle & Middleware
│   │   ├── database.py           # SQLite Schema & Connection Pool
│   │   ├── routes/               # Modular Endpoints
│   │   ├── services/             # Storage, Extraction, Vector, RAG
│   │   └── config.py             # Environment Configuration
│   └── tests/                    # Pytest Verification Suite
│
├── data/                         # Persistent Storage Mount
│   ├── echovault.db              # Relational Metadata & Passages
│   ├── vector_index.json         # Dense Embeddings
│   ├── uploads/                  # Original Files & Photos
│   └── exports/                  # Generated Portable ZIP Archives
│
└── compose.yaml                  # Podman / Docker Container Orchestration
```

## Data Flow Diagrams

### Ingestion Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant SQLite
    participant VectorStore
    participant Disk

    User->>Frontend: Upload File (Letter/Photo/PDF)
    Frontend->>Backend: POST /api/memories (multipart/form-data)
    Backend->>Backend: Check size & sanitize filename
    Backend->>Disk: Write sanitized file to data/uploads
    Backend->>Backend: Extract text & chunk into passages
    Backend->>SQLite: Insert Memory & SourcePassages
    Backend->>VectorStore: Compute embeddings & index passages
    Backend->>SQLite: Insert TimelineEvent
    Backend-->>Frontend: Return MemoryOut (JSON)
```

### Evidence-Backed Retrieval Flow
```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant VectorStore
    participant Ollama

    User->>Frontend: Submit Question
    Frontend->>Backend: POST /api/chat
    Backend->>VectorStore: Search(query, top_k=5)
    VectorStore-->>Backend: Return ranked passages + scores
    Backend->>Backend: Check keyword overlap & relevance
    alt Sufficient Evidence
        Backend->>Ollama: Generate answer with bounded <ARCHIVAL_EVIDENCE>
        Ollama-->>Backend: Grounded answer with [1], [2] citations
        Backend-->>Frontend: ChatResponse (answer, citations, evidence_status="grounded")
    else Insufficient Evidence
        Backend-->>Frontend: ChatResponse ("No verified evidence found", citations=[], evidence_status="insufficient")
    end
    Frontend->>User: Render answer with clickable citation cards
```
