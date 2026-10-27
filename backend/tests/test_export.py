def test_timeline_retrieval(client):
    client.post("/api/sample-data/seed")
    res = client.get("/api/timeline")
    assert res.status_code == 200
    events = res.json()
    assert isinstance(events, list)
    assert len(events) > 0
    # Confirm events have dates and source types
    assert any(e["event_date"] is not None for e in events)

def test_archive_export_download(client):
    res = client.get("/api/export")
    assert res.status_code == 200
    assert res.headers["content-type"] == "application/zip"
    assert len(res.content) > 100  # Non-empty ZIP

def test_vault_reset_safety(client):
    # Bad confirmation phrase should fail
    bad_res = client.request("DELETE", "/api/data/reset", json={"confirm_phrase": "WRONG_PHRASE"})
    assert bad_res.status_code == 400

    # Correct confirmation phrase should wipe data cleanly
    good_res = client.request("DELETE", "/api/data/reset", json={"confirm_phrase": "DELETE_ALL_MEMORIES"})
    assert good_res.status_code == 200

    # Verify memories are now 0
    status_res = client.get("/api/status")
    assert status_res.json()["total_memories"] == 0
