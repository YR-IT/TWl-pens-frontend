# The WL Pens — Project Architecture & Status Memory

## 1. Project Overview
- **Brand**: The WL Pens (Atelier based in Panchkula, Haryana)
- **Tech Stack**: FastAPI + Motor (MongoDB) on backend, React 19 + Tailwind CSS on frontend.
- **Port Allocation**:
  - Frontend: `http://localhost:3000` (started via `npm run dev`)
  - Backend: `http://localhost:8000` (started via `uvicorn server:app --reload --port 8000`)
- **Admin Account**: `thewlpens@gmail.com` / `Thewlpens@2000`

---

## 2. Complete Homepage Overhaul (21+ Sections)

The homepage in `frontend/src/pages/Home.jsx` implements the full luxury pen boutique layout inspired by *penstore.in*:

1. **Hero Moving Carousel** (`Home.jsx`): Multi-slide responsive carousel with auto-play, pause-on-hover, slide indicators, and dynamic CTA routes.
2. **Legacy Trust Strip** (`LegacyTrustStrip.jsx`): Minimalist heritage trust badge + live real-time visitor heartbeat counter with pulse animation.
3. **Promotional Offers Ticker** (`OffersTicker.jsx`): Infinite marquee ticker for promo codes, shipping offers, with hover-pause functionality.
4. **4-Column Trust Bar** (`TrustBar.jsx`): Free shipping, extra refill, genuine guarantee, expert curation.
5. **Ink Tagline Banner** (`Home.jsx`): Editorial headline & subtitle.
6. **Category Browsing Carousel** (`Home.jsx`): Live fetched categories from MongoDB.
7. **Writing Instruments Tiles** (`CategoryTilesGrid.jsx`): 3-column curated grid (Fountain Pens, Rollerball/Ballpoint, Inks).
8. **Hallmark Best Sellers** (`Home.jsx`): 3-column hallmark product grid with quick-view modal.
9. **Signature Collections** (`SignatureCollections.jsx`): 2-column luxury collection cards (*Exclusive* & *Premium*).
10. **Fountain Pens Product Rail** (`ProductCategoryRail.jsx`): Dedicated category carousel with quick-add.
11. **Secondary Authenticity Marquee** (`SecondaryTrustMarquee.jsx`): 100% genuine, authorized distributor, 1-year warranty marquee ribbon.
12. **Occasion Gift Tiles** (`OccasionGiftTiles.jsx`): Editorial gifting cards (*Gifts for Her* & *Gifts for Him*).
13. **New Arrivals Carousel** (`Home.jsx`): Fresh additions to the atelier.
14. **Rollerball Pens Product Rail** (`ProductCategoryRail.jsx`): Dedicated category carousel for rollerballs.
15. **Bulk & Corporate Gifts** (`BulkAndCorporateGifts.jsx`): Two cards for high-volume corporate and retail gifting.
16. **Featured Categories Editorial** (`Home.jsx`): 3 cards with custom backgrounds and accent styling.
17. **Gift & Promo Banner** (`Home.jsx`): Seasonal promotional banner.
18. **Brand Heritage Marquee** (`BrandMarqueeSection.jsx`): Infinite marquee of authorized partner brand logos.
19. **Assurance of Excellence** (`WarrantyTrustBlock.jsx`): Minimalist 3-pillar craftsmanship assurance grid (*Hand-Tuned Precision*, *100% Genuine Provenance*, *Dedicated Studio Care*).
20. **Customer Reviews Carousel** (`CustomerReviewsCarousel.jsx`): Auto-sliding review carousel with pause-on-hover, prev/next buttons, and 8+ authentic Indian pen connoisseurs.
21. **Physical Store Location & Map** (`StoreLocationMap.jsx`): Panchkula atelier address, hours, contact, and Google Maps embed.
22. **Founder Story Section** (`Home.jsx`): Brand narrative from the foothills of the Shivaliks.
23. **Crafted For You (Custom Engraving)** (`MinimalEngravingSection.jsx`): Laser personalization atelier showcase positioned after the founder's story at the very end of the page.

---

## 3. Dynamic CMS Customization in Admin Panel

All dynamic assets and promotional copy are fully editable from the Admin Dashboard (`/admin > Homepage Sections`):
- **Hero Carousel Slides**: Add/remove/reorder slides, edit copy, upload images.
- **Offers Ticker Messages**: Add/remove/edit promo text strings.
- **Secondary Trust Marquee Items**: Add/remove/edit assurance points.
- **Occasion Gift Tiles**: Upload background images, edit titles, descriptions, and links for *Gifts for Her* and *Gifts for Him*.
- **Customer Reviews**: Add/remove/edit reviewer name, city, 1-5 star ratings, testimonials, and product photos.
- **Store Location & Atelier Details**: Studio address, phone, email, opening hours, Google Maps embed URL.
- **Signature Collections**: Custom background uploads, brand eyebrows, titles, links.
- **Product Variants**: Full multi-color variants with hex codes, swatch images, price overrides, discount prices, stock counts, and dedicated variant image galleries.
- **Laser Name Engraving**: Engravable toggle, custom character limit, font options, and PDP preview.

---

## 4. Automated Testing Suite

Full test coverage across 5 test suites with **48/48 passing tests**:
- `backend/tests/backend_test.py`: Product catalog, filters, facets, admin CRUD, upload, auth, and order flow (18 tests).
- `backend/tests/test_iteration3.py`: Category management, cascade renames, product engraving, and order persistence (12 tests).
- `backend/tests/test_analytics_and_search.py`: Fuzzy search, analytics ingestion, and caching lifecycle (6 tests).
- `backend/tests/test_wishlist.py`: Wishlist toggle, ordering, sharing token, and public access (9 tests).
- `tests/test_homepage_api.py`: Homepage CMS banners, site settings, and auth security tests (3 tests).

---

## 5. Development Guidelines & Constraints
- **Zero Mock Data in Frontend**: All products, categories, reviews, and banner configurations are fetched live from the backend API.
- **Portaling Standard**: All interactive overlays (modals, drawers, quick-view) use `createPortal(..., document.body)` to avoid z-index or overflow clipping.
- **Build Constraint**: Use `npm run dev` for local development. Do not run `npm run build` due to pre-existing CRA alias config.
