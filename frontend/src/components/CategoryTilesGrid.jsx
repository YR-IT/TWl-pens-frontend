import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function CategoryTilesGrid({
  eyebrow = "WRITING INSTRUMENTS",
  title = "DISCOVER OUR HALLMARK CATEGORIES",
  subtitle = "Engineered for effortless glide, supreme balance, and timeless aesthetic.",
  tiles = [],
  showBrowseAll = true,
  className = "",
}) {
  return (
    <section className={`max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-20 ${className}`} data-testid={`category-grid-${eyebrow.toLowerCase().replace(/[^a-z0-9]/g, "-")}`}>
      {/* Header */}
      <div className="text-center mb-10 sm:mb-12">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold">
          {eyebrow}
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2 tracking-wide uppercase">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-xs sm:text-sm text-[#6E685E] max-w-xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        {tiles.map((tile, idx) => (
          <Link
            key={tile.title || idx}
            to={tile.link || `/shop?category=${encodeURIComponent(tile.category || tile.title)}`}
            className="group flex flex-col overflow-hidden rounded-2xl sm:rounded-3xl border border-[#E6E0D6]/70 bg-[#FAF8F5] shadow-sm hover:shadow-xl transition-all duration-500"
            data-testid={`category-tile-${idx}`}
          >
            {/* Full Length Image Container */}
            <div className="relative aspect-[3/4] sm:aspect-[4/5] overflow-hidden bg-[#1C1815]/5">
              <img
                src={tile.image}
                alt={tile.title}
                loading="lazy"
                decoding="async"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              {tile.tag && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 text-[9px] sm:text-[10px] uppercase tracking-[0.25em] font-semibold bg-[#1C1815]/75 backdrop-blur-md text-[#D4AF37] rounded-full shadow-sm">
                    {tile.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Separated Content Section Below Image */}
            <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between bg-white border-t border-[#E6E0D6]/60">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1815] group-hover:text-[#B8860B] transition-colors leading-tight font-normal">
                  {tile.title}
                </h3>
                {tile.description && (
                  <p className="text-xs sm:text-sm text-[#6E685E] mt-2 line-clamp-2 leading-relaxed">
                    {tile.description}
                  </p>
                )}
              </div>

              <div className="mt-5 pt-4 border-t border-[#E6E0D6]/40 flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#1C1815] font-semibold group-hover:text-[#B8860B] transition-colors">
                <span>Explore Category</span>
                <span className="w-8 h-8 rounded-full bg-[#FAF8F5] border border-[#E6E0D6] flex items-center justify-center group-hover:bg-[#1C1815] group-hover:text-[#FAF8F5] group-hover:border-[#1C1815] transition-all duration-300">
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Browse All Categories Button */}
      {showBrowseAll && (
        <div className="flex justify-center mt-10">
          <Link
            to="/shop"
            className="inline-flex items-center justify-center px-8 py-3 rounded-full border border-[#1C1815] text-[#1C1815] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium shadow-sm hover:shadow"
            data-testid="grid-browse-all-btn"
          >
            Browse All Writing Categories
          </Link>
        </div>
      )}
    </section>
  );
}
