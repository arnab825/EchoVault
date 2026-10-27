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
            target_model = settings.OLLAMA_MODEL
            timeout = httpx.Timeout(self.timeout, connect=2.0)
            async with httpx.AsyncClient(timeout=timeout) as client:
                tags_resp = await client.get(f"{self.base_url}/api/tags")
                if tags_resp.status_code == 200:
                    installed = [m.get("name", "") for m in tags_resp.json().get("models", [])]
                    instruction_models = [m for m in installed if "embed" not in m]
                    if not instruction_models:
                        return None
                    if target_model not in installed and not any(target_model in m for m in installed):
                        target_model = instruction_models[0]

                payload = {
                    "model": target_model,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "temperature": 0.1,  # Low temperature for factual fidelity
                        "top_p": 0.9,
                    }
                }
                if system_prompt:
                    payload["system"] = system_prompt

                resp = await client.post(f"{self.base_url}/api/generate", json=payload)
                if resp.status_code == 200:
                    return resp.json().get("response")
        except Exception:
            return None
        return None

ollama_client = OllamaClient()
