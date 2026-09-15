import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { X, ChevronDown, SlidersHorizontal } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../components/ui/collapsible";

export default function Catalog() {
  const [sp, setSp] = useSearchParams();
  const category = sp.get("category") || "All";
  const q = sp.get("q") || "";
  const [sort, setSort] = useState(sp.get("sort") || "newest");
  const [brand, setBrand] = useState(sp.get("brand") || "");
  const [colour, setColour] = useState(sp.get("colour") || "");
  const [nibSize, setNibSize] = useState(sp.get("nibSize") || "");
  const [inStock, setInStock] = useState(sp.get("inStock") === "true" ? true : null);
  const [products, setProducts] = useState([]);
  const [facets, setFacets] = useState({ categories: [], brands: [], colours: [], nib_sizes: [], price_min: 0, price_max: 3000 });
  const [priceMax, setPriceMax] = useState(3000);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

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
    if (colour) params.colour = colour;
    if (nibSize) params.nib_size = nibSize;
    if (inStock !== null) params.in_stock = inStock;
    if (q) params.q = q;
    params.sort = sort;
    params.max_price = priceMax;
    api.get("/products", { params }).then((r) => { setProducts(r.data); setLoading(false); });
  }, [category, brand, colour, nibSize, inStock, q, sort, priceMax]);

  const activeFilters = useMemo(() => {
    const f = [];
    if (category !== "All") f.push({ label: category, clear: () => setSp((s) => { s.delete("category"); return s; }) });
    if (brand) f.push({ label: brand, clear: () => setBrand("") });
    if (q) f.push({ label: `"${q}"`, clear: () => setSp((s) => { s.delete("q"); return s; }) });
    return f;
  }, [category, brand, q, setSp]);

  const setCategory = (c) => setSp((s) => { if (c === "All") s.delete("category"); else s.set("category", c); return s; });

  const FilterContent = () => (
    <aside className="space-y-8" data-testid="filter-sidebar">
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Category <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          {["All", ...facets.categories].map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setFilterOpen(false); }}
              className={`block text-sm text-left w-full py-1 ${category === c ? "text-[#1C1815] font-medium border-l-2 border-[#B8860B] pl-3" : "text-[#6E685E] hover:text-[#1C1815] pl-3"}`}
            >
              {c}
            </button>
          ))}
        </CollapsibleContent>
      </Collapsible>
      
      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Availability <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={inStock === true} onChange={(e) => setInStock(e.target.checked ? true : null)} className="accent-[#3D4838]" />
            <span className="text-sm text-[#6E685E]">In Stock</span>
          </label>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Maker <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]">
            <option value="">All makers</option>
            {facets.brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Colour <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <select value={colour} onChange={(e) => setColour(e.target.value)} className="w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]">
            <option value="">All colours</option>
            {facets.colours.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Nib Size <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <select value={nibSize} onChange={(e) => setNibSize(e.target.value)} className="w-full bg-transparent border-b border-[#E6E0D6] py-2 text-sm text-[#1C1815] outline-none focus:border-[#3D4838]">
            <option value="">All sizes</option>
            {facets.nib_sizes.map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible defaultOpen>
        <CollapsibleTrigger className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">
          Price <ChevronDown size={14}/>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#1C1815] mb-4">Up to Rs {priceMax.toLocaleString("en-IN")}</p>
          <input type="range" min={facets.price_min} max={facets.price_max} value={priceMax}
            onChange={(e) => setPriceMax(parseFloat(e.target.value))} className="w-full accent-[#3D4838]"
          />
        </CollapsibleContent>
      </Collapsible>
    </aside>
  );

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-16 pb-8 border-b border-[#E6E0D6]">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">THE ATELIER</p>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-[#1C1815] mt-3">
          {category === "All" ? <>The full <em className="text-[#3D4838]">collection.</em></> : <>{category}.</>}
        </h1>
        <p className="mt-4 text-[#6E685E] max-w-xl">{products.length} instruments · curated by hand.</p>
      </section>

      {/* Mobile filter toggle bar */}
      <div className="lg:hidden max-w-[1600px] mx-auto px-6 py-4 border-b border-[#E6E0D6] flex items-center justify-between">
        <button
          onClick={() => setFilterOpen(true)}
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#1C1815] border border-[#E6E0D6] px-4 py-2 hover:border-[#3D4838] transition-colors"
          data-testid="mobile-filter-btn"
        >
          <SlidersHorizontal size={14}/> Filters
          {activeFilters.length > 0 && <span className="bg-[#B8860B] text-[#FAF8F5] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{activeFilters.length}</span>}
        </button>
        <div className="flex items-center gap-3">
          <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Sort</label>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-b border-[#E6E0D6] text-sm py-1 text-[#1C1815] outline-none" data-testid="sort-select">
            <option value="newest">Newest</option>
            <option value="price-asc">Price · low to high</option>
            <option value="price-desc">Price · high to low</option>
          </select>
        </div>
      </div>

      {/* Mobile filter overlay */}
      {filterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" onClick={() => setFilterOpen(false)}>
          <div className="absolute inset-0 bg-[#1C1815]/40 backdrop-blur-sm"/>
          <div className="relative w-4/5 max-w-[320px] bg-[#FAF8F5] h-full overflow-y-auto p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">Filters</p>
              <button onClick={() => setFilterOpen(false)} className="text-[#1C1815]"><X size={20}/></button>
            </div>
            <FilterContent/>
          </div>
        </div>
      )}

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <FilterContent/>
        </div>

        <main>
          <div className="flex flex-wrap gap-3 items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((f, i) => (
                <button key={i} onClick={f.clear} className="inline-flex items-center gap-2 border border-[#E6E0D6] px-3 py-1.5 text-xs text-[#1C1815] hover:border-[#3D4838]" data-testid={`active-filter-${i}`}>
                  {f.label} <X size={12}/>
                </button>
              ))}
            </div>
            <div className="hidden lg:flex items-center gap-3">
              <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Sort</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className="bg-transparent border-b border-[#E6E0D6] text-sm py-1 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="sort-select-desktop">
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
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-8 lg:gap-10" data-testid="catalog-grid">
              {products.map((p) => <ProductCard key={p.id} p={p}/>)}
            </div>
          )}
        </main>
      </section>
    </div>
  );
}

