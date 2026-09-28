import { Link } from "react-router-dom";
import { X, Trash2, ArrowRight, Scale } from "lucide-react";
import { useCompare } from "../lib/compare";
import { useCart } from "../lib/cart";
import { fileUrl } from "../lib/api";
import { money } from "../lib/format";

export default function CompareDrawer() {
  const { items, open, setOpen, remove, clear } = useCompare();
  const { add: addToCart } = useCart();

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs"
      onClick={() => setOpen(false)}
      data-testid="compare-drawer"
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between overflow-hidden border-l border-[#E6E0D6]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#E6E0D6] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <Scale size={20} className="text-[#B8860B]" />
            <h2 className="font-serif text-2xl text-[#1C1815]">Product Comparison</h2>
            <span className="text-xs bg-[#F3EFEA] px-2 py-0.5 rounded-full text-[#6E685E] font-medium">
              {items.length}/4
            </span>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <button
                onClick={clear}
                className="text-xs uppercase tracking-[0.15em] text-[#6E685E] hover:text-red-700 px-2 py-1"
                data-testid="clear-compare-btn"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-[#6E685E] hover:text-[#1C1815] rounded-full"
              data-testid="close-compare-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <Scale size={36} className="mx-auto text-[#6E685E]/40" />
              <p className="font-serif italic text-lg text-[#6E685E]">No writing instruments selected for comparison.</p>
              <p className="text-xs text-[#6E685E] max-w-sm mx-auto">
                Click the compare icon on any pen card to compare specifications side-by-side.
              </p>
              <Link
                to="/shop"
                onClick={() => setOpen(false)}
                className="inline-block mt-4 bg-[#1C1815] text-[#FAF8F5] px-6 py-2.5 text-xs uppercase tracking-[0.2em]"
              >
                Explore Atelier
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {items.map((p) => {
                const cover = p.images?.[0] || "";
                const price = p.discount_price || p.price;
                return (
                  <div
                    key={p.id}
                    className="bg-white border border-[#E6E0D6] p-4 flex flex-col justify-between relative shadow-xs"
                    data-testid={`compare-item-${p.id}`}
                  >
                    <button
                      onClick={() => remove(p.id)}
                      className="absolute top-2 right-2 p-1 text-[#6E685E] hover:text-red-700 bg-white/80 rounded-full"
                      title="Remove from comparison"
                    >
                      <X size={14} />
                    </button>

                    <div>
                      <div className="aspect-square bg-[#F3EFEA] overflow-hidden mb-3">
                        <img src={fileUrl(cover)} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-[#B8860B]">{p.brand}</p>
                      <h4 className="font-serif text-sm text-[#1C1815] mt-0.5 line-clamp-2">{p.name}</h4>
                      <p className="font-medium text-sm text-[#1C1815] mt-1">{money(price)}</p>

                      {/* Specs snippet */}
                      <div className="mt-3 pt-3 border-t border-[#E6E0D6] space-y-1.5 text-xs text-[#6E685E]">
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase tracking-wider">Category:</span>
                          <span className="text-[#1C1815] font-medium">{p.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[10px] uppercase tracking-wider">Stock:</span>
                          <span className={p.stock > 0 ? "text-emerald-700 font-medium" : "text-red-700 font-medium"}>
                            {p.stock > 0 ? `${p.stock} in stock` : "Sold Out"}
                          </span>
                        </div>
                        {p.engravable && (
                          <div className="flex justify-between text-[#B8860B]">
                            <span className="text-[10px] uppercase tracking-wider">Engraving:</span>
                            <span className="font-medium">Available</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E6E0D6] flex gap-2">
                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={p.stock <= 0}
                        className="flex-1 bg-[#1C1815] text-[#FAF8F5] py-2 text-[10px] uppercase tracking-[0.15em] hover:bg-[#3D4838] disabled:bg-gray-400"
                      >
                        Add to Bag
                      </button>
                      <Link
                        to={`/product/${p.id}`}
                        onClick={() => setOpen(false)}
                        className="px-3 py-2 border border-[#E6E0D6] text-xs hover:border-[#1C1815]"
                        title="View product details"
                      >
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
