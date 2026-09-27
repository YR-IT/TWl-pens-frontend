import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const DEFAULT_ENGRAVING = {
  eyebrow: "CRAFTED FOR YOU",
  title: "CUSTOM NAME ENGRAVING",
  subtitle: "Personalise the pen with a name for a thoughtful and elegant gift.",
  cta_text: "Contact Us",
  cta_link: "/contact",
};

export default function MinimalEngravingSection({ data, className = "" }) {
  const cfg = { ...DEFAULT_ENGRAVING, ...data };

  return (
    <section className={`w-full bg-[#FAF8F5] py-20 sm:py-24 px-6 text-center border-y border-[#E6E0D6] ${className}`} data-testid="minimal-engraving-section">
      <div className="max-w-3xl mx-auto space-y-4 sm:space-y-5">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold">
          {cfg.eyebrow}
        </p>
        
        <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#1C1815] tracking-tight leading-tight">
          {cfg.title}
        </h2>

        <p className="text-sm sm:text-base lg:text-lg text-[#6E685E] font-light max-w-xl mx-auto leading-relaxed pt-1">
          {cfg.subtitle}
        </p>

        <div className="pt-6">
          {cfg.cta_link?.startsWith("http") || cfg.cta_link?.startsWith("mailto:") ? (
            <a
              href={cfg.cta_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#1C1815] text-[#FAF8F5] px-8 sm:px-10 py-3.5 rounded-full uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#3D4838] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
              data-testid="engraving-contact-btn"
            >
              <span>{cfg.cta_text}</span>
              <ArrowRight size={14} />
            </a>
          ) : (
            <Link
              to={cfg.cta_link || "/contact"}
              className="inline-flex items-center gap-2.5 bg-[#1C1815] text-[#FAF8F5] px-8 sm:px-10 py-3.5 rounded-full uppercase tracking-[0.2em] text-xs font-medium hover:bg-[#3D4838] transition-all duration-200 shadow-sm hover:shadow-md hover:scale-105"
              data-testid="engraving-contact-btn"
            >
              <span>{cfg.cta_text}</span>
              <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
