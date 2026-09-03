import { Link, Navigate, useLocation } from "react-router-dom";
import { CheckCircle2, ArrowRight, MessageCircle, Copy } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { money } from "../lib/format";

export default function OrderPlaced() {
  const { state } = useLocation();
  const order = state?.order;

  if (!order) return <Navigate to="/shop" replace/>;

  const copyOrderId = async () => {
    try { await navigator.clipboard.writeText(order.id); toast.success("Order ID copied"); } catch {}
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 0.9, 0.3, 1] }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
            className="w-20 h-20 rounded-full bg-[#3D4838] mx-auto grid place-items-center"
          >
            <CheckCircle2 size={36} className="text-[#FAF8F5]"/>
          </motion.div>
          <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="order-id-eyebrow">ORDER {order.id}</p>
          <h1 className="font-serif text-4xl lg:text-6xl text-[#1C1815] mt-3 leading-[1.05]">
            Order placed.<br/><em className="text-[#3D4838]">On its way.</em>
          </h1>
          <p className="mt-6 text-[#6E685E] max-w-lg mx-auto leading-relaxed">
            We've opened WhatsApp with your order details. If the tab didn't open,
            tap the button below to send it now. The studio will confirm payment and shipping there.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={order.whatsapp_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3.5 text-xs uppercase tracking-[0.25em] transition-all active:scale-[0.98]"
              data-testid="open-whatsapp-btn"
            >
              <MessageCircle size={16}/> Send on WhatsApp
            </a>
            <button
              onClick={copyOrderId}
              className="inline-flex items-center gap-2 border border-[#1C1815] text-[#1C1815] px-5 py-3.5 text-xs uppercase tracking-[0.25em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors"
              data-testid="copy-order-id-btn"
            >
              <Copy size={14}/> Copy order ID
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mt-14 border border-[#E6E0D6] bg-white p-6 lg:p-8"
          data-testid="order-recap"
        >
          <div className="flex justify-between items-baseline pb-4 border-b border-[#E6E0D6]">
            <h3 className="font-serif text-xl text-[#1C1815]">Order recap</h3>
            <span className="font-serif text-2xl text-[#1C1815]">{money(order.total)}</span>
          </div>
          <ul className="mt-4 space-y-2 text-sm text-[#1C1815]/90">
            {order.items.map((it, i) => (
              <li key={i} className="flex justify-between">
                <span>{it.quantity}× {it.name}{it.engraving && <em className="text-[#B8860B]"> · "{it.engraving}"</em>}</span>
                <span>{money(it.unit_price * it.quantity)}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <div className="mt-12 text-center">
          <Link to="/shop" className="inline-flex items-center gap-3 border border-[#1C1815] text-[#1C1815] px-7 py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors" data-testid="continue-shopping-btn">
            Keep browsing <ArrowRight size={14}/>
          </Link>
        </div>
      </div>
    </div>
  );
}
