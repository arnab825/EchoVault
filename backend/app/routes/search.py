from fastapi import APIRouter
from typing import List
from app.schemas import SearchQuery, SearchResultItem, ChatRequest, ChatResponse, SourceType, DatePrecision
from app.services.vector_store import vector_store
from app.services.rag_service import answer_memory_query

router = APIRouter(prefix="/api", tags=["Retrieval & Conversational Search"])

@router.post("/search", response_model=List[SearchResultItem])
async def search_passages(payload: SearchQuery):
    """Semantic vector search across indexed memory passages."""
    source_types = [st.value for st in payload.source_types] if payload.source_types else None
    results = await vector_store.search(
        query=payload.query,
        top_k=payload.top_k,
        source_types=source_types,
        tags=payload.tags
    )
    return [
        SearchResultItem(
            passage_id=r["passage_id"],
            memory_id=r["memory_id"],
            memory_title=r["memory_title"],
            source_type=SourceType(r["source_type"]),
            event_date=r.get("event_date"),
            date_precision=DatePrecision(r.get("date_precision", "exact")),
            passage_text=r["passage_text"],
            similarity_score=r["similarity_score"]
        )
        for r in results
    ]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_archive(payload: ChatRequest):
    """
    Evidence-backed conversational retrieval. Returns answers grounded in archival sources
    with verified citations and graceful uncertainty handling.
    """
    return await answer_memory_query(
        query=payload.query,
        conversation_id=payload.conversation_id,
        top_k=payload.top_k
    )
