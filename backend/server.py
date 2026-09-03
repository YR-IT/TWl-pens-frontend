"""
Atelier Ink & Steel — Luxury Pen E-commerce Backend
FastAPI + MongoDB (Motor) + JWT auth + Emergent Object Storage + Stripe Checkout
"""
import os
import uuid
import logging
import bcrypt
import jwt
import requests
from pathlib import Path
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Response, Header, Query, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# ---------------- Setup ----------------
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("atelier")

MONGO_URL = os.environ["MONGO_URL"]
DB_NAME = os.environ["DB_NAME"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = os.environ.get("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRE_MINUTES", "10080"))
ADMIN_EMAIL = os.environ.get("ADMIN_EMAIL", "").lower()
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "")
STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "sk_test_emergent")
EMERGENT_LLM_KEY = os.environ.get("EMERGENT_LLM_KEY", "")
INTEGRATION_PROXY_URL = (os.environ.get("INTEGRATION_PROXY_URL") or "").strip().rstrip("/") or "https://integrations.emergentagent.com"
STORAGE_URL = f"{INTEGRATION_PROXY_URL}/objstore/api/v1/storage"
APP_NAME = os.environ.get("APP_NAME", "atelier-pens")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

app = FastAPI(title="Atelier Ink & Steel API")
api = APIRouter(prefix="/api")
security = HTTPBearer(auto_error=False)

# ---------------- Emergent Object Storage adapter ----------------
_storage_key: Optional[str] = None


def init_storage() -> Optional[str]:
    global _storage_key
    if _storage_key:
        return _storage_key
    if not EMERGENT_LLM_KEY:
        logger.warning("EMERGENT_LLM_KEY missing — object storage disabled")
        return None
    try:
        r = requests.post(f"{STORAGE_URL}/init", json={"emergent_key": EMERGENT_LLM_KEY}, timeout=30)
        r.raise_for_status()
        _storage_key = r.json()["storage_key"]
        logger.info("Emergent object storage initialized")
        return _storage_key
    except Exception as e:
        logger.error(f"Storage init failed: {e}")
        return None


def put_object(path: str, data: bytes, content_type: str) -> dict:
    key = init_storage()
    if not key:
        raise HTTPException(503, "Object storage unavailable")
    r = requests.put(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key, "Content-Type": content_type},
        data=data,
        timeout=120,
    )
    r.raise_for_status()
    return r.json()


def get_object(path: str) -> tuple[bytes, str]:
    key = init_storage()
    if not key:
        raise HTTPException(503, "Object storage unavailable")
    r = requests.get(
        f"{STORAGE_URL}/objects/{path}",
        headers={"X-Storage-Key": key},
        timeout=60,
    )
    r.raise_for_status()
    return r.content, r.headers.get("Content-Type", "application/octet-stream")


# ---------------- Auth helpers ----------------
def hash_password(password: str) -> str:
    raw = password.encode("utf-8")
    if len(raw) > 72:
        raise HTTPException(400, "Password too long")
    return bcrypt.hashpw(raw, bcrypt.gensalt(rounds=12)).decode()


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode(), hashed.encode())
    except Exception:
        return False


def make_token(user_id: str, role: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": user_id, "role": role, "iat": now, "exp": now + timedelta(minutes=JWT_EXPIRE_MINUTES)}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def current_user_optional(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not creds:
        return None
    try:
        p = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user = await db.users.find_one({"id": p["sub"]}, {"_id": 0, "password_hash": 0})
        return user
    except Exception:
        return None


async def current_user(creds: Optional[HTTPAuthorizationCredentials] = Depends(security)):
    if not creds:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    try:
        p = jwt.decode(creds.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except Exception:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")
    user = await db.users.find_one({"id": p["sub"]}, {"_id": 0, "password_hash": 0})
    if not user:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "User not found")
    return user


def admin_only(user=Depends(current_user)):
    if user.get("role") != "admin":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Admin only")
    return user


# ---------------- Models ----------------
class RegisterBody(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6, max_length=72)
    name: Optional[str] = None


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class ProductIn(BaseModel):
    name: str
    brand: str
    category: str  # Fountain Pens, Rollerball, Ballpoint, Mechanical Pencils, Inks, Accessories, Limited Editions
    price: float = Field(gt=0)
    discount_price: Optional[float] = Field(default=None, ge=0)
    description: str
    features: List[str] = Field(default_factory=list)
    specs: dict = Field(default_factory=dict)  # brand, form, colour, ink_colour, age_range, material
    images: List[str] = Field(default_factory=list)  # URLs (from storage or external)
    stock: int = Field(default=10, ge=0)
    featured: bool = False


class ProductOut(ProductIn):
    id: str
    created_at: str


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = Field(ge=1, le=50)


class ShippingAddress(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    line1: str
    line2: Optional[str] = ""
    city: str
    state: str
    postal_code: str
    country: str = "IN"


class CheckoutBody(BaseModel):
    items: List[CartItemIn]
    shipping: ShippingAddress
    origin_url: str


class ShipmentUpdate(BaseModel):
    status: str  # processing, shipped, delivered, cancelled
    tracking_number: Optional[str] = None
    carrier: Optional[str] = None


# ---------------- Startup ----------------
@app.on_event("startup")
async def startup():
    # Indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.products.create_index("id", unique=True)
    await db.orders.create_index("id", unique=True)
    await db.orders.create_index("session_id")
    await db.payment_transactions.create_index("session_id", unique=True)

    # Seed admin
    if ADMIN_EMAIL and ADMIN_PASSWORD:
        existing = await db.users.find_one({"email": ADMIN_EMAIL})
        if not existing:
            await db.users.insert_one({
                "id": str(uuid.uuid4()),
                "email": ADMIN_EMAIL,
                "password_hash": hash_password(ADMIN_PASSWORD),
                "name": "Atelier Admin",
                "role": "admin",
                "created_at": datetime.now(timezone.utc).isoformat(),
            })
            logger.info(f"Seeded admin user: {ADMIN_EMAIL}")

    # Seed products if empty
    if await db.products.count_documents({}) == 0:
        await _seed_products()
        logger.info("Seeded starter product catalog")

    # Init storage (non-blocking)
    init_storage()


async def _seed_products():
    seeds = [
        {
            "name": "Monteverde Invincia Deluxe",
            "brand": "Monteverde",
            "category": "Fountain Pens",
            "price": 285.00,
            "discount_price": 199.00,
            "description": "Solid brass barrel with satin chrome finish and a smooth German-made stainless nib. A quiet statement of intent for the daily writer.",
            "features": ["Solid brass construction", "German #6 stainless nib", "Cartridge & converter filling", "Snap-cap security"],
            "specs": {"Writing Form": "Fountain Pen", "Colour": "Chrome / Black", "Ink Colour": "Blue-Black", "Age Range": "Adult", "Material": "Brass with satin chrome"},
            "images": ["https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 12,
            "featured": True,
        },
        {
            "name": "Silver Dragon Roller",
            "brand": "Atelier Editions",
            "category": "Rollerball",
            "price": 1288.00,
            "discount_price": 499.00,
            "description": "1200 golden dragon clip high grade metal roller ball pen — a slim but comfortable weight, perfect for signing checks, taking notes, filling out forms. A refined gift for weddings, uniforms, and daily use.",
            "features": ["Dragon clip in warm gold", "Metal etched barrel", "Rollerball smooth flow", "Comfortable balanced weight"],
            "specs": {"Writing Form": "Roller Ball Pen", "Colour": "Silver", "Ink Colour": "Gold", "Age Range": "Adult", "Material": "Metal"},
            "images": ["https://images.unsplash.com/photo-1517971071642-34a2d3ecc9cd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 30,
            "featured": True,
        },
        {
            "name": "Nordic Ballpoint — Ash",
            "brand": "Nord & Ink",
            "category": "Ballpoint",
            "price": 65.00,
            "discount_price": None,
            "description": "Minimal Scandinavian silhouette in matte ash aluminium. Weighted for long writing sessions.",
            "features": ["Anodised aluminium body", "Twist-action mechanism", "Refillable Parker G2", "Made in Copenhagen"],
            "specs": {"Writing Form": "Ballpoint", "Colour": "Ash Grey", "Ink Colour": "Black", "Age Range": "Adult", "Material": "Aluminium"},
            "images": ["https://images.unsplash.com/photo-1473186505569-9c61870c11f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 40,
            "featured": False,
        },
        {
            "name": "Cedar Mechanical Pencil 0.7",
            "brand": "Studio Kohl",
            "category": "Mechanical Pencils",
            "price": 48.00,
            "discount_price": 39.00,
            "description": "Warm cedar wood grip with a knurled steel tip. Draws a confident 0.7mm line.",
            "features": ["Solid cedar body", "0.7mm HB lead", "Retractable metal sleeve", "Balanced 22g weight"],
            "specs": {"Writing Form": "Mechanical Pencil", "Colour": "Cedar", "Lead": "0.7mm HB", "Age Range": "Adult", "Material": "Cedar wood + steel"},
            "images": ["https://images.unsplash.com/photo-1582319193453-d841c7a5e586?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 60,
            "featured": False,
        },
        {
            "name": "Iroshizuku-inspired Ink · Midnight Olive",
            "brand": "Atelier Editions",
            "category": "Inks",
            "price": 32.00,
            "discount_price": None,
            "description": "A deep, muted olive with black undertones — pours the mood of a Scandinavian forest at dusk. 50ml faceted glass.",
            "features": ["50ml bottle", "Shimmer-free", "Low-feathering formula", "Waterproof when dry"],
            "specs": {"Type": "Fountain Pen Ink", "Colour": "Midnight Olive", "Volume": "50ml", "Bottle": "Faceted glass"},
            "images": ["https://images.unsplash.com/photo-1780171865622-f6391f2f7397?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 100,
            "featured": True,
        },
        {
            "name": "Leather Journal · Espresso",
            "brand": "Nord & Ink",
            "category": "Accessories",
            "price": 85.00,
            "discount_price": 72.00,
            "description": "Full-grain vegetable-tanned leather journal with 240 pages of Tomoe River-inspired paper.",
            "features": ["Full-grain leather", "240 pages", "Lay-flat binding", "Ribbon marker"],
            "specs": {"Type": "Journal", "Colour": "Espresso Brown", "Pages": "240", "Size": "A5"},
            "images": ["https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 25,
            "featured": False,
        },
        {
            "name": "Aurora Limited No. 001",
            "brand": "Aurora",
            "category": "Limited Editions",
            "price": 2400.00,
            "discount_price": 1899.00,
            "description": "Numbered 001/300. Sterling silver clip, marbled resin body cured in Turin, 18kt gold nib. Presented in a walnut case with a signed certificate.",
            "features": ["18kt gold nib", "Sterling silver clip", "Numbered 001/300", "Walnut presentation case"],
            "specs": {"Writing Form": "Fountain Pen", "Colour": "Ocean Marble", "Ink Colour": "Blue-Black", "Material": "Resin + Sterling Silver", "Edition": "001 / 300"},
            "images": ["https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200"],
            "stock": 4,
            "featured": True,
        },
    ]
    now = datetime.now(timezone.utc).isoformat()
    docs = [{"id": str(uuid.uuid4()), "created_at": now, **s} for s in seeds]
    await db.products.insert_many(docs)


# ---------------- Auth routes ----------------
@api.post("/auth/register")
async def register(body: RegisterBody):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(409, "Email already registered")
    uid = str(uuid.uuid4())
    doc = {
        "id": uid,
        "email": email,
        "password_hash": hash_password(body.password),
        "name": body.name or email.split("@")[0],
        "role": "customer",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(doc)
    return {
        "access_token": make_token(uid, "customer"),
        "token_type": "bearer",
        "user": {"id": uid, "email": email, "name": doc["name"], "role": "customer"},
    }


@api.post("/auth/login")
async def login(body: LoginBody):
    email = body.email.lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user["password_hash"]):
        raise HTTPException(401, "Invalid credentials")
    return {
        "access_token": make_token(user["id"], user["role"]),
        "token_type": "bearer",
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", ""), "role": user["role"]},
    }


@api.get("/auth/me")
async def me(user=Depends(current_user)):
    return user


# ---------------- Product routes ----------------
@api.get("/products")
async def list_products(
    category: Optional[str] = None,
    brand: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    featured: Optional[bool] = None,
    q: Optional[str] = None,
    sort: Optional[str] = "newest",
    limit: int = 100,
):
    query: dict = {}
    if category and category != "All":
        query["category"] = category
    if brand:
        query["brand"] = brand
    if featured is not None:
        query["featured"] = featured
    if q:
        query["$or"] = [
            {"name": {"$regex": q, "$options": "i"}},
            {"brand": {"$regex": q, "$options": "i"}},
            {"description": {"$regex": q, "$options": "i"}},
        ]
    cursor = db.products.find(query, {"_id": 0}).limit(limit)
    items = await cursor.to_list(limit)
    # Effective price for filter/sort
    def eff(p):
        return p["discount_price"] if p.get("discount_price") else p["price"]
    if min_price is not None:
        items = [p for p in items if eff(p) >= min_price]
    if max_price is not None:
        items = [p for p in items if eff(p) <= max_price]
    if sort == "price-asc":
        items.sort(key=eff)
    elif sort == "price-desc":
        items.sort(key=eff, reverse=True)
    else:
        items.sort(key=lambda p: p.get("created_at", ""), reverse=True)
    return items


@api.get("/products/facets")
async def product_facets():
    categories = await db.products.distinct("category")
    brands = await db.products.distinct("brand")
    prices = await db.products.find({}, {"_id": 0, "price": 1, "discount_price": 1}).to_list(1000)
    all_prices = [(p.get("discount_price") or p["price"]) for p in prices] or [0]
    return {
        "categories": sorted(categories),
        "brands": sorted(brands),
        "price_min": min(all_prices),
        "price_max": max(all_prices),
    }


@api.get("/products/{product_id}")
async def get_product(product_id: str):
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    if not p:
        raise HTTPException(404, "Product not found")
    return p


@api.post("/admin/products")
async def admin_create_product(body: ProductIn, _admin=Depends(admin_only)):
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.products.insert_one(doc)
    doc.pop("_id", None)
    return doc


@api.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, body: ProductIn, _admin=Depends(admin_only)):
    upd = body.model_dump()
    result = await db.products.update_one({"id": product_id}, {"$set": upd})
    if not result.matched_count:
        raise HTTPException(404, "Product not found")
    p = await db.products.find_one({"id": product_id}, {"_id": 0})
    return p


@api.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, _admin=Depends(admin_only)):
    r = await db.products.delete_one({"id": product_id})
    if not r.deleted_count:
        raise HTTPException(404, "Product not found")
    return {"ok": True}


# ---------------- Admin image upload ----------------
ALLOWED_IMG = {"image/jpeg", "image/jpg", "image/png", "image/webp"}


@api.post("/admin/upload")
async def admin_upload(file: UploadFile = File(...), _admin=Depends(admin_only)):
    ctype = (file.content_type or "").lower()
    if ctype not in ALLOWED_IMG:
        raise HTTPException(415, "Only JPEG, PNG, or WebP images allowed")
    data = await file.read()
    if len(data) > 5 * 1024 * 1024:
        raise HTTPException(413, "Image exceeds 5 MB")
    ext = (file.filename or "img.png").rsplit(".", 1)[-1].lower()
    path = f"{APP_NAME}/products/{uuid.uuid4()}.{ext}"
    result = put_object(path, data, ctype)
    stored_path = result["path"]
    # Publicly accessible via our backend
    return {"path": stored_path, "url": f"/api/files/{stored_path}"}


@api.get("/files/{path:path}")
async def download_file(path: str):
    try:
        data, ctype = get_object(path)
    except requests.HTTPError as e:
        raise HTTPException(404 if e.response is not None and e.response.status_code == 404 else 500, "File error")
    return Response(content=data, media_type=ctype)


# ---------------- Orders & Payments ----------------
# Using emergentintegrations.payments.stripe.checkout
from emergentintegrations.payments.stripe.checkout import (  # noqa: E402
    StripeCheckout,
    CheckoutSessionRequest,
)


def _price_of(p: dict) -> float:
    return float(p["discount_price"]) if p.get("discount_price") else float(p["price"])


@api.post("/checkout/session")
async def create_checkout(body: CheckoutBody, user=Depends(current_user_optional)):
    # Resolve authoritative prices from DB — never trust client
    ids = [i.product_id for i in body.items]
    prods_cursor = db.products.find({"id": {"$in": ids}}, {"_id": 0})
    prods = {p["id"]: p async for p in prods_cursor}
    if len(prods) != len(set(ids)):
        raise HTTPException(400, "Some products not found")
    total = 0.0
    order_items = []
    for it in body.items:
        p = prods[it.product_id]
        if it.quantity > p.get("stock", 0):
            raise HTTPException(400, f"Insufficient stock for {p['name']}")
        unit = _price_of(p)
        total += unit * it.quantity
        order_items.append({
            "product_id": p["id"],
            "name": p["name"],
            "unit_price": unit,
            "quantity": it.quantity,
            "image": p["images"][0] if p.get("images") else None,
        })
    total = round(total, 2)

    order_id = f"AT-{uuid.uuid4().hex[:8].upper()}"
    origin = body.origin_url.rstrip("/")
    success_url = f"{origin}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/cart"

    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=f"{origin}/api/webhook/stripe")
    session = await stripe_checkout.create_checkout_session(CheckoutSessionRequest(
        amount=float(total),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            "order_id": order_id,
            "user_id": user["id"] if user else "",
            "customer_email": body.shipping.email,
        },
    ))

    now = datetime.now(timezone.utc).isoformat()
    await db.orders.insert_one({
        "id": order_id,
        "session_id": session.session_id,
        "user_id": user["id"] if user else None,
        "items": order_items,
        "shipping": body.shipping.model_dump(),
        "total": total,
        "currency": "usd",
        "payment_status": "pending",
        "order_status": "pending",  # pending -> paid -> processing -> shipped -> delivered
        "shipment": {"status": "pending", "tracking_number": None, "carrier": None},
        "created_at": now,
        "updated_at": now,
    })
    await db.payment_transactions.insert_one({
        "session_id": session.session_id,
        "order_id": order_id,
        "amount": total,
        "currency": "usd",
        "status": "initiated",
        "payment_status": "pending",
        "created_at": now,
        "updated_at": now,
    })
    return {"checkout_url": session.url, "session_id": session.session_id, "order_id": order_id, "total": total}


@api.get("/payments/status/{session_id}")
async def payment_status(session_id: str):
    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    if not tx:
        raise HTTPException(404, "Transaction not found")
    if tx["payment_status"] != "paid":
        try:
            stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="https://example.com/api/webhook/stripe")
            s = await stripe_checkout.get_checkout_status(session_id)
            if s.payment_status == "paid" or s.status == "complete":
                now = datetime.now(timezone.utc).isoformat()
                await db.payment_transactions.update_one(
                    {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                    {"$set": {"status": "completed", "payment_status": "paid", "updated_at": now}},
                )
                order = await db.orders.find_one({"session_id": session_id})
                if order and order["payment_status"] != "paid":
                    await db.orders.update_one(
                        {"session_id": session_id, "payment_status": {"$ne": "paid"}},
                        {"$set": {"payment_status": "paid", "order_status": "processing", "shipment.status": "processing", "updated_at": now}},
                    )
                    # decrement stock
                    for it in order["items"]:
                        await db.products.update_one({"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}})
                tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
        except Exception as e:
            logger.warning(f"Stripe poll failed: {e}")
    order = await db.orders.find_one({"session_id": session_id}, {"_id": 0})
    return {
        "session_id": session_id,
        "status": tx["status"],
        "payment_status": tx["payment_status"],
        "order": order,
    }


from fastapi import Request  # noqa: E402


@api.post("/webhook/stripe")
async def stripe_webhook_impl(request: Request):
    body_bytes = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    try:
        stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url="https://example.com/api/webhook/stripe")
        result = await stripe_checkout.handle_webhook(body_bytes, sig)
    except Exception as e:
        logger.warning(f"Webhook processing failed: {e}")
        raise HTTPException(400, "Invalid webhook")
    now = datetime.now(timezone.utc).isoformat()
    if result.session_id and (result.payment_status or "").lower() in ("paid", "complete"):
        await db.payment_transactions.update_one(
            {"session_id": result.session_id, "payment_status": {"$ne": "paid"}},
            {"$set": {"status": "completed", "payment_status": "paid", "updated_at": now}},
        )
        order = await db.orders.find_one({"session_id": result.session_id})
        if order and order["payment_status"] != "paid":
            await db.orders.update_one(
                {"session_id": result.session_id, "payment_status": {"$ne": "paid"}},
                {"$set": {"payment_status": "paid", "order_status": "processing", "shipment.status": "processing", "updated_at": now}},
            )
            for it in order["items"]:
                await db.products.update_one({"id": it["product_id"]}, {"$inc": {"stock": -it["quantity"]}})
    return {"ok": True}


# ---------------- Order routes ----------------
@api.get("/orders/mine")
async def my_orders(user=Depends(current_user)):
    orders = await db.orders.find({"user_id": user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return orders


@api.get("/orders/lookup/{order_id}")
async def lookup_order(order_id: str, email: str):
    o = await db.orders.find_one({"id": order_id, "shipping.email": email.lower()}, {"_id": 0})
    if not o:
        raise HTTPException(404, "Order not found")
    return o


@api.get("/admin/orders")
async def admin_orders(_admin=Depends(admin_only)):
    orders = await db.orders.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return orders


@api.patch("/admin/orders/{order_id}/shipment")
async def admin_update_shipment(order_id: str, upd: ShipmentUpdate, _admin=Depends(admin_only)):
    r = await db.orders.update_one(
        {"id": order_id},
        {"$set": {
            "shipment.status": upd.status,
            "shipment.tracking_number": upd.tracking_number,
            "shipment.carrier": upd.carrier,
            "order_status": upd.status if upd.status in ("shipped", "delivered", "cancelled") else "processing",
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }},
    )
    if not r.matched_count:
        raise HTTPException(404, "Order not found")
    return {"ok": True}


@api.get("/admin/stats")
async def admin_stats(_admin=Depends(admin_only)):
    total_orders = await db.orders.count_documents({})
    paid = await db.orders.count_documents({"payment_status": "paid"})
    pending = await db.orders.count_documents({"payment_status": "pending"})
    shipped = await db.orders.count_documents({"shipment.status": "shipped"})
    products = await db.products.count_documents({})
    users = await db.users.count_documents({"role": "customer"})
    # revenue
    pipeline = [{"$match": {"payment_status": "paid"}}, {"$group": {"_id": None, "sum": {"$sum": "$total"}}}]
    agg = await db.orders.aggregate(pipeline).to_list(1)
    revenue = round(agg[0]["sum"], 2) if agg else 0.0
    return {
        "total_orders": total_orders,
        "paid_orders": paid,
        "pending_orders": pending,
        "shipped_orders": shipped,
        "total_products": products,
        "total_customers": users,
        "revenue": revenue,
    }


@api.get("/")
async def root():
    return {"service": "atelier-ink-steel", "status": "ok"}


# ---------------- Wire it up ----------------
app.include_router(api)

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown():
    client.close()
