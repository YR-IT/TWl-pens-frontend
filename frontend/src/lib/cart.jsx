import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const KEY = "atelier_cart_v3";  // bumped for estimated_delivery

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  // Two rows are considered same-line only if same product AND same engraving configuration
  const rowKey = (id, eng, font, pos) => `${id}::${(eng || "").trim()}::${(font || "").trim()}::${(pos || "").trim()}`;

  const add = (product, qty = 1, engraving = "", engraving_font = "", engraving_position = "") => {
    const eng = (engraving || "").trim();
    const font = (engraving_font || "").trim();
    const pos = (engraving_position || "").trim();
    setItems((old) => {
      const key = rowKey(product.id, eng, font, pos);
      const found = old.find((i) => rowKey(i.id, i.engraving, i.engraving_font, i.engraving_position) === key);
      if (found) return old.map((i) => rowKey(i.id, i.engraving, i.engraving_font, i.engraving_position) === key ? { ...i, quantity: i.quantity + qty } : i);
      const price = product.discount_price || product.price;
      return [...old, {
        id: product.id, name: product.name, brand: product.brand,
        price, original_price: product.price,
        image: product.images?.[0], quantity: qty,
        engraving: eng || null,
        engraving_font: font || null,
        engraving_position: pos || null,
        estimated_delivery: product.estimated_delivery,
      }];
    });
    setOpen(true);
  };

  const setQty = (key, qty) => setItems((old) =>
    old.map((i) => rowKey(i.id, i.engraving, i.engraving_font, i.engraving_position) === key ? { ...i, quantity: qty } : i).filter((i) => i.quantity > 0)
  );

  const remove = (key) => setItems((old) => old.filter((i) => rowKey(i.id, i.engraving, i.engraving_font, i.engraving_position) !== key));
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, total, count, open, setOpen, rowKey }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
