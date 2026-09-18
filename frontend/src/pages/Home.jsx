import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift, ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api, fileUrl } from "../lib/api";
import { useCategories } from "../lib/categories";
import { SITE } from "../lib/site";
import ProductCard from "../components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

const HERO_IMG = "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const EDITORIAL_1 = "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const EDITORIAL_2 = "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const GIFT_IMG = "/gifting-banner.jpg";

const DEFAULT_SLIDES = [
  {
    id: "slide-1",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
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
    image: "https://images.unsplash.com/photo-1583195764036-5d2c7b0b5e3f?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
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
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600",
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
    image: "https://images.unsplash.com/photo-1583195764036-5d2c7b0b5e3f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    label: "Premium Inks",
    sub: "Shimmering, sheening, and waterproof pigments.",
    query: "Inks",
    bg: "#3D4838",
    accent: "#FAF8F5",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
  {
    label: "Accessories",
    sub: "Notebooks, cases, converters and care kits.",
    query: "Accessories",
    bg: "#DED6CC",
    accent: "#1C1815",
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
  },
];

const DEFAULT_BRANDS = [
  { name: "Pilot",  image: "", link: "/shop?brand=Pilot" },
  { name: "Namiki", image: "", link: "/shop?brand=Namiki" },
  { name: "Sailor", image: "", link: "/shop?brand=Sailor" },
  { name: "Lamy",   image: "", link: "/shop?brand=Lamy" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [studio, setStudio] = useState([]);
  const [banner, setBanner] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const cats = useCategories();

  useEffect(() => {
    api.get("/site/banner")
      .then((r) => setBanner(r.data))
      .catch(() => setBanner(null));
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
    api.get("/studio-posts", { params: { limit: 6 } })
      .then((r) => setStudio(Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.posts) ? r.data.posts : [])))
      .catch(() => setStudio([]));
  }, []);

  // Compute active slides list
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

  // Auto-play timer (5.5s) with pause-on-hover
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  // Keep index within bounds if slides length changes
  const activeSlideIndex = currentSlide % (slides.length || 1);
  const activeSlide = slides[activeSlideIndex] || slides[0] || DEFAULT_SLIDES[0];

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const safeCats = Array.isArray(cats) ? cats : [];
  const safeFeatured = Array.isArray(featured) ? featured : [];
  const safeNewArrivals = Array.isArray(newArrivals) ? newArrivals : [];

  const categoriesEyebrow = banner?.categories_eyebrow || "01 / CURATED COLLECTIONS";
  const categoriesTitle = banner?.categories_title || "Shop by category.";
  const categoriesSubtitle = banner?.categories_subtitle || "Explore fine pens, rich pigment inks, and handcrafted accessories engineered for effortless writing.";

  const bestsellersEyebrow = banner?.bestsellers_eyebrow || "02 / BEST SELLERS";
  const bestsellersTitle = banner?.bestsellers_title || "Hallmark editions.";
  const bestsellersSubtitle = banner?.bestsellers_subtitle || "Our most coveted writing instruments, beloved by connoisseurs.";

  const studioEyebrow = banner?.studio_eyebrow || "03 / FROM THE STUDIO";
  const studioTitle = banner?.studio_title || "Live from the desk.";
  const studioSubtitle = banner?.studio_subtitle || "Fresh nib videos, first inks of the season, and bespoke commissions — straight from our Panchkula atelier.";

  // Featured categories — from backend or fallback
  const featuredCats = (Array.isArray(banner?.featured_cats) && banner.featured_cats.length > 0)
    ? banner.featured_cats
    : DEFAULT_FEATURED_CATS;

  // Brands — from backend or fallback
  const brands = (Array.isArray(banner?.brands) && banner.brands.length > 0)
    ? banner.brands
    : DEFAULT_BRANDS;

  // Brand strip items for marquee (use brands list, duplicated)
  const brandItems = [...brands, ...brands];

  return (
    <div className="pt-[108px] sm:pt-[108px]">
      {/* Hero Moving Carousel Section */}
      <section 
        className="relative w-full h-[60vh] sm:h-[68vh] lg:h-[72vh] min-h-[440px] max-h-[720px] overflow-hidden bg-[#1C1815]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSlide.id || activeSlideIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <img 
              src={activeSlide.image ? fileUrl(activeSlide.image) : HERO_IMG} 
              alt={activeSlide.title || "The WL Pens Atelier"} 
              className="w-full h-full object-cover object-[center_35%] scale-105 transition-transform duration-1000"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/80 via-[#1C1815]/40 to-[#1C1815]/20" />
          </motion.div>
        </AnimatePresence>

        {/* Slide Content Layer */}
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-6 z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${activeSlide.id || activeSlideIndex}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
              className="max-w-3xl flex flex-col items-center"
            >
              {activeSlide.eyebrow && (
                <div className="flex items-center gap-2 text-[#B8860B] text-[11px] sm:text-xs uppercase tracking-[0.3em] mb-3 drop-shadow">
                  <Sparkles size={13} />
                  <span>{activeSlide.eyebrow}</span>
                </div>
              )}
              <h1 className="font-serif text-3xl sm:text-5xl lg:text-7xl text-[#FAF8F5] leading-tight drop-shadow-md">
                {activeSlide.title || "The Eternal Quill"}
              </h1>
              {activeSlide.subtitle && (
                <p className="text-[#FAF8F5]/90 text-sm sm:text-base lg:text-lg font-serif italic mt-3 sm:mt-4 max-w-2xl leading-relaxed drop-shadow">
                  {activeSlide.subtitle}
                </p>
              )}
              <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4">
                {activeSlide.cta_text && (
                  <Link
                    to={activeSlide.cta_link || "/shop"}
                    className="bg-[#FAF8F5] text-[#1C1815] px-8 sm:px-10 py-3.5 rounded-full uppercase tracking-widest text-xs font-semibold hover:bg-[#E6E0D6] transition-all shadow-lg hover:shadow-xl hover:scale-105 duration-200"
                  >
                    {activeSlide.cta_text}
                  </Link>
                )}
                {activeSlide.secondary_cta_text && (
                  <Link
                    to={activeSlide.secondary_cta_link || "/new-arrivals"}
                    className="border border-[#FAF8F5]/80 text-[#FAF8F5] bg-black/20 backdrop-blur-sm px-6 sm:px-8 py-3.5 rounded-full uppercase tracking-widest text-xs font-medium hover:bg-[#FAF8F5] hover:text-[#1C1815] transition-all duration-200"
                  >
                    {activeSlide.secondary_cta_text}
                  </Link>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Arrows (only if multiple slides) */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 hover:bg-black/60 text-white/90 hover:text-white flex items-center justify-center backdrop-blur-sm border border-white/10 transition-all hover:scale-110"
            >
              <ChevronRight size={22} />
            </button>

            {/* Slide Indicator Bars / Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-3 bg-black/30 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
              {slides.map((s, idx) => (
                <button
                  key={s.id || idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === activeSlideIndex
                      ? "w-8 bg-[#B8860B]"
                      : "w-2 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Brand Strip Marquee — uses live brands list */}
      <section className="bg-[#F3EFEA] py-10 overflow-hidden border-y border-[#E6E0D6]">
        <div className="animate-marquee-infinite flex items-center">
          {brandItems.map((b, i) => (
            <div key={i} className="flex items-center gap-10 px-10 shrink-0">
              <span className="font-serif text-2xl tracking-[0.2em] text-[#1C1815]/40 select-none whitespace-nowrap">
                {b.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#B8860B]/40 shrink-0"/>
            </div>
          ))}
        </div>
      </section>

      {/* Category Cards Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
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
                  <div className="bg-[#FFFFFF] border border-[#E6E0D6] overflow-hidden hover:border-[#B8860B] transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="aspect-square overflow-hidden bg-[#F3EFEA]">
                      <img src={fileUrl(cat.image)} alt={cat.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
                    </div>
                    <div className="p-5 text-center">
                      <h3 className="font-serif text-lg text-[#1C1815]">{cat.name}</h3>
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

      {/* Best sellers & hallmark instruments */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">{bestsellersEyebrow}</p>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">{bestsellersTitle}</h2>
            <p className="mt-2 text-xs sm:text-sm text-[#6E685E]">{bestsellersSubtitle}</p>
          </div>
          <Link to="/best-sellers" className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1 self-start sm:self-auto" data-testid="view-all-products">
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
              <ProductCard p={p}/>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Bespoke Personalization / Engraving Preview Showcase */}
      <EngravingPreviewSection/>

      {/* Secondary Banner Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative aspect-[16/9] md:aspect-[4/5] flex items-end p-12 overflow-hidden bg-[#D1D9D1]">
          <img src={EDITORIAL_1} alt="Timeless Elegance" className="absolute inset-0 w-full h-full object-cover opacity-70"/>
          <div className="relative text-[#FAF8F5]">
            <h3 className="font-serif text-4xl drop-shadow">Timeless Elegance</h3>
            <Link to="/shop" className="mt-4 inline-block bg-[#FAF8F5] text-[#1C1815] px-8 py-3 rounded-full uppercase text-xs hover:bg-white transition-colors">Discover</Link>
          </div>
        </div>
        <div className="relative aspect-[16/9] md:aspect-[4/5] flex items-end p-12 overflow-hidden bg-[#DED6CC]">
          <img src={EDITORIAL_2} alt="Modern Precision" className="absolute inset-0 w-full h-full object-cover opacity-70"/>
          <div className="relative text-[#FAF8F5]">
            <h3 className="font-serif text-4xl drop-shadow">Modern Precision</h3>
            <Link to="/shop" className="mt-4 inline-block bg-[#1C1815] text-[#FAF8F5] px-8 py-3 rounded-full uppercase text-xs hover:bg-[#3D4838] transition-colors">Explore</Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Carousel Section */}
      {safeNewArrivals.length > 0 && (
        <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10 gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">04 / NEW ARRIVALS</p>
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
                  <ProductCard p={p}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static"/>
              <CarouselNext className="static"/>
            </div>
          </Carousel>
        </section>
      )}

      {/* Featured Categories — 3 editorial banners */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12">
        <div className="border-b border-[#E6E0D6] pb-8 mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">05 / FEATURED CATEGORIES</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">Curated for you.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredCats.map((item) => (
            <Link
              key={item.label}
              to={`/shop?category=${encodeURIComponent(item.query)}`}
              className="group relative overflow-hidden aspect-[3/4] flex flex-col justify-end p-8"
              style={{ background: item.bg }}
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
                  Explore <ArrowRight size={12}/>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Gift / Promo Banner */}
      <section className="relative w-full overflow-hidden my-20 bg-[#1C1815]" style={{ minHeight: "420px" }}>
        <img 
          src={GIFT_IMG} 
          alt="Luxury Gift Giving" 
          className="absolute inset-0 w-full h-full object-cover object-center lg:object-right opacity-90 transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1815]/95 via-[#1C1815]/75 to-[#1C1815]/30 sm:to-transparent"/>
        <div className="relative max-w-[1600px] mx-auto px-6 sm:px-12 lg:px-24 py-16 sm:py-20 flex flex-col justify-center min-h-[420px]">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#B8860B] mb-3 sm:mb-4 bg-[#FAF8F5]/10 backdrop-blur-sm px-3 py-1 rounded-full w-fit">
              <Gift size={13}/> Bespoke Gifting
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#FAF8F5] leading-tight">
              The perfect gift,<br/><em className="text-[#FAF8F5]/90">perfectly engraved.</em>
            </h2>
            <p className="text-[#FAF8F5]/80 text-sm sm:text-base mt-4 leading-relaxed max-w-md font-light">
              Complimentary bespoke studio engraving on every order. Delivered in a hand-stitched cotton pouch with a wax-sealed note.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-8">
              <Link 
                to="/shop" 
                className="bg-[#B8860B] text-[#FAF8F5] px-8 py-3.5 rounded-full uppercase text-xs tracking-[0.2em] font-medium hover:bg-[#96700A] transition-all shadow-lg hover:shadow-xl"
              >
                Shop Gifts
              </Link>
              <Link 
                to="/contact" 
                className="border border-[#FAF8F5]/60 text-[#FAF8F5] px-8 py-3.5 rounded-full uppercase text-xs tracking-[0.2em] font-medium hover:border-[#FAF8F5] hover:bg-[#FAF8F5]/10 transition-all backdrop-blur-sm"
              >
                Enquire
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Brands Section */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="border-b border-[#E6E0D6] pb-8 mb-10 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">06 / EXCLUSIVE PARTNERS</p>
          <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">Our writing houses.</h2>
        </div>

        {brands.length <= 6 ? (
          /* Grid for 6 or fewer brands */
          <div className="flex flex-wrap justify-center gap-10">
            {brands.map((b) => (
              <BrandCard key={b.name} b={b}/>
            ))}
          </div>
        ) : (
          /* Carousel for 7+ brands */
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {brands.map((b) => (
                <CarouselItem key={b.name} className="basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <BrandCard b={b}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static"/>
              <CarouselNext className="static"/>
            </div>
          </Carousel>
        )}

        <div className="text-center mt-12">
          <Link to="/brands" className="text-[#B8860B] underline uppercase text-xs">Explore All Brands &rarr;</Link>
        </div>
      </section>

      {/* Founder Story Block — Exclusive to Homepage */}
      <FounderStorySection />
    </div>
  );
}

function BrandCard({ b }) {
  const inner = (
    <div className="flex flex-col items-center gap-4 group cursor-pointer">
      <div className="w-36 h-36 rounded-full overflow-hidden border border-[#E6E0D6] group-hover:border-[#B8860B] transition-colors duration-300 bg-[#F3EFEA] flex items-center justify-center">
        {b.image ? (
          <img src={b.image} alt={b.name} className="w-full h-full object-cover"/>
        ) : (
          <span className="font-serif text-2xl tracking-wider text-[#1C1815]/60 group-hover:text-[#1C1815] transition-colors">{b.name[0]}</span>
        )}
      </div>
      <span className="font-serif text-lg text-[#1C1815]">{b.name}</span>
    </div>
  );
  if (b.link) return <Link to={b.link}>{inner}</Link>;
  return inner;
}

function EngravingPreviewSection() {
  const [sampleText, setSampleText] = useState("Aryan Kumar");
  const [activeFont, setActiveFont] = useState("script");

  const fontStyles = {
    script: { name: "Classic Script", fontClass: "font-serif italic", sample: "Aryan Kumar" },
    serif: { name: "Timeless Roman", fontClass: "font-serif tracking-[0.2em] uppercase font-medium", sample: "ARYAN KUMAR" },
    sans: { name: "Modern Minimalist", fontClass: "font-sans tracking-[0.25em] uppercase font-bold", sample: "ARYAN KUMAR" },
  };

  return (
    <section className="w-full bg-[#1C1815] text-[#FAF8F5] py-20 px-6 lg:px-12 my-12 overflow-hidden">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left Column: Interactive Engraving Showcase Preview */}
        <div className="relative aspect-[16/10] sm:aspect-[16/9] rounded-sm overflow-hidden bg-[#241F1B] border border-[#3D4838] shadow-2xl group">
          <img 
            src="/engraving-showcase.jpg" 
            alt="Craft Your Identity - Bespoke Engraving" 
            className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/90 via-[#1C1815]/40 to-transparent"/>
          
          {/* Live Dynamic Engraving Overlay Banner on Pen */}
          <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#1C1815]/85 backdrop-blur-md border border-[#B8860B]/40 rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="text-[9px] uppercase tracking-[0.25em] text-[#B8860B]">Simulated Studio Etching</p>
              <p className={`text-xl sm:text-2xl text-[#E6C687] drop-shadow-md mt-0.5 ${fontStyles[activeFont].fontClass}`}>
                {sampleText.trim() || "Your Name Here"}
              </p>
            </div>
            <span className="text-[10px] uppercase tracking-wider text-[#FAF8F5]/60 bg-[#FAF8F5]/10 px-2 py-1 rounded">
              {fontStyles[activeFont].name}
            </span>
          </div>
        </div>

        {/* Right Column: Information & Interactive Font Picker */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B]">03 / BESPOKE PERSONALIZATION</p>
            <h2 className="font-serif text-3xl sm:text-5xl text-[#FAF8F5] mt-2 leading-tight">
              Craft Your Identity.
            </h2>
            <p className="text-[#FAF8F5]/75 text-sm sm:text-base mt-4 leading-relaxed font-light">
              Every fine pen tells a story, but an engraved instrument immortalizes it. Our master nibsmiths in Panchkula precision-etch names, monograms, and landmark dates in your chosen calligraphy font.
            </p>
          </div>

          {/* Interactive Font Selector */}
          <div className="space-y-3 pt-2">
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#B8860B] font-medium">
              1. Choose a Calligraphy Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(fontStyles).map(([key, item]) => (
                <button
                  key={key}
                  onClick={() => setActiveFont(key)}
                  className={`p-3 text-center border transition-all rounded-sm ${
                    activeFont === key
                      ? "border-[#B8860B] bg-[#B8860B]/15 text-[#FAF8F5]"
                      : "border-[#3D4838] bg-[#FAF8F5]/5 text-[#FAF8F5]/70 hover:border-[#FAF8F5]/40"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-wider font-medium">{item.name}</p>
                  <p className={`text-xs mt-1 text-[#B8860B] ${item.fontClass}`}>Sample</p>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Live Name Tester */}
          <div className="space-y-2 pt-1">
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#B8860B] font-medium">
              2. Test Your Custom Inscription
            </label>
            <input
              type="text"
              value={sampleText}
              maxLength={24}
              onChange={(e) => setSampleText(e.target.value)}
              placeholder="Type your name or monogram…"
              className="w-full bg-[#FAF8F5]/10 border border-[#3D4838] px-4 py-3 text-base text-[#FAF8F5] outline-none placeholder:text-[#FAF8F5]/40 focus:border-[#B8860B] transition-colors rounded-sm"
            />
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <Link
              to="/shop"
              className="bg-[#B8860B] text-[#FAF8F5] px-8 py-3.5 rounded-full uppercase text-xs tracking-[0.2em] font-medium hover:bg-[#96700A] transition-all shadow-lg hover:shadow-xl"
            >
              Shop Engravable Pens &rarr;
            </Link>
            <a
              href="https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio%2C%20I%20would%20like%20to%20know%20more%20about%20bespoke%20pen%20engraving"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-[#FAF8F5]/70 hover:text-[#FAF8F5] border-b border-[#FAF8F5]/30 pb-1 transition-colors"
            >
              Enquire Custom Logo
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function FounderStorySection() {
  return (
    <section className="border-t border-[#E6E0D6] bg-[#FAF8F5] overflow-hidden" data-testid="founder-story-section">
      <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
        {/* Founder Photo Column */}
        <div className="lg:col-span-6 relative aspect-[16/10] lg:aspect-auto min-h-[340px] bg-[#EFE9DF] overflow-hidden">
          <img 
            src="/founder-placeholder.jpg" 
            alt="Manjeet Singh - Founder of The WL Pens" 
            className="w-full h-full object-cover object-center lg:object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1815]/60 via-transparent to-transparent lg:hidden"/>
          <div className="absolute bottom-4 left-6 text-[#FAF8F5] lg:hidden">
            <p className="font-serif text-xl font-medium">Manjeet Singh</p>
            <p className="text-xs text-[#FAF8F5]/80 uppercase tracking-widest">Founder &amp; Nibsmith</p>
          </div>
        </div>

        {/* Story Narrative Column */}
        <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-[#FAF8F5]">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold mb-3">
            PEOPLE OF THE WL PENS · FOUNDER'S NOTE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl text-[#1C1815] leading-tight mb-4">
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

          <div className="mt-6 pt-5 border-t border-[#E6E0D6] flex items-center justify-between">
            <div>
              <p className="font-serif text-lg sm:text-xl text-[#1C1815] font-medium">Manjeet Singh</p>
              <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-[#B8860B]">Founder &amp; Master Nibsmith</p>
            </div>
            <span className="font-serif italic text-xs sm:text-sm text-[#6E685E]">Panchkula Atelier</span>
          </div>
        </div>
      </div>
    </section>
  );
}


