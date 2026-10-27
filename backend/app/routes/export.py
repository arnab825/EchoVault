from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse
from pydantic import BaseModel
from app.services.export_service import export_vault_archive, purge_vault_data

router = APIRouter(prefix="/api", tags=["Archive Export & Data Lifecycle"])

class ResetConfirm(BaseModel):
    confirm_phrase: str

@router.get("/export")
def download_archive():
    """Generates and serves a self-contained ZIP bundle of the complete memory vault."""
    try:
        archive_path = export_vault_archive()
        return FileResponse(
            path=str(archive_path),
            filename=archive_path.name,
            media_type="application/zip"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Archive generation failed: {str(e)}"
        )

@router.delete("/data/reset")
def reset_vault(payload: ResetConfirm):
    """
    Purge all memories, files, vector embeddings, and database tables.
    Requires explicit confirmation phrase 'DELETE_ALL_MEMORIES'.
    """
    if payload.confirm_phrase != "DELETE_ALL_MEMORIES":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid confirmation phrase. Must be exactly 'DELETE_ALL_MEMORIES'."
        )

    purge_vault_data()
    return {"message": "All EchoVault archives and indices have been permanently erased."}
