import { Link } from "react-router-dom";
import { Sparkles, ArrowRight } from "lucide-react";

export default function NewArrivalsTicker({ variant = "dark" }) {
  const isDark = variant === "dark";

  const items = [
    { text: "NEW ARRIVALS", highlight: true },
    { text: "SS/26 ATELIER COLLECTION" },
    { text: "HAND-GROUND IRIDIUM NIBS", highlight: true },
    { text: "FREE BESPOKE STUDIO ENGRAVING" },
    { text: "LIMITED PRODUCTION BATCHES", highlight: true },
    { text: "PANCHKULA ATELIER · FAST DISPATCH" },
    { text: "EXPLORE COLLECTION", isCta: true },
  ];

  const renderContent = () => (
    <div className="flex items-center gap-8 px-4 shrink-0">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-8">
          <span
            className={`inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] font-medium ${
              item.isCta
                ? isDark
                  ? "text-[#B8860B] font-semibold underline underline-offset-4"
                  : "text-[#1C1815] font-semibold underline underline-offset-4"
                : item.highlight
                ? "text-[#B8860B]"
                : isDark
                ? "text-[#FAF8F5]/90"
                : "text-[#1C1815]/85"
            }`}
          >
            {item.highlight && <Sparkles size={12} className="text-[#B8860B] shrink-0" />}
            {item.text}
            {item.isCta && <ArrowRight size={12} className="shrink-0 ml-1" />}
          </span>
          <span className={`w-1.5 h-1.5 rounded-full ${isDark ? "bg-[#B8860B]/60" : "bg-[#3D4838]/40"}`} />
        </div>
      ))}
    </div>
  );

  return (
    <div
      className={`relative w-full overflow-hidden border-y py-3.5 select-none transition-colors group cursor-pointer ${
        isDark
          ? "bg-[#1C1815] text-[#FAF8F5] border-[#3D4838]"
          : "bg-[#F3EFEA] text-[#1C1815] border-[#E6E0D6]"
      }`}
      data-testid="new-arrivals-ticker"
    >
      <Link to="/new-arrivals" className="block focus:outline-none" title="Explore New Arrivals">
        <div className="animate-marquee-infinite flex items-center">
          {renderContent()}
          {renderContent()}
        </div>
      </Link>
    </div>
  );
}
