from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def send(session: str, message: str = "", action: str | None = None):
    return client.post("/api/chat", json={"session_id": session, "message": message, "action": action})


def test_exact_order_statuses():
    expected = {
        "111": ("Shipped", "Arriving tomorrow"),
        "222": ("Processing", "Ships in 24 hours"),
        "333": ("Delivered", "Was everything received as expected?"),
    }
    for order_number, (status, detail) in expected.items():
        response = send(f"order-{order_number}", f"Track order {order_number}")
        payload = response.json()
        assert response.status_code == 200
        assert payload["messages"][0]["status"] == status
        assert payload["messages"][0]["detail"] == detail


def test_invalid_order():
    payload = send("invalid-order", "Track order 999").json()
    assert payload["messages"][0]["status"] == "Not found"
    assert "couldn’t find" in payload["messages"][0]["detail"]


def test_return_policy_is_exact():
    payload = send("returns", "What is your return policy?").json()
    message = payload["messages"][0]
    assert message["text"] == "North Star accepts returns within 30 days."
    assert message["data"]["requirements"] == [
        "The item must be unused",
        "The original packaging is required",
    ]


def test_shipping_is_exact():
    payload = send("shipping", "How long does shipping take?").json()
    assert payload["messages"][0]["data"] == {
        "standard": "3–5 business days",
        "expedited": "1–2 business days",
    }


def test_recommendation_flow():
    session = "recommendation"
    first = send(session, "Recommend gear").json()
    assert first["state"] == "recommendation_activity"
    second = send(session, action="activity_hiking").json()
    assert second["state"] == "recommendation_preference"
    third = send(session, action="pref_rainy").json()
    assert third["state"] == "recommendation_resolved"
    assert third["messages"][0]["title"] == "Waterproof hiking apparel"


def test_handoff_and_return_to_menu():
    session = "handoff"
    start = send(session, "I need a real person").json()
    assert start["state"] == "live_agent_context"
    active = send(session, action="handoff_return").json()
    assert active["state"] == "live_agent"
    menu = send(session, action="main_menu").json()
    assert menu["state"] == "main_menu"


def test_progressive_fallback():
    session = "fallback"
    first = send(session, "Repair my bicycle").json()
    second = send(session, "Book me a flight").json()
    assert first["messages"][0]["data"]["attempt"] == 1
    assert second["messages"][0]["data"]["attempt"] == 2


def test_flow_interruption():
    session = "interruption"
    send(session, "Recommend gear")
    payload = send(session, "Actually, track order 222").json()
    assert payload["messages"][0]["status"] == "Processing"
