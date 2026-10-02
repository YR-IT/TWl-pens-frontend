import { useState, useEffect } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

const DEFAULT_REVIEWS = [
  {
    name: "Vikramaditya S.",
    city: "New Delhi",
    rating: 5,
    quote: "The nib smoothness on my custom engraved pen exceeds my vintage Montblanc. Truly world-class craftsmanship from Panchkula.",
    product_name: "1200 Golden Dragon Rollerball",
  },
  {
    name: "Ananya Roy",
    city: "Bengaluru",
    rating: 5,
    quote: "Ordered 25 personalised pens for our firm's annual leadership awards. Every recipient was genuinely stunned by the presentation packaging.",
    product_name: "Atelier Bespoke Engraved Edition",
  },
  {
    name: "Karan Malhotra",
    city: "Chandigarh",
    rating: 5,
    quote: "The weight distribution is impeccably balanced. Writing long journals feels effortless. Outstanding customer support via WhatsApp as well.",
    product_name: "High Grade Metal Rollerball",
  },
  {
    name: "Dr. Siddharth Verma",
    city: "Mumbai",
    rating: 5,
    quote: "As a surgeon, I appreciate precision instruments. The ink feed never skips, and the hand-etched initials on the brass barrel look stunning.",
    product_name: "Turin Brass Atelier Edition",
  },
  {
    name: "Meera Nambiar",
    city: "Chennai",
    rating: 5,
    quote: "The shimmer and flow of the archival twilight ink paired with the medium nib is pure joy. Arrived in a lovely cotton pouch within 48 hours.",
    product_name: "Archival Midnight Shimmer Set",
  },
  {
    name: "Adv. Harshvardhan Joshi",
    city: "Jaipur",
    rating: 5,
    quote: "Signed my high court registry deeds with the WL Gold Dragon pen today. The balance in hand commands respect. Highly impressed.",
    product_name: "1200 Golden Dragon Clip Edition",
  },
  {
    name: "Pooja Deshmukh",
    city: "Pune",
    rating: 5,
    quote: "Gifted this to my father for his 60th birthday with his name engraved. He hasn't stopped using it since. Thank you Manjeet & team!",
    product_name: "Executive Matte Black Rollerball",
  },
  {
    name: "Ritwik Sen",
    city: "Kolkata",
    rating: 5,
    quote: "Being a calligraphy enthusiast, I am very picky about feed consistency. The WL nib ground in Panchkula is phenomenal for everyday prose.",
    product_name: "Fine Nib Classic Fountain Pen",
  },
];

export default function CustomerReviewsCarousel({ reviews, className = "" }) {
  const reviewList = Array.isArray(reviews) && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);

  // Responsive items visible
  useEffect(() => {
    const updateVisible = () => {
      if (window.innerWidth < 768) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    updateVisible();
    window.addEventListener("resize", updateVisible);
    return () => window.removeEventListener("resize", updateVisible);
  }, []);

  const total = reviewList.length;
  const maxIndex = Math.max(0, total - visibleCount);
  const safeIndex = Math.min(currentIndex, maxIndex);

  const next = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  // Auto-play interval
  useEffect(() => {
    if (isPaused || maxIndex <= 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, maxIndex]);

  return (
    <section
      className={`w-full bg-[#FAF8F5] py-16 sm:py-24 overflow-hidden ${className}`}
      data-testid="customer-reviews-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold">
            VERIFIED BUYERS · NATIONWIDE
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2 tracking-wide uppercase">
            Our Writers' Experiences
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6E685E] max-w-md mx-auto">
            Reflections from connoisseurs, advocates, doctors, and calligraphers across India.
          </p>
        </div>

        {/* Carousel Viewport & Track */}
        <div className="relative overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(calc(-${safeIndex} * ((100% + 24px) / ${visibleCount})))`,
            }}
          >
            {reviewList.map((rev, idx) => (
              <div
                key={idx}
                data-testid={`review-card-${idx}`}
                className="bg-white border border-[#E6E0D6] p-7 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow shrink-0"
                style={{
                  width: `calc((100% - ${(visibleCount - 1) * 24}px) / ${visibleCount})`,
                }}
              >
                <div>
                  {/* Stars */}
                  <div className="flex items-center gap-1 text-[#B8860B] mb-4">
                    {[...Array(rev.rating || 5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="font-serif italic text-sm sm:text-base text-[#1C1815] leading-relaxed">
                    "{rev.quote}"
                  </p>
                </div>

                {/* Footer without images */}
                <div className="mt-6 pt-5 border-t border-[#E6E0D6]/80 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 font-medium text-xs text-[#1C1815]">
                      <span>{rev.name}</span>
                      <CheckCircle2 size={13} className="text-emerald-600" title="Verified Customer" />
                    </div>
                    {rev.city && (
                      <span className="text-[11px] text-[#6E685E] block mt-0.5">{rev.city}</span>
                    )}
                  </div>

                  {rev.product_name && (
                    <span className="text-[10px] text-[#6E685E] bg-[#FAF8F5] border border-[#E6E0D6] px-2.5 py-1 rounded-full font-medium max-w-[180px] truncate">
                      {rev.product_name}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        {total > visibleCount && (
          <div className="flex items-center justify-center gap-4 mt-10">
            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous review"
              className="w-10 h-10 rounded-full border border-[#E6E0D6] bg-white hover:bg-[#1C1815] text-[#1C1815] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {[...Array(maxIndex + 1)].map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Go to review group ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === safeIndex ? "w-6 bg-[#B8860B]" : "w-1.5 bg-[#D6CCBF] hover:bg-[#6E685E]"
                  }`}
                />
              ))}
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              aria-label="Next review"
              className="w-10 h-10 rounded-full border border-[#E6E0D6] bg-white hover:bg-[#1C1815] text-[#1C1815] hover:text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
