import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartCtx = createContext(null);
const KEY = "atelier_cart_v3";  // bumped for estimated_delivery

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  // Two rows are considered same-line only if same product, color variant AND same engraving configuration
  const rowKey = (id, color = "", eng = "", font = "", pos = "") =>
    `${id}::${(color || "").trim()}::${(eng || "").trim()}::${(font || "").trim()}::${(pos || "").trim()}`;

  const add = (product, qty = 1, engraving = "", engraving_font = "", engraving_position = "", color = null) => {
    const eng = (engraving || "").trim();
    const font = (engraving_font || "").trim();
    const pos = (engraving_position || "").trim();
    const colorName = (typeof color === "string" ? color : color?.name || "").trim();
    const colorImg = (typeof color === "object" && color?.images?.[0]) ? color.images[0] : null;
    const variantPrice = (typeof color === "object" && color?.price)
      ? (color.discount_price || color.price)
      : (product.discount_price || product.price);

    setItems((old) => {
      const key = rowKey(product.id, colorName, eng, font, pos);
      const found = old.find((i) => rowKey(i.id, i.color, i.engraving, i.engraving_font, i.engraving_position) === key);
      if (found) {
        return old.map((i) =>
          rowKey(i.id, i.color, i.engraving, i.engraving_font, i.engraving_position) === key
            ? { ...i, quantity: i.quantity + qty }
            : i
        );
      }
      return [
        ...old,
        {
          id: product.id,
          name: product.name,
          brand: product.brand,
          color: colorName || null,
          color_image: colorImg,
          price: variantPrice,
          original_price: (typeof color === "object" && color?.price) ? color.price : product.price,
          image: colorImg || product.images?.[0],
          quantity: qty,
          engraving: eng || null,
          engraving_font: font || null,
          engraving_position: pos || null,
          estimated_delivery: product.estimated_delivery,
        },
      ];
    });
    setOpen(true);
  };

  const setQty = (key, qty) =>
    setItems((old) =>
      old
        .map((i) => (rowKey(i.id, i.color, i.engraving, i.engraving_font, i.engraving_position) === key ? { ...i, quantity: qty } : i))
        .filter((i) => i.quantity > 0)
    );

  const remove = (key) =>
    setItems((old) => old.filter((i) => rowKey(i.id, i.color, i.engraving, i.engraving_font, i.engraving_position) !== key));
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
