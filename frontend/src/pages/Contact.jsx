import { useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { MapPin, Phone, Mail, MessageCircle, Clock, Send, Sparkles, CheckCircle2, Loader2, RefreshCw } from "lucide-react";
import { SITE } from "../lib/site";
import { api } from "../lib/api";
import { toast } from "sonner";

const DEFAULT_INQUIRY_TYPES = [
  "General Studio Inquiry",
  "Bespoke Nib Tuning & Engraving",
  "Corporate & Wedding Gifting",
  "Order Status & Dispatch",
  "Private Studio Consultation (Panchkula)",
];

export default function Contact() {
  const [inquiryTypes, setInquiryTypes] = useState(DEFAULT_INQUIRY_TYPES);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    inquiryType: DEFAULT_INQUIRY_TYPES[0],
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    api.get("/site/banner")
      .then((r) => {
        if (Array.isArray(r.data?.contact_inquiry_types) && r.data.contact_inquiry_types.length > 0) {
          setInquiryTypes(r.data.contact_inquiry_types);
          setForm((prev) => ({
            ...prev,
            inquiryType: r.data.contact_inquiry_types.includes(prev.inquiryType)
              ? prev.inquiryType
              : r.data.contact_inquiry_types[0],
          }));
        }
      })
      .catch(() => {});
  }, []);

  // EmailJS configuration via environment variables with fallback defaults
  const EMAILJS_SERVICE_ID = process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_wlpens";
  const EMAILJS_TEMPLATE_ID = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "template_wlpens";
  const EMAILJS_PUBLIC_KEY = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "";

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please provide your name, email, and message.");
      return;
    }

    if (!EMAILJS_PUBLIC_KEY || EMAILJS_PUBLIC_KEY === "YOUR_EMAILJS_PUBLIC_KEY") {
      // If keys are not yet configured in .env.local, inform user and open mailto as fallback
      toast.error("EmailJS keys are pending setup in .env.local. Please check instructions.", {
        duration: 5000,
      });
      window.open(
        `mailto:hello@wlpens.in?subject=${encodeURIComponent(`[${form.inquiryType}] Inquiry from ${form.name}`)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || "N/A"}\nInquiry Type: ${form.inquiryType}\n\nMessage:\n${form.message}`)}`,
        "_blank"
      );
      return;
    }

    setLoading(true);

    try {
      const templateParams = {
        name: form.name.trim(),
        from_name: form.name.trim(),
        email: form.email.trim(),
        from_email: form.email.trim(),
        reply_to: form.email.trim(),
        phone: form.phone.trim() || "Not provided",
        inquiry_type: form.inquiryType,
        message: form.message.trim(),
        submitted_at: new Date().toLocaleString("en-IN", {
          dateStyle: "full",
          timeStyle: "short",
          timeZone: "Asia/Kolkata",
        }),
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setSent(true);
      toast.success("Your message has been sent directly to our atelier inbox!");
    } catch (err) {
      console.error("EmailJS Error:", err);
      toast.error("Failed to send message via Email. You can also chat with us on WhatsApp!");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppSend = () => {
    if (!form.name.trim() && !form.message.trim()) {
      // Default general greeting
      window.open(
        `https://wa.me/919351996272?text=${encodeURIComponent("Hello The WL Pens Studio, I would like to inquire about your pens.")}`,
        "_blank"
      );
      return;
    }

    const waMessage = encodeURIComponent(
      `Hello The WL Pens Studio,\n*Topic:* ${form.inquiryType}\n*Name:* ${form.name || "N/A"}\n*Email:* ${form.email || "N/A"}\n*Phone:* ${form.phone || "N/A"}\n\n*Inquiry:* ${form.message || "I would like to inquire about your bespoke collection."}`
    );
    window.open(`https://wa.me/919351996272?text=${waMessage}`, "_blank");
    toast.success("Opening WhatsApp Concierge with your details.");
  };

  const handleReset = () => {
    setForm({ name: "", email: "", phone: "", inquiryType: "General Inquiry", message: "" });
    setSent(false);
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      {/* Header */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-16">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 text-[#B8860B] text-[11px] uppercase tracking-[0.3em] mb-4">
            <Sparkles size={14} />
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
                  <p className="text-xs text-[#6E685E] mt-0.5 mb-2">Instant assistance &amp; custom orders</p>
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-5 py-2.5 text-xs uppercase tracking-[0.2em] hover:bg-[#3D4838] transition-colors"
                  >
                    <MessageCircle size={14} className="text-[#25D366]" /> Chat on WhatsApp
                  </button>
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
              Send an email straight to our studio or connect instantly via WhatsApp Concierge.
            </p>

            {sent ? (
              <div className="p-8 text-center bg-[#F3EFEA] border border-[#E6E0D6] space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#3D4838]/10 text-[#3D4838] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={24} />
                </div>
                <h3 className="font-serif text-2xl text-[#1C1815]">Inquiry Received</h3>
                <p className="text-sm text-[#6E685E] max-w-md mx-auto leading-relaxed">
                  Thank you for reaching out to <strong className="text-[#1C1815] font-medium">{form.name}</strong>. Our studio curators will respond to your email (<strong className="text-[#1C1815] font-medium">{form.email}</strong>) within 24 hours.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] border border-[#1C1815] px-5 py-2.5 text-[#1C1815] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-colors"
                  >
                    <RefreshCw size={12} /> Send Another Note
                  </button>
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] bg-[#25D366] text-white px-5 py-2.5 hover:bg-[#1ebd59] transition-colors"
                  >
                    <MessageCircle size={14} /> Also Send on WhatsApp
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">
                    Your Name <span className="text-[#B8860B]">*</span>
                  </label>
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
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">
                      Email Address <span className="text-[#B8860B]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] placeholder:text-[#6E685E]/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] placeholder:text-[#6E685E]/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">
                    Subject / Inquiry Type
                  </label>
                  <select
                    value={form.inquiryType}
                    onChange={(e) => setForm({ ...form, inquiryType: e.target.value })}
                    className="w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#1C1815]"
                  >
                    {inquiryTypes.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mb-2">
                    Message or Inquiry <span className="text-[#B8860B]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Inquiry regarding bespoke nib tuning, wedding gift sets, custom engraving, or studio orders…"
                    className="w-full bg-transparent border border-[#E6E0D6] p-3 text-sm text-[#1C1815] outline-none focus:border-[#1C1815] resize-y placeholder:text-[#6E685E]/40"
                  />
                </div>

                <div className="space-y-3 pt-2">
                  {/* Primary Email Send Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:opacity-60 transition-colors flex items-center justify-center gap-3 font-medium cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Sending to Studio Inbox...</span>
                      </>
                    ) : (
                      <>
                        <Mail size={15} />
                        <span>Send via Email</span>
                      </>
                    )}
                  </button>

                  {/* Secondary WhatsApp Button */}
                  <button
                    type="button"
                    onClick={handleWhatsAppSend}
                    className="w-full border border-[#25D366] text-[#1C1815] hover:bg-[#25D366]/10 py-3 text-xs uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-2 font-medium cursor-pointer"
                  >
                    <MessageCircle size={15} className="text-[#25D366]" />
                    <span>Send via WhatsApp Concierge</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

