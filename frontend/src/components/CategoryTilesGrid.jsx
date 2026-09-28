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
            className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-3xl shadow-md hover:shadow-xl transition-all duration-500 block bg-[#1C1815]"
            data-testid={`category-tile-${idx}`}
          >
            <img
              src={tile.image}
              alt={tile.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-95"
            />
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent transition-opacity duration-500" />

            {/* Bottom Content Card */}
            <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 text-white flex flex-col justify-end">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-medium mb-1">
                {tile.tag || "COLLECTION"}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF8F5] leading-tight">
                {tile.title}
              </h3>
              {tile.description && (
                <p className="text-xs text-[#FAF8F5]/80 mt-1.5 line-clamp-2 leading-relaxed">
                  {tile.description}
                </p>
              )}
              <div className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#B8860B] font-semibold group-hover:text-white transition-colors">
                <span>Explore Category</span>
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
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
