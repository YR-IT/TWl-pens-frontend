import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { X, Check, ShoppingBag, ArrowRight } from "lucide-react";
import { fileUrl } from "../lib/api";
import { money } from "../lib/format";
import { useCart } from "../lib/cart";

export default function QuickViewModal({ product, onClose }) {
  const { add } = useCart();
  const [activeImgIdx, setActiveImgIdx] = useState(0);
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [product, onClose]);

  if (!product) return null;

  const hasColors = Array.isArray(product.colors) && product.colors.length > 0 && product.colors.some((c) => c.images?.length > 0);
  const activeColor = hasColors ? (product.colors[selectedColorIdx] || product.colors[0]) : null;
  const images = hasColors && activeColor?.images?.length ? activeColor.images : (product.images?.length ? product.images : []);
  const currentImg = images[activeImgIdx] || images[0] || "";

  const basePrice = hasColors && activeColor?.price ? activeColor.price : product.price;
  const baseDiscount = hasColors && activeColor?.discount_price !== undefined && activeColor?.discount_price !== null ? activeColor.discount_price : product.discount_price;
  const hasDiscount = !!baseDiscount;
  const price = hasDiscount ? baseDiscount : basePrice;
  const off = hasDiscount ? Math.round(((basePrice - baseDiscount) / basePrice) * 100) : 0;
  const stock = hasColors && activeColor?.stock !== undefined && activeColor?.stock !== null ? activeColor.stock : product.stock;

  const handleAddToCart = () => {
    add(product, quantity, "", "", "", activeColor);
    onClose();
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-[#1C1815]/75 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view ${product.name}`}
      data-testid="quick-view-modal"
    >
      <div
        className="relative bg-[#FAF8F5] w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row rounded-lg shadow-2xl border border-[#E6E0D6] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 p-2 bg-white/80 hover:bg-white text-[#1C1815] rounded-full shadow-xs"
          data-testid="close-quick-view"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Gallery on Left */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-white border-b md:border-b-0 md:border-r border-[#E6E0D6]">
          <div className="aspect-square bg-[#F3EFEA] overflow-hidden rounded-sm flex items-center justify-center">
            {currentImg ? (
              <img src={fileUrl(currentImg)} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-xs text-[#6E685E]">No image available</span>
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2 mt-3">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveImgIdx(i)}
                  className={`aspect-square border-2 rounded-xs overflow-hidden ${activeImgIdx === i ? "border-[#B8860B]" : "border-transparent"}`}
                >
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details on Right */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">{product.brand}</p>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1815] mt-1">{product.name}</h3>

            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-2xl text-[#1C1815]">{money(price)}</span>
              {hasDiscount && (
                <>
                  <span className="text-sm text-[#6E685E] line-through">{money(basePrice)}</span>
                  <span className="text-[10px] uppercase tracking-[0.15em] text-[#B8860B] font-semibold">
                    −{off}%
                  </span>
                </>
              )}
            </div>

            <p className="text-xs text-[#6E685E] mt-3 line-clamp-3 leading-relaxed">{product.description}</p>

            {/* Color swatches if any */}
            {hasColors && (
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] font-medium">Colour:</span>
                  <span className="font-medium text-[#1C1815]">{activeColor?.name}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.filter((c) => c.images?.length > 0).map((c, idx) => {
                    const realIdx = product.colors.indexOf(c);
                    const isSelected = realIdx === selectedColorIdx;
                    return (
                      <button
                        key={realIdx}
                        type="button"
                        onClick={() => { setSelectedColorIdx(realIdx); setActiveImgIdx(0); }}
                        className={`relative w-8 h-8 rounded-full border-2 transition-all ${isSelected ? "border-[#B8860B] scale-110 shadow-xs" : "border-gray-200"}`}
                        title={c.name}
                      >
                        {c.swatch_image ? (
                          <img src={fileUrl(c.swatch_image)} alt={c.name} className="w-full h-full rounded-full object-cover" />
                        ) : (
                          <span className="w-6 h-6 rounded-full block m-auto" style={{ background: c.hex || '#888' }} />
                        )}
                        {isSelected && (
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#B8860B] rounded-full flex items-center justify-center">
                            <Check size={8} className="text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E6E0D6] space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#E6E0D6] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-xs hover:bg-[#F3EFEA]"
                >
                  −
                </button>
                <span className="px-3 py-2 text-xs font-medium">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-xs hover:bg-[#F3EFEA]"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={stock <= 0}
                className="flex-1 bg-[#1C1815] text-[#FAF8F5] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-2"
                data-testid="quick-view-add-btn"
              >
                <ShoppingBag size={14} />
                {stock <= 0 ? "Sold Out" : "Add to Bag"}
              </button>
            </div>

            <Link
              to={`/product/${product.id}`}
              onClick={onClose}
              className="text-center block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815] pt-1"
            >
              View Full Product Specifications <ArrowRight size={11} className="inline ml-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
