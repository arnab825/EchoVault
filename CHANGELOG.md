# Changelog

All notable changes to **EchoVault** will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-10-27

### Added
- **Core Product:** Launched EchoVault for Hacktoberfest 2026 "Ghost in the Machine" challenge.
- **Frontend Architecture:** Next.js 14 App Router with Tailwind CSS design system, Lucide icons, and responsive layouts.
- **Routes:** Premium Landing Page (`/`), Archive Dashboard (`/app`), Memory Library (`/app/memories`), Memory Detail & Source Viewer (`/app/memories/[id]`), Import Workflow (`/app/import`), Conversational AI Search (`/app/ask`), Chronological Timeline (`/app/timeline`), User Collections (`/app/collections`), Digital Remembrance Room (`/app/remembrance`), System Settings (`/app/settings`), Privacy Policy (`/privacy`), Documentation Viewer (`/docs`), and Sample Data Demo Mode (`/demo`).
- **Backend Architecture:** FastAPI application with SQLite metadata persistence, secure file management, content SHA-256 deduplication, and vector indexing.
- **AI & RAG Engine:** Grounded retrieval-augmented generation using open-weight models via Ollama with strict evidence citations, uncertainty detection, and offline deterministic fallback.
- **Security & Privacy:** Path traversal defenses, prompt injection delimiters, untrusted input containment, zero external telemetry, and complete local export/purge.
- **Containerization:** Production-ready `frontend.Containerfile`, `backend.Containerfile`, and `compose.yaml` validated with Podman Desktop.
- **Testing & Documentation:** Pytest test suite with 100% passing checks and a 23-document technical specification suite in `docs/`.
