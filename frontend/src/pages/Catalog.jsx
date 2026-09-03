import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { X } from "lucide-react";

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const category = sp.get("category") || "All";
  const q = sp.get("q") || "";
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [brand, setBrand] = useState(sp.get("brand") || "");
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({ categories: [], brands: [], price_min: 0, price_max: 3000 });
  const [priceMax, setPriceMax] = useState(3000);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/products/facets").then((r) => {
      setFacets(r.data);
      setPriceMax(r.data.price_max);
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (category !== "All") params.category = category;
    if (brand) params.brand = brand;
    if (q) params.q = q;
    params.sort = sort;
    params.max_price = priceMax;
    api.get("/products", { params }).then((r) => { setProducts(r.data); setLoading(false); });
  }, [category, brand, q, sort, priceMax]);

  const activeFilters = useMemo(() => {
    const f = [];
    if (category !== "All") f.push({ label: category, clear: () => setSp((s) => { s.delete("category"); return s; }) });
    if (brand) f.push({ label: brand, clear: () => setBrand("") });
    if (q) f.push({ label: `"${q}"`, clear: () => setSp((s) => { s.delete("q"); return s; }) });
    return f;
  }, [category, brand, q, setSp]);

  const setCategory = (c) => setSp((s) => { if (c === "All") s.delete("category"); else s.set("category", c); return s; });

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 pb-8 border-b border-[#E6E0D6]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">THE ATELIER</p>
        <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1815] mt-3">
          {category === "All" ? <>The full <em className="text-[#3D4838]">collection.</em></> : <>{category}.</>}
        </h1>
        <p className="mt-4 text-[#6E685E] max-w-xl">{products.length} instruments · curated by hand.</p>
      </section>

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        <aside className="space-y-8" data-testid="filter-sidebar">
          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">Category</h3>
            <div className="space-y-2">
              {["All", ...facets.categories].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`block text-sm text-left w-full py-1 ${category === c ? "text-[#1C1815] font-medium border-l-2 border-[#B8860B] pl-3" : "text-[#6E685E] hover:text-[#1C1815] pl-3"}`}
                  data-testid={`filter-category-${c.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">Maker</h3>
            <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="filter-brand-select">
              <option value="">All makers</option>
              {facets.brands.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">Price · up to Rs {priceMax.toLocaleString("en-IN")}</h3>
            <input
              type="range"
              min={facets.price_min}
              max={facets.price_max}
              value={priceMax}
              onChange={(e) => setPriceMax(parseFloat(e.target.value))}
              className="w-full accent-[#3D4838]"
              data-testid="filter-price-range"
            />
            <div className="flex justify-between text-[10px] text-[#6E685E] mt-2">
              <span>Rs {facets.price_min.toLocaleString("en-IN")}</span>
              <span>Rs {facets.price_max.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </aside>

        <main>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((f, i) => (
                <button key={i} onClick={f.clear} className="inline-flex items-center gap-2 border border-[#E6E0D6] px-3 py-1.5 text-xs text-[#1C1815] hover:border-[#3D4838]" data-testid={`active-filter-${i}`}>
                  {f.label} <X size={12}/>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-b border-[#E6E0D6] text-sm py-1 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="sort-select">
                <option value="newest">Newest</option>
                <option value="price-asc">Price · low to high</option>
                <option value="price-desc">Price · high to low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-[#6E685E]" data-testid="catalog-loading">Loading atelier…</div>
          ) : products.length === 0 ? (
            <div className="text-center py-24 border border-dashed border-[#E6E0D6]" data-testid="catalog-empty">
              <p className="font-serif italic text-2xl text-[#6E685E]">Nothing matches quite yet.</p>
              <p className="text-sm text-[#6E685E] mt-2">Try widening your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10" data-testid="catalog-grid">
              {products.map((p) => <ProductCard key={p.id} p={p}/>)}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}
