import hashlib
import os
import re
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from app.config import settings

def sanitize_filename(filename: str) -> str:
    """Sanitize filename to prevent directory traversal and invalid characters."""
    base = os.path.basename(filename)
    # Remove any dangerous characters, keep only alphanumerics, dots, dashes, underscores
    sanitized = re.sub(r'[^a-zA-Z0-9_.-]', '_', base)
    if not sanitized:
        sanitized = "unnamed_memory"
    return sanitized

def compute_sha256(file_bytes: bytes) -> str:
    """Compute SHA-256 hash of raw bytes."""
    hasher = hashlib.sha256()
    hasher.update(file_bytes)
    return hasher.hexdigest()

def validate_and_save_file(file: UploadFile, content_bytes: bytes) -> tuple[str, str, str]:
    """
    Validate file size, extension, compute hash, and save safely.
    Returns: (content_hash, relative_file_path, original_filename)
    """
    if len(content_bytes) > settings.MAX_UPLOAD_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_BYTES // (1024*1024)}MB."
        )

    orig_name = sanitize_filename(file.filename or "uploaded_memory")
    ext = Path(orig_name).suffix.lower()

    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(sorted(settings.ALLOWED_EXTENSIONS))}"
        )

    content_hash = compute_sha256(content_bytes)
    safe_stored_name = f"{content_hash[:16]}_{orig_name}"
    
    # Secure path traversal check: ensure resolved target is inside UPLOAD_DIR
    target_path = (settings.UPLOAD_DIR / safe_stored_name).resolve()
    upload_dir_resolved = settings.UPLOAD_DIR.resolve()
    
    try:
        target_path.relative_to(upload_dir_resolved)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Illegal filename or directory traversal attempt detected."
        )

    # Save file to disk
    with open(target_path, "wb") as f:
        f.write(content_bytes)

    relative_path = f"uploads/{safe_stored_name}"
    return content_hash, relative_path, orig_name
