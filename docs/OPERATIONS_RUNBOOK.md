# Operations Runbook: EchoVault

## Routine Maintenance & Operations

### 1. Health & Liveness Checks
- **Probe Endpoint**: `curl http://localhost:8000/api/health`
- **Readiness Check**: `curl http://localhost:8000/api/status`

### 2. Monitoring & Diagnostics
- Check total memories, passages, and Ollama connectivity via `/app/settings`.
- If search feels unresponsive or Ollama is offline, the backend automatically transitions to deterministic grounded synthesis with zero downtime.

### 3. Rebuilding the Vector Index
If the underlying embedding model is switched or passage files are modified out-of-band:
1. Navigate to `/app/settings`.
2. Click **Rebuild Index**.
3. Or invoke: `curl -X POST http://localhost:8000/api/index/rebuild`.

### 4. Handling Port Conflicts
- Default Frontend: 3000
- Default Backend: 8000
- If port 8000 is occupied, set `BACKEND_PORT=8001` in `.env` and `NEXT_PUBLIC_API_URL=http://localhost:8001` in frontend.
