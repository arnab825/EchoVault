import pytest
import os
import shutil
from pathlib import Path
from fastapi.testclient import TestClient

# Configure test environment
os.environ["DATA_DIR"] = "./test_data"
os.environ["DATABASE_PATH"] = "./test_data/test_echovault.db"
os.environ["UPLOAD_DIR"] = "./test_data/uploads"
os.environ["EXPORT_DIR"] = "./test_data/exports"
os.environ["VECTOR_INDEX_PATH"] = "./test_data/test_vector_index.json"
os.environ["ALLOW_OFFLINE_MOCK_FALLBACK"] = "true"
os.environ["OFFLINE_MODE_STRICT"] = "true"

import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.main import app
from app.config import settings
from app.database import init_db
from app.services.vector_store import vector_store

@pytest.fixture(scope="session", autouse=True)
def setup_test_environment():
    # Setup clean test directories
    test_dir = Path("./test_data")
    if test_dir.exists():
        shutil.rmtree(test_dir)
    test_dir.mkdir(parents=True, exist_ok=True)
    settings.DATA_DIR = test_dir
    settings.DATABASE_PATH = test_dir / "test_echovault.db"
    settings.UPLOAD_DIR = test_dir / "uploads"
    settings.EXPORT_DIR = test_dir / "exports"
    settings.VECTOR_INDEX_PATH = test_dir / "test_vector_index.json"
    settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    settings.EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    
    vector_store.index_path = settings.VECTOR_INDEX_PATH
    vector_store.clear()
    init_db()

    yield

    # Teardown
    if test_dir.exists():
        try:
            shutil.rmtree(test_dir)
        except Exception:
            pass

@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c
