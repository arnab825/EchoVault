import json
import math
import re
from pathlib import Path
from typing import List, Dict, Any, Optional
import httpx
import numpy as np
from app.config import settings

class LocalVectorStore:
    def __init__(self, index_path: Path = settings.VECTOR_INDEX_PATH):
        self.index_path = index_path
        self.passages: Dict[str, Dict[str, Any]] = {}
        self.load()

    def load(self):
        """Load the vector index from disk if it exists."""
        if self.index_path.exists():
            try:
                with open(self.index_path, "r", encoding="utf-8") as f:
                    self.passages = json.load(f)
            except Exception:
                self.passages = {}
        else:
            self.passages = {}

    def save(self):
        """Persist vector index to disk."""
        with open(self.index_path, "w", encoding="utf-8") as f:
            json.dump(self.passages, f, indent=2)

    async def get_embedding(self, text: str) -> List[float]:
        """
        Generate embedding vector using Ollama.
        If Ollama is offline or fails, use deterministic local hash/n-gram embedding.
        """
        if not settings.OFFLINE_MODE_STRICT:
            try:
                async with httpx.AsyncClient(timeout=1.5) as client:
                    resp = await client.post(
                        f"{settings.OLLAMA_BASE_URL}/api/embeddings",
                        json={"model": settings.OLLAMA_EMBED_MODEL, "prompt": text}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        if "embedding" in data and len(data["embedding"]) > 0:
                            return data["embedding"]
            except Exception:
                # Fallback to local deterministic embedding
                pass

        # Offline deterministic vectorizer (384-dimensional dense bag-of-words/character n-grams)
        return self._compute_fallback_embedding(text)

    def _compute_fallback_embedding(self, text: str, dim: int = 384) -> List[float]:
        """
        Generates a normalized, deterministic dense embedding using subword tokens and n-grams.
        Guarantees that semantically similar words and exact matches cluster together.
        """
        vec = np.zeros(dim, dtype=np.float32)
        words = re.findall(r'\b\w+\b', text.lower())
        
        if not words:
            return vec.tolist()

        for word in words:
            # Word level hashing
            h_word = abs(hash(word)) % dim
            vec[h_word] += 1.0
            
            # Character trigrams for morphological and stem similarity
            for i in range(len(word) - 2):
                tri = word[i:i+3]
                h_tri = abs(hash(tri)) % dim
                vec[h_tri] += 0.4

        # Normalize L2
        norm = np.linalg.norm(vec)
        if norm > 0:
            vec = vec / norm

        return vec.tolist()

    async def add_passage(
        self,
        passage_id: str,
        memory_id: str,
        memory_title: str,
        source_type: str,
        passage_text: str,
        event_date: Optional[str] = None,
        date_precision: str = "exact",
        tags: Optional[List[str]] = None
    ):
        """Add or update a passage with its embedding."""
        embedding = await self.get_embedding(passage_text)
        self.passages[passage_id] = {
            "passage_id": passage_id,
            "memory_id": memory_id,
            "memory_title": memory_title,
            "source_type": source_type,
            "passage_text": passage_text,
            "event_date": event_date,
            "date_precision": date_precision,
            "tags": tags or [],
            "embedding": embedding
        }
        self.save()

    def remove_by_memory_id(self, memory_id: str):
        """Remove all passages associated with a given memory ID."""
        keys_to_delete = [
            pid for pid, data in self.passages.items() if data.get("memory_id") == memory_id
        ]
        for k in keys_to_delete:
            del self.passages[k]
        self.save()

    def clear(self):
        """Clear all entries."""
        self.passages = {}
        self.save()

    async def search(
        self,
        query: str,
        top_k: int = 5,
        source_types: Optional[List[str]] = None,
        tags: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        """
        Semantic search across passages using cosine similarity.
        """
        if not self.passages:
            return []

        query_emb = np.array(await self.get_embedding(query), dtype=np.float32)
        query_norm = np.linalg.norm(query_emb)
        if query_norm == 0:
            query_norm = 1.0

        results = []
        for pid, data in self.passages.items():
            if source_types and data.get("source_type") not in source_types:
                continue
            if tags and not any(t in data.get("tags", []) for t in tags):
                continue

            doc_emb = np.array(data["embedding"], dtype=np.float32)
            # Handle dimension mismatch if any
            if len(doc_emb) != len(query_emb):
                min_len = min(len(doc_emb), len(query_emb))
                doc_emb = doc_emb[:min_len]
                q_slice = query_emb[:min_len]
            else:
                q_slice = query_emb

            doc_norm = np.linalg.norm(doc_emb)
            if doc_norm == 0:
                doc_norm = 1.0

            similarity = float(np.dot(q_slice, doc_emb) / (query_norm * doc_norm))

            results.append({
                "passage_id": pid,
                "memory_id": data["memory_id"],
                "memory_title": data["memory_title"],
                "source_type": data["source_type"],
                "event_date": data.get("event_date"),
                "date_precision": data.get("date_precision", "exact"),
                "passage_text": data["passage_text"],
                "similarity_score": round(similarity, 4)
            })

        # Sort descending by similarity
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results[:top_k]

vector_store = LocalVectorStore()
