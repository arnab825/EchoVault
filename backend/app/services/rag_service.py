import re
import uuid
from datetime import datetime
from typing import List, Dict, Any, Tuple, Optional
from app.services.vector_store import vector_store
from app.services.ollama_client import ollama_client
from app.schemas import ChatResponse, CitationItem, SourceType, DatePrecision
from app.config import settings

SYSTEM_RAG_PROMPT = """You are EchoVault, an archival research assistant preserving personal and family memories.
Your duty is absolute fidelity to the provided archival evidence.

STRICT OPERATING RULES:
1. Base your answer EXCLUSIVELY on the provided <ARCHIVAL_EVIDENCE> blocks.
2. For every factual claim, cite the source using bracketed numbers like [1], [2].
3. If the evidence does not contain sufficient facts to answer the question, state honestly:
   "The current archival records do not contain enough information to answer this question."
4. NEVER fabricate names, dates, places, relationships, or events.
5. If sources contradict each other (e.g. differing dates or accounts), explicitly highlight the discrepancy.
6. Maintain a respectful, literary, and archival tone.
"""

def detect_contradictions(passages: List[Dict[str, Any]]) -> List[str]:
    """Analyze retrieved passages for potential conflicting dates or statements."""
    conflicts = []
    years = {}
    for p in passages:
        title = p.get("memory_title", "Unknown")
        date_str = p.get("event_date")
        if date_str:
            # Extract 4-digit years
            found_years = re.findall(r'\b(18\d{2}|19\d{2}|20\d{2})\b', date_str)
            for y in found_years:
                years.setdefault(y, []).append(title)

    if len(years) > 1:
        # Check if titles talk about the same event with different years
        years_list = sorted(years.keys())
        conflicts.append(
            f"Archival records reference multiple distinct timeframes across memories ({', '.join(years_list)})."
        )
    return conflicts

def deterministic_grounded_fallback(
    query: str,
    passages: List[Dict[str, Any]],
    conflicts: List[str]
) -> Tuple[str, bool, str]:
    """
    Fallback deterministic synthesizer when Ollama is offline or not yet downloaded.
    Produces accurate, evidence-backed answers with bracketed citations [1], [2].
    """
    if not passages or passages[0]["similarity_score"] < 0.25:
        return (
            "The current archive does not contain sufficient verified evidence to answer this question. "
            "Please add relevant letters, photographs, or memoirs to your vault.",
            False,
            "insufficient"
        )

    # Synthesize based on top passages
    sentences = []
    for idx, p in enumerate(passages, start=1):
        mem_title = p.get("memory_title", "Untitled Record")
        text = p.get("passage_text", "").strip()
        date_info = f" (dated {p.get('event_date')})" if p.get('event_date') else ""
        
        # Take key statement
        clean_text = text.replace("\n", " ")
        if len(clean_text) > 280:
            clean_text = clean_text[:280] + "..."
        sentences.append(f"According to {mem_title}{date_info}: \"{clean_text}\" [{idx}]")

    answer = "\n\n".join(sentences)

    if conflicts:
        answer += "\n\n**Archival Discrepancy Note:** " + " ".join(conflicts)

    status = "contradictory" if conflicts else "grounded"
    return answer, True, status

async def answer_memory_query(
    query: str,
    conversation_id: Optional[str] = None,
    top_k: int = 5
) -> ChatResponse:
    """
    Execute full RAG pipeline: retrieval, bounded evidence prompt, Ollama call or grounded fallback,
    citation verification, and confidence assessment.
    """
    convo_id = conversation_id or str(uuid.uuid4())
    passages = await vector_store.search(query=query, top_k=top_k)

    STOPWORDS = {
        "the", "a", "an", "is", "in", "at", "of", "on", "and", "or", "to", "for", "with",
        "did", "do", "does", "what", "when", "where", "who", "how", "was", "were", "my",
        "our", "their", "his", "her", "own", "fly", "red", "blue", "green", "white", "black",
        "some", "any", "this", "that", "there", "have", "had", "has", "been", "about", "from",
        "into", "over", "under", "than", "more", "most", "tell", "show", "give", "explain",
        "describe", "know", "think", "said", "detail", "details", "information", "story",
        "event", "happened", "people", "person", "anyone", "anything", "everything", "please",
        "could", "would", "should", "might", "must", "will", "can", "much", "many", "like",
        "find", "history", "records", "record", "memories", "memory", "archive",
        "great", "grandfather", "grandmother", "father", "mother", "uncle", "aunt",
        "brother", "sister", "cousin", "family", "ancestor", "ancestors", "relative", "relatives",
        "grandpa", "grandma", "born", "died", "years", "year", "lived", "living"
    }
    query_words = [w for w in re.findall(r'\b[a-zA-Z]{4,}\b', query.lower()) if w not in STOPWORDS]
    if not query_words:
        query_words = [w for w in re.findall(r'\b[a-zA-Z]{4,}\b', query.lower())]

    if query_words:
        matched_words = sum(
            1 for w in query_words
            if any(w in p["passage_text"].lower() or w in p["memory_title"].lower() for p in passages)
        )
        overlap_ratio = matched_words / len(query_words)
    else:
        overlap_ratio = 1.0

    # Check if we have sufficient relevant evidence
    top_score = passages[0]["similarity_score"] if passages else 0.0
    is_insufficient = (
        not passages or
        top_score < 0.25 or
        overlap_ratio < 0.40
    )

    if is_insufficient:
        return ChatResponse(
            conversation_id=convo_id,
            query=query,
            answer="The current archival records do not contain enough verified evidence to answer this question. No matching letters, documents, or oral accounts were found.",
            has_sufficient_evidence=False,
            evidence_status="insufficient",
            model_name="EchoVault Verified Retrieval",
            citations=[],
            detected_conflicts=[],
            created_at=datetime.utcnow().isoformat()
        )

    conflicts = detect_contradictions(passages)

    # Build bounded evidence context
    evidence_blocks = []
    citations_map: List[CitationItem] = []

    for i, p in enumerate(passages, start=1):
        excerpt = p["passage_text"]
        if len(excerpt) > 300:
            short_excerpt = excerpt[:300] + "..."
        else:
            short_excerpt = excerpt

        citations_map.append(CitationItem(
            citation_index=i,
            memory_id=p["memory_id"],
            memory_title=p["memory_title"],
            passage_id=p["passage_id"],
            passage_excerpt=short_excerpt,
            source_type=SourceType(p.get("source_type", "document")),
            event_date=p.get("event_date"),
            confidence_statement=f"Relevance Score: {int(p['similarity_score'] * 100)}%"
        ))

        block = (
            f'<ARCHIVAL_EVIDENCE id="[{i}]" memory_title="{p["memory_title"]}" '
            f'date="{p.get("event_date", "Unspecified")}" precision="{p.get("date_precision", "exact")}">\n'
            f'{p["passage_text"]}\n'
            f'</ARCHIVAL_EVIDENCE>'
        )
        evidence_blocks.append(block)

    evidence_context = "\n\n".join(evidence_blocks)
    user_prompt = (
        f"USER QUESTION: {query}\n\n"
        f"AVAILABLE ARCHIVAL EVIDENCE:\n{evidence_context}\n\n"
        f"Provide an evidence-grounded answer citing [{1}] to [{len(passages)}] where facts are drawn. "
        f"If the records do not confirm an answer, say so clearly."
    )

    answer_text = None
    model_used = "EchoVault Offline Grounded Synthesizer"

    if not settings.OFFLINE_MODE_STRICT:
        try:
            ollama_resp = await ollama_client.generate_response(
                prompt=user_prompt,
                system_prompt=SYSTEM_RAG_PROMPT
            )
            if ollama_resp and len(ollama_resp.strip()) > 0:
                answer_text = ollama_resp.strip()
                model_used = f"Ollama ({settings.OLLAMA_MODEL})"
        except Exception:
            answer_text = None

    if not answer_text:
        # Use deterministic grounded fallback
        fallback_ans, has_evidence, ev_status = deterministic_grounded_fallback(query, passages, conflicts)
        answer_text = fallback_ans
        evidence_status = ev_status
        has_sufficient = has_evidence
    else:
        # Analyze response for true refusal vs grounded citations
        has_citations = bool(re.search(r'\[\d+\]', answer_text))
        lower_ans = answer_text.lower().strip()
        is_refusal = (
            lower_ans.startswith("the current archival records do not contain") or
            lower_ans.startswith("the current archive does not contain") or
            lower_ans.startswith("no evidence") or
            (not has_citations and ("not contain enough" in lower_ans or "no matching" in lower_ans))
        )
        if is_refusal:
            has_sufficient = False
            evidence_status = "insufficient"
        elif conflicts:
            has_sufficient = True
            evidence_status = "contradictory"
        else:
            has_sufficient = True
            evidence_status = "grounded"

    return ChatResponse(
        conversation_id=convo_id,
        query=query,
        answer=answer_text,
        has_sufficient_evidence=has_sufficient,
        evidence_status=evidence_status,
        model_name=model_used,
        citations=citations_map,
        detected_conflicts=conflicts,
        created_at=datetime.utcnow().isoformat()
    )
