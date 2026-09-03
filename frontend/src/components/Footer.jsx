import { SITE } from "../lib/site";
import { MapPin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-32 border-t border-[#E6E0D6] bg-[#F3EFEA]">
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
              <Mail size={14} className="text-[#B8860B]"/>
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
      <div className="border-t border-[#E6E0D6] py-6 px-6 lg:px-12 text-xs uppercase tracking-[0.2em] text-[#6E685E] flex flex-wrap justify-between gap-3 max-w-[1600px] mx-auto">
        <span>© 2026 {SITE.brand}</span>
        <span>{SITE.cities}</span>
      </div>
    </footer>
  );
}
