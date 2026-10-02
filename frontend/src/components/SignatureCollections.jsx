import { Link } from "react-router-dom";
import { fileUrl } from "../lib/api";

const DEFAULT_LEFT_IMG = "";
const DEFAULT_RIGHT_IMG = "";

export default function SignatureCollections({ data }) {


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
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
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
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </Link>
      </div>
    </section>
  );
}
