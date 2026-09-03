import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "./api";
import { useAuth } from "./auth";

const WishlistCtx = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [ids, setIds] = useState([]);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setIds([]); setReady(true); return; }
    try {
      const r = await api.get("/wishlist");
      setIds(r.data.product_ids || []);
    } catch { setIds([]); }
    finally { setReady(true); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const has = (id) => ids.includes(id);

  const toggle = async (id) => {
    if (!user) return { needsLogin: true };
    const r = await api.post("/wishlist/toggle", { product_id: id });
    setIds(r.data.product_ids);
    return { added: r.data.added };
  };

  return (
    <WishlistCtx.Provider value={{ ids, has, toggle, refresh, ready, count: ids.length }}>
      {children}
    </WishlistCtx.Provider>
  );
}

export const useWishlist = () => useContext(WishlistCtx);
