import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Award } from "lucide-react";
import { motion } from "framer-motion";
import HorizontalFlowBars from "../components/ui/demo";

export default function BestSellers() {
  const [sp, setSp] = useSearchParams();
  const category = sp.get("category") || "All";
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [brand, setBrand] = useState(sp.get("brand") || "");
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({ categories: [], brands: [], price_min: 0, price_max: 3000 });
  const [priceMax, setPriceMax] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/facets").then((r) => {
      setFacets(r.data);
      if (r.data?.price_max) setPriceMax(r.data.price_max);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { best_seller: true, sort, max_price: priceMax };
    if (category !== "All") params.category = category;
    if (brand) params.brand = brand;

    api.get("/products", { params })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        if (list.length === 0 && !brand && category === "All") {
          // If no specific items flagged best_seller, load featured or top products
          api.get("/products", { params: { featured: true, limit: 20 } }).then((res) => {
            const fallback = Array.isArray(res.data) ? res.data : [];
            if (fallback.length === 0) {
              api.get("/products", { params: { limit: 20 } }).then((allRes) => {
                setProducts(Array.isArray(allRes.data) ? allRes.data : []);
                setLoading(false);
              });
            } else {
              setProducts(fallback);
              setLoading(false);
            }
          });
        } else {
          setProducts(list);
          setLoading(false);
        }
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [category, brand, sort, priceMax]);

  const setCategory = (c) => setSp((s) => {
    if (c === "All") s.delete("category");
    else s.set("category", c);
    return s;
  });

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      {/* Editorial Hero Banner */}
      <section className="relative border-b border-[#E6E0D6] bg-[#F3EFEA] overflow-hidden">
        <HorizontalFlowBars
          backgroundColor="#F3EFEA"
          lineColor="#E6E0D6"
          barColor="#B8860B"
          lineWidth={1}
          animationSpeed={0.0006}
          removeWaveLine={false}
          className="opacity-50"
        />
        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24 pointer-events-none">
          <div className="pointer-events-auto">
            <div className="flex items-center gap-2 text-[#B8860B] text-[11px] uppercase tracking-[0.3em] mb-4">
              <Award size={14}/>
              <span>HALLMARK SELECTION</span>
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-[#1C1815] leading-[1.05] max-w-3xl">
              Best sellers, <em className="text-[#3D4838] font-normal">revered &amp; celebrated.</em>
            </h1>
            <p className="mt-6 text-sm sm:text-base text-[#6E685E] max-w-xl leading-relaxed">
              The instruments most chosen by calligraphers, architects, and collectors. Hand-finished nibs, balanced weight distribution, and timeless materials.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="text-xs uppercase tracking-[0.2em] bg-[#1C1815] text-[#FAF8F5] px-3.5 py-1.5 font-medium">
                {products.length} Coveted Editions
              </span>
              <span className="text-xs uppercase tracking-[0.2em] text-[#3D4838] border border-[#3D4838]/40 px-3.5 py-1.5">
                Complimentary Studio Engraving
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
        {/* Filter Sidebar */}
        <aside className="space-y-8" data-testid="best-sellers-filter-sidebar">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4 font-semibold">Category</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCategory("All")}
                className={`text-left text-xs uppercase tracking-[0.15em] py-1.5 transition-colors ${category === "All" ? "font-semibold text-[#B8860B] border-l-2 border-[#B8860B] pl-2.5" : "text-[#6E685E] hover:text-[#1C1815] pl-2.5"}`}
              >
                All Best Sellers
              </button>
              {facets.categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`text-left text-xs uppercase tracking-[0.15em] py-1.5 transition-colors ${category === c ? "font-semibold text-[#B8860B] border-l-2 border-[#B8860B] pl-2.5" : "text-[#6E685E] hover:text-[#1C1815] pl-2.5"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {facets.brands?.length > 0 && (
            <div className="border-t border-[#E6E0D6] pt-6">
              <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4 font-semibold">Brand</h3>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setBrand("")}
                  className={`text-left text-xs uppercase tracking-[0.15em] py-1 transition-colors ${brand === "" ? "font-semibold text-[#B8860B]" : "text-[#6E685E] hover:text-[#1C1815]"}`}
                >
                  All Brands
                </button>
                {facets.brands.map((b) => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`text-left text-xs uppercase tracking-[0.15em] py-1 transition-colors ${brand === b ? "font-semibold text-[#B8860B]" : "text-[#6E685E] hover:text-[#1C1815]"}`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-[#E6E0D6] pt-6">
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-3 font-semibold">Max Price</h3>
            <p className="text-xs text-[#6E685E] mb-2 font-mono">Up to Rs {priceMax.toLocaleString("en-IN")}</p>
            <input
              type="range"
              min={facets.price_min || 0}
              max={facets.price_max || 3000}
              step={50}
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-[#3D4838] cursor-pointer"
            />
          </div>
        </aside>

        {/* Product Grid */}
        <div>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E6E0D6]">
            <p className="text-xs text-[#6E685E]">
              Showing <span className="text-[#1C1815] font-semibold">{products.length}</span> best selling instruments
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Sort By:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border-b border-[#E6E0D6] pb-1 text-xs uppercase tracking-[0.1em] text-[#1C1815] outline-none focus:border-[#3D4838]"
              >
                <option value="newest">Featured First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="aspect-[4/5] bg-[#F3EFEA]" />
                  <div className="h-4 bg-[#F3EFEA] w-2/3" />
                  <div className="h-3 bg-[#F3EFEA] w-1/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center">
              <p className="font-serif text-2xl text-[#1C1815]">No best sellers found with current filters.</p>
              <button
                onClick={() => { setCategory("All"); setBrand(""); }}
                className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8860B] border-b border-[#B8860B] pb-1"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
            >
              {products.map((p) => (
                <motion.div
                  key={p.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.5, ease: [0.22, 0.9, 0.3, 1] }}
                >
                  <ProductCard p={p} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}
