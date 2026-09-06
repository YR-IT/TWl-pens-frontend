import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { Sparkles, ArrowRight, SlidersHorizontal, X } from "lucide-react";
import { motion } from "framer-motion";

export default function NewArrivals() {
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
    const params = { new_arrival: true, sort, max_price: priceMax };
    if (category !== "All") params.category = category;
    if (brand) params.brand = brand;

    api.get("/products", { params })
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : [];
        if (list.length === 0 && !brand && category === "All") {
          // If no specific items flagged new_arrival, load newest sorted
          api.get("/products", { params: { sort: "newest", limit: 20 } }).then((res) => {
            setProducts(Array.isArray(res.data) ? res.data : []);
            setLoading(false);
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
      <section className="border-b border-[#E6E0D6] bg-gradient-to-b from-[#F3EFEA] to-[#FAF8F5]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 lg:py-24">
          <div className="flex items-center gap-2 text-[#B8860B] text-[11px] uppercase tracking-[0.3em] mb-4">
            <Sparkles size={14}/>
            <span>SS/26 ATELIER COLLECTION</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl text-[#1C1815] leading-[1.05] max-w-3xl">
            New arrivals, <em className="text-[#3D4838] font-normal">hand-tuned &amp; fresh.</em>
          </h1>
          <p className="mt-6 text-sm sm:text-base text-[#6E685E] max-w-xl leading-relaxed">
            The newest writing instruments to enter our studio. Each pen is tested on fine vellum, numbered, and ready to be personalized with custom engraving.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-xs uppercase tracking-[0.2em] bg-[#1C1815] text-[#FAF8F5] px-3.5 py-1.5 font-medium">
              {products.length} New Editions
            </span>
            <span className="text-xs uppercase tracking-[0.2em] text-[#3D4838] border border-[#3D4838]/40 px-3.5 py-1.5">
              Available for Engraving
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
        {/* Filter Sidebar */}
        <aside className="space-y-8" data-testid="new-arrivals-filter-sidebar">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4 font-semibold">Category</h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setCategory("All")}
                className={`text-left text-xs uppercase tracking-[0.15em] py-1.5 transition-colors ${category === "All" ? "font-semibold text-[#B8860B] border-l-2 border-[#B8860B] pl-2.5" : "text-[#6E685E] hover:text-[#1C1815] pl-2.5"}`}
              >
                All Arrivals
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
            <p className="text-xs uppercase tracking-[0.2em] text-[#6E685E]">
              Showing <span className="font-semibold text-[#1C1815]">{products.length}</span> instruments
            </p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Sort by:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="bg-transparent border border-[#E6E0D6] px-3 py-1.5 text-xs text-[#1C1815] uppercase tracking-[0.15em] outline-none focus:border-[#3D4838]"
                data-testid="new-arrivals-sort"
              >
                <option value="newest">Newest First</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center text-[#6E685E] text-xs uppercase tracking-[0.2em]">
              Gathering new arrivals…
            </div>
          ) : products.length === 0 ? (
            <div className="p-16 border border-dashed border-[#E6E0D6] text-center" data-testid="no-new-arrivals">
              <p className="font-serif text-2xl text-[#1C1815]">No new arrivals matching your filters.</p>
              <p className="text-sm text-[#6E685E] mt-2">Try clearing category or brand filters to see more.</p>
              <Link to="/shop" className="inline-flex items-center gap-2 mt-6 bg-[#1C1815] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors">
                View All Catalog <ArrowRight size={14}/>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" data-testid="new-arrivals-grid">
              {products.map((p) => (
                <div key={p.id} className="relative group">
                  <div className="absolute top-3 left-3 z-10 bg-[#B8860B] text-[#FAF8F5] px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold pointer-events-none shadow-sm">
                    New Arrival
                  </div>
                  <ProductCard p={p} product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
