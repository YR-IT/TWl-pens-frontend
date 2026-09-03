import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";

const HERO_IMG = "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1600";
const EDITORIAL_1 = "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const EDITORIAL_2 = "https://images.unsplash.com/photo-1473186505569-9c61870c11f9?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const CATS = [
  { name: "Fountain Pens", tag: "01", note: "Gold nibs, brass barrels" },
  { name: "Rollerball", tag: "02", note: "Ink-flow smooth" },
  { name: "Ballpoint", tag: "03", note: "Everyday companions" },
  { name: "Inks", tag: "04", note: "Bottled colour" },
  { name: "Limited Editions", tag: "05", note: "Numbered · rare" },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    api.get("/products", { params: { featured: true, limit: 6 } }).then((r) => setFeatured(r.data));
  }, []);

  return (
    <div className="pt-[76px]">
      {/* Hero */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 lg:pt-24 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#B8860B] mb-6" data-testid="hero-eyebrow">ATELIER · SS/26 ARRIVALS</p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl xl:text-[92px] leading-[0.98] tracking-tight text-[#1C1815]">
            The quiet<br/>art of<br/><em className="text-[#3D4838]">writing</em> well.
          </h1>
          <p className="mt-8 max-w-lg text-[#6E685E] leading-relaxed">
            A curated atelier of fountain pens, rollerballs and inks — sourced from
            Turin, Copenhagen and Kyoto. Numbered, hand-inked, and shipped in walnut.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/shop" className="inline-flex items-center gap-3 bg-[#1C1815] text-[#FAF8F5] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] transition-colors" data-testid="hero-cta-shop">
              Enter the atelier <ArrowRight size={14}/>
            </Link>
            <Link to="/shop?category=Limited%20Editions" className="inline-flex items-center gap-3 border border-[#1C1815] text-[#1C1815] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors" data-testid="hero-cta-limited">
              Limited editions
            </Link>
          </div>
        </div>
        <div className="lg:col-span-5 order-1 lg:order-2 relative">
          <div className="aspect-[4/5] overflow-hidden bg-[#F3EFEA]">
            <img src={HERO_IMG} alt="Fountain pen resting on paper" className="w-full h-full object-cover"/>
          </div>
          <div className="absolute -bottom-8 -left-8 w-28 h-28 lg:w-40 lg:h-40 border border-[#E6E0D6] bg-[#FAF8F5] flex flex-col justify-center items-center text-center">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">EST</p>
            <p className="font-serif text-3xl lg:text-4xl text-[#1C1815]">2019</p>
          </div>
        </div>
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
            {CATS.map((c) => (
              <Link key={c.name} to={`/shop?category=${encodeURIComponent(c.name)}`} className="group border border-[#E6E0D6] bg-[#FAF8F5] p-6 hover:border-[#3D4838] transition-colors" data-testid={`category-tile-${c.name.toLowerCase().replaceAll(' ', '-')}`}>
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">{c.tag}</p>
                <h3 className="font-serif text-xl text-[#1C1815] mt-3">{c.name}</h3>
                <p className="text-xs text-[#6E685E] mt-1">{c.note}</p>
                <ArrowRight size={16} className="mt-6 text-[#6E685E] group-hover:text-[#3D4838] transition-transform group-hover:translate-x-1"/>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-20">
        <div className="flex items-end justify-between border-b border-[#E6E0D6] pb-8 mb-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">02 / IN HAND</p>
            <h2 className="font-serif text-3xl lg:text-5xl text-[#1C1815] mt-2">New arrivals.</h2>
          </div>
          <Link to="/shop" className="text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1" data-testid="view-all-products">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {featured.map((p) => <ProductCard key={p.id} p={p}/>)}
        </div>
      </section>

      {/* Editorial spread */}
      <section className="bg-[#1C1815] text-[#FAF8F5]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="grid grid-cols-2 gap-4">
            <img src={EDITORIAL_1} alt="Editorial detail" className="aspect-[3/4] object-cover"/>
            <img src={EDITORIAL_2} alt="Nib detail" className="aspect-[3/4] object-cover mt-12"/>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">03 / CRAFT</p>
            <h2 className="font-serif text-4xl lg:text-5xl mt-3 leading-[1.1]">
              Every nib is hand-tuned,<br/>every barrel is<br/><em className="text-[#B8860B]">signed.</em>
            </h2>
            <p className="mt-6 text-[#FAF8F5]/70 leading-relaxed max-w-md">
              We work with fewer than a dozen makers worldwide — small studios who
              still measure tolerances by hand and etch their initials into the cap.
            </p>
            <Link to="/shop" className="inline-flex mt-8 items-center gap-3 border border-[#FAF8F5] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#FAF8F5] hover:text-[#1C1815] transition-colors" data-testid="craft-cta">
              Meet the makers <ArrowRight size={14}/>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
