"""
Backend tests for Wishlist Vault feature (iteration 2).
Covers: /api/wishlist, /api/wishlist/toggle, /api/wishlist/share, /api/wishlist/shared/{token}
"""
import os
import uuid
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def customer():
    email = f"test_wl_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/auth/register", json={
        "email": email, "password": "Cust@12345", "name": "TEST WL Customer"
    }, timeout=15)
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture(scope="module")
def customer_headers(customer):
    return {"Authorization": f"Bearer {customer['access_token']}"}


@pytest.fixture(scope="module")
def two_products():
    r = requests.get(f"{API}/products", timeout=15)
    items = r.json()
    assert len(items) >= 2
    return items[0], items[1]


# -------- Auth guard --------
def test_wishlist_requires_auth():
    r = requests.get(f"{API}/wishlist", timeout=15)
    assert r.status_code == 401


def test_wishlist_toggle_requires_auth(two_products):
    p1, _ = two_products
    r = requests.post(f"{API}/wishlist/toggle", json={"product_id": p1["id"]}, timeout=15)
    assert r.status_code == 401


# -------- Toggle add/remove --------
def test_toggle_add_and_remove(customer_headers, two_products):
    p1, _ = two_products
    # Add
    r1 = requests.post(f"{API}/wishlist/toggle", headers=customer_headers,
                      json={"product_id": p1["id"]}, timeout=15)
    assert r1.status_code == 200, r1.text
    d1 = r1.json()
    assert d1["added"] is True
    assert p1["id"] in d1["product_ids"]

    # Remove
    r2 = requests.post(f"{API}/wishlist/toggle", headers=customer_headers,
                      json={"product_id": p1["id"]}, timeout=15)
    assert r2.status_code == 200
    d2 = r2.json()
    assert d2["added"] is False
    assert p1["id"] not in d2["product_ids"]


def test_toggle_unknown_product_404(customer_headers):
    r = requests.post(f"{API}/wishlist/toggle", headers=customer_headers,
                    json={"product_id": "does-not-exist"}, timeout=15)
    assert r.status_code == 404


# -------- GET /wishlist returns products in order --------
def test_wishlist_get_returns_products_in_order(customer_headers, two_products):
    p1, p2 = two_products
    # Add p1 then p2 (p2 should be first since newest-first insertion)
    requests.post(f"{API}/wishlist/toggle", headers=customer_headers,
                 json={"product_id": p1["id"]}, timeout=15)
    requests.post(f"{API}/wishlist/toggle", headers=customer_headers,
                 json={"product_id": p2["id"]}, timeout=15)
    r = requests.get(f"{API}/wishlist", headers=customer_headers, timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "product_ids" in d and "products" in d and "share_token" in d
    assert d["product_ids"][0] == p2["id"]
    assert d["product_ids"][1] == p1["id"]
    # products list order matches product_ids
    assert [p["id"] for p in d["products"]] == d["product_ids"]


# -------- Share --------
def test_share_idempotent(customer_headers):
    r1 = requests.post(f"{API}/wishlist/share", headers=customer_headers, timeout=15)
    assert r1.status_code == 200, r1.text
    t1 = r1.json()["share_token"]
    assert isinstance(t1, str) and len(t1) > 0

    r2 = requests.post(f"{API}/wishlist/share", headers=customer_headers, timeout=15)
    assert r2.status_code == 200
    t2 = r2.json()["share_token"]
    assert t1 == t2


def test_shared_wishlist_public_access(customer_headers):
    tok = requests.post(f"{API}/wishlist/share", headers=customer_headers, timeout=15).json()["share_token"]
    # no auth header
    r = requests.get(f"{API}/wishlist/shared/{tok}", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "owner_name" in d and "products" in d and "count" in d
    assert d["count"] == len(d["products"])
    assert d["count"] >= 1


def test_shared_wishlist_unknown_token_404():
    r = requests.get(f"{API}/wishlist/shared/deadbeefdead", timeout=15)
    assert r.status_code == 404


def test_share_empty_wishlist_400():
    # Fresh customer with no wishlist doc
    email = f"test_wl_empty_{uuid.uuid4().hex[:8]}@example.com"
    reg = requests.post(f"{API}/auth/register", json={
        "email": email, "password": "Cust@12345", "name": "TEST Empty"
    }, timeout=15).json()
    headers = {"Authorization": f"Bearer {reg['access_token']}"}
    r = requests.post(f"{API}/wishlist/share", headers=headers, timeout=15)
    assert r.status_code == 400
