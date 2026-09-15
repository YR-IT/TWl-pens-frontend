import { SITE } from "../lib/site";
import { MapPin, Mail, Phone, MessageCircle, Instagram, Youtube, Shield, Truck, RefreshCw, Award } from "lucide-react";
import { Link } from "react-router-dom";

const TRUST_BADGES = [
  { icon: Truck, label: "Ships in 48hrs" },
  { icon: Shield, label: "Secure Checkout" },
  { icon: Award, label: "Authentic Products" },
  { icon: RefreshCw, label: "Easy Returns" },
];

const SOCIAL = [
  { icon: Instagram, href: "https://instagram.com/thewlpens", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@thewlpens", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer id="contact" className="mt-12 sm:mt-20 border-t border-[#E6E0D6] bg-[#F3EFEA]">
      {/* SEO Tagline Banner */}
      <div className="border-b border-[#E6E0D6] py-14 px-6 lg:px-12 text-center bg-[#FAF8F5]">
        <p className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B] mb-4">{SITE.brand.toUpperCase()} · {SITE.founded.toUpperCase()}</p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-6xl text-[#1C1815] leading-[1.1] max-w-3xl mx-auto">
          India's finest writing<br/><em className="text-[#3D4838]">instrument atelier.</em>
        </h2>
        <p className="text-sm text-[#6E685E] mt-5 max-w-xl mx-auto leading-relaxed">
          Hand-selected pens, pigment inks and accessories — engraved to order, shipped from Panchkula to pen lovers across India.
        </p>
      </div>

      {/* Trust Badges */}
      <div className="border-b border-[#E6E0D6] py-6 px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3 justify-center">
              <Icon size={16} className="text-[#B8860B] flex-shrink-0"/>
              <span className="text-[11px] uppercase tracking-[0.2em] text-[#1C1815] font-medium">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Grid */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand + Contact */}
        <div className="md:col-span-2">
          <p className="font-serif text-2xl text-[#1C1815] mb-1">The WL Pens</p>
          <p className="text-xs text-[#6E685E] mb-6">Made for the slow hand.</p>
          <address className="not-italic text-sm text-[#6E685E] leading-relaxed space-y-3" data-testid="footer-address">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-[#B8860B] flex-shrink-0"/>
              <span>
                {SITE.address_lines.map((l, i) => (
                  <span key={i}>{l}<br/></span>
                ))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-[#B8860B] flex-shrink-0"/>
              <a href="tel:+919351996272" className="hover:text-[#1C1815] transition-colors" data-testid="footer-phone">
                +91 93519 96272
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-[#25D366] flex-shrink-0"/>
              <a
                href="https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#1C1815] transition-colors text-xs"
                data-testid="footer-whatsapp"
              >
                WhatsApp Concierge
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-[#B8860B] flex-shrink-0"/>
              <a href="mailto:hello@wlpens.in" className="hover:text-[#1C1815]">hello@wlpens.in</a>
            </div>
          </address>

          {/* Social Links */}
          <div className="flex items-center gap-3 mt-6">
            {SOCIAL.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 border border-[#E6E0D6] flex items-center justify-center text-[#6E685E] hover:border-[#B8860B] hover:text-[#B8860B] transition-colors"
              >
                <Icon size={15}/>
              </a>
            ))}
          </div>
        </div>

        {/* Policies / Care */}
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Policies</h4>
          <ul className="space-y-2.5 text-sm text-[#6E685E]">
            <li><Link to="/shipping" className="hover:text-[#1C1815] transition-colors">Shipping &amp; Returns</Link></li>
            <li><Link to="/engraving" className="hover:text-[#1C1815] transition-colors">Engraving Guide</Link></li>
            <li><Link to="/ink-care" className="hover:text-[#1C1815] transition-colors">Ink Care</Link></li>
            <li><Link to="/warranty" className="hover:text-[#1C1815] transition-colors">Warranty</Link></li>
            <li><Link to="/privacy" className="hover:text-[#1C1815] transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-[#1C1815] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        {/* Store Locator / Studio */}
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Visit Us</h4>
          <div className="text-sm text-[#6E685E] leading-relaxed space-y-3">
            <p className="text-[#1C1815] font-medium">The WL Pens Studio</p>
            <p>Chandi Mandir, Panchkula<br/>Haryana — 134107</p>
            <p className="text-xs">Mon – Sat: 10am – 7pm<br/>Sunday: By appointment</p>
            <a
              href="https://maps.google.com/?q=Chandi+Mandir+Panchkula+Haryana"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#B8860B] text-xs underline underline-offset-4 hover:text-[#96700A] transition-colors mt-2"
            >
              <MapPin size={12}/> Get Directions
            </a>
          </div>
          <div className="mt-6">
            <h4 className="font-serif text-lg text-[#1C1815] mb-3">Also in</h4>
            <p className="text-sm text-[#6E685E]">{SITE.cities}</p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#E6E0D6] py-6 px-6 lg:px-12 text-xs tracking-[0.15em] text-[#6E685E] flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-3 max-w-[1600px] mx-auto">
        <span className="uppercase">© 2026 {SITE.brand}</span>
        <span className="normal-case tracking-normal text-xs text-[#6E685E]">
          Design and Development by{" "}
          <a
            href="https://yritsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#1C1815] font-medium hover:text-[#B8860B] transition-colors underline underline-offset-4"
          >
            YR IT SOLUTIONS
          </a>{" "}
          (<a
            href="https://yritsolutions.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#B8860B] transition-colors"
          >yritsolutions.com</a>)
        </span>
        <span className="uppercase hidden sm:inline">{SITE.cities}</span>
      </div>
    </footer>
  );
}
