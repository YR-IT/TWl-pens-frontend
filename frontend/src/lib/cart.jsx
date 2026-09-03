import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const KEY = "atelier_cart_v2";  // bumped for engraving field

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  // Two rows are considered same-line only if same product AND same engraving
  const rowKey = (id, eng) => `${id}::${(eng || "").trim()}`;

  const add = (product, qty = 1, engraving = "") => {
    const eng = (engraving || "").trim();
    setItems((old) => {
      const key = rowKey(product.id, eng);
      const found = old.find((i) => rowKey(i.id, i.engraving) === key);
      if (found) return old.map((i) => rowKey(i.id, i.engraving) === key ? { ...i, quantity: i.quantity + qty } : i);
      const price = product.discount_price || product.price;
      return [...old, {
        id: product.id, name: product.name, brand: product.brand,
        price, original_price: product.price,
        image: product.images?.[0], quantity: qty,
        engraving: eng || null,
      }];
    });
    setOpen(true);
  };

  const setQty = (key, qty) => setItems((old) =>
    old.map((i) => rowKey(i.id, i.engraving) === key ? { ...i, quantity: qty } : i).filter((i) => i.quantity > 0)
  );

  const remove = (key) => setItems((old) => old.filter((i) => rowKey(i.id, i.engraving) !== key));
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
