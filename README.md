# WL Pens — Local Setup Guide

A luxury pen e-commerce store based in Chandi Mandir, Panchkula. Built with FastAPI + MongoDB on the backend, React 19 + Tailwind + shadcn/ui on the frontend. Orders are placed on the site and confirmed over WhatsApp — no card processing on the website.

---

## 1. Requirements

| Tool          | Version           | Why                                              |
| ------------- | ----------------- | ------------------------------------------------ |
| Python        | 3.10 or newer     | FastAPI backend                                  |
| Node.js       | 18 LTS or newer   | React frontend                                   |
| Yarn (Classic)| 1.22+             | Frontend package manager (npm is not supported)  |
| MongoDB       | 6.x or newer      | Local database                                   |

Optional but recommended: `git`, a modern browser (Chrome/Safari/Firefox).

---

## 2. Clone the code

```bash
git clone <your-repo-url> wl-pens
cd wl-pens
```

Repo layout:

```
wl-pens/
├── backend/    # FastAPI app
└── frontend/   # React app
```

---

## 3. Start MongoDB

### Option A — Docker (fastest)
```bash
docker run -d --name wl-mongo -p 27017:27017 mongo:7
```

### Option B — Native install
- **macOS**:  `brew install mongodb-community && brew services start mongodb-community`
- **Ubuntu**: `sudo apt install mongodb && sudo systemctl start mongod`
- **Windows**: Install MongoDB Community Server, then `net start MongoDB`

Verify it is up:
```bash
mongosh --eval "db.runCommand({ ping: 1 })"
```

---

## 4. Backend — FastAPI

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate         # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

### Configure `backend/.env`

```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=wl_pens
CORS_ORIGINS=http://localhost:3000
JWT_SECRET=<generate-with: openssl rand -hex 32>
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080

# Seeded admin — change before going public
ADMIN_EMAIL=admin@wlpens.in
ADMIN_PASSWORD=Admin@123456

# WhatsApp Business number in international format — used for the order handoff
WHATSAPP_NUMBER=+919999999999

# Emergent Object Storage (product image uploads)
EMERGENT_LLM_KEY=sk-emergent-xxxxxxxxxxxxxxx
INTEGRATION_PROXY_URL=https://integrations.emergentagent.com
APP_NAME=wl-pens
```

> Only `EMERGENT_LLM_KEY` needs to come from the Emergent workspace. Without it the site still runs — only admin image uploads fail.

### Run the API

```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

API is now at `http://localhost:8001/api/*`. On first boot it seeds an admin user, 7 categories, and 7 starter products.

Sanity check:
```bash
curl http://localhost:8001/api/products | jq length   # → 7
curl http://localhost:8001/api/site/config
```

---

## 5. Frontend — React

```bash
cd ../frontend
yarn install
```

### Configure `frontend/.env`

```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=0
ENABLE_HEALTH_CHECK=false
```

### Run the dev server

```bash
yarn start
```

Open **http://localhost:3000**. First visit plays the WL Pens splash intro (only on first tab load per session).

---

## 6. Signing in as admin

Go to `http://localhost:3000/login` and use the credentials from your `backend/.env`:

- **Email**: `admin@atelier.pens`   (or whatever you set)
- **Password**: `Admin@123456`   (change this in production)

You'll land on `/admin` with four tabs:

| Tab         | What you can do                                                                    |
| ----------- | ---------------------------------------------------------------------------------- |
| Dashboard   | KPIs — revenue, orders, paid, shipped, products, customers                         |
| Products    | Full CRUD · discount pricing · drag-to-reorder images · engraving toggle           |
| Categories  | Create / rename / delete (rename cascades to all products)                         |
| Orders      | Every incoming order · update shipment status + tracking number                    |

---

## 7. How the ordering flow works

There is **no card processing on the site**. When a customer clicks "Place order on WhatsApp":

1. Backend saves the order with `payment_status = pending_whatsapp` and decrements stock.
2. Backend replies with a `wa.me/<WHATSAPP_NUMBER>?text=…` URL containing the entire order (items, engraving, address, total, note).
3. Frontend opens that URL in a new tab. The customer reviews and sends the message — it lands in your `WHATSAPP_NUMBER` inbox.
4. You reply with a payment link / UPI QR and confirm shipping. Update the order in `/admin > Orders` as you fulfil it.

Change `WHATSAPP_NUMBER` in `backend/.env` any time — a backend restart is all it needs.

---

## 8. Common tasks

| Task                                 | Command                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------- |
| Reset the database                   | `mongosh wl_pens --eval "db.dropDatabase()"` then restart backend       |
| Add a Python dependency              | `pip install <pkg>` then `pip freeze > backend/requirements.txt`        |
| Add a JS dependency                  | `cd frontend && yarn add <pkg>` (never `npm install`)                   |
| Run backend tests                    | `cd backend && pytest -q`                                               |
| Build the frontend for production    | `cd frontend && yarn build` (output → `frontend/build`)                 |
| Serve the production build           | Any static host — Nginx / Vercel / Netlify / Cloudflare Pages           |

---

## 9. Directory reference

```
wl-pens/
├── backend/
│   ├── server.py            # single FastAPI app — auth, products, categories, orders, wishlist, admin
│   ├── requirements.txt
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/      # Header, Footer, ProductCard, CartDrawer, SearchModal, Splash…
│   │   ├── lib/             # api, auth, cart, wishlist, categories, site, format
│   │   └── pages/           # Home, Catalog, ProductDetail, Checkout, OrderPlaced, Wishlist, Admin…
│   ├── package.json
│   ├── craco.config.js
│   └── .env
└── README.md
```

---

## 10. Troubleshooting

- **`ECONNREFUSED 127.0.0.1:27017`** → MongoDB isn't running. Start it (step 3).
- **CORS errors in the browser** → make sure `CORS_ORIGINS=http://localhost:3000` in `backend/.env` and restart the backend.
- **Admin image upload → 503** → `EMERGENT_LLM_KEY` isn't set. Add it and restart.
- **`yarn` says "command not found"** → `corepack enable && corepack prepare yarn@1.22.22 --activate` (Node 18+).
- **Splash reappears every session** → intentional; it's per-session. Clear `sessionStorage.wl_splash_seen` to test.

---

Made in Panchkula for the slow hand.
