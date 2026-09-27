import { useEffect, useRef, useState } from "react";
import { 
  Truck, 
  Sparkles, 
  ShieldCheck, 
  Award, 
  Gift, 
  RefreshCw, 
  Headphones, 
  CreditCard, 
  PackageCheck,
  CheckCircle2,
  HelpCircle,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { fileUrl } from "../lib/api";

const ICON_MAP = {
  Truck,
  Sparkles,
  ShieldCheck,
  Award,
  Gift,
  RefreshCw,
  Headphones,
  CreditCard,
  PackageCheck,
  CheckCircle2,
};

const DEFAULT_USP_ITEMS = [
  {
    icon: "Truck",
    title: "Free Shipping",
    subtext: "Free delivery on orders above ₹1499",
  },
  {
    icon: "Sparkles",
    title: "Complimentary Refill",
    subtext: "Extra refill with selected pens",
  },
  {
    icon: "ShieldCheck",
    title: "100% Genuine Products",
    subtext: "Authentic products from trusted brands",
  },
  {
    icon: "Award",
    title: "Expertly Curated",
    subtext: "Pens selected for every kind of writer",
  },
];

export default function TrustBar({ items, className = "" }) {
  const uspItems = Array.isArray(items) && items.length > 0 ? items : DEFAULT_USP_ITEMS;
  const scrollRef = useRef(null);
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  // Auto-scroll loop on mobile
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let timeout;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const nextIdx = (activeMobileIdx + 1) % uspItems.length;
      setActiveMobileIdx(nextIdx);
      const cardWidth = scrollRef.current.clientWidth * 0.85;
      scrollRef.current.scrollTo({
        left: nextIdx * cardWidth,
        behavior: "smooth",
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [activeMobileIdx, uspItems.length]);

  const renderIcon = (iconNameOrUrl) => {
    if (!iconNameOrUrl) return <Truck size={24} className="text-[#B8860B]" />;
    
    // Check if it's a known Lucide icon name
    const Comp = ICON_MAP[iconNameOrUrl];
    if (Comp) {
      return <Comp size={26} className="text-[#B8860B] stroke-[1.75]" />;
    }

    // Otherwise treat as an image URL
    if (typeof iconNameOrUrl === "string" && (iconNameOrUrl.startsWith("http") || iconNameOrUrl.startsWith("/") || iconNameOrUrl.startsWith("data:"))) {
      return (
        <img
          src={fileUrl(iconNameOrUrl)}
          alt=""
          className="w-7 h-7 object-contain"
        />
      );
    }

    return <Sparkles size={24} className="text-[#B8860B]" />;
  };

  return (
    <section className={`w-full bg-[#FAF8F5] border-y border-[#E6E0D6] py-6 sm:py-8 ${className}`} data-testid="trust-bar-section">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
        {/* Desktop / Tablet PC View: 4 Equal Columns */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E6E0D6]/70">
          {uspItems.map((item, idx) => (
            <div
              key={item.title || idx}
              className={`flex items-center gap-4 ${idx > 0 ? "md:pl-6 lg:pl-8" : ""} group transition-transform duration-200 hover:-translate-y-0.5`}
            >
              <div className="w-12 h-12 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] flex-shrink-0 flex items-center justify-center transition-colors group-hover:border-[#B8860B] group-hover:bg-white shadow-xs">
                {renderIcon(item.icon)}
              </div>
              <div>
                <h4 className="font-serif text-base text-[#1C1815] font-semibold leading-tight tracking-wide">
                  {item.title}
                </h4>
                <p className="text-xs text-[#6E685E] mt-0.5 leading-snug">
                  {item.subtext}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile / Swipeable & Auto-scrolling Carousel */}
        <div className="md:hidden">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1"
            onScroll={(e) => {
              const cardWidth = e.currentTarget.clientWidth * 0.82;
              const cur = Math.round(e.currentTarget.scrollLeft / cardWidth);
              if (cur !== activeMobileIdx && cur >= 0 && cur < uspItems.length) {
                setActiveMobileIdx(cur);
              }
            }}
          >
            {uspItems.map((item, idx) => (
              <div
                key={item.title || idx}
                className="min-w-[82vw] sm:min-w-[340px] snap-center bg-white border border-[#E6E0D6] p-4 rounded-sm flex items-center gap-3.5 shadow-xs"
              >
                <div className="w-11 h-11 rounded-full bg-[#F3EFEA] border border-[#E6E0D6] flex-shrink-0 flex items-center justify-center">
                  {renderIcon(item.icon)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-[#1C1815] leading-tight truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#6E685E] mt-0.5 leading-snug line-clamp-2">
                    {item.subtext}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots on mobile */}
          <div className="flex justify-center items-center gap-1.5 mt-3">
            {uspItems.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setActiveMobileIdx(idx);
                  if (scrollRef.current) {
                    const cardWidth = scrollRef.current.clientWidth * 0.85;
                    scrollRef.current.scrollTo({ left: idx * cardWidth, behavior: "smooth" });
                  }
                }}
                aria-label={`Go to trust item ${idx + 1}`}
                className={`h-1 rounded-full transition-all duration-300 ${
                  idx === activeMobileIdx ? "w-5 bg-[#B8860B]" : "w-1.5 bg-[#E6E0D6]"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
