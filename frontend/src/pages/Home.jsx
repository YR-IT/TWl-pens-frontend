import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, fileUrl } from "../lib/api";
import { useCategories } from "../lib/categories";
import { SITE } from "../lib/site";
import ProductCard from "../components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

// ── Section Components ──────────────────────────────────────────────────────
import OffersTicker from "../components/OffersTicker";
import TrustBar from "../components/TrustBar";
import CategoryTilesGrid from "../components/CategoryTilesGrid";
import SignatureCollections from "../components/SignatureCollections";
import ProductCategoryRail from "../components/ProductCategoryRail";
import SecondaryTrustMarquee from "../components/SecondaryTrustMarquee";
import MinimalEngravingSection from "../components/MinimalEngravingSection";
import BrandMarqueeSection from "../components/BrandMarqueeSection";

import CustomerReviewsCarousel from "../components/CustomerReviewsCarousel";
import BulkAndCorporateGifts from "../components/BulkAndCorporateGifts";
import StoreLocationMap from "../components/StoreLocationMap";

// ── Static fallbacks ─────────────────────────────────────────────────────────
const HERO_IMG = "";

const DEFAULT_SLIDES = [
  {
    id: "slide-1",
    image: "",
    eyebrow: "PANCHKULA ATELIER · SS/26",
    title: "The Eternal Quill",
    subtitle: "Discover the art of handcrafted writing instruments, engineered for generations of prose.",
    cta_text: "Shop Now",
    cta_link: "/shop",
    secondary_cta_text: "New Arrivals",
    secondary_cta_link: "/new-arrivals",
  },
  {
    id: "slide-2",
    image: "",
    eyebrow: "HAND-TUNED NIBS & ENGRAVING",
    title: "Bespoke Personalization",
    subtitle: "Complimentary hand-etched initials, custom nib tuning, and cotton presentation pouch with every fine pen.",
    cta_text: "Fountain Pens",
    cta_link: "/shop?category=Fountain%20Pens",
    secondary_cta_text: "Studio Services",
    secondary_cta_link: "/contact",
  },
  {
    id: "slide-3",
    image: "",
    eyebrow: "ARCHIVAL PIGMENTS & SHIMMER",
    title: "Rich Inks of the Season",
    subtitle: "From shimmering sheen to waterproof archival formulations, curated from master ink houses worldwide.",
    cta_text: "Explore Inks",
    cta_link: "/shop?category=Inks",
    secondary_cta_text: "Best Sellers",
    secondary_cta_link: "/best-sellers",
  },
];

const DEFAULT_FEATURED_CATS = [
  {
    label: "Fine Fountain Pens",
    sub: "From beginner-friendly to collector-grade nibs.",
    query: "Fountain Pens",
    bg: "#1C1815",
    accent: "#B8860B",
    image: "",
  },
  {
    label: "Premium Inks",
    sub: "Shimmering, sheening, and waterproof pigments.",
    query: "Inks",
    bg: "#3D4838",
    accent: "#FAF8F5",
    image: "",
  },
  {
    label: "Accessories",
    sub: "Notebooks, cases, converters and care kits.",
    query: "Accessories",
    bg: "#DED6CC",
    accent: "#1C1815",
    image: "",
  },
];

const DEFAULT_WRITING_TILES = [
  {
    title: "Fountain Pens",
    tag: "WRITING INSTRUMENTS",
    description: "Master-crafted nibs, balanced brass barrels, and archival ink flows.",
    category: "Fountain Pens",
    image: "",
  },
  {
    title: "Rollerball Pens",
    tag: "WRITING INSTRUMENTS",
    description: "Smooth, confident strokes with premium liquid ink refills.",
    category: "Rollerball Pens",
    image: "",
  },
  {
    title: "Inks & Accessories",
    tag: "WRITING ESSENTIALS",
    description: "Shimmering sheens, deep pigments, and everything in between.",
    category: "Inks",
    image: "",
  },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [fountainPens, setFountainPens] = useState([]);
  const [rollerballs, setRollerballs] = useState([]);
  const [banner, setBanner] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const cats = useCategories();

  useEffect(() => {
    api.get("/site/banner").then((r) => setBanner(r.data)).catch(() => setBanner(null));

    api.get("/products", { params: { best_seller: true, limit: 6 } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.products) ? r.data.products : []);
        if (list.length > 0) {
          setFeatured(list);
        } else {
          api.get("/products", { params: { featured: true, limit: 6 } })
            .then((res) => setFeatured(Array.isArray(res.data) ? res.data : []));
        }
      })
      .catch(() => setFeatured([]));

    api.get("/products", { params: { new_arrival: true, limit: 8 } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.products) ? r.data.products : []);
        setNewArrivals(list);
      })
      .catch(() => setNewArrivals([]));

    api.get("/products", { params: { category: "Fountain Pens", limit: 8 } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.products) ? r.data.products : []);
        setFountainPens(list);
      })
      .catch(() => setFountainPens([]));

    api.get("/products", { params: { category: "Rollerball Pens", limit: 8 } })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.products) ? r.data.products : []);
        setRollerballs(list);
      })
      .catch(() => setRollerballs([]));
  }, []);

  const slides = (Array.isArray(banner?.slides) && banner.slides.length > 0)
    ? banner.slides
    : (banner?.image
        ? [{
            id: "default-banner",
            image: banner.image,
            eyebrow: banner.eyebrow || `${SITE.brand.toUpperCase()} · SS/26 ARRIVALS`,
            title: banner.title || "The quiet art of writing well.",
            subtitle: banner.subtitle || `${SITE.brand} — a small studio of writing instruments in the shadow of the Shivaliks.`,
            cta_text: banner.cta_text || "Enter the atelier",
            cta_link: banner.cta_link || "/shop",
            secondary_cta_text: banner.secondary_cta_text || "New Arrivals",
            secondary_cta_link: banner.secondary_cta_link || "/new-arrivals",
          }]
        : DEFAULT_SLIDES);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const activeSlideIndex = currentSlide % (slides.length || 1);
  const activeSlide = slides[activeSlideIndex] || slides[0] || DEFAULT_SLIDES[0];
  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const safeCats = Array.isArray(cats) ? cats : [];
  const safeFeatured = Array.isArray(featured) ? featured : [];
  const safeNewArrivals = Array.isArray(newArrivals) ? newArrivals : [];
  const safeFountainPens = Array.isArray(fountainPens) ? fountainPens : [];
  const safeRollerballs = Array.isArray(rollerballs) ? rollerballs : [];

  const categoriesEyebrow = banner?.categories_eyebrow || "01 / CURATED COLLECTIONS";
  const categoriesTitle = banner?.categories_title || "Shop by category.";
  const categoriesSubtitle = banner?.categories_subtitle || "Explore fine pens, rich pigment inks, and handcrafted accessories engineered for effortless writing.";
  const bestsellersEyebrow = banner?.bestsellers_eyebrow || "02 / BEST SELLERS";
  const bestsellersTitle = banner?.bestsellers_title || "Hallmark editions.";
  const bestsellersSubtitle = banner?.bestsellers_subtitle || "Our most coveted writing instruments, beloved by connoisseurs.";

  const writingTiles = (Array.isArray(banner?.writing_tiles) && banner.writing_tiles.length > 0)
    ? banner.writing_tiles
    : DEFAULT_WRITING_TILES;

  const featuredCats = (Array.isArray(banner?.featured_cats) && banner.featured_cats.length > 0)
    ? banner.featured_cats
    : DEFAULT_FEATURED_CATS;

  return (
    <div className="pt-[108px] sm:pt-[108px]">

      {/* S1: HERO MOVING CAROUSEL */}
      <section
        className="relative w-full overflow-hidden bg-[#FAF8F5]"
        data-testid="hero-carousel-section"
      >
        <div className="relative w-full h-[45vh] sm:h-[58vh] lg:h-[72vh] min-h-[260px] max-h-[780px] flex items-center justify-center">
          {slides.map((slide, idx) => {
            const isCurrent = idx === activeSlideIndex;
            const targetLink = slide.link || slide.cta_link || "/shop";
            const imageSrc = slide.image ? fileUrl(slide.image) : HERO_IMG;

            return (
              <div
                key={slide.id || idx}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ease-in-out ${
                  isCurrent ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                }`}
              >
                <Link
                  to={targetLink}
                  className="w-full h-full flex items-center justify-center cursor-pointer"
                  aria-label={slide.title || `Go to slide ${idx + 1}`}
                  data-testid={isCurrent ? "hero-slide-link" : undefined}
                >
                  <img
                    src={imageSrc}
                    alt={slide.title || "The WL Pens Banner"}
                    loading={idx === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="w-full h-full object-contain object-center select-none"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous Slide"
              data-testid="hero-prev-btn"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#1C1815] shadow-lg flex items-center justify-center backdrop-blur-sm border border-[#E6E0D6] transition-all hover:scale-110"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next Slide"
              data-testid="hero-next-btn"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-[#1C1815] shadow-lg flex items-center justify-center backdrop-blur-sm border border-[#E6E0D6] transition-all hover:scale-110"
            >
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#E6E0D6] shadow-sm">
              {slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentSlide(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 transition-all duration-300 rounded-full ${
                    idx === activeSlideIndex ? "w-8 bg-[#B8860B]" : "w-2 bg-[#1C1815]/30 hover:bg-[#1C1815]/60"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* S2: OFFERS TICKER */}
      <OffersTicker offers={banner?.offers_ticker} />

      {/* S4: USP TRUST BAR (Hardcoded) */}
      <TrustBar />

      {/* S5: INK TAGLINE BANNER */}
      <section className="w-full bg-[#FAF8F5] py-8 sm:py-10 text-center border-b border-[#E6E0D6]/60">
        <div className="max-w-3xl mx-auto px-6">
          <p className="ink-font text-2xl sm:text-4xl text-[#1A2836] leading-relaxed tracking-wide">
            Experience the timeless elegance of craft.
          </p>
        </div>
      </section>

      {/* S6: CATEGORY BROWSING CAROUSEL */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16" data-testid="categories-carousel-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">{categoriesEyebrow}</p>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">{categoriesTitle}</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6E685E]">{categoriesSubtitle}</p>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1 self-start sm:self-auto">
            Browse all
          </Link>
        </div>
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselContent>
            {safeCats.map(cat => (
              <CarouselItem key={cat.id} className="basis-1/2 md:basis-1/3 lg:basis-1/5">
                <Link to={`/shop?category=${encodeURIComponent(cat.name)}`} className="group block">
                  <div className="bg-[#FFFFFF] border border-[#E6E0D6] overflow-hidden hover:border-[#B8860B] transition-all duration-300 shadow-sm hover:shadow-md rounded-2xl flex flex-col">
                    <div className="aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#F3EFEA]">
                      <img
                        src={fileUrl(cat.image)}
                        alt={cat.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4 sm:p-5 text-center bg-white border-t border-[#E6E0D6]/40 flex-1 flex flex-col justify-center">
                      <h3 className="font-serif text-base sm:text-lg text-[#1C1815] group-hover:text-[#B8860B] transition-colors font-medium">{cat.name}</h3>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center gap-4 mt-8">
            <CarouselPrevious className="static" />
            <CarouselNext className="static" />
          </div>
        </Carousel>
      </section>

      {/* S7: WRITING INSTRUMENTS CATEGORY TILE GRID */}
      <CategoryTilesGrid
        eyebrow={banner?.writing_tiles_eyebrow || "WRITING INSTRUMENTS"}
        title={banner?.writing_tiles_title || "DISCOVER OUR HALLMARK CATEGORIES"}
        subtitle={banner?.writing_tiles_subtitle || "Engineered for effortless glide, supreme balance, and timeless aesthetic."}
        tiles={writingTiles}
        showBrowseAll={true}
      />

      {/* S8: BEST SELLERS GRID */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-4" data-testid="bestsellers-section">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">{bestsellersEyebrow}</p>
              <span className="text-[#E6E0D6]">·</span>
              <span className="ink-font text-xl sm:text-2xl text-[#1A2836]">Our Recommendation</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">{bestsellersTitle}</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6E685E]">{bestsellersSubtitle}</p>
          </div>
          <Link
            to="/best-sellers"
            className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1 self-start sm:self-auto"
            data-testid="view-all-products"
          >
            View all best sellers
          </Link>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {safeFeatured.map((p) => (
            <motion.div key={p.id} variants={{ hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 0.9, 0.3, 1] } } }}>
              <ProductCard p={p} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* S9: SIGNATURE COLLECTIONS */}
      <SignatureCollections data={banner?.signature_collections} />

      {/* S10: FOUNTAIN PEN CATEGORY RAIL */}
      {safeFountainPens.length > 0 && (
        <ProductCategoryRail
          eyebrow="HALLMARK CATEGORY SPOTLIGHT"
          title="BEST-SELLING FOUNTAIN PENS"
          subtitle="Master-crafted nibs, ergonomic brass barrels, and archival ink flows — from everyday workhorses to collector-grade heirlooms."
          products={safeFountainPens}
          categoryLink="/shop?category=Fountain%20Pens"
        />
      )}

      {/* S11: SECONDARY TRUST MARQUEE */}
      <SecondaryTrustMarquee items={banner?.secondary_trust_marquee} />

      {/* S13: NEW ARRIVALS CAROUSEL */}
      {safeNewArrivals.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20" data-testid="new-arrivals-section">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">04 / NEW ARRIVALS</p>
                <span className="text-[#E6E0D6]">·</span>
                <span className="ink-font text-xl sm:text-2xl text-[#1A2836]">New Arrival Editions</span>
              </div>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">Just landed.</h2>
              <p className="mt-2 text-xs sm:text-sm text-[#6E685E]">The latest additions to the atelier — freshly sourced, freshly inked.</p>
            </div>
            <Link to="/new-arrivals" className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1 self-start sm:self-auto">
              View all new arrivals
            </Link>
          </div>
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {safeNewArrivals.map((p) => (
                <CarouselItem key={p.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                  <ProductCard p={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static" />
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </section>
      )}

      {/* S15: ROLLERBALL CATEGORY RAIL */}
      {safeRollerballs.length > 0 && (
        <ProductCategoryRail
          eyebrow="PREMIUM ROLLERBALLS"
          title="SMOOTH INK ROLLERBALL PENS"
          subtitle="Confident, fluid strokes with premium liquid ink refills — built for daily elegance."
          products={safeRollerballs}
          categoryLink="/shop?category=Rollerball%20Pens"
        />
      )}

      {/* S16: BULK & CORPORATE GIFTS */}
      <BulkAndCorporateGifts
        bulkCard={banner?.bulk_orders_card}
        corpCard={banner?.corporate_gifts_card}
      />

      {/* S17: FEATURED CATEGORIES - 3 editorial banners */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12" data-testid="featured-categories-section">
        <div className="border-b border-[#E6E0D6] pb-8 mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">05 / FEATURED CATEGORIES</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">Curated for you.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCats.map((item) => (
            <Link
              key={item.label}
              to={`/shop?category=${encodeURIComponent(item.query)}`}
              className="group relative overflow-hidden aspect-[3/4] flex flex-col justify-end p-8 rounded-sm"
              style={{ background: item.bg }}
              data-testid="featured-cat-card"
            >
              <img
                src={item.image}
                alt={item.label}
                className="absolute inset-0 w-full h-full object-cover opacity-30 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="relative">
                <h3 className="font-serif text-3xl leading-tight" style={{ color: item.accent }}>{item.label}</h3>
                <p className="text-sm mt-2 opacity-70" style={{ color: item.accent }}>{item.sub}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] font-medium" style={{ color: item.accent }}>
                  Explore <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* S18: GIFT / PROMO BANNER */}
      <section className="relative w-full overflow-hidden my-20 bg-[#1C1815]" style={{ minHeight: "420px" }} data-testid="gift-promo-banner">
        <img
          src="/gifting-banner.jpg"
          alt="Luxury Gift Giving"
          loading="lazy"
          decoding="async"
          width={1600}
          height={420}
          className="absolute inset-0 w-full h-full object-cover object-center lg:object-right opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1815]/95 via-[#1C1815]/75 to-[#1C1815]/30 sm:to-transparent" />
        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-20 flex flex-col justify-center min-h-[420px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#B8860B] mb-3 sm:mb-4 bg-[#FAF8F5]/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
              <Gift size={13} /> Bespoke Gifting
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF8F5] leading-tight">
              The perfect gift,<br /><em className="text-[#FAF8F5]/90">perfectly engraved.</em>
            </h2>
            <p className="text-[#FAF8F5]/80 text-sm sm:text-base mt-4 leading-relaxed max-w-md font-light">
              Complimentary bespoke studio engraving on every order. Delivered in a hand-stitched cotton pouch with a wax-sealed note.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
              <Link to="/shop" className="bg-[#B8860B] text-[#FAF8F5] px-8 py-3.5 rounded-full uppercase text-xs tracking-[0.2em] font-medium hover:bg-[#96700A] transition-all shadow-lg hover:shadow-xl" data-testid="gift-shop-link">
                Shop Gifts
              </Link>
              <Link to="/contact" className="border border-[#FAF8F5]/60 text-[#FAF8F5] px-8 py-3.5 rounded-full uppercase text-xs tracking-[0.2em] font-medium hover:border-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-all backdrop-blur-sm" data-testid="gift-enquire-link">
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* S19: BRAND PARTNERS MARQUEE */}
      <BrandMarqueeSection brands={banner?.brands} />

      {/* S20: CUSTOMER REVIEWS CAROUSEL */}
      <CustomerReviewsCarousel reviews={banner?.customer_reviews} />

      {/* S22: STORE LOCATION MAP */}
      <StoreLocationMap info={banner?.store_info} />

      {/* S23: FOUNDER STORY */}
      <FounderStorySection />

      {/* S24: CRAFTED FOR YOU - BESPOKE ENGRAVING CTA */}
      <MinimalEngravingSection data={banner?.engraving_section} className="border-t border-[#E6E0D6] bg-white py-16" />
    </div>
  );
}

function FounderStorySection() {
  return (
    <section className="border-t border-[#E6E0D6] bg-[#FAF8F5] overflow-hidden" data-testid="founder-story-section">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[340px] bg-[#EFE9DF] overflow-hidden">
          <img
            src="/founder-placeholder.jpg"
            alt="Manjeet Singh - Founder of The WL Pens"
            loading="lazy"
            decoding="async"
            width={600}
            height={460}
            className="w-full h-full object-cover object-center lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/60 via-transparent to-transparent lg:hidden" />
          <div className="absolute bottom-4 left-6 text-[#FAF8F5] lg:hidden">
            <p className="font-serif text-xl font-medium">Manjeet Singh</p>
            <p className="text-xs text-[#FAF8F5]/80 uppercase tracking-widest">Founder &amp; Nibsmith</p>
          </div>
        </div>
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#FAF8F5]">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold mb-3">
            PEOPLE OF THE WL PENS · FOUNDER'S NOTE
          </span>
          <h2 className="ink-font text-3xl sm:text-4xl lg:text-5xl text-[#1A2836] leading-tight mb-4">
            "A pen should never just write. It should remember."
          </h2>
          <div className="space-y-3.5 text-sm sm:text-base text-[#6E685E] leading-relaxed font-light">
            <p>
              Founded in 2019 at the foothills of the Shivaliks, <strong className="text-[#1C1815] font-medium">The WL Pens</strong> was born from a singular obsession: reviving the intimacy and deliberate grace of fine fountain pen writing in India.
            </p>
            <p>
              Every writing instrument that leaves our Panchkula studio is hand-inspected, nib-tested, and individually engraved with precision diamond tools to become a personal heirloom.
            </p>
          </div>
          <div className="mt-6 pt-5 border-t border-[#E6E0D6] flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="ink-font text-2xl sm:text-3xl text-[#1A2836] leading-none mb-1">— W.L. Signature</p>
              <p className="font-serif text-base sm:text-lg text-[#1C1815] font-medium">Manjeet Singh</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#B8860B]">Founder &amp; Master Nibsmith</p>
            </div>
            <span className="font-serif italic text-xs sm:text-sm text-[#6E685E] bg-[#F3EFEA] px-3 py-1.5 rounded-full border border-[#E6E0D6]">
              Panchkula Atelier
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
