import { useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Sparkles, ChevronLeft } from "lucide-react";
import { SITE } from "../lib/site";
import { toast } from "sonner";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      toast.error("Please provide your name and message.");
      return;
    }
    const waMessage = encodeURIComponent(
      `Hello The WL Pens Studio,\nName: ${form.name}\nEmail: ${form.email || "N/A"}\nPhone: ${form.phone || "N/A"}\nInquiry: ${form.message}`
    );
    window.open(`https://wa.me/919351996272?text=${waMessage}`, "_blank");
    toast.success("Opening WhatsApp Concierge with your inquiry.");
    setSent(true);
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      {/* Breadcrumb */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815]">
          <ChevronLeft size={14}/> Back to atelier
        </Link>
      </div>

      {/* Header */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#B8860B] text-[11px] uppercase tracking-[0.3em] mb-4">
            <Sparkles size={14}/>
            <span>PANCHKULA ATELIER</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1C1815] leading-[1.05]">
            Contact the <em className="text-[#3D4838] font-normal">atelier.</em>
          </h1>
          <p className="mt-4 text-[#6E685E] text-base leading-relaxed">
            Whether you have a question about our hand-tuned nibs, bespoke studio engraving,
            archival inks, or would like to schedule a private studio consultation in Panchkula.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Direct Channels */}
          <div className="space-y-8">
            <div className="border border-[#E6E0D6] bg-[#F3EFEA] p-8 lg:p-10 space-y-6">
              <h2 className="font-serif text-2xl text-[#1C1815]">Studio Details</h2>
              
              <div className="flex items-start gap-4">
                <MapPin className="text-[#B8860B] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">Address</p>
                  <p className="text-sm text-[#1C1815] font-medium mt-1">
                    {SITE.address_lines.join(", ")}
                  </p>
                  <p className="text-xs text-[#6E685E] mt-0.5">{SITE.cities}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="text-[#B8860B] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">Telephone</p>
                  <a
                    href="tel:+919351996272"
                    className="text-base text-[#1C1815] font-medium mt-1 hover:text-[#B8860B] transition-colors inline-block"
                  >
                    +91 93519 96272
                  </a>
                  <p className="text-xs text-[#6E685E] mt-0.5">Mon – Sat, 10:00 AM – 7:00 PM IST</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MessageCircle className="text-[#25D366] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">WhatsApp Concierge</p>
                  <a
                    href="https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="text-[#B8860B] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">Email</p>
                  <a
                    href="mailto:hello@wlpens.in"
                    className="text-sm text-[#1C1815] font-medium mt-1 hover:text-[#B8860B] transition-colors inline-block"
                  >
                    hello@wlpens.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="text-[#B8860B] mt-1 shrink-0" size={20} />
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E]">Dispatch &amp; Studio Hours</p>
                  <p className="text-xs text-[#1C1815] mt-1">Orders dispatched within 48 hours.</p>
                  <p className="text-xs text-[#6E685E]">Hand-etched personalization adds 2 working days.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Inquiry Form */}
          <div className="border border-[#E6E0D6] bg-[#FAF8F5] p-8 lg:p-10">
            <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B]">DIRECT INQUIRY</p>
            <h2 className="font-serif text-2xl lg:text-3xl text-[#1C1815] mt-1">Leave a message.</h2>
            <p className="text-xs text-[#6E685E] mt-2 mb-8">
              We respond to all bespoke pen, corporate gifting, and engraving requests within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Aryan Kumar"
                  className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] placeholder:text-[#6E685E]/40"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Email Address</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@example.com"
                    className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] placeholder:text-[#6E685E]/40"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+91 ..."
                    className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] placeholder:text-[#6E685E]/40"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">Message or Inquiry *</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Inquiry regarding bespoke nib tuning, wedding gift sets, custom engraving, or studio orders…"
                  className="w-full bg-transparent border border-[#E6E0D6] p-3 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] resize-y placeholder:text-[#6E685E]/40"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] transition-colors flex items-center justify-center gap-3 font-medium"
              >
                Send via WhatsApp Concierge <Send size={14}/>
              </button>

              {sent && (
                <p className="text-xs text-[#3D4838] text-center">
                  Thank you! Our studio team will connect with you shortly.
                </p>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
