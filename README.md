# The WL Pens — Luxury Writing Instruments Storefront

A luxury pen atelier & e-commerce platform based in Panchkula, Haryana. Built with **FastAPI + Motor (MongoDB)** on the backend and **React 19 + Tailwind CSS + shadcn/ui** on the frontend. Features a rich, 21+ section homepage architecture inspired by *penstore.in*, live dynamic CMS management for non-technical administrators, custom laser name engraving, variant colors & swatches, and streamlined WhatsApp checkout.

---

## 1. System Architecture & Tech Stack

- **Backend**: Python 3.10+ / 3.14, FastAPI, Motor (Async MongoDB Driver), PyMongo, Pydantic v2, PyJWT, Passlib (Bcrypt), Supabase Storage for media assets.
- **Frontend**: React 19, React Router DOM v7, Tailwind CSS, Lucide React, Framer Motion, Embla Carousel, Sonner toast system.
- **Database**: MongoDB Atlas / Local MongoDB.
- **Checkout Flow**: Native cart & checkout with direct WhatsApp handoff to the Panchkula studio team (`+91 93519 96272`), generating detailed order breakdown URLs with product names, color selections, bespoke engraving details, and customer address.

---

## 2. Homepage Architecture (21+ Sections)

The homepage replicates and expands upon luxury writing instrument boutique patterns with full dynamic backend connectivity:

| # | Section Name | Component File | Description & Dynamic CMS Fields |
|---|---|---|---|
| 1 | **Hero Moving Carousel** | `Home.jsx` | Multi-slide banner with auto-play, pause on hover, slide indicators, and customizable CTAs. |
| 2 | **Legacy & Trust Strip** | `LegacyTrustStrip.jsx` | Minimalist heritage badge ("Panchkula Atelier · Since 2020") with live real-time visitor heartbeat counter. |
| 3 | **Promotional Offers Ticker** | `OffersTicker.jsx` | Infinite marquee with hover-pause showing active promotional discount codes & free shipping perks. |
| 4 | **4-Column Trust Bar** | `TrustBar.jsx` | Free shipping, complimentary refills, 100% genuine guarantee, and expert curation. |
| 5 | **Ink Tagline Editorial** | `Home.jsx` | Philosophy banner: *"Fine Pens & Rich Pigments curated for effortless writing."* |
| 6 | **Category Carousel** | `Home.jsx` | Dynamic category rail fetched live from MongoDB database. |
| 7 | **Writing Instruments Tiles** | `CategoryTilesGrid.jsx` | 3-column curated grid: Fountain Pens, Rollerball & Ballpoint, Archival Inks. |
| 8 | **Hallmark Best Sellers Grid** | `Home.jsx` | 3-column hallmark product grid with instant quick-view. |
| 9 | **Signature Collections** | `SignatureCollections.jsx` | 2-column luxury cards: *Exclusive Collection* & *Premium Collection*. |
| 10 | **Fountain Pens Product Rail** | `ProductCategoryRail.jsx` | Dedicated category carousel featuring fine fountain pens with quick-add & details. |
| 11 | **Secondary Authenticity Marquee** | `SecondaryTrustMarquee.jsx` | Infinite marquee highlighting 100% genuine products, official warranty, and express dispatch. |
| 12 | **Occasion Gift Tiles** | `OccasionGiftTiles.jsx` | 2-column gifting section: *Gifts for Her* (slender/rose gold) and *Gifts for Him* (brass/matte black). |
| 13 | **New Arrivals Carousel** | `Home.jsx` | Dynamic showcase of recently added writing editions. |
| 14 | **Rollerball Pens Product Rail** | `ProductCategoryRail.jsx` | Dedicated carousel for smooth rollerballs and daily writers. |
| 15 | **Corporate & Bulk Inquiries** | `BulkAndCorporateGifts.jsx` | High-volume corporate gifting and retail inquiry cards with email triggers. |
| 16 | **Editorial Categories** | `Home.jsx` | 3 editorial category highlight cards with custom background styling. |
| 17 | **Gift & Studio Banner** | `Home.jsx` | Luxury promotional banner for seasonal collections. |
| 18 | **Brand Heritage Marquee** | `BrandMarqueeSection.jsx` | Authorized distributor partner logo marquee (Pilot, Namiki, Sailor, Lamy, etc.). |
| 19 | **Assurance of Excellence** | `WarrantyTrustBlock.jsx` | Minimalist, understated 3-pillar craftsmanship assurance grid. |
| 20 | **Customer Reviews Carousel** | `CustomerReviewsCarousel.jsx` | Auto-moving carousel with pause-on-hover and 8+ authentic Indian pen connoisseurs. |
| 21 | **Physical Atelier & Map** | `StoreLocationMap.jsx` | Panchkula studio address, operating hours, phone, email, and embedded Google Map. |
| 22 | **Founder's Story** | `Home.jsx` | Brand story and craftsmanship pledge from the Shivalik foothills. |
| 23 | **Crafted For You (Custom Engraving)** | `MinimalEngravingSection.jsx` | Laser personalization atelier section placed at the conclusion of the story. |

---

## 3. Local Development Setup

### Prerequisites
- Python 3.10+ (or Python 3.14)
- Node.js 18+ & npm
- MongoDB Atlas connection string or local MongoDB instance on `mongodb://localhost:27017`

### Step 1: Backend Setup

```bash
# From repository root
cd backend
source ../.venv/bin/activate    # Or: python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Start backend server on port 8000
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be accessible at `http://localhost:8000/api/*`.

### Step 2: Frontend Setup

```bash
# In a new terminal window
cd frontend
npm install

# Start React dev server on port 3000
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 4. Admin Panel & CMS Management

Access the studio admin dashboard at `http://localhost:3000/admin` (or click **Atelier Admin** after logging in at `/login`).

### Default Admin Credentials
- **Email**: `thewlpens@gmail.com`
- **Password**: `Thewlpens@2000`

### Admin Management Capabilities
1. **Homepage Sections (CMS)**:
   - **Hero Carousel**: Add/remove slides, reorder slides, edit titles, subtitles, CTAs, and upload slide images.
   - **Promotional Offers Ticker**: Add/remove/edit live announcement strings.
   - **Secondary Trust Marquee**: Add/remove/edit authenticity assurance points.
   - **4-Column Trust Bar**: Customize icons, titles, and subtext.
   - **Signature Collections**: Upload custom luxury card background images and update links.
   - **Occasion Gift Tiles**: Manage *Gifts for Her* and *Gifts for Him* images, copy, and links.
   - **Customer Reviews**: Add verified buyer testimonials with star ratings, quotes, city, and product images.
   - **Physical Store & Atelier**: Update address, phone, email, business hours, and Google Maps embed iframe.
   - **Contact Form Inquiry Topics**: Add and edit inquiry categories available on the Contact Us page dropdown.
2. **Product Catalog & Variants**:
   - Title, brand, category, regular price, discount price, stock count, SKU.
   - **Color Variants**: Color name, hex code, swatch image, price override, discount price override, stock override, and dedicated multi-image uploads per color.
   - **Laser Engraving Settings**: Toggle engravable status, custom max length limit, font options, and placement previews.
3. **Categories**: Create, edit, reorder, and delete categories (renames cascade safely to existing products).
4. **Orders & Fulfilment**: View all incoming WhatsApp orders, customer addresses, engraving requests, and update shipment tracking status & carrier details.

---

## 5. Running Automated Backend Tests

The test suite covers full catalog search, fuzzy matching, category cascades, wishlist operations, engraving persistence, auth roles, and order creation:

```bash
# Run full backend test suite
.venv/bin/pytest backend/tests/ -v

# Run specific test modules
.venv/bin/pytest backend/tests/backend_test.py -v
.venv/bin/pytest backend/tests/test_iteration3.py -v
.venv/bin/pytest backend/tests/test_analytics_and_search.py -v
.venv/bin/pytest backend/tests/test_wishlist.py -v
```

All 45+ tests run against the live API endpoints and MongoDB backend.

---

## 6. Directory Structure Reference

```
TWI-Pens-Frontend/
├── backend/
│   ├── server.py                   # FastAPI application & MongoDB endpoints
│   ├── requirements.txt            # Python dependencies
│   ├── .env                        # MongoDB URL, JWT, and Supabase credentials
│   └── tests/                      # Automated test suites
│       ├── backend_test.py
│       ├── test_iteration3.py
│       ├── test_analytics_and_search.py
│       └── test_wishlist.py
├── frontend/
│   ├── src/
│   │   ├── App.js                  # App router & layout container
│   │   ├── index.css               # Global typography, colors, animations & marquee rules
│   │   ├── components/             # Reusable UI & Homepage components
│   │   │   ├── Header.jsx          # Top utility bar + main navigation
│   │   │   ├── Footer.jsx          # Studio footer & trust assurances
│   │   │   ├── LegacyTrustStrip.jsx
│   │   │   ├── OffersTicker.jsx
│   │   │   ├── TrustBar.jsx
│   │   │   ├── CategoryTilesGrid.jsx
│   │   │   ├── SignatureCollections.jsx
│   │   │   ├── ProductCategoryRail.jsx
│   │   │   ├── SecondaryTrustMarquee.jsx
│   │   │   ├── OccasionGiftTiles.jsx
│   │   │   ├── MinimalEngravingSection.jsx
│   │   │   ├── BrandMarqueeSection.jsx
│   │   │   ├── WarrantyTrustBlock.jsx
│   │   │   ├── CustomerReviewsCarousel.jsx
│   │   │   ├── BulkAndCorporateGifts.jsx
│   │   │   ├── StoreLocationMap.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   ├── QuickViewModal.jsx
│   │   │   └── CompareDrawer.jsx
│   │   ├── lib/                    # API client, auth context, compare context, formatters
│   │   └── pages/                  # Home, Catalog, ProductDetail, Cart, Checkout, Admin, Contact
│   ├── package.json
│   └── .env                        # REACT_APP_BACKEND_URL=http://localhost:8000
└── README.md
```

---

## 7. Important Development Notes

- **Production Build Notice**: Use `npm run dev` for local development. Do not run `npm run build` due to a legacy CRA alias path constraint.
- **Portaling Pattern**: All modals and quick-view dialogs use `createPortal(..., document.body)` to avoid z-index and stacking context clipping.
- **No Hardcoded Product Data**: All homepage rails, best sellers, categories, and new arrivals fetch live from the backend API.
