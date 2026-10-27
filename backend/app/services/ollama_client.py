import httpx
from typing import List, Dict, Any, Optional
from app.config import settings

class OllamaClient:
    def __init__(self, base_url: str = settings.OLLAMA_BASE_URL, timeout: float = settings.OLLAMA_TIMEOUT_SECONDS):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout

    async def check_health(self) -> Dict[str, Any]:
        """Check if Ollama service is reachable and list installed models."""
        try:
            async with httpx.AsyncClient(timeout=3.0) as client:
                resp = await client.get(f"{self.base_url}/api/tags")
                if resp.status_code == 200:
                    data = resp.json()
                    models = [m.get("name") for m in data.get("models", [])]
                    return {
                        "connected": True,
                        "models": models,
                        "active_model": settings.OLLAMA_MODEL,
                        "embed_model": settings.OLLAMA_EMBED_MODEL
                    }
        except Exception:
            pass

        return {
            "connected": False,
            "models": [],
            "active_model": settings.OLLAMA_MODEL,
            "embed_model": settings.OLLAMA_EMBED_MODEL
        }

    async def generate_response(self, prompt: str, system_prompt: Optional[str] = None) -> Optional[str]:
        """Call Ollama /api/generate endpoint."""
        try:
            payload = {
                "model": settings.OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,  # Low temperature for factual fidelity
                    "top_p": 0.9,
                }
            }
            if system_prompt:
                payload["system"] = system_prompt

            async with httpx.AsyncClient(timeout=self.timeout) as client:
                resp = await client.post(f"{self.base_url}/api/generate", json=payload)
                if resp.status_code == 200:
                    return resp.json().get("response")
        except Exception:
            return None
        return None

ollama_client = OllamaClient()
