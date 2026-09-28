import pytest
import requests

BASE_URL = "http://127.0.0.1:8000"

def test_site_banner_endpoint():
    """Verify GET /api/site/banner returns all expected dynamic sections with non-empty defaults"""
    resp = requests.get(f"{BASE_URL}/api/site/banner")
    assert resp.status_code == 200
    data = resp.json()
    assert "id" in data
    assert "trust_bar" in data
    assert len(data["trust_bar"]) >= 4
    assert "bulk_orders_card" in data
    assert "corporate_gifts_card" in data
    assert "signature_collections" in data
    assert "utility_bar_messages" in data
    assert "offers_ticker" in data
    assert "secondary_trust_marquee" in data
    assert "occasion_gift_tiles" in data
    assert "customer_reviews" in data
    assert "store_info" in data

def test_products_endpoint():
    """Verify GET /api/products returns real product data structure"""
    resp = requests.get(f"{BASE_URL}/api/products")
    assert resp.status_code == 200
    data = resp.json()
    assert isinstance(data, list)
    if len(data) > 0:
        p = data[0]
        assert "id" in p
        assert "name" in p
        assert "price" in p
        assert "brand" in p
        assert "category" in p

def test_admin_banner_requires_auth():
    """Verify unauthorized PUT /api/admin/banner is rejected with 401/403"""
    resp = requests.put(f"{BASE_URL}/api/admin/banner", json={"enabled": True})
    assert resp.status_code in [401, 403]
