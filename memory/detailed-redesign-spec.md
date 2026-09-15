# Updated Redesign Plan

## 1. Header (`frontend/src/components/Header.jsx`)
- **Top Announcement Bar**: Dark background (`#1C1815`), italic serif text, underlined CTA.
- **Navigation Bar**: 
  - Logo: "WL PENS" (serif wordmark + circular icon).
  - Links (Simplified): "HOME", "NEW ARRIVALS", "CONTACT US".

## 2. Homepage (`frontend/src/pages/Home.jsx`)

### Section 2.1: Hero Section
- Full-width hero image with script overlay ("The Eternal Quill") and white pill CTA ("SHOP NOW").

### Section 2.2: Category Section (Dynamic/Editable)
- **Card-based Layout**: 6-column grid of product category cards (image + name), fetched from backend.

### Section 2.3: Brand Strip
- Soft cream/beige background band (`#F3EFEA`) with scrolling logo carousel.

### Section 2.4: Dedicated Sections (New in Queue)
- **New Arrivals Section**: Dedicated, distinct carousel section for new products.
- **Featured Categories Section**: 3-4 distinct sections highlighting specific categories with curated product grids or banners.

### Section 2.5: Other Sections
- Secondary Banner Grid (lifestyle banners).
- Exclusive Brands Section.
- Gift/Promo Banner.
- Marquee Strip.
- Featured Items Grid.

## 3. Footer (`frontend/src/components/Footer.jsx`)
- Large centered SEO tagline, logo, trust badges, newsletter, social, links, store locator, policies, copyright.

## Design Constraints
- Maintain existing palette and typography (`Cormorant Garamond`, `Manrope`).
- Use `framer-motion` for transitions and marquee.
