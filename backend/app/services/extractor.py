import io
from pathlib import Path
from typing import List, Tuple
import pypdf

def extract_text_from_file(file_bytes: bytes, filename: str) -> Tuple[str, str]:
    """
    Extracts text from file bytes based on extension.
    Returns: (extracted_text, extraction_method)
    """
    ext = Path(filename).suffix.lower()
    
    if ext in [".txt", ".md"]:
        try:
            return file_bytes.decode("utf-8").strip(), "plain_text"
        except UnicodeDecodeError:
            try:
                return file_bytes.decode("latin-1").strip(), "plain_text_latin1"
            except Exception:
                return "", "text_decode_failed"
                
    elif ext == ".pdf":
        try:
            reader = pypdf.PdfReader(io.BytesIO(file_bytes))
            pages_text = []
            for i, page in enumerate(reader.pages):
                text = page.extract_text()
                if text:
                    pages_text.append(f"[Page {i+1}]\n{text.strip()}")
            full_text = "\n\n".join(pages_text).strip()
            if full_text:
                return full_text, "pdf_extractor"
            else:
                return "[Scanned or image-only PDF. Please review and provide text transcript.]", "pdf_empty"
        except Exception as e:
            return f"[Error parsing PDF: {str(e)}]", "pdf_error"

    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        # Image memory: Check if OCR is available or use metadata attribution
        return "[Archival Photograph. Add notes or memories associated with this photograph.]", "image_metadata"

    elif ext in [".mp3", ".wav", ".m4a"]:
        # Audio memory: Oral history recording
        return "[Oral History Audio Recording. User transcript or summary may be added.]", "audio_metadata"

    return "", "unsupported"

def chunk_text_into_passages(text: str, chunk_size: int = 400, overlap: int = 50) -> List[Tuple[str, int | None]]:
    """
    Splits text into bounded passages for semantic retrieval and evidence citations.
    Returns list of (passage_text, page_number or None).
    """
    if not text or not text.strip():
        return []

    lines = text.split("\n")
    passages = []
    current_chunk = []
    current_length = 0
    current_page = None

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
            
        if line_clean.startswith("[Page ") and line_clean.endswith("]"):
            try:
                current_page = int(line_clean.replace("[Page ", "").replace("]", ""))
            except ValueError:
                pass
            continue

        if current_length + len(line_clean) > chunk_size and current_chunk:
            passage_str = " ".join(current_chunk).strip()
            if passage_str:
                passages.append((passage_str, current_page))
            # Keep small overlap
            if len(current_chunk) > 1:
                current_chunk = [current_chunk[-1], line_clean]
                current_length = len(current_chunk[0]) + len(line_clean)
            else:
                current_chunk = [line_clean]
                current_length = len(line_clean)
        else:
            current_chunk.append(line_clean)
            current_length += len(line_clean)

    if current_chunk:
        passage_str = " ".join(current_chunk).strip()
        if passage_str:
            passages.append((passage_str, current_page))

    return passages
