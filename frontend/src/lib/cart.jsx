import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const KEY = "atelier_cart_v1";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const add = (product, qty = 1) => {
    setItems((old) => {
      const found = old.find((i) => i.id === product.id);
      if (found) return old.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      const price = product.discount_price || product.price;
      return [...old, {
        id: product.id, name: product.name, brand: product.brand,
        price, original_price: product.price,
        image: product.images?.[0], quantity: qty,
      }];
    });
    setOpen(true);
  };

  const setQty = (id, qty) => setItems((old) =>
    old.map((i) => i.id === id ? { ...i, quantity: qty } : i).filter((i) => i.quantity > 0)
  );

  const remove = (id) => setItems((old) => old.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  const total = useMemo(
    () => items.reduce((s, i) => s + i.price * i.quantity, 0),
    [items]
  );
  const count = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <CartCtx.Provider value={{ items, add, setQty, remove, clear, total, count, open, setOpen }}>
      {children}
    </CartCtx.Provider>
  );
}

export const useCart = () => useContext(CartCtx);
