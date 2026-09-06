import { SITE } from "../lib/site";
import { MapPin, Mail, Phone, MessageCircle } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="mt-32 border-t border-[#E6E0D6] bg-[#F3EFEA]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <p className="text-xs uppercase tracking-[0.25em] text-[#B8860B] mb-4">{SITE.brand.toUpperCase()} · {SITE.founded.toUpperCase()}</p>
          <h3 className="font-serif text-3xl lg:text-4xl text-[#1C1815] leading-[1.1] mb-4">
            Made for the<br/><em className="text-[#3D4838]">slow hand.</em>
          </h3>
          <p className="text-sm text-[#6E685E] max-w-md leading-relaxed">
            {SITE.brand} — a small atelier of writing instruments, hand-picked, hand-engraved and shipped from the foothills of the Shivaliks.
          </p>
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Studio</h4>
          <address className="not-italic text-sm text-[#6E685E] leading-relaxed" data-testid="footer-address">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 text-[#B8860B] flex-shrink-0"/>
              <span>
                {SITE.address_lines.map((l, i) => (
                  <span key={i}>{l}<br/></span>
                ))}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3">
              <Phone size={14} className="text-[#B8860B] flex-shrink-0"/>
              <a href="tel:+919351996272" className="hover:text-[#1C1815] transition-colors" data-testid="footer-phone">
                +91 93519 96272
              </a>
            </div>
            <div className="flex items-center gap-2 mt-2">
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
            <div className="flex items-center gap-2 mt-2">
              <Mail size={14} className="text-[#B8860B] flex-shrink-0"/>
              <a href="mailto:hello@wlpens.in" className="hover:text-[#1C1815]">hello@wlpens.in</a>
            </div>
          </address>
        </div>
        <div>
          <h4 className="font-serif text-lg text-[#1C1815] mb-4">Care</h4>
          <ul className="space-y-2 text-sm text-[#6E685E]">
            <li>Shipping &amp; Returns</li>
            <li>Engraving guide</li>
            <li>Ink care</li>
            <li>Warranty</li>
            <li>Contact</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#E6E0D6] py-6 px-6 lg:px-12 text-xs tracking-[0.15em] text-[#6E685E] flex flex-wrap justify-between items-center gap-4 max-w-[1600px] mx-auto">
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
        <span className="uppercase">{SITE.cities}</span>
      </div>
    </footer>
  );
}
