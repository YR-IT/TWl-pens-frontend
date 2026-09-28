import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const CompareContext = createContext(null);
const STORAGE_KEY = "the_wl_pens_compare_v1";

export function CompareProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* ignore */
    }
  }, [items]);

  const add = (product) => {
    if (!product || !product.id) return;
    if (items.some((p) => p.id === product.id)) {
      setItems((prev) => prev.filter((p) => p.id !== product.id));
      toast.info(`Removed ${product.name} from comparison`);
      return;
    }
    if (items.length >= 4) {
      toast.error("You can compare up to 4 products at once");
      setOpen(true);
      return;
    }
    setItems((prev) => [...prev, product]);
    toast.success(`Added ${product.name} to comparison`);
    setOpen(true);
  };

  const remove = (productId) => {
    setItems((prev) => prev.filter((p) => p.id !== productId));
  };

  const clear = () => setItems([]);

  const has = (productId) => items.some((p) => p.id === productId);

  return (
    <CompareContext.Provider
      value={{
        items,
        count: items.length,
        open,
        setOpen,
        add,
        remove,
        clear,
        has,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
