"""
Iteration 3 backend tests: Categories CRUD, Engraving on products/checkout,
Wishlist empty regression fix.
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

ADMIN_EMAIL = "admin@atelier.pens"
ADMIN_PASSWORD = "Admin@123456"

DEFAULT_CATS = ["Fountain Pens", "Rollerball", "Ballpoint", "Mechanical Pencils",
                "Inks", "Accessories", "Limited Editions"]


@pytest.fixture(scope="module")
def admin_headers():
    r = requests.post(f"{API}/auth/login",
                      json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD}, timeout=15)
    assert r.status_code == 200, r.text
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


@pytest.fixture(scope="module")
def customer_headers():
    email = f"test_cust_{uuid.uuid4().hex[:8]}@example.com"
    r = requests.post(f"{API}/auth/register",
                      json={"email": email, "password": "Cust@12345", "name": "TEST Cust"}, timeout=15)
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


# ---------------- Categories ----------------
class TestCategories:
    def test_list_default_categories_sorted_by_order(self):
        r = requests.get(f"{API}/categories", timeout=15)
        assert r.status_code == 200
        cats = r.json()
        assert isinstance(cats, list)
        names = [c["name"] for c in cats]
        for d in DEFAULT_CATS:
            assert d in names, f"Missing default cat: {d}"
        # sorted by order ascending
        orders = [c.get("order", 0) for c in cats]
        assert orders == sorted(orders)

    def test_create_category_admin_success(self, admin_headers):
        name = f"TEST_Cat_{uuid.uuid4().hex[:6]}"
        r = requests.post(f"{API}/admin/categories", headers=admin_headers,
                          json={"name": name, "order": 99}, timeout=15)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["name"] == name
        assert "id" in data
        # cleanup
        requests.delete(f"{API}/admin/categories/{data['id']}", headers=admin_headers, timeout=15)

    def test_create_category_duplicate_returns_409(self, admin_headers):
        r = requests.post(f"{API}/admin/categories", headers=admin_headers,
                          json={"name": "Rollerball", "order": 0}, timeout=15)
        assert r.status_code == 409

    def test_create_category_non_admin_403(self, customer_headers):
        r = requests.post(f"{API}/admin/categories", headers=customer_headers,
                          json={"name": "Nope", "order": 0}, timeout=15)
        assert r.status_code == 403

    def test_rename_category_cascades_to_products(self, admin_headers):
        # Create a fresh category, add a product to it, rename, verify product got renamed
        cat_name = f"TEST_Rename_{uuid.uuid4().hex[:6]}"
        cr = requests.post(f"{API}/admin/categories", headers=admin_headers,
                           json={"name": cat_name, "order": 50}, timeout=15)
        assert cr.status_code == 200
        cat_id = cr.json()["id"]
        # create product
        pr = requests.post(f"{API}/admin/products", headers=admin_headers,
                           json={"name": "TEST Product for rename", "brand": "TB", "category": cat_name,
                                 "price": 10.0, "description": "d"}, timeout=15)
        assert pr.status_code == 200
        pid = pr.json()["id"]
        # rename
        new_name = f"{cat_name}_v2"
        ur = requests.put(f"{API}/admin/categories/{cat_id}", headers=admin_headers,
                          json={"name": new_name, "order": 50}, timeout=15)
        assert ur.status_code == 200
        assert ur.json()["name"] == new_name
        # verify product cascaded
        g = requests.get(f"{API}/products/{pid}", timeout=15).json()
        assert g["category"] == new_name
        # cleanup
        requests.delete(f"{API}/admin/products/{pid}", headers=admin_headers, timeout=15)
        requests.delete(f"{API}/admin/categories/{cat_id}", headers=admin_headers, timeout=15)

    def test_delete_unused_category_succeeds(self, admin_headers):
        name = f"TEST_DelUnused_{uuid.uuid4().hex[:6]}"
        cr = requests.post(f"{API}/admin/categories", headers=admin_headers,
                           json={"name": name, "order": 60}, timeout=15)
        cid = cr.json()["id"]
        dr = requests.delete(f"{API}/admin/categories/{cid}", headers=admin_headers, timeout=15)
        assert dr.status_code == 200

    def test_delete_used_category_returns_409(self, admin_headers):
        # find Rollerball category id
        r = requests.get(f"{API}/categories", timeout=15)
        rb = next((c for c in r.json() if c["name"] == "Rollerball"), None)
        assert rb, "Rollerball missing"
        d = requests.delete(f"{API}/admin/categories/{rb['id']}", headers=admin_headers, timeout=15)
        assert d.status_code == 409


# ---------------- Engraving on products ----------------
class TestEngravingProducts:
    def test_all_seeded_products_have_engraving_fields(self):
        r = requests.get(f"{API}/products", timeout=15)
        assert r.status_code == 200
        items = r.json()
        for p in items:
            assert "engravable" in p, f"engravable missing on {p['name']}"
            assert "engraving_max_length" in p
        # Non-Inks seeds should be engravable
        for p in items:
            if p["category"] != "Inks":
                assert p["engravable"] is True, f"{p['name']} should be engravable"
                assert p["engraving_max_length"] == 20

    def test_product_detail_includes_engraving_fields(self):
        pid = requests.get(f"{API}/products", timeout=15).json()[0]["id"]
        p = requests.get(f"{API}/products/{pid}", timeout=15).json()
        assert "engravable" in p and "engraving_max_length" in p

    def test_admin_create_product_with_engraving(self, admin_headers):
        payload = {"name": f"TEST Engrave {uuid.uuid4().hex[:6]}", "brand": "TB",
                   "category": "Ballpoint", "price": 20.0, "description": "d",
                   "engravable": True, "engraving_max_length": 35}
        r = requests.post(f"{API}/admin/products", headers=admin_headers, json=payload, timeout=15)
        assert r.status_code == 200
        d = r.json()
        assert d["engravable"] is True
        assert d["engraving_max_length"] == 35
        # verify persisted
        g = requests.get(f"{API}/products/{d['id']}", timeout=15).json()
        assert g["engraving_max_length"] == 35
        # update
        up = {**payload, "engravable": False, "engraving_max_length": 20}
        r2 = requests.put(f"{API}/admin/products/{d['id']}", headers=admin_headers, json=up, timeout=15)
        assert r2.status_code == 200
        assert r2.json()["engravable"] is False
        # cleanup
        requests.delete(f"{API}/admin/products/{d['id']}", headers=admin_headers, timeout=15)


# ---------------- Checkout engraving ----------------
class TestCheckoutEngraving:
    def _shipping(self):
        return {"full_name": "TEST", "email": "test@example.com", "phone": "555",
                "line1": "1 St", "line2": "", "city": "T", "state": "TS",
                "postal_code": "12345", "country": "IN"}

    def test_checkout_persists_engraving(self, admin_headers):
        prod = requests.get(f"{API}/products", timeout=15).json()[0]
        body = {"items": [{"product_id": prod["id"], "quantity": 1, "engraving": "For Ada"}],
                "shipping": self._shipping(), "origin_url": BASE_URL}
        r = requests.post(f"{API}/checkout/session", json=body, timeout=60)
        assert r.status_code == 200, r.text
        order_id = r.json()["order_id"]
        # admin fetch
        ao = requests.get(f"{API}/admin/orders", headers=admin_headers, timeout=15)
        order = next((o for o in ao.json() if o["id"] == order_id), None)
        assert order is not None
        assert order["items"][0].get("engraving") == "For Ada"


# ---------------- Wishlist empty regression ----------------
class TestWishlistShareEmptyRegression:
    def test_share_empty_after_toggle_off_returns_400(self):
        email = f"test_wl_{uuid.uuid4().hex[:8]}@example.com"
        reg = requests.post(f"{API}/auth/register",
                            json={"email": email, "password": "Cust@12345", "name": "TEST"}, timeout=15)
        assert reg.status_code == 200
        h = {"Authorization": f"Bearer {reg.json()['access_token']}"}
        # toggle a product on then off
        pid = requests.get(f"{API}/products", timeout=15).json()[0]["id"]
        t1 = requests.post(f"{API}/wishlist/toggle", headers=h, json={"product_id": pid}, timeout=15)
        assert t1.status_code == 200 and t1.json()["added"] is True
        t2 = requests.post(f"{API}/wishlist/toggle", headers=h, json={"product_id": pid}, timeout=15)
        assert t2.status_code == 200 and t2.json()["added"] is False
        # now share should return 400 (empty)
        s = requests.post(f"{API}/wishlist/share", headers=h, timeout=15)
        assert s.status_code == 400
