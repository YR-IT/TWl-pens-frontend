import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ChevronLeft, Expand } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";
import { useCart } from "../lib/cart";
import { toast } from "sonner";
import WishlistButton from "../components/WishlistButton";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [engraving, setEngraving] = useState("");
  const [lightbox, setLightbox] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => { setP(r.data); setActive(0); });
  }, [id]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!p) return <div className="pt-[76px] p-12 text-center text-[#6E685E]" data-testid="product-loading">Loading…</div>;

  const hasDiscount = !!p.discount_price;
  const price = hasDiscount ? p.discount_price : p.price;
  const off = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
  const images = p.images?.length ? p.images : [];
  const current = images[active];

  return (
    <div className="pt-[76px] bg-[#FAF8F5]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815]" data-testid="back-to-catalog">
          <ChevronLeft size={14}/> Back to catalog
        </Link>
      </div>

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <ZoomImage src={current ? fileUrl(current) : ""} alt={p.name} onOpen={() => setLightbox(true)}/>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden bg-[#F3EFEA] border-2 transition-colors ${active === i ? "border-[#1C1815]" : "border-transparent hover:border-[#E6E0D6]"}`} data-testid={`thumb-${i}`}>
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="product-brand">{p.brand}</p>
              <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2 leading-[1.05]" data-testid="product-name">{p.name}</h1>
            </div>
            <div className="mt-2 flex-shrink-0 border border-[#E6E0D6] p-3">
              <WishlistButton productId={p.id} size={20} testId="pdp-wishlist-toggle"/>
            </div>
          </div>
          <div className="mt-6 flex items-baseline gap-3" data-testid="product-price">
            <span className="font-serif text-3xl text-[#1C1815]">{money(price)}</span>
            {hasDiscount && <><span className="text-lg text-[#6E685E] line-through">{money(p.price)}</span><span className="text-xs uppercase tracking-[0.2em] text-[#B8860B]">−{off}%</span></>}
          </div>
          <p className="mt-6 text-[#1C1815]/80 leading-relaxed" data-testid="product-description">{p.description}</p>

          {p.features?.length > 0 && (
            <ul className="mt-8 space-y-2" data-testid="product-features">
              {p.features.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#1C1815]/85">
                  <span className="text-[#B8860B] mt-1">·</span>{f}
                </li>
              ))}
            </ul>
          )}

          {p.engravable && (
            <div className="mt-8 border border-[#E6E0D6] bg-[#F3EFEA]/60 p-5" data-testid="engraving-section">
              <div className="flex items-baseline justify-between gap-4 mb-3">
                <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">Engraving · optional</p>
                <span className="text-[10px] text-[#6E685E]">{engraving.length} / {p.engraving_max_length}</span>
              </div>
              <input
                type="text"
                value={engraving}
                onChange={(e) => setEngraving(e.target.value.slice(0, p.engraving_max_length))}
                placeholder="A name, a date, a line…"
                className="w-full bg-transparent border-b border-[#3D4838] pb-2 font-serif text-lg text-[#1C1815] outline-none placeholder:text-[#6E685E]/50 focus:border-[#B8860B]"
                data-testid="engraving-input"
              />
              <p className="mt-2 text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">Hand-etched in our Panchkula studio · adds 2 working days</p>
            </div>
          )}

          <div className="mt-8 flex items-center gap-4">
            <div className="flex items-center border border-[#E6E0D6]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-decrease"><Minus size={14}/></button>
              <span className="w-10 text-center" data-testid="qty-value">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-increase"><Plus size={14}/></button>
            </div>
            <button
              disabled={p.stock === 0}
              onClick={() => { add(p, qty, engraving); toast.success(`${p.name} added to cart${engraving ? ` · "${engraving}"` : ""}`); }}
              className="flex-1 bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-3 transition-colors"
              data-testid="add-to-cart-btn"
            >
              {p.stock === 0 ? "Sold out" : "Add to cart"} {p.stock > 0 && <ArrowRight size={14}/>}
            </button>
          </div>

          <p className="mt-4 text-xs text-[#6E685E]" data-testid="product-stock">{p.stock > 0 ? `${p.stock} in the atelier · ships within 48 hours` : "Currently sold out"}</p>

          {p.specs && Object.keys(p.specs).length > 0 && (
            <div className="mt-12 border-t border-[#E6E0D6] pt-8" data-testid="product-specs">
              <h3 className="font-serif text-xl text-[#1C1815] mb-4">Specifications</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                {Object.entries(p.specs).map(([k, v]) => (
                  <div key={k} className="flex justify-between border-b border-[#E6E0D6]/50 py-2">
                    <dt className="text-xs uppercase tracking-[0.15em] text-[#6E685E]">{k}</dt>
                    <dd className="text-sm text-[#1C1815]">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </section>

      {lightbox && current && (
        <Lightbox images={images} index={active} onIndex={setActive} onClose={() => setLightbox(false)}/>
      )}
    </div>
  );
}

function ZoomImage({ src, alt, onOpen }) {
  const boxRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className="relative aspect-square bg-[#F3EFEA] overflow-hidden cursor-zoom-in"
      data-testid="product-main-image"
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={hover ? { transform: `scale(2)`, transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
        />
      )}
      <button
        type="button"
        onClick={onOpen}
        className="absolute bottom-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E6E0D6] p-2 hover:border-[#3D4838] text-[#1C1815] transition-colors"
        aria-label="Open lightbox"
        data-testid="open-lightbox-btn"
      >
        <Expand size={16}/>
      </button>
    </div>
  );
}

function Lightbox({ images, index, onIndex, onClose }) {
  const cur = images[index];
  return (
    <div className="fixed inset-0 z-[70] bg-[#1C1815]/95 flex items-center justify-center p-4" onClick={onClose} data-testid="lightbox">
      <button className="absolute top-6 right-6 text-[#FAF8F5]" onClick={onClose} data-testid="close-lightbox">
        <ChevronLeft size={24} className="rotate-45"/>
      </button>
      <div className="relative max-w-6xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={fileUrl(cur)} alt="" className="w-full max-h-[80vh] object-contain"/>
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((im, i) => (
              <button
                key={i}
                onClick={() => onIndex(i)}
                className={`w-16 h-16 overflow-hidden border-2 ${i === index ? "border-[#B8860B]" : "border-transparent opacity-60 hover:opacity-100"}`}
                data-testid={`lightbox-thumb-${i}`}
              >
                <img src={fileUrl(im)} alt="" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
