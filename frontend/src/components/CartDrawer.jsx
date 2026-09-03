import { X, Minus, Plus, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../lib/cart";
import { fileUrl } from "../lib/api";
import { money } from "../lib/format";

export default function CartDrawer() {
  const { items, open, setOpen, setQty, remove, total, rowKey } = useCart();
  const nav = useNavigate();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-[#1C1815]/40 backdrop-blur-sm" />
      <aside
        className="relative w-full sm:w-[440px] bg-[#FAF8F5] h-full flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        data-testid="cart-drawer"
      >
        <div className="flex items-center justify-between px-6 lg:px-8 py-6 border-b border-[#E6E0D6]">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">YOUR SELECTION</p>
            <h2 className="font-serif text-2xl text-[#1C1815] mt-1">The Cart</h2>
          </div>
          <button onClick={() => setOpen(false)} className="text-[#1C1815] hover:text-[#3D4838]" data-testid="close-cart-btn">
            <X size={22}/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">
          {items.length === 0 ? (
            <div className="text-center py-16" data-testid="empty-cart">
              <p className="font-serif italic text-xl text-[#6E685E]">Your cart holds no ink yet.</p>
              <button onClick={() => { setOpen(false); nav("/shop"); }} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-1">
                Browse the atelier <ArrowRight size={14}/>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((it) => {
                const key = rowKey(it.id, it.engraving);
                return (
                  <div key={key} className="flex gap-4 border-b border-[#E6E0D6] pb-6" data-testid={`cart-item-${it.id}`}>
                    <div className="w-20 h-24 bg-[#F3EFEA] overflow-hidden flex-shrink-0">
                      {it.image && <img src={fileUrl(it.image)} alt={it.name} className="w-full h-full object-cover"/>}
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">{it.brand}</p>
                        <h3 className="font-serif text-lg text-[#1C1815] leading-tight">{it.name}</h3>
                        {it.engraving && (
                          <p className="mt-1 text-[11px] uppercase tracking-[0.15em] text-[#B8860B]" data-testid={`cart-engraving-${it.id}`}>
                            Engraved · "{it.engraving}"
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2 border border-[#E6E0D6]">
                          <button onClick={() => setQty(key, it.quantity - 1)} className="w-7 h-7 grid place-items-center hover:bg-[#F3EFEA]" data-testid={`decrease-${it.id}`}><Minus size={12}/></button>
                          <span className="w-6 text-center text-sm" data-testid={`qty-${it.id}`}>{it.quantity}</span>
                          <button onClick={() => setQty(key, it.quantity + 1)} className="w-7 h-7 grid place-items-center hover:bg-[#F3EFEA]" data-testid={`increase-${it.id}`}><Plus size={12}/></button>
                        </div>
                        <span className="font-medium text-[#1C1815]">{money(it.price * it.quantity)}</span>
                      </div>
                    </div>
                    <button onClick={() => remove(key)} className="text-[#6E685E] hover:text-[#1C1815] self-start" data-testid={`remove-${it.id}`}>
                      <X size={16}/>
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#E6E0D6] px-6 lg:px-8 py-6 bg-[#F3EFEA]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.2em] text-[#6E685E]">Subtotal</span>
              <span className="font-serif text-2xl text-[#1C1815]" data-testid="cart-subtotal">{money(total)}</span>
            </div>
            <p className="text-xs text-[#6E685E] mb-4">Shipping calculated at checkout.</p>
            <button
              onClick={() => { setOpen(false); nav("/checkout"); }}
              className="w-full bg-[#1C1815] text-[#FAF8F5] py-4 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors"
              data-testid="checkout-btn"
            >
              Proceed to checkout <ArrowRight size={14}/>
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}
