import pytest
from app.services.sample_data_loader import seed_sample_data

@pytest.mark.asyncio
async def test_semantic_search_and_rag_citations(client):
    # Seed synthetic sample data first
    seed_res = client.post("/api/sample-data/seed")
    assert seed_res.status_code == 200

    # Test Vector Search
    search_res = client.post("/api/search", json={"query": "lantern festival apple buns", "top_k": 3})
    assert search_res.status_code == 200
    results = search_res.json()
    assert len(results) > 0
    top_hit = results[0]
    assert "Autumn Lantern Walk" in top_hit["memory_title"] or "1952" in top_hit["memory_title"]

    # Test Conversational Search / Chat
    chat_res = client.post("/api/chat", json={"query": "When was the river lantern festival and what did Aunt Clara bring?"})
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["has_sufficient_evidence"] is True
    assert len(chat_data["citations"]) > 0
    # Citations must resolve to real memory title
    first_citation = chat_data["citations"][0]
    assert first_citation["memory_title"] == "The Autumn Lantern Walk along the River"
    assert "apple buns" in chat_data["answer"].lower() or "1952" in chat_data["answer"]

def test_unsupported_question_graceful_uncertainty(client):
    # Ask a question that cannot be answered from the archive
    chat_res = client.post("/api/chat", json={"query": "Did great-grandfather own a red helicopter or fly a spaceship?"})
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    assert chat_data["has_sufficient_evidence"] is False
    assert chat_data["evidence_status"] == "insufficient"
    assert "not contain enough" in chat_data["answer"].lower() or "insufficient" in chat_data["answer"].lower()

def test_contradiction_detection(client):
    # Query regarding the clocktower bell repair which has conflicting accounts in sample data
    chat_res = client.post("/api/chat", json={"query": "What year was the clocktower bell installed in the village church?"})
    assert chat_res.status_code == 200
    chat_data = chat_res.json()
    # Check that detected conflicts are reported
    assert len(chat_data["citations"]) > 0
    assert "1923" in chat_data["answer"] or "1925" in chat_data["answer"]
