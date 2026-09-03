import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ArrowRight } from "lucide-react";
import { api } from "../lib/api";
import { useCart } from "../lib/cart";
import { money } from "../lib/format";

export default function PaymentSuccess() {
  const [sp] = useSearchParams();
  const sessionId = sp.get("session_id");
  const [status, setStatus] = useState("polling"); // polling, paid, failed, expired
  const [order, setOrder] = useState(null);
  const { clear } = useCart();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!sessionId) return;
    let attempts = 0;
    const poll = async () => {
      attempts += 1;
      try {
        const r = await api.get(`/payments/status/${sessionId}`);
        if (r.data.payment_status === "paid") {
          setStatus("paid");
          setOrder(r.data.order);
          if (!clearedRef.current) { clear(); clearedRef.current = true; }
          return;
        }
        if (["failed", "expired"].includes(r.data.payment_status)) {
          setStatus(r.data.payment_status);
          return;
        }
        if (attempts < 10) setTimeout(poll, 2000);
        else setStatus("timeout");
      } catch {
        if (attempts < 10) setTimeout(poll, 2000);
        else setStatus("failed");
      }
    };
    poll();
  }, [sessionId, clear]);

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        {status === "polling" && (
          <div data-testid="payment-polling">
            <Clock size={40} className="mx-auto text-[#B8860B] animate-pulse"/>
            <p className="mt-6 font-serif text-3xl text-[#1C1815]">Confirming your payment…</p>
            <p className="mt-3 text-sm text-[#6E685E]">Stripe is settling the details.</p>
          </div>
        )}
        {status === "paid" && order && (
          <div data-testid="payment-success">
            <div className="w-16 h-16 rounded-full bg-[#3D4838] mx-auto grid place-items-center">
              <CheckCircle2 size={32} className="text-[#FAF8F5]"/>
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="order-id">ORDER {order.id}</p>
            <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1815] mt-3 leading-[1.05]">Thank you,<br/><em className="text-[#3D4838]">{order.shipping?.full_name?.split(" ")[0] || "friend"}.</em></h1>
            <p className="mt-6 text-[#6E685E] max-w-lg mx-auto leading-relaxed">
              Your order of {order.items.reduce((s, i) => s + i.quantity, 0)} item(s) — <strong className="text-[#1C1815]">{money(order.total)}</strong> —
              is in the atelier. We'll email a tracking number to <strong className="text-[#1C1815]">{order.shipping?.email}</strong> within 48 hours.
            </p>
            <Link to="/shop" className="mt-10 inline-flex items-center gap-3 border border-[#1C1815] text-[#1C1815] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors" data-testid="continue-shopping-btn">
              Continue browsing <ArrowRight size={14}/>
            </Link>
          </div>
        )}
        {["failed", "expired", "timeout"].includes(status) && (
          <div data-testid="payment-failed">
            <XCircle size={40} className="mx-auto text-[#6E685E]"/>
            <p className="mt-6 font-serif text-3xl text-[#1C1815]">We couldn't confirm the payment.</p>
            <p className="mt-3 text-sm text-[#6E685E]">No charge was captured. Please try again.</p>
            <Link to="/checkout" className="mt-8 inline-flex items-center gap-3 bg-[#1C1815] text-[#FAF8F5] px-7 py-4 text-xs uppercase tracking-[0.25em]" data-testid="retry-checkout-btn">
              Try again <ArrowRight size={14}/>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
