import { Link } from "react-router-dom";
import { fileUrl } from "../lib/api";

const DEFAULT_LEFT_IMG = "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";
const DEFAULT_RIGHT_IMG = "https://images.unsplash.com/photo-1585336261026-78b17b6a1f81?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200";

export default function SignatureCollections({ data }) {
  const sectionTitle = data?.title || "SIGNATURE COLLECTIONS";
  const sectionSubtitle = data?.subtitle || "Our carefully selected products just for you";

  const cardLeft = {
    brand: data?.card_left?.brand || "THE WL PENS",
    title: data?.card_left?.title || "EXCLUSIVE",
    image: data?.card_left?.image || DEFAULT_LEFT_IMG,
    link: data?.card_left?.link || "/shop",
  };

  const cardRight = {
    brand: data?.card_right?.brand || "THE WL PENS",
    title: data?.card_right?.title || "PREMIUM",
    image: data?.card_right?.image || DEFAULT_RIGHT_IMG,
    link: data?.card_right?.link || "/shop",
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-20" data-testid="signature-collections-section">
      {/* Top Browse Pill Button */}
      <div className="flex justify-center mb-8">
        <Link
          to="/shop"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full border border-[#1C1815] text-[#1C1815] hover:bg-[#1C1815] hover:text-[#FAF8F5] transition-all duration-300 text-xs uppercase tracking-[0.2em] font-medium shadow-sm hover:shadow"
          data-testid="browse-all-categories-btn"
        >
          Browse All Categories
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-10 sm:mb-14">
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] tracking-[0.08em] uppercase">
          {sectionTitle}
        </h2>
        <p className="mt-3 text-sm sm:text-base text-[#6E685E] font-normal tracking-wide max-w-xl mx-auto">
          {sectionSubtitle}
        </p>
      </div>

      {/* 2-Column Luxury Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
        {/* Left Card: Exclusive */}
        <Link
          to={cardLeft.link}
          className="group relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#1C1815]"
          data-testid="signature-card-exclusive"
        >
          <img
            src={cardLeft.image.startsWith("http") || cardLeft.image.startsWith("/") ? fileUrl(cardLeft.image) : cardLeft.image}
            alt={`${cardLeft.brand} ${cardLeft.title}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-95"
          />

          {/* Vignette / Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:via-black/20 transition-colors duration-500" />
          <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />

          {/* Center Brand Badge (Silver / Metallic Luxury Styling) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#E6E0D6]/90 font-medium drop-shadow mb-1 sm:mb-2">
              {cardLeft.brand}
            </p>
            <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-[0.15em] text-[#FAF8F5] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] uppercase">
              {cardLeft.title}
            </h3>

            {/* Decorative Metallic Divider with Diamond Accent */}
            <div className="flex items-center gap-3 mt-3 w-40 sm:w-56 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FAF8F5]/60 to-transparent" />
              <span className="text-[#FAF8F5] text-[10px]">◇</span>
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#FAF8F5]/60 to-transparent" />
            </div>
          </div>
        </Link>

        {/* Right Card: Premium */}
        <Link
          to={cardRight.link}
          className="group relative aspect-[16/11] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden block shadow-lg hover:shadow-2xl transition-all duration-500 bg-[#1C1815]"
          data-testid="signature-card-premium"
        >
          <img
            src={cardRight.image.startsWith("http") || cardRight.image.startsWith("/") ? fileUrl(cardRight.image) : cardRight.image}
            alt={`${cardRight.brand} ${cardRight.title}`}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-95"
          />

          {/* Vignette / Contrast Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40 group-hover:via-black/20 transition-colors duration-500" />
          <div className="absolute inset-0 bg-radial-vignette opacity-60 pointer-events-none" />

          {/* Center Brand Badge (Gold Luxury Styling) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-white">
            <p className="text-[10px] sm:text-xs uppercase tracking-[0.35em] text-[#B8860B] font-medium drop-shadow mb-1 sm:mb-2">
              {cardRight.brand}
            </p>
            <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl tracking-[0.15em] text-[#D4AF37] drop-shadow-[0_4px_16px_rgba(0,0,0,0.8)] uppercase">
              {cardRight.title}
            </h3>

            {/* Decorative Gold Divider with Diamond Accent */}
            <div className="flex items-center gap-3 mt-3 w-40 sm:w-56 opacity-80 group-hover:opacity-100 transition-opacity">
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
              <span className="text-[#B8860B] text-[10px]">◆</span>
              <span className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#B8860B] to-transparent" />
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
