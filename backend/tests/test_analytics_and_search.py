import sys
import os
import uuid
import pytest
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
from fastapi.testclient import TestClient
from server import app, ADMIN_EMAIL, ADMIN_PASSWORD


@pytest.fixture(scope="module")
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture(scope="module")
def admin_headers(client):
    r = client.post("/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    token = r.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def test_products_endpoint_remains_array(client):
    """Verify GET /api/products returns a plain list and remains untouched."""
    r = client.get("/api/products", params={"limit": 5})
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list), "GET /api/products must return a plain array"
    if len(data) > 0:
        assert "id" in data[0]
        assert "name" in data[0]


def test_products_search_exact_and_fuzzy(client):
    """Verify GET /api/products/search handles exact matches and typos with fuzzy scoring."""
    # 1. Exact search
    r_exact = client.get("/api/products/search", params={"q": "Pilot"})
    assert r_exact.status_code == 200
    d_exact = r_exact.json()
    assert "results" in d_exact
    assert "fuzzy" in d_exact
    assert isinstance(d_exact["results"], list)
    assert d_exact["fuzzy"] is False

    # 2. Typo search (fuzzy fallback) e.g., 'pilott' or 'fountan' or 'namki'
    r_fuzzy = client.get("/api/products/search", params={"q": "pilott"})
    assert r_fuzzy.status_code == 200
    d_fuzzy = r_fuzzy.json()
    assert "results" in d_fuzzy
    assert "fuzzy" in d_fuzzy
    assert isinstance(d_fuzzy["results"], list)
    if len(d_fuzzy["results"]) > 0:
        assert d_fuzzy["fuzzy"] is True
        names = [p["name"] + " " + p.get("brand", "") for p in d_fuzzy["results"]]
        assert any("pilot" in n.lower() for n in names)


def test_events_ingestion_and_analytics(client, admin_headers):
    """Verify event tracking and funnel aggregation."""
    session_id = f"sess_test_{uuid.uuid4().hex[:10]}"
    
    # Ingest product view
    r1 = client.post("/api/events", json={
        "event_type": "product_view",
        "product_id": "test-prod-1",
        "session_id": session_id,
        "metadata": {"source": "test"}
    })
    assert r1.status_code == 200
    assert r1.json()["ok"] is True

    # Ingest add_to_cart
    r2 = client.post("/api/events", json={
        "event_type": "add_to_cart",
        "product_id": "test-prod-1",
        "session_id": session_id
    })
    assert r2.status_code == 200

    # Ingest checkout_started
    r3 = client.post("/api/events", json={
        "event_type": "checkout_started",
        "session_id": session_id
    })
    assert r3.status_code == 200

    # Test funnel endpoint
    r_funnel = client.get("/api/analytics/funnel", headers=admin_headers)
    assert r_funnel.status_code == 200
    f_data = r_funnel.json()
    assert "steps" in f_data
    assert len(f_data["steps"]) == 4
    assert f_data["steps"][0]["stage"] == "product_view"
    assert f_data["steps"][1]["stage"] == "add_to_cart"
    assert f_data["steps"][2]["stage"] == "checkout_started"
    assert f_data["steps"][3]["stage"] == "order_placed"
    assert "overall_conversion_pct" in f_data

    # Test product views analytics endpoint
    r_views = client.get("/api/analytics/product-views", headers=admin_headers)
    assert r_views.status_code == 200
    pv_data = r_views.json()
    assert "most_viewed" in pv_data
    assert "most_abandoned" in pv_data
    assert isinstance(pv_data["most_viewed"], list)


def test_admin_update_order_status(client, admin_headers):
    """Verify admin can update order payment_status and shipment_status."""
    # 1. Fetch any product from catalog
    r_prods = client.get("/api/products", params={"limit": 1})
    assert r_prods.status_code == 200
    prods = r_prods.json()
    if not prods:
        return
    prod = prods[0]

    # 2. Place order
    order_payload = {
        "items": [{
            "product_id": prod["id"],
            "quantity": 1
        }],
        "shipping": {
            "full_name": "Aditya Test",
            "email": "aditya@test.com",
            "phone": "+91 9876543210",
            "line1": "123 Atelier Street",
            "city": "Panchkula",
            "state": "Haryana",
            "postal_code": "134107",
            "country": "India"
        }
    }
    r_place = client.post("/api/orders", json=order_payload)
    assert r_place.status_code == 200
    order_id = r_place.json()["id"]
    assert r_place.json()["payment_status"] == "pending_whatsapp"

    # 3. Update payment status to paid and shipment status to shipped
    r_patch = client.patch(f"/api/admin/orders/{order_id}", headers=admin_headers, json={
        "payment_status": "paid",
        "shipment_status": "shipped",
        "carrier": "BlueDart",
        "tracking_number": "BD99887766"
    })
    assert r_patch.status_code == 200
    updated_order = r_patch.json()["order"]
    assert updated_order["payment_status"] == "paid"
    assert updated_order["shipment"]["status"] == "shipped"
    assert updated_order["shipment"]["carrier"] == "BlueDart"
    assert updated_order["shipment"]["tracking_number"] == "BD99887766"


def test_catalog_search_exact_and_fuzzy_fallback(client):
    """Verify GET /api/products returns items and sets X-Search-Fuzzy header on typos."""
    # 1. Exact catalog search
    r_exact = client.get("/api/products", params={"q": "Pilot"})
    assert r_exact.status_code == 200
    assert isinstance(r_exact.json(), list)
    assert r_exact.headers.get("X-Search-Fuzzy") is None

    # 2. Misspelled/typo search fallback
    r_typo = client.get("/api/products", params={"q": "pilott"})
    assert r_typo.status_code == 200
    items = r_typo.json()
    assert isinstance(items, list)
    if len(items) > 0:
        assert r_typo.headers.get("X-Search-Fuzzy") == "true"
        names = [p["name"] + " " + p.get("brand", "") for p in items]
        assert any("pilot" in n.lower() for n in names)


def test_product_cache_invalidation_lifecycle(client, admin_headers):
    """Verify in-memory product cache is updated immediately on create/delete."""
    unique_name = f"Test Pen {uuid.uuid4().hex[:8]}"
    
    # 1. Search before creation (must be empty)
    r1 = client.get("/api/products/search", params={"q": unique_name})
    assert r1.status_code == 200
    assert len(r1.json()["results"]) == 0

    # 2. Create product
    r_create = client.post("/api/admin/products", headers=admin_headers, json={
        "name": unique_name,
        "brand": "CustomBrand",
        "category": "Fountain Pens",
        "price": 150.0,
        "description": "Exclusive test pen for cache verification",
        "stock": 10,
        "features": ["Feature 1"],
        "specs": {"Colour": "Blue"},
        "images": []
    })
    assert r_create.status_code == 200
    prod_id = r_create.json()["id"]

    # 3. Search immediately after creation (cache must be fresh)
    r2 = client.get("/api/products/search", params={"q": unique_name})
    assert r2.status_code == 200
    assert any(p["id"] == prod_id for p in r2.json()["results"])

    # 4. Delete product
    r_del = client.delete(f"/api/admin/products/{prod_id}", headers=admin_headers)
    assert r_del.status_code == 200

    # 5. Search immediately after deletion (must not find deleted item)
    r3 = client.get("/api/products/search", params={"q": unique_name})
    assert r3.status_code == 200
    assert not any(p["id"] == prod_id for p in r3.json()["results"])


