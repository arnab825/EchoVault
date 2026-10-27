from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager
from app.config import settings
from app.database import init_db
from app.routes.health import router as health_router
from app.routes.memories import router as memories_router
from app.routes.search import router as search_router
from app.routes.timeline import router as timeline_router
from app.routes.collections import router as collections_router
from app.routes.remembrance import router as remembrance_router
from app.routes.export import router as export_router
from app.routes.index_routes import router as index_router
from app.routes.settings_routes import router as settings_router

# Setup Logging (Sanitized, excluding private memory content)
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("echovault")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database schema
    logger.info("Initializing EchoVault database schema and directories...")
    init_db()
    yield
    # Shutdown
    logger.info("EchoVault backend shutting down cleanly.")

app = FastAPI(
    title="EchoVault API",
    description="Local-First AI Memory Archive Engine for Hacktoberfest 2026 Ghost in the Machine challenge.",
    version=settings.VERSION,
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permits localhost Next.js and container networking
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global sanitized exception handler to prevent leaking internal traces
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception at {request.method} {request.url.path}: {exc.__class__.__name__}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred. Sensitive information was not leaked."}
    )

# Mount Uploads directory for source file retrieval
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")

# Include Routers
app.include_router(health_router)
app.include_router(memories_router)
app.include_router(search_router)
app.include_router(timeline_router)
app.include_router(collections_router)
app.include_router(remembrance_router)
app.include_router(export_router)
app.include_router(index_router)
app.include_router(settings_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
