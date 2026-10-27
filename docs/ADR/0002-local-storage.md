# ADR 0002: SQLite 3 and Local Filesystem Persistence

## Status
Accepted

## Context
A digital preservation archive must guarantee that user data can be inspected, backed up, and migrated easily without requiring complex database server management.

## Decision
We chose **SQLite 3** operating in Write-Ahead Logging (WAL) mode with foreign key enforcement (`PRAGMA foreign_keys = ON;`), combined with standard local filesystem storage for uploaded original files.

1. **Relational Schema**: Manages memories, passages, timeline events, collections, and tributes with cascade deletion.
2. **File Assets**: Uploaded files are stored in `data/uploads/` with SHA-256 prefixes.
3. **Vector Index**: Persisted in human-readable JSON format (`data/vector_index.json`).

## Alternatives Considered
- **PostgreSQL / pgvector**: Rejected because running a separate database server adds deployment overhead for single-user desktop workstations.
- **Pure JSON Flat Files**: Rejected due to lack of relational referential integrity, indexing, and transactional guarantees.

## Consequences
- **Positive**: Single-file database portability (`echovault.db`), zero external server dependencies, instant backups.
- **Negative**: Concurrency is limited to single-writer, which is appropriate for personal desktop usage.
