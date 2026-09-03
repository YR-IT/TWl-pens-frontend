import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import { useAuth } from "../lib/auth";
import { money } from "../lib/format";

const STATUS_STYLES = {
  pending: "text-[#B8860B]",
  processing: "text-[#3D4838]",
  shipped: "text-[#1E293B]",
  delivered: "text-[#3D4838]",
  cancelled: "text-red-700",
};

export default function Account() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.get("/orders/mine").then((r) => setOrders(r.data)).finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="pt-[76px] max-w-md mx-auto px-6 py-24 text-center">
        <p className="font-serif text-2xl text-[#1C1815]" data-testid="account-signin-required">Sign in to view your orders.</p>
        <Link to="/login" className="mt-6 inline-block underline text-[#3D4838]" data-testid="signin-link">Sign in</Link>
      </div>
    );
  }

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12 py-16">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">YOUR ATELIER</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2">Hello, {user.name || user.email}.</h1>
        <p className="mt-3 text-sm text-[#6E685E]">Track your recent orders below.</p>

        <div className="mt-12">
          {loading ? (
            <p className="text-[#6E685E]" data-testid="account-loading">Loading…</p>
          ) : orders.length === 0 ? (
            <div className="border border-dashed border-[#E6E0D6] p-12 text-center" data-testid="no-orders">
              <p className="font-serif italic text-xl text-[#6E685E]">No orders yet.</p>
              <Link to="/shop" className="mt-4 inline-block underline text-[#3D4838]">Browse the atelier</Link>
            </div>
          ) : (
            <div className="space-y-6" data-testid="orders-list">
              {orders.map((o) => (
                <article key={o.id} className="border border-[#E6E0D6] bg-white p-6 lg:p-8" data-testid={`order-row-${o.id}`}>
                  <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E0D6] pb-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">ORDER {o.id}</p>
                      <p className="text-xs text-[#6E685E] mt-1">{new Date(o.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs uppercase tracking-[0.2em] ${STATUS_STYLES[o.shipment?.status] || "text-[#6E685E]"}`}>
                        {o.shipment?.status || o.order_status || "pending"}
                      </p>
                      {o.shipment?.tracking_number && (
                        <p className="text-xs text-[#3D4838] mt-1" data-testid={`tracking-${o.id}`}>{o.shipment.carrier} · {o.shipment.tracking_number}</p>
                      )}
                    </div>
                  </header>
                  <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
                    <ul className="text-sm text-[#1C1815]/90 space-y-1">
                      {o.items.map((it, i) => (
                        <li key={i}>{it.quantity}× {it.name}</li>
                      ))}
                    </ul>
                    <span className="font-serif text-2xl text-[#1C1815]">{money(o.total)}</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
