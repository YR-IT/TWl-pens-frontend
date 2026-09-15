import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Gift } from "lucide-react";
import { motion } from "framer-motion";
import { api, fileUrl } from "../lib/api";
import { useCategories } from "../lib/categories";
import { SITE } from "../lib/site";
import ProductCard from "../components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

const HERO_IMG = "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const EDITORIAL_1 = "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const EDITORIAL_2 = "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const GIFT_IMG = "/Gifting Banner.jpg";

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

  const safeCats = Array.isArray(cats) ? cats : [];
  const safeFeatured = Array.isArray(featured) ? featured : [];
  const safeNewArrivals = Array.isArray(newArrivals) ? newArrivals : [];

  const heroImage = banner?.image ? fileUrl(banner.image) : HERO_IMG;
  const eyebrow = banner?.eyebrow || `${SITE.brand.toUpperCase()} · SS/26 ARRIVALS`;
  const title = banner?.title || "The quiet art of writing well.";
  const subtitle = banner?.subtitle || `${SITE.brand} — a small studio of writing instruments in the shadow of the Shivaliks.`;
  const ctaText = banner?.cta_text || "Enter the atelier";
  const ctaLink = banner?.cta_link || "/shop";
  const secondaryCtaText = banner?.secondary_cta_text || "New Arrivals";
  const secondaryCtaLink = banner?.secondary_cta_link || "/new-arrivals";

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
    <div className="pt-[112px]">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] overflow-hidden">
        <img src={heroImage} alt="Hero" className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-[#1C1815]/20"/>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
          <h1 className="font-serif text-6xl lg:text-8xl text-[#FAF8F5] leading-tight">The Eternal Quill</h1>
          <p className="text-[#FAF8F5] text-lg lg:text-xl font-serif italic mt-4">Discover the art of writing.</p>
          <Link to="/shop" className="mt-8 bg-[#FAF8F5] text-[#1C1815] px-10 py-3 rounded-full uppercase tracking-widest text-xs hover:bg-[#E6E0D6] transition-colors">SHOP NOW</Link>
        </div>
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
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
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
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
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
      <section className="relative overflow-hidden mx-6 lg:mx-12 mb-20" style={{ height: "500px" }}>
        <img src={GIFT_IMG} alt="Gift giving" className="absolute inset-0 w-full h-full object-cover object-center"/>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C1815]/85 via-[#1C1815]/55 to-transparent"/>
        <div className="absolute inset-0 flex flex-col justify-center px-12 lg:px-24">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[#B8860B] mb-4">
              <Gift size={12}/> Gifting
            </span>
            <h2 className="font-serif text-4xl lg:text-6xl text-[#FAF8F5] leading-tight">
              The perfect gift,<br/><em>perfectly engraved.</em>
            </h2>
            <p className="text-[#FAF8F5]/75 text-sm mt-4 leading-relaxed max-w-sm">
              Complimentary bespoke studio engraving on every order. Delivered in a hand-stitched cotton pouch with a wax-sealed note.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/shop" className="bg-[#B8860B] text-[#FAF8F5] px-8 py-3 rounded-full uppercase text-xs tracking-widest hover:bg-[#96700A] transition-colors">
                Shop Gifts
              </Link>
              <Link to="/contact" className="border border-[#FAF8F5]/50 text-[#FAF8F5] px-8 py-3 rounded-full uppercase text-xs tracking-widest hover:border-[#FAF8F5] transition-colors">
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
