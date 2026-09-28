import { memo, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Eye, Scale, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "../lib/cart";
import { useCompare } from "../lib/compare";
import { fileUrl } from "../lib/api";
import { money } from "../lib/format";
import WishlistButton from "./WishlistButton";
import QuickViewModal from "./QuickViewModal";

function ProductCard({ p: propP, product }) {
  const p = propP || product;
  const { add } = useCart();
  const { add: toggleCompare, has: inCompare } = useCompare();
  const [quickView, setQuickView] = useState(false);
  const [hovered, setHovered] = useState(false);

  if (!p) return null;
  const hasDiscount = Boolean(p.discount_price);
  const price = hasDiscount ? p.discount_price : p.price;
  const off = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;

  const primaryImg = p.images?.[0] || "";
  const secondaryImg = p.images?.[1] || primaryImg;

  return (
    <>
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
        className="group relative"
        data-testid={`product-card-${p.id}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Link to={`/product/${p.id}`} className="block">
          <div className="relative aspect-[4/5] bg-[#F3EFEA] overflow-hidden rounded-sm">
            {/* Primary & Secondary Image Swap on Hover */}
            {primaryImg && (
              <img
                src={fileUrl(hovered && secondaryImg ? secondaryImg : primaryImg)}
                alt={p.name}
                loading="lazy"
                decoding="async"
                width={400}
                height={500}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            )}

            {/* Discount Badge */}
            {hasDiscount && (
              <span
                className="absolute top-3 left-3 bg-[#1C1815] text-[#FAF8F5] px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] font-medium"
                data-testid={`discount-badge-${p.id}`}
              >
                −{off}%
              </span>
            )}

            {/* Quick Action Floating Strip (Top Right) */}
            <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
              <div className="bg-[#FAF8F5]/90 backdrop-blur-sm rounded-full p-2 hover:bg-white shadow-xs">
                <WishlistButton productId={p.id} size={16} />
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleCompare(p);
                }}
                className={`p-2 rounded-full backdrop-blur-sm shadow-xs transition-colors ${
                  inCompare(p.id) ? "bg-[#B8860B] text-white" : "bg-[#FAF8F5]/90 text-[#1C1815] hover:bg-white"
                }`}
                title={inCompare(p.id) ? "In Comparison" : "Compare Specs"}
                data-testid={`compare-btn-${p.id}`}
              >
                <Scale size={16} />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuickView(true);
                }}
                className="p-2 bg-[#FAF8F5]/90 hover:bg-white text-[#1C1815] rounded-full backdrop-blur-sm shadow-xs transition-colors"
                title="Quick View"
                data-testid={`quick-view-btn-${p.id}`}
              >
                <Eye size={16} />
              </button>
            </div>

            {/* Quick Add To Bag Button (Bottom Right) */}
            <motion.button
              whileTap={{ scale: 0.92 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                add(p, 1);
              }}
              className="absolute right-3 bottom-3 w-10 h-10 bg-[#FAF8F5] text-[#1C1815] grid place-items-center hover:bg-[#1C1815] hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300 shadow-md rounded-xs z-10"
              data-testid={`quick-add-${p.id}`}
              aria-label="Add to cart"
            >
              <Plus size={18} />
            </motion.button>
          </div>

          <div className="pt-4">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">{p.brand}</p>
            <h3 className="font-serif text-lg text-[#1C1815] mt-1 leading-tight line-clamp-1">{p.name}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-medium text-[#1C1815]">{money(price)}</span>
              {hasDiscount && (
                <span className="text-sm text-[#6E685E] line-through">{money(p.price)}</span>
              )}
            </div>
          </div>
        </Link>
      </motion.article>

      {/* Quick View Modal */}
      {quickView && <QuickViewModal product={p} onClose={() => setQuickView(false)} />}
    </>
  );
}

export default memo(ProductCard);
