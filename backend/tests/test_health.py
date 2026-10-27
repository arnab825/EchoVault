def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["app"] == "EchoVault"
    assert "version" in data

def test_system_status(client):
    response = client.get("/api/status")
    assert response.status_code == 200
    data = response.json()
    assert data["database_connected"] is True
    assert "total_memories" in data
    assert "active_model" in data
