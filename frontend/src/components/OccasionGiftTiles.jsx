import { Link } from "react-router-dom";
import { ArrowRight, Gift } from "lucide-react";
import { fileUrl } from "../lib/api";

const DEFAULT_OCCASION = {
  card_left: {
    title: "Gifts for Her",
    subtitle: "Slender profiles, refined rose gold accents, and delicate lacquer finishes.",
    image: "https://images.unsplash.com/photo-1585336261026-78b17b6a1f81?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    link: "/shop?category=Fountain%20Pens",
  },
  card_right: {
    title: "Gifts for Him",
    subtitle: "Substantial brass weight, knurled grip, and matte black & gold hardware.",
    image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    link: "/shop?category=Rollerball%20Pens",
  },
};

export default function OccasionGiftTiles({ data, className = "" }) {
  const left = data?.card_left || DEFAULT_OCCASION.card_left;
  const right = data?.card_right || DEFAULT_OCCASION.card_right;

  return (
    <section className={`max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-20 ${className}`} data-testid="occasion-gift-tiles-section">
      <div className="text-center mb-10 sm:mb-14">
        <div className="inline-flex items-center gap-2 text-[#B8860B] text-[10px] sm:text-xs uppercase tracking-[0.35em] font-semibold mb-2">
          <Gift size={14} />
          <span>CURATED OCCASIONS</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] tracking-wide uppercase">
          GIFTS OF DISTINCTION
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-[#6E685E] max-w-xl mx-auto">
          Thoughtfully matched writing instruments designed to mark milestones and celebrate lifelong achievements.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Left: Gifts for Her */}
        <Link
          to={left.link}
          className="group relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#1C1815]"
          data-testid="occasion-card-her"
        >
          <img
            src={left.image.startsWith("http") || left.image.startsWith("/") ? fileUrl(left.image) : left.image}
            alt={left.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white flex flex-col justify-end">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-medium mb-1">
              CURATED COLLECTION
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] leading-tight">
              {left.title}
            </h3>
            {left.subtitle && (
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 mt-2 max-w-md line-clamp-2 leading-relaxed">
                {left.subtitle}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold group-hover:text-[#B8860B] transition-colors">
              <span>Shop Selection</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>

        {/* Right: Gifts for Him */}
        <Link
          to={right.link}
          className="group relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#1C1815]"
          data-testid="occasion-card-him"
        >
          <img
            src={right.image.startsWith("http") || right.image.startsWith("/") ? fileUrl(right.image) : right.image}
            alt={right.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 text-white flex flex-col justify-end">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-medium mb-1">
              CURATED COLLECTION
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] leading-tight">
              {right.title}
            </h3>
            {right.subtitle && (
              <p className="text-xs sm:text-sm text-[#FAF8F5]/80 mt-2 max-w-md line-clamp-2 leading-relaxed">
                {right.subtitle}
              </p>
            )}
            <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#FAF8F5] font-semibold group-hover:text-[#B8860B] transition-colors">
              <span>Shop Selection</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
