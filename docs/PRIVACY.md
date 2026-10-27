# Privacy by Design: EchoVault

## Core Privacy Architecture

### 1. Air-Gapped Local Operation
The default operational workflow sends zero bytes to remote commercial AI servers.
- **Inference**: Executed on `localhost` via Ollama.
- **Embeddings**: Generated locally using `nomic-embed-text` or our deterministic fallback engine.
- **Database**: Maintained on local disk in SQLite 3.

### 2. Disclosures on Local Security
While EchoVault eliminates cloud data leakage, local data privacy depends on physical and OS-level workstation security:
- **Local Machine Access**: Other users with root/admin access to the physical workstation can inspect SQLite files.
- **Workstation Encryption**: We recommend full-disk encryption (BitLocker, FileVault, LUKS) for machines storing sensitive historical documents.
- **Network Interface**: In container deployments, ensure ports `3000` and `8000` bind to `127.0.0.1` when operating on untrusted local networks.

### 3. Data Export & Erasure Rights
- **Complete Portability**: Download a standalone `.zip` containing all memories, raw source files, and JSON databases.
- **Right to be Forgotten**: One-click purge (`DELETE_ALL_MEMORIES`) erases all database tables, vector indices, and uploaded disk assets simultaneously.
