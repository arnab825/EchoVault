# Deployment Guide: EchoVault

While local execution via Podman Desktop is the primary target for privacy, EchoVault can also be deployed to dedicated private servers or self-hosted environments.

---

## 1. Local Native Deployment (Without Containers)

### Backend Deployment
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Frontend Deployment
```powershell
cd frontend
npm install
npm run build
npm start
```

---

## 2. Linux Server Deployment (Systemd + Reverse Proxy)

### Architecture
Use Nginx or Caddy as a TLS reverse proxy in front of Next.js and FastAPI:
- `https://vault.example.com` -> Next.js on `127.0.0.1:3000`
- `https://vault.example.com/api` -> FastAPI on `127.0.0.1:8000/api`

### Security Rules for Public Hosting
1. Never expose Ollama (`11434`) to the public internet.
2. Bind backend and database ports only to loopback (`127.0.0.1`).
3. Enforce HTTPS via Let's Encrypt certificates.
4. Protect `/api/data/reset` with additional network firewalls or disable destructive endpoints.
