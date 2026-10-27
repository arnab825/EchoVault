# Product Requirements Document (PRD): EchoVault

## 1. Executive Summary
EchoVault is a private, local-first AI memory archive designed for individuals, families, historians, and researchers. Submitted for the Hacktoberfest 2026 “Ghost in the Machine” challenge, EchoVault allows users to ingest personal letters, audio memoirs, photographs, and PDF documents into an air-gapped knowledge vault. Users can converse with their archive, receive evidence-backed answers citing exact source passages, explore chronological timelines with explicit date precision, and export self-contained archival bundles without third-party cloud dependencies.

## 2. Problem Statement
Personal and family heritage is currently fragmented across paper albums, forgotten cassettes, disparate cloud drives, and scanned PDFs. Searching for meaningful facts or stories across these media is tedious. While commercial cloud AI assistants offer conversational search, uploading private letters, medical accounts, and intimate family recollections to remote servers introduces serious privacy risks, potential model training on private data, and long-term vendor lock-in.

## 3. Product Vision & Goals
- **Grounded Historical Fidelity**: Responses are strictly anchored in retrieved source material with bracketed citations ([1], [2]).
- **Local-First Sovereignty**: The core application, vector indexing, and AI inference run locally on consumer hardware without sending data to hosted APIs.
- **Graceful Uncertainty**: The AI never fabricates missing relatives, dates, or events. If evidence is insufficient or conflicting, the system states so honestly.
- **Data Portability**: Users can export their entire archive as an unencrypted, portable ZIP bundle (JSON metadata + original files) at any time.
- **Open-Weight Independence**: The system communicates with standard open-weight model runtimes (Ollama) supporting Llama 3.2, Qwen 2.5, Mistral, and Gemma 2.

## 4. Non-Goals
- Simulating supernatural conversations with deceased relatives (e.g. griefbots).
- Voice cloning or synthetic audio recreation of ancestors.
- Mandatory commercial cloud AI integrations.
- Multi-tenant enterprise access control for an inherently single-user/family archive.

## 5. Personas
1. **Eleanor (Family Archivist)**: Preserving decades of handwritten letters and oral recordings. Needs transparent source citations and easy export for relatives.
2. **Marcus (Independent Researcher)**: Organizing local historical documents and oral history cassette transcripts. Requires chronological precision and discrepancy detection.
3. **Devon (Privacy-Conscious Developer)**: Wants an open-source, air-gapped personal memory vault running locally via Podman Desktop.

## 6. Functional Requirements
- **FR-01 Document Ingestion**: Ingest PDF, TXT, Markdown, image annotations, and audio recordings up to 50MB with cryptographic SHA-256 deduplication.
- **FR-02 Text Extraction & Chunking**: Extract readable text and partition content into bounded passages with page/segment tracking.
- **FR-03 Semantic Vector Indexing**: Generate dense vector embeddings and index passages using cosine similarity.
- **FR-04 Evidence-Grounded Conversational Search**: Retrieve top-k passages and generate answers citing exact source passages.
- **FR-05 Graceful Uncertainty & Discrepancy Detection**: Report insufficient evidence when questions lack support; flag conflicting dates or accounts across records.
- **FR-06 Chronological Timeline**: Visualize events chronologically with date precision badges (exact, month, year, approximate, unknown).
- **FR-07 Thematic Collections**: Group memories into curated binders without duplicating physical files.
- **FR-08 Digital Remembrance Room**: Respectful tributes capturing wisdom, favorite foods/songs, and personal reflections.
- **FR-09 Archive Export & Purge**: One-click download of a self-contained ZIP archive; irreversible wipe requiring typed confirmation.
- **FR-10 Settings & Runtime Diagnostics**: Configure Ollama connection, view storage metrics, and rebuild search indices.

## 7. Non-Functional Requirements
- **NFR-01 Security & Air-Gap**: Zero external network telemetry. All search and inference operate on `localhost`.
- **NFR-02 Accessibility**: Complies with WCAG 2.1 AA contrast standards, keyboard navigation, and `prefers-reduced-motion`.
- **NFR-03 Performance**: Vector search across 10,000 passages in under 50ms; offline synthesis in under 200ms.
- **NFR-04 Portability**: Containerized using standard Containerfiles compatible with Podman Desktop.
