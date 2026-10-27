import io
from fastapi import status

def test_create_and_get_memory(client):
    # Create memory via form
    payload = {
        "title": "Summer by the Lake 1974",
        "source_type": "story",
        "description": "Recollections of cabin trip in Minnesota",
        "extracted_text": "We stayed at the red cedar cabin on Lake Vermilion in July 1974. Uncle Leo caught a northern pike.",
        "event_date": "1974-07-10",
        "date_precision": "exact",
        "tags": '["lake", "cabin", "minnesota"]'
    }
    res = client.post("/api/memories", data=payload)
    assert res.status_code == 201
    created = res.json()
    assert created["title"] == "Summer by the Lake 1974"
    mem_id = created["id"]

    # Retrieve by ID
    get_res = client.get(f"/api/memories/{mem_id}")
    assert get_res.status_code == 200
    detail = get_res.json()
    assert detail["id"] == mem_id
    assert len(detail["passages"]) > 0

    # Test update
    update_res = client.patch(f"/api/memories/{mem_id}", json={"description": "Updated cabin description"})
    assert update_res.status_code == 200
    assert update_res.json()["description"] == "Updated cabin description"

    # Test delete
    del_res = client.delete(f"/api/memories/{mem_id}")
    assert del_res.status_code == 200
    assert client.get(f"/api/memories/{mem_id}").status_code == 404

def test_file_upload_and_duplicate_detection(client):
    file_content = b"Dear Martha, The garden roses bloomed early this May 1965. Love, Charles."
    file_obj = ("letter_martha.txt", io.BytesIO(file_content), "text/plain")

    data = {
        "title": "Letter to Martha 1965",
        "source_type": "letter",
        "event_date": "1965-05-12",
        "date_precision": "exact",
        "tags": '["letter", "roses"]'
    }

    # Upload first time
    res = client.post("/api/memories", data=data, files={"file": file_obj})
    assert res.status_code == 201
    mem = res.json()
    assert "roses bloomed early" in mem["extracted_text"]

    # Upload duplicate exact file
    file_obj2 = ("letter_copy.txt", io.BytesIO(file_content), "text/plain")
    res_dup = client.post("/api/memories", data=data, files={"file": file_obj2})
    assert res_dup.status_code == 409
    assert "Duplicate file detected" in res_dup.json()["detail"]

def test_path_traversal_defense(client):
    # Dangerous filename with traversal
    dangerous_file = ("../../../../etc/passwd.txt", io.BytesIO(b"malicious content"), "text/plain")
    data = {"title": "Traversal Attempt", "source_type": "document"}
    res = client.post("/api/memories", data=data, files={"file": dangerous_file})
    # Filename must be sanitized to safe base or rejected
    assert res.status_code in [201, 400]
    if res.status_code == 201:
        assert "../" not in res.json()["file_path"]
