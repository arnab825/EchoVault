# Backup & Disaster Recovery: EchoVault

## 1. Export-Based Backup (Recommended)
EchoVault provides a single-click backup mechanism:
- Navigate to `/app/settings` and click **Export Archive (.ZIP)**, or call `GET /api/export`.
- This creates a timestamped bundle containing:
  - `archive_dump.json`: All memories, passage records, collections, tributes, and timeline events.
  - `vector_index.json`: Full dense embedding representations.
  - `uploads/`: All original high-resolution photos, audio files, and PDFs.

## 2. Filesystem Snapshot Backup
To back up the underlying data directory directly:
```bash
# Copy the data directory
cp -r backend/data /path/to/secure/backup/echovault_data_backup
```

## 3. Disaster Recovery Restoration
To restore a corrupted or wiped vault:
1. Stop the backend server or container.
2. Replace `backend/data/echovault.db` with your backup copy.
3. Replace `backend/data/uploads/` with your backup files.
4. Restart the backend and invoke `POST /api/index/rebuild` to synchronize vector indices.
