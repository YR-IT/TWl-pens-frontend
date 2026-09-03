import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

export default function Checkout() {
  const { items, total, count } = useCart();
  const { user } = useAuth();
  const nav = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    full_name: user?.name || "",
    email: user?.email || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "IN",
  });

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (count === 0) return;
    setSubmitting(true);
    try {
      const r = await api.post("/checkout/session", {
        items: items.map((i) => ({ product_id: i.id, quantity: i.quantity })),
        shipping: form,
        origin_url: window.location.origin,
      });
      window.location.href = r.data.checkout_url;
    } catch (err) {
      toast.error(err.response?.data?.detail || "Checkout failed");
      setSubmitting(false);
    }
  };

  if (count === 0) {
    return (
      <div className="pt-[76px] max-w-2xl mx-auto px-6 py-24 text-center">
        <p className="font-serif italic text-2xl text-[#6E685E]" data-testid="empty-checkout-message">Your cart is empty.</p>
        <button onClick={() => nav("/shop")} className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#3D4838] border-b border-[#3D4838] pb-1" data-testid="browse-atelier-btn">
          Browse the atelier <ArrowRight size={14}/>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-14 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">CHECKOUT</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-2">Shipping details.</h1>
          {!user && (
            <p className="mt-3 text-sm text-[#6E685E]">
              Checking out as a guest. <a href="/login" className="underline text-[#3D4838]" data-testid="login-during-checkout">Sign in</a> to save this order to your account.
            </p>
          )}

          <form onSubmit={submit} className="mt-10 space-y-6" data-testid="checkout-form">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Field label="Full name" required value={form.full_name} onChange={set("full_name")} testid="ship-full-name"/>
              <Field label="Email" type="email" required value={form.email} onChange={set("email")} testid="ship-email"/>
            </div>
            <Field label="Phone" required value={form.phone} onChange={set("phone")} testid="ship-phone"/>
            <Field label="Address line 1" required value={form.line1} onChange={set("line1")} testid="ship-line1"/>
            <Field label="Address line 2 (optional)" value={form.line2} onChange={set("line2")} testid="ship-line2"/>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Field label="City" required value={form.city} onChange={set("city")} testid="ship-city"/>
              <Field label="State / region" required value={form.state} onChange={set("state")} testid="ship-state"/>
              <Field label="Postal code" required value={form.postal_code} onChange={set("postal_code")} testid="ship-postal"/>
            </div>
            <Field label="Country" required value={form.country} onChange={set("country")} testid="ship-country"/>

            <button type="submit" disabled={submitting} className="mt-6 w-full bg-[#1C1815] text-[#FAF8F5] py-5 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-3 transition-colors" data-testid="place-order-btn">
              {submitting ? "Preparing secure checkout…" : <>Continue to payment <ArrowRight size={14}/></>}
            </button>
          </form>
        </div>

        <aside className="bg-[#F3EFEA] p-6 lg:p-8 h-fit border border-[#E6E0D6]" data-testid="order-summary">
          <h3 className="font-serif text-xl text-[#1C1815] mb-6">Your order</h3>
          <div className="space-y-4 border-b border-[#E6E0D6] pb-6">
            {items.map((it) => (
              <div key={it.id} className="flex gap-3">
                <div className="w-16 h-16 bg-[#FAF8F5] overflow-hidden flex-shrink-0">
                  {it.image && <img src={fileUrl(it.image)} alt="" className="w-full h-full object-cover"/>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-serif text-[#1C1815]">{it.name}</p>
                  <p className="text-xs text-[#6E685E]">Qty {it.quantity}</p>
                </div>
                <span className="text-sm text-[#1C1815]">{money(it.price * it.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="pt-6 space-y-2 text-sm">
            <div className="flex justify-between text-[#6E685E]"><span>Subtotal</span><span>{money(total)}</span></div>
            <div className="flex justify-between text-[#6E685E]"><span>Shipping</span><span>Calculated at Stripe</span></div>
            <div className="flex justify-between pt-3 border-t border-[#E6E0D6] font-serif text-xl text-[#1C1815]"><span>Total</span><span data-testid="summary-total">{money(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, testid, ...rest }) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">{label}</span>
      <input {...rest} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-[#1C1815] outline-none focus:border-[#3D4838] transition-colors" data-testid={testid}/>
    </label>
  );
}
