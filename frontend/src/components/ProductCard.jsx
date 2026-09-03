import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useCart } from "../lib/cart";
import { fileUrl } from "../lib/api";
import { money } from "../lib/format";

export default function ProductCard({ p }) {
  const { add } = useCart();
  const hasDiscount = !!p.discount_price;
  const price = hasDiscount ? p.discount_price : p.price;
  const off = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;

  return (
    <article className="group" data-testid={`product-card-${p.id}`}>
      <Link to={`/product/${p.id}`} className="block">
        <div className="relative aspect-[4/5] bg-[#F3EFEA] overflow-hidden">
          {p.images?.[0] && (
            <img src={fileUrl(p.images[0])} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"/>
          )}
          {hasDiscount && (
            <span className="absolute top-3 left-3 bg-[#1C1815] text-[#FAF8F5] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]" data-testid={`discount-badge-${p.id}`}>
              −{off}%
            </span>
          )}
          <button
            onClick={(e) => { e.preventDefault(); add(p, 1); }}
            className="absolute right-3 bottom-3 w-11 h-11 bg-[#FAF8F5] text-[#1C1815] grid place-items-center hover:bg-[#B8860B] hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            data-testid={`quick-add-${p.id}`}
            aria-label="Add to cart"
          >
            <Plus size={18}/>
          </button>
        </div>
        <div className="pt-4">
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">{p.brand}</p>
          <h3 className="font-serif text-lg text-[#1C1815] mt-1 leading-tight">{p.name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-medium text-[#1C1815]">{money(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-[#6E685E] line-through">{money(p.price)}</span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}
