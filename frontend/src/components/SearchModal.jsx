import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Clock, ArrowRight } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";

const RECENT_KEY = "atelier_recent_searches";
const MAX_RECENT = 6;

export default function SearchModal({ open, onClose }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recent, setRecent] = useState(() => {
    try { return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]"); } catch { return []; }
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 60);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQ(""); setResults([]);
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const term = q.trim();
    if (term.length < 2) { setResults([]); return; }
    setLoading(true);
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const r = await api.get("/products", { params: { q: term, limit: 8 }, signal: ctrl.signal });
        setResults(r.data);
      } catch { /* aborted */ }
      finally { setLoading(false); }
    }, 220);
    return () => { clearTimeout(t); ctrl.abort(); };
  }, [q, open]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape" && open) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const commitRecent = (term) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...recent.filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX_RECENT);
    setRecent(next);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  };

  const clearRecent = () => { setRecent([]); localStorage.removeItem(RECENT_KEY); };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] bg-[#FAF8F5]" data-testid="search-modal">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-6 pb-4 flex items-center gap-4 border-b border-[#E6E0D6]">
        <Search size={22} className="text-[#6E685E]"/>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { commitRecent(q); onClose(); } }}
          placeholder="Search pens, brands, materials…"
          className="flex-1 bg-transparent text-2xl lg:text-3xl font-serif text-[#1C1815] outline-none placeholder:text-[#6E685E]/50"
          data-testid="search-input"
        />
        <button onClick={onClose} className="text-[#1C1815] hover:text-[#3D4838]" data-testid="close-search-btn">
          <X size={22}/>
        </button>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 overflow-y-auto h-[calc(100vh-88px)]">
        {q.trim().length < 2 ? (
          <div>
            {recent.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">Recent searches</p>
                  <button onClick={clearRecent} className="text-xs uppercase tracking-[0.15em] text-[#6E685E] hover:text-[#1C1815]" data-testid="clear-recent-btn">Clear</button>
                </div>
                <div className="flex flex-wrap gap-2" data-testid="recent-searches">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQ(r)}
                      className="inline-flex items-center gap-2 border border-[#E6E0D6] px-4 py-2 text-sm text-[#1C1815] hover:border-[#3D4838] hover:bg-[#F3EFEA]"
                      data-testid={`recent-${r.toLowerCase().replaceAll(' ', '-')}`}
                    >
                      <Clock size={12}/> {r}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <p className="font-serif italic text-2xl text-[#6E685E]">Start typing to explore the atelier.</p>
            )}
            <p className="mt-10 text-[10px] uppercase tracking-[0.25em] text-[#B8860B] mb-3">Popular</p>
            <div className="flex flex-wrap gap-2">
              {["Fountain", "Rollerball", "Gold nib", "Limited"].map((t) => (
                <button key={t} onClick={() => setQ(t)} className="border border-[#E6E0D6] px-4 py-2 text-sm text-[#1C1815] hover:border-[#3D4838]" data-testid={`popular-${t.toLowerCase().replaceAll(' ', '-')}`}>{t}</button>
              ))}
            </div>
          </div>
        ) : loading ? (
          <p className="text-[#6E685E]" data-testid="search-loading">Searching the atelier…</p>
        ) : results.length === 0 ? (
          <p className="font-serif italic text-2xl text-[#6E685E]" data-testid="search-no-results">No matches for "{q}". Try broader words.</p>
        ) : (
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] mb-4">{results.length} result{results.length === 1 ? "" : "s"}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4" data-testid="search-results">
              {results.map((p) => {
                const price = p.discount_price || p.price;
                return (
                  <Link
                    key={p.id}
                    to={`/product/${p.id}`}
                    onClick={() => { commitRecent(q); onClose(); }}
                    className="group flex gap-5 border border-transparent hover:border-[#E6E0D6] hover:bg-[#F3EFEA]/50 p-3 transition-colors"
                    data-testid={`search-result-${p.id}`}
                  >
                    <div className="w-24 h-28 bg-[#F3EFEA] overflow-hidden flex-shrink-0">
                      {p.images?.[0] && <img src={fileUrl(p.images[0])} alt="" className="w-full h-full object-cover"/>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">{p.brand} · {p.category}</p>
                        <h3 className="font-serif text-xl text-[#1C1815] mt-1 leading-tight">{p.name}</h3>
                        <p className="text-xs text-[#6E685E] mt-1 line-clamp-2">{p.description}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="font-medium text-[#1C1815]">{money(price)}</span>
                        <ArrowRight size={14} className="text-[#6E685E] group-hover:text-[#3D4838] group-hover:translate-x-1 transition-transform"/>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
