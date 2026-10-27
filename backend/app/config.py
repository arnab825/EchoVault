import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    APP_NAME: str = "EchoVault"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "production"
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    CORS_ORIGINS: list[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000"
    ]
    
    # Storage Paths
    DATA_DIR: Path = BASE_DIR / "data"
    DATABASE_PATH: Path = BASE_DIR / "data" / "echovault.db"
    UPLOAD_DIR: Path = BASE_DIR / "data" / "uploads"
    EXPORT_DIR: Path = BASE_DIR / "data" / "exports"
    VECTOR_INDEX_PATH: Path = BASE_DIR / "data" / "vector_index.json"
    
    # File Limits
    MAX_UPLOAD_SIZE_BYTES: int = 50 * 1024 * 1024  # 50 MB
    ALLOWED_EXTENSIONS: set[str] = {
        ".txt", ".md", ".pdf", ".png", ".jpg", ".jpeg", ".webp", ".mp3", ".wav", ".m4a"
    }
    
    # Ollama / Local AI Settings
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")
    OLLAMA_EMBED_MODEL: str = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")
    OLLAMA_TIMEOUT_SECONDS: float = float(os.getenv("OLLAMA_TIMEOUT_SECONDS", "60.0"))
    ALLOW_OFFLINE_MOCK_FALLBACK: bool = os.getenv("ALLOW_OFFLINE_MOCK_FALLBACK", "true").lower() in ("true", "1")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "echovault-local-secret-key-1026")
    OFFLINE_MODE_STRICT: bool = os.getenv("OFFLINE_MODE_STRICT", "false").lower() in ("true", "1")

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()

# Ensure directories exist
settings.DATA_DIR.mkdir(parents=True, exist_ok=True)
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
settings.EXPORT_DIR.mkdir(parents=True, exist_ok=True)
