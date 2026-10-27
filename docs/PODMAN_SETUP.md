# Podman Desktop Setup & Container Operations: EchoVault

This guide details how to build, run, and test EchoVault using Podman Desktop.

---

## 1. Prerequisites
- **Podman Desktop** (v5.x or v6.x) or **Podman CLI** (6.1.4+)
- On Windows/macOS: Active Podman machine initialized with at least 4GB RAM (recommended for LLMs)
- (Optional) Local Ollama daemon running on host machine

---

## 2. Podman Machine Initialization (Windows/macOS)

If setting up a fresh Podman machine:
```bash
# Initialize a machine with 4 CPUs and 4GB RAM
podman machine init --cpus 4 --memory 4096 echovault-vm

# Start the machine
podman machine start echovault-vm
```

---

## 3. Validating & Running Services with Compose

EchoVault ships with a root `compose.yaml`:

```bash
# 1. Validate compose structure
podman compose config

# 2. Build and launch services in background
podman compose up --build -d

# 3. Inspect running containers
podman compose ps

# 4. View service logs
podman compose logs -f backend
podman compose logs -f frontend
```

---

## 4. Port Mappings & Network Topology

| Service | Internal Port | Exposed Port | URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | 3000 | 3000 | `http://localhost:3000` |
| **Backend** | 8000 | 8000 | `http://localhost:8000` |
| **Ollama** | 11434 | 11434 (Host) | `http://host.containers.internal:11434` |

### Host Networking with Ollama
When the backend container needs to talk to Ollama running on your workstation, `compose.yaml` configures:
```yaml
extra_hosts:
  - "host.containers.internal:host-gateway"
```
This enables the containerized backend to send inference requests to `http://host.containers.internal:11434`.

---

## 5. Persistence & Volume Management
EchoVault mounts a persistent named volume:
- `echovault_data:/app/data`: Contains `echovault.db`, `vector_index.json`, and `uploads/`.

Rebuilding or restarting containers preserves all stored memories and vector embeddings.

### Backup & Restore
```bash
# Export container volume
podman volume export echovault_data > echovault_backup.tar

# Restore volume
podman volume import echovault_data echovault_backup.tar
```

---

## 6. Clean Shutdown
```bash
podman compose down
```
To remove persistent volumes as well:
```bash
podman compose down -v
```
