import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Instagram } from "lucide-react";
import { motion } from "framer-motion";
import { api, fileUrl } from "../lib/api";
import { useCategories } from "../lib/categories";
import { SITE } from "../lib/site";
import ProductCard from "../components/ProductCard";
import VerticalBarsNoise from "../components/ui/vertical-bars";
import NewArrivalsTicker from "../components/NewArrivalsTicker";

const HERO_IMG = "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const EDITORIAL_1 = "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const EDITORIAL_2 = "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [studio, setStudio] = useState([]);
  const [banner, setBanner] = useState(null);
  const cats = useCategories();

  useEffect(() => {
    api.get("/site/banner")
      .then((r) => setBanner(r.data))
      .catch(() => setBanner(null));
    api.get("/products", { params: { featured: true, limit: 6 } })
      .then((r) => setFeatured(Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.products) ? r.data.products : [])))
      .catch(() => setFeatured([]));
    api.get("/studio-posts", { params: { limit: 6 } })
      .then((r) => setStudio(Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.posts) ? r.data.posts : [])))
      .catch(() => setStudio([]));
  }, []);

  const safeCats = Array.isArray(cats) ? cats : [];
  const safeFeatured = Array.isArray(featured) ? featured : [];
  const safeStudio = Array.isArray(studio) ? studio : [];

  const heroImage = banner?.image ? fileUrl(banner.image) : HERO_IMG;
  const eyebrow = banner?.eyebrow || `${SITE.brand.toUpperCase()} · SS/26 ARRIVALS`;
  const title = banner?.title || "The quiet art of writing well.";
  const subtitle = banner?.subtitle || `${SITE.brand} — a small studio of writing instruments in the shadow of the Shivaliks. Hand-selected pens and inks, engraved to order, delivered in cotton pouches.`;
  const ctaText = banner?.cta_text || "Enter the atelier";
  const ctaLink = banner?.cta_link || "/shop";
  const secondaryCtaText = banner?.secondary_cta_text || "New Arrivals";
  const secondaryCtaLink = banner?.secondary_cta_link || "/new-arrivals";

  return (
    <div className="pt-[76px]">
      {/* Hero / Banner */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.35em] text-[#B8860B] mb-6" data-testid="hero-eyebrow">
            {eyebrow}
          </motion.p>
          <motion.h1
            initial="hidden" animate="show"
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } } }}
            className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[92px] leading-[0.98] tracking-tight text-[#1C1815]"
          >
            {title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 max-w-lg text-[#6E685E] leading-relaxed"
          >
            {subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <Link to={ctaLink} className="group inline-flex items-center gap-3 bg-[#1C1815] text-[#FAF8F5] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] transition-colors active:scale-[0.98]" data-testid="hero-cta-shop">
              {ctaText} <ArrowRight size={14} className="transition-transform group-hover:translate-x-1"/>
            </Link>
            <Link to={secondaryCtaLink} className="inline-flex items-center gap-3 border border-[#1C1815] text-[#1C1815] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors active:scale-[0.98]" data-testid="hero-cta-limited">
              {secondaryCtaText}
            </Link>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.2, ease: [0.22, 0.9, 0.3, 1], delay: 0.3 }}
          className="lg:col-span-5 order-1 lg:order-2 relative"
        >
          <div className="aspect-[4/5] overflow-hidden bg-[#F3EFEA]">
            <img src={heroImage} alt="The WL Pens Hero Banner" className="w-full h-full object-cover"/>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ duration: 0.7, delay: 1.1 }}
            className="absolute -bottom-8 -left-8 w-28 h-28 lg:w-40 lg:h-40 border border-[#E6E0D6] bg-[#FAF8F5] flex flex-col justify-center items-center text-center"
          >
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">EST</p>
            <p className="font-serif text-3xl lg:text-4xl text-[#1C1815]">2019</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories strip */}
      <section className="border-y border-[#E6E0D6] bg-[#F3EFEA]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-14">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">01 / CURATED</p>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">By discipline.</h2>
            </div>
            <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1" data-testid="all-categories-link">All categories <ArrowRight size={14}/></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {safeCats.slice(0, 5).map((c, i) => (
              <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`} className="group border border-[#E6E0D6] bg-[#FAF8F5] p-6 hover:border-[#3D4838] transition-colors" data-testid={`category-tile-${c.name.toLowerCase().replaceAll(' ', '-')}`}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="font-serif text-xl text-[#1C1815] mt-3">{c.name}</h3>
                <ArrowRight size={16} className="mt-6 text-[#6E685E] group-hover:text-[#3D4838] transition-transform group-hover:translate-x-1"/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Continuous Motion Strip of New Arrival */}
      <NewArrivalsTicker variant="dark" />

      {/* Featured products */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">02 / IN HAND</p>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">New arrivals.</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1" data-testid="view-all-products">View all</Link>
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

      {/* Studio feed — instagram-style grid */}
      <section className="border-t border-[#E6E0D6] bg-[#F3EFEA]/60">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
          <div className="flex items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">03 / FROM THE STUDIO</p>
              <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">New arrivals, live from the desk.</h2>
              <p className="mt-2 text-sm text-[#6E685E] max-w-lg">Fresh nib videos, first inks of the season, and the odd wedding order — straight from our Panchkula studio.</p>
            </div>
            <a href="https://instagram.com/thewlpens" target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1" data-testid="instagram-follow-link">
              <Instagram size={14}/> @thewlpens
            </a>
          </div>
          {safeStudio.length === 0 ? (
            <p className="text-[#6E685E] text-sm">The studio feed is coming to life…</p>
          ) : (
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06 } } }}
              data-testid="studio-grid"
            >
              {safeStudio.slice(0, 6).map((post, i) => (
                <motion.a
                  key={post.id}
                  href={post.link || "https://instagram.com/thewlpens"}
                  target="_blank"
                  rel="noopener noreferrer"
                  variants={{ hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 0.9, 0.3, 1] } } }}
                  whileHover={{ y: -3 }}
                  className="group relative block aspect-square overflow-hidden bg-[#F3EFEA]"
                  data-testid={`studio-tile-${i}`}
                >
                  <img src={fileUrl(post.image)} alt={post.caption || `Studio post ${i + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"/>
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1C1815]/70 opacity-0 group-hover:opacity-100 transition-opacity"/>
                  <div className="absolute inset-x-4 bottom-4 text-[#FAF8F5] opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-[#B8860B] flex items-center gap-1.5">
                      <Instagram size={12}/> @thewlpens
                    </p>
                    <p className="font-serif italic text-base sm:text-lg leading-tight mt-1 line-clamp-2">{post.caption || "See on Instagram"}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Editorial spread with Generative Ink Noise Canvas */}
      <section className="relative bg-[#1C1815] text-[#FAF8F5] overflow-hidden">
        <VerticalBarsNoise
          backgroundColor="#1C1815"
          lineColor="#2E2822"
          barColor="#B8860B"
          lineWidth={1}
          animationSpeed={0.0005}
          removeWaveLine={false}
          className="opacity-35 pointer-events-auto"
        />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pointer-events-none">
          <div className="grid grid-cols-2 gap-4 pointer-events-auto">
            <img src={EDITORIAL_1} alt="Editorial detail" className="aspect-[3/4] object-cover shadow-2xl"/>
            <img src={EDITORIAL_2} alt="Nib detail" className="aspect-[3/4] object-cover mt-12 shadow-2xl"/>
          </div>
          <div className="pointer-events-auto">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="craft-eyebrow">04 / CRAFT &amp; ENGRAVING</p>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.1]">
              Every nib is hand-tuned,<br/>every barrel is<br/><em className="text-[#B8860B]">signed.</em>
            </h2>
            <p className="mt-6 text-[#FAF8F5]/70 leading-relaxed max-w-md">
              Add up to 20 characters of engraving to any eligible pen — a name, a date,
              a line of a favourite poem. Etched by our studio in Panchkula.
            </p>
            <Link to="/shop" className="inline-flex mt-8 items-center gap-3 border border-[#FAF8F5] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#FAF8F5] hover:text-[#1C1815] transition-colors" data-testid="craft-cta">
              Start engraving <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
