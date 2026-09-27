import { Link } from "react-router-dom";
import { DEFAULT_BRAND_PARTNERS } from "../constants/brandLogos";
import { fileUrl } from "../lib/api";

export default function BrandMarqueeSection({ brands, className = "" }) {
  const brandList = Array.isArray(brands) && brands.length > 0
    ? brands
    : DEFAULT_BRAND_PARTNERS;

  // Quadruple items to guarantee seamless infinite loop regardless of screen width
  const loopItems = [...brandList, ...brandList, ...brandList, ...brandList];

  return (
    <section className={`w-full py-20 bg-[#FAF8F5] overflow-hidden ${className}`} data-testid="brand-marquee-section">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-10 text-center">
        <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold">
          06 / EXCLUSIVE PARTNERS
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2">
          Our writing houses.
        </h2>
        <p className="text-xs sm:text-sm text-[#6E685E] mt-2 max-w-md mx-auto">
          Authentic writing instruments and archival inks curated from master ateliers worldwide.
        </p>
      </div>

      {/* Continuously Moving Marquee Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Soft edge fade masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee flex items-center gap-8 sm:gap-12 px-4 cursor-grab">
          {loopItems.map((brand, idx) => {
            const logoSrc = brand.image || (brand.svg || "");
            const brandContent = (
              <div
                className="h-20 sm:h-24 min-w-[160px] sm:min-w-[200px] px-6 bg-white border border-[#E6E0D6] rounded-xl flex items-center justify-center shadow-xs hover:shadow-md hover:border-[#B8860B] transition-all duration-300 group flex-shrink-0"
              >
                {logoSrc ? (
                  <img
                    src={fileUrl(logoSrc)}
                    alt={brand.name || "Brand Partner Logo"}
                    loading="lazy"
                    decoding="async"
                    className="max-h-12 sm:max-h-14 max-w-[140px] sm:max-w-[170px] object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                ) : (
                  <span className="font-serif text-lg tracking-wider text-[#1C1815]/70 group-hover:text-[#1C1815] transition-colors">
                    {brand.name || "WL Partner"}
                  </span>
                )}
              </div>
            );

            if (brand.link) {
              return (
                <Link
                  key={`brand-${idx}`}
                  to={brand.link}
                  className="block flex-shrink-0"
                  title={brand.name || "View Brand"}
                >
                  {brandContent}
                </Link>
              );
            }

            return (
              <div key={`brand-${idx}`} className="flex-shrink-0">
                {brandContent}
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-8">
        <Link
          to="/shop"
          className="text-[11px] uppercase tracking-[0.2em] text-[#3D4838] hover:text-[#1C1815] border-b border-[#3D4838] pb-0.5 transition-colors font-medium"
        >
          Explore all writing instruments &rarr;
        </Link>
      </div>
    </section>
  );
}
