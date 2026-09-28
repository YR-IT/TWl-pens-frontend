import { ShieldCheck, Award, Sparkles, CheckCircle2 } from "lucide-react";

const DEFAULT_TRUST_ITEMS = [
  "100% GENUINE ATELIER PRODUCTS",
  "OFFICIAL BRAND AUTHORIZED DISTRIBUTOR",
  "1-YEAR ATELIER COMPREHENSIVE WARRANTY",
  "EXPRESS DISPATCH FROM PANCHKULA",
  "LIFETIME WRITING INSTRUMENT CARE",
];

export default function SecondaryTrustMarquee({ items, className = "" }) {
  const list = Array.isArray(items) && items.length > 0 ? items : DEFAULT_TRUST_ITEMS;
  const loopItems = [...list, ...list, ...list, ...list];

  return (
    <div
      className={`announcement-bar w-full bg-[#FAF8F5] text-[#1C1815] py-4 overflow-hidden border-y border-[#E6E0D6] group cursor-pointer ${className}`}
      data-testid="secondary-trust-marquee"
    >
      <div className="animate-marquee-infinite flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
        {loopItems.map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-8">
            <CheckCircle2 size={14} className="text-[#B8860B] flex-shrink-0" />
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#1C1815]">
              {item}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
