"""
Backend tests for Atelier Ink & Steel luxury pen e-commerce API.
Covers: products list/filters/facets, auth (register/login/me), admin CRUD,
image upload + fetch, checkout session creation, payment status poll, admin orders & shipment.
"""
import io
import os
import uuid
import struct
import zlib
import pytest
import requests
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / "frontend" / ".env")
BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/")
API = f"{BASE_URL}/api"

ADMIN_EMAIL = "admin@atelier.pens"
ADMIN_PASSWORD = "Admin@123456"


# -------- helpers --------
def _png_bytes(w=2, h=2):
    def chunk(t, d):
        return (struct.pack(">I", len(d)) + t + d +
                struct.pack(">I", zlib.crc32(t + d) & 0xffffffff))
    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0)
    raw = b""
    for _ in range(h):
        raw += b"\x00" + b"\xff\x00\x00" * w
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


# -------- fixtures --------
@pytest.fixture(scope="module")
def admin_token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["user"]["role"] == "admin"
    return d["access_token"]


@pytest.fixture(scope="module")
def admin_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(scope="module")
def customer_token():
    email = f"test_customer_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/auth/register", json={"email": email, "password": "Cust@12345", "name": "TEST Cust"}, timeout=15)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["user"]["role"] == "customer"
    return d["access_token"]


# -------- products --------
def test_products_list_has_seven_including_silver_dragon():
    r = requests.get(f"{API}/products", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 7
    dragon = next((p for p in items if p["name"] == "Silver Dragon Roller"), None)
    assert dragon is not None
    assert dragon["price"] == 1288
    assert dragon["discount_price"] == 499


def test_products_facets():
    r = requests.get(f"{API}/products/facets", timeout=15)
    assert r.status_code == 200
    d = r.json()
    assert "categories" in d and "brands" in d
    assert "Rollerball" in d["categories"]
    assert d["price_min"] <= d["price_max"]


def test_products_filter_category():
    r = requests.get(f"{API}/products?category=Rollerball", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1
    assert all(p["category"] == "Rollerball" for p in items)


def test_products_search_dragon():
    r = requests.get(f"{API}/products?q=dragon", timeout=15)
    assert r.status_code == 200
    items = r.json()
    assert any(p["name"] == "Silver Dragon Roller" for p in items)


def test_products_sort_price_asc():
    r = requests.get(f"{API}/products?sort=price-asc", timeout=15)
    assert r.status_code == 200
    items = r.json()
    eff = [(p["discount_price"] or p["price"]) for p in items]
    assert eff == sorted(eff)


def test_product_detail_and_404():
    r = requests.get(f"{API}/products", timeout=15)
    pid = r.json()[0]["id"]
    r2 = requests.get(f"{API}/products/{pid}", timeout=15)
    assert r2.status_code == 200
    assert r2.json()["id"] == pid
    r3 = requests.get(f"{API}/products/does-not-exist", timeout=15)
    assert r3.status_code == 404


# -------- auth --------
def test_admin_login_returns_admin_role(admin_token):
    assert isinstance(admin_token, str) and len(admin_token) > 20


def test_auth_me_works(admin_headers):
    r = requests.get(f"{API}/auth/me", headers=admin_headers, timeout=15)
    assert r.status_code == 200
    assert r.json()["role"] == "admin"


def test_auth_me_missing_token_401():
    r = requests.get(f"{API}/auth/me", timeout=15)
    assert r.status_code == 401


def test_customer_registration(customer_token):
    assert customer_token


def test_admin_products_requires_admin(customer_token):
    r = requests.post(f"{API}/admin/products",
                      headers={"Authorization": f"Bearer {customer_token}"},
                      json={"name": "x", "brand": "y", "category": "Inks", "price": 10, "description": "d"},
                      timeout=15)
    assert r.status_code == 403


def test_admin_products_missing_token_401():
    r = requests.post(f"{API}/admin/products", json={}, timeout=15)
    assert r.status_code == 401


# -------- admin CRUD --------
@pytest.fixture(scope="module")
def created_product(admin_headers):
    payload = {
        "name": f"TEST Pen {uuid.uuid4().hex[:6]}",
        "brand": "TESTBrand",
        "category": "Ballpoint",
        "price": 120.0,
        "discount_price": 99.0,
        "description": "TEST product",
        "features": ["a", "b"],
        "specs": {"Colour": "Black"},
        "images": [],
        "stock": 5,
        "featured": False,
    }
    r = requests.post(f"{API}/admin/products", headers=admin_headers, json=payload, timeout=15)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["discount_price"] == 99.0
    assert "id" in d
    yield d
    requests.delete(f"{API}/admin/products/{d['id']}", headers=admin_headers, timeout=15)


def test_admin_create_persisted(created_product):
    r = requests.get(f"{API}/products/{created_product['id']}", timeout=15)
    assert r.status_code == 200
    assert r.json()["discount_price"] == 99.0


def test_admin_update_product(admin_headers, created_product):
    payload = {**created_product, "price": 150.0, "discount_price": 120.0}
    payload.pop("id", None); payload.pop("created_at", None)
    r = requests.put(f"{API}/admin/products/{created_product['id']}", headers=admin_headers, json=payload, timeout=15)
    assert r.status_code == 200
    assert r.json()["price"] == 150.0
    g = requests.get(f"{API}/products/{created_product['id']}", timeout=15).json()
    assert g["discount_price"] == 120.0


def test_admin_delete_flow(admin_headers):
    payload = {"name": "TEST DELETE", "brand": "b", "category": "Inks", "price": 10.0,
               "description": "d", "features": [], "specs": {}, "images": [], "stock": 1, "featured": False}
    r = requests.post(f"{API}/admin/products", headers=admin_headers, json=payload, timeout=15)
    pid = r.json()["id"]
    d = requests.delete(f"{API}/admin/products/{pid}", headers=admin_headers, timeout=15)
    assert d.status_code == 200
    g = requests.get(f"{API}/products/{pid}", timeout=15)
    assert g.status_code == 404


# -------- image upload --------
def test_admin_upload_png_and_fetch(admin_headers):
    png = _png_bytes()
    files = {"file": ("t.png", io.BytesIO(png), "image/png")}
    r = requests.post(f"{API}/admin/upload", headers=admin_headers, files=files, timeout=60)
    if r.status_code == 503:
        pytest.skip("Object storage unavailable in this environment")
    assert r.status_code == 200, r.text
    d = r.json()
    assert "path" in d and "url" in d
    # Fetch via /api/files/{path}
    fetch_url = f"{BASE_URL}{d['url']}"
    fr = requests.get(fetch_url, timeout=30)
    assert fr.status_code == 200
    assert fr.headers.get("content-type", "").startswith("image/")


# -------- checkout & payment --------
def _shipping():
    return {
        "full_name": "TEST Buyer",
        "email": "test_buyer@example.com",
        "phone": "555-0100",
        "line1": "1 TEST Street",
        "line2": "",
        "city": "Testville",
        "state": "TS",
        "postal_code": "12345",
        "country": "IN",
    }


@pytest.fixture(scope="module")
def a_product():
    return requests.get(f"{API}/products", timeout=15).json()[0]


def test_guest_checkout_session(a_product):
    body = {"items": [{"product_id": a_product["id"], "quantity": 1}],
            "shipping": _shipping(), "origin_url": BASE_URL}
    r = requests.post(f"{API}/checkout/session", json=body, timeout=60)
    assert r.status_code == 200, r.text
    d = r.json()
    assert d["checkout_url"].startswith("http")
    assert d["session_id"]
    assert d["order_id"].startswith("AT-")
    # Payment status
    ps = requests.get(f"{API}/payments/status/{d['session_id']}", timeout=30)
    assert ps.status_code == 200
    pj = ps.json()
    assert pj["payment_status"] in ("pending", "paid", "initiated")


def test_authenticated_checkout(customer_token, a_product, admin_headers):
    body = {"items": [{"product_id": a_product["id"], "quantity": 1}],
            "shipping": _shipping(), "origin_url": BASE_URL}
    r = requests.post(f"{API}/checkout/session",
                      headers={"Authorization": f"Bearer {customer_token}"},
                      json=body, timeout=60)
    assert r.status_code == 200
    order_id = r.json()["order_id"]

    # customer sees own order
    mine = requests.get(f"{API}/orders/mine",
                       headers={"Authorization": f"Bearer {customer_token}"}, timeout=15)
    assert mine.status_code == 200
    assert any(o["id"] == order_id for o in mine.json())

    # admin sees it
    ao = requests.get(f"{API}/admin/orders", headers=admin_headers, timeout=15)
    assert ao.status_code == 200
    assert any(o["id"] == order_id for o in ao.json())

    # admin update shipment
    up = requests.patch(f"{API}/admin/orders/{order_id}/shipment",
                        headers=admin_headers,
                        json={"status": "shipped", "tracking_number": "TRACK123", "carrier": "UPS"},
                        timeout=15)
    assert up.status_code == 200
