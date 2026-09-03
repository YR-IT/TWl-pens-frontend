import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowRight, Minus, Plus, ChevronLeft } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";
import { useCart } from "../lib/cart";
import { toast } from "sonner";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => { setP(r.data); setActive(0); });
  }, [id]);

  if (!p) return <div className="pt-[76px] p-12 text-center text-[#6E685E]" data-testid="product-loading">Loading…</div>;

  const hasDiscount = !!p.discount_price;
  const price = hasDiscount ? p.discount_price : p.price;
  const off = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
  const images = p.images?.length ? p.images : [];

  return (
    <div className="pt-[76px] bg-[#FAF8F5]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815]" data-testid="back-to-catalog">
          <ChevronLeft size={14}/> Back to catalog
        </Link>
      </div>

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <div className="aspect-square bg-[#F3EFEA] overflow-hidden" data-testid="product-main-image">
            {images[active] && <img src={fileUrl(images[active])} alt={p.name} className="w-full h-full object-cover"/>}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden bg-[#F3EFEA] border ${active === i ? "border-[#1C1815]" : "border-transparent"}`} data-testid={`thumb-${i}`}>
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="product-brand">{p.brand}</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2 leading-[1.05]" data-testid="product-name">{p.name}</h1>
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

          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center border border-[#E6E0D6]">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-decrease"><Minus size={14}/></button>
              <span className="w-10 text-center" data-testid="qty-value">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-increase"><Plus size={14}/></button>
            </div>
            <button
              disabled={p.stock === 0}
              onClick={() => { add(p, qty); toast.success(`${p.name} added to cart`); }}
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
    </div>
  );
}
