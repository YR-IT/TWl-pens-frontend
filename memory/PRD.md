# Atelier Ink & Steel — Luxury Pen E-commerce Store

## Original Problem Statement
Build a luxury pen e-commerce website inspired by makoba.com/collections/new-arrivals but with a distinct premium design. Includes an admin page for uploading pen designs, managing products (with discount pricing) and tracking shipments.

## User Choices
- Full replacement pivot (was a restaurant app)
- Features: catalog with filters (brand/category/price), product detail, cart, guest checkout, user accounts/login, real Stripe payments
- Categories: Fountain Pens, Rollerball, Ballpoint, Mechanical Pencils, Inks, Accessories, Limited Editions
- Design: blend of Minimal Scandinavian + Warm Editorial Luxury (cream #FAF8F5, deep espresso #1C1815, muted olive #3D4838, warm gold #B8860B) with Cormorant Garamond serif + Manrope sans
- Product images: curated stock luxury pen photography + admin can upload their own
- Admin: image upload, discount pricing, product CRUD, shipment tracking

## Architecture
- **Backend** (FastAPI + Motor MongoDB): `/app/backend/server.py`
  - JWT bearer auth (bcrypt), roles: customer / admin
  - Supabase Storage adapter for admin image uploads
  - WhatsApp order handoff (Stripe disabled)
  - Collections: `users`, `products`, `orders`, `payment_transactions`
- **Frontend** (React 19 + React Router + Tailwind + shadcn/ui):
  - Pages: Home, Catalog (`/shop`), ProductDetail (`/product/:id`), Checkout, PaymentSuccess (`/checkout/success`), Login, Register, Account, Admin
  - Contexts: `AuthProvider` (localStorage token) + `CartProvider` (localStorage cart)
  - Sonner toast for feedback

## Completed (2026-02-03)
- Full pivot from restaurant to luxury pen store — old code wiped
- 7-item seeded catalog across all pen categories with discount pricing on 4 SKUs
- Catalog with category / brand / price / search / sort filters
- Product detail with image thumbnails, specs, features, discount pricing (−% badge)
- Cart drawer with quantity control, persistent to localStorage
- Guest & authenticated checkout → WhatsApp order handoff with pre-filled details
- Auth: register/login/me, JWT stored client-side
- Admin dashboard: KPIs (revenue, orders, paid, shipped, products, customers)
- Admin product CRUD with image upload to Supabase Storage
- Admin shipment tracking (status + carrier + tracking number)
- Backend test suite: 18/18 green; Playwright e2e green

## Seeded Admin
- Email: `admin@atelier.pens`
- Password: `Admin@123456`
- Also stored at `/app/memory/test_credentials.md`

## Prioritized Backlog (P0/P1/P2)
- **P1**: Wishlist / saved products for customers
- **P1**: Search modal in header with autocomplete
- **P1**: Product image gallery — currently 1 image per seed, admin can add more
- **P2**: Custom nib size / engraving options on PDP (mentioned in design guidelines)
- **P2**: Real Stripe webhook signature validation (currently uses inline polling as primary fulfilment path)
- **P2**: Email order confirmations (via Resend integration)
- **P2**: Split server.py into routers (auth/products/admin/payments)
- **P2**: Case-normalise shipping.email at write time (lookup edge case)

## Key API Endpoints
- Public: `GET /api/products`, `GET /api/products/facets`, `GET /api/products/{id}`
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Checkout: `POST /api/checkout/session`, `GET /api/payments/status/{session_id}`, `POST /api/webhook/stripe`
- Customer orders: `GET /api/orders/mine`, `GET /api/orders/lookup/{order_id}?email=`
- Admin: `POST/PUT/DELETE /api/admin/products/*`, `POST /api/admin/upload`, `GET /api/admin/orders`, `PATCH /api/admin/orders/{id}/shipment`, `GET /api/admin/stats`
- Files: `GET /api/files/{path}` (proxy for object storage)

## Test Report
`/app/test_reports/iteration_1.json` — no critical bugs.
