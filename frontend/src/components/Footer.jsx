import { SITE } from "../lib/site";
import { MapPin, Mail, Phone, MessageCircle, Instagram, Youtube, Shield, Truck, RefreshCw, Award, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../logo.png";

const TRUST_BADGES = [
  { icon: Truck, label: "Ships in 48 Hours" },
  { icon: Award, label: "100% Authentic Instruments" },
  { icon: Shield, label: "Secure Payment" },
  { icon: RefreshCw, label: "Hassle-Free Returns" },
];

const SOCIAL = [
  { icon: Instagram, href: "https://instagram.com/thewlpens", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com/@thewlpens", label: "YouTube" },
  { icon: MessageCircle, href: "https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer id="contact" className="mt-12 sm:mt-16 border-t border-[#E6E0D6] bg-[#F3EFEA]">
      {/* Sleek Trust & Quality Strip */}
      <div className="border-b border-[#E6E0D6] bg-[#FAF8F5] py-4 px-4 sm:px-6 lg:px-12">
        <div className="max-w-[1600px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {TRUST_BADGES.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center justify-center gap-2 py-1 text-center">
              <Icon size={15} className="text-[#B8860B] shrink-0" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.15em] text-[#1C1815] font-medium">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Navigation & Studio Info */}
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Col 1: Brand Atelier (lg: 4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img src={logo} alt="The WL Pens" className="h-9 w-auto" />
              <span className="font-serif text-xl sm:text-2xl tracking-[0.12em] text-[#1C1815] font-medium">
                The <span className="text-[#B8860B]">WL</span> PENS
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-[#6E685E] leading-relaxed max-w-sm font-light">
              Bespoke writing instruments, archival inks and precision diamond engraving. Hand-inspected and nib-tested in our Panchkula atelier.
            </p>
            <div className="pt-2 flex items-center gap-2.5">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 border border-[#E6E0D6] bg-[#FAF8F5] rounded-full flex items-center justify-center text-[#6E685E] hover:border-[#B8860B] hover:text-[#B8860B] hover:bg-white transition-all shadow-2xs"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Collections (lg: 2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base text-[#1C1815] font-medium">Collections</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E685E]">
              <li>
                <Link to="/shop?category=Fountain%20Pens" className="hover:text-[#1C1815] transition-colors">
                  Fountain Pens
                </Link>
              </li>
              <li>
                <Link to="/new-arrivals" className="hover:text-[#1C1815] transition-colors">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link to="/best-sellers" className="hover:text-[#1C1815] transition-colors">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=Inks" className="hover:text-[#1C1815] transition-colors">
                  Archival Inks
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-[#1C1815] transition-colors">
                  All Collections
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Atelier & Services (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base text-[#1C1815] font-medium">Atelier &amp; Services</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#6E685E]">
              <li>
                <Link to="/shop" className="hover:text-[#1C1815] transition-colors">
                  Bespoke Studio Engraving
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1C1815] transition-colors">
                  Corporate &amp; Wedding Gifting
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#1C1815] transition-colors">
                  Contact Atelier
                </Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-[#1C1815] transition-colors">
                  Order Tracking &amp; Account
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#1EBE5B] font-medium transition-colors"
                >
                  WhatsApp Concierge <ArrowUpRight size={13} />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Studio Location & Contact (lg: 3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base text-[#1C1815] font-medium">Panchkula Atelier</h4>
            <div className="text-xs sm:text-sm text-[#6E685E] space-y-2 leading-relaxed">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="text-[#B8860B] shrink-0 mt-0.5" />
                <span>
                  Chandi Mandir, Panchkula<br />
                  Haryana — 134107, India
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="text-[#B8860B] shrink-0" />
                <a href="tel:+919351996272" className="text-[#1C1815] hover:text-[#B8860B] font-medium transition-colors">
                  +91 93519 96272
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={15} className="text-[#B8860B] shrink-0" />
                <a href="mailto:hello@wlpens.in" className="hover:text-[#1C1815] transition-colors">
                  hello@wlpens.in
                </a>
              </p>
              <p className="text-[11px] text-[#6E685E] pt-1">
                Mon – Sat: 10:00 AM – 7:00 PM IST
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Copyright Bar & Developer Credit */}
      <div className="border-t border-[#E6E0D6] bg-[#FAF8F5] py-5 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6E685E] text-center sm:text-left">
          <span className="tracking-wide">
            © {new Date().getFullYear()} <strong className="font-medium text-[#1C1815]">{SITE.brand}</strong>. All rights reserved.
          </span>
          <span className="tracking-normal">
            Designed and Developed by{" "}
            <a
              href="https://www.yritsolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1C1815] font-medium hover:text-[#B8860B] underline underline-offset-4 transition-colors"
            >
              YR IT Solutions
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
