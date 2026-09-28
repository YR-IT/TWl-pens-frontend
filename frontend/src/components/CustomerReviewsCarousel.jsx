import { useState, useEffect, useRef, useCallback } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";
import { fileUrl } from "../lib/api";

const DEFAULT_REVIEWS = [
  {
    name: "Vikramaditya S.",
    city: "New Delhi",
    rating: 5,
    quote: "The nib smoothness on my custom engraved pen exceeds my vintage Montblanc. Truly world-class craftsmanship from Panchkula.",
    product_name: "1200 Golden Dragon Rollerball",
    product_image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Ananya Roy",
    city: "Bengaluru",
    rating: 5,
    quote: "Ordered 25 personalised pens for our firm's annual leadership awards. Every recipient was genuinely stunned by the presentation packaging.",
    product_name: "Atelier Bespoke Engraved Edition",
    product_image: "https://images.unsplash.com/photo-1585336261026-78b17b6a1f81?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Karan Malhotra",
    city: "Chandigarh",
    rating: 5,
    quote: "The weight distribution is impeccably balanced. Writing long journals feels effortless. Outstanding customer support via WhatsApp as well.",
    product_name: "High Grade Metal Rollerball",
    product_image: "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Dr. Siddharth Verma",
    city: "Mumbai",
    rating: 5,
    quote: "As a surgeon, I appreciate precision instruments. The ink feed never skips, and the hand-etched initials on the brass barrel look stunning.",
    product_name: "Turin Brass Atelier Edition",
    product_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Meera Nambiar",
    city: "Chennai",
    rating: 5,
    quote: "The shimmer and flow of the archival twilight ink paired with the medium nib is pure joy. Arrived in a lovely cotton pouch within 48 hours.",
    product_name: "Archival Midnight Shimmer Set",
    product_image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Adv. Harshvardhan Joshi",
    city: "Jaipur",
    rating: 5,
    quote: "Signed my high court registry deeds with the WL Gold Dragon pen today. The balance in hand commands respect. Highly impressed.",
    product_name: "1200 Golden Dragon Clip Edition",
    product_image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Pooja Deshmukh",
    city: "Pune",
    rating: 5,
    quote: "Gifted this to my father for his 60th birthday with his name engraved. He hasn't stopped using it since. Thank you Manjeet & team!",
    product_name: "Executive Matte Black Rollerball",
    product_image: "https://images.unsplash.com/photo-1585336261026-78b17b6a1f81?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
  {
    name: "Ritwik Sen",
    city: "Kolkata",
    rating: 5,
    quote: "Being a calligraphy enthusiast, I am very picky about feed consistency. The WL nib ground in Panchkula is phenomenal for everyday prose.",
    product_name: "Fine Nib Classic Fountain Pen",
    product_image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?crop=entropy&cs=srgb&fm=jpg&q=85&w=300",
  },
];

export default function CustomerReviewsCarousel({ reviews, className = "" }) {
  const reviewList = Array.isArray(reviews) && reviews.length > 0 ? reviews : DEFAULT_REVIEWS;
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);
  const autoRef = useRef(null);
  const total = reviewList.length;

  // Scroll the track to the given index
  const scrollTo = useCallback((idx) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[idx];
    if (!card) return;
    // Centre the card within the track
    const trackLeft = track.getBoundingClientRect().left;
    const cardLeft = card.getBoundingClientRect().left;
    track.scrollBy({ left: cardLeft - trackLeft, behavior: "smooth" });
    setCurrent(idx);
  }, []);

  const next = useCallback(() => {
    const nxt = (current + 1) % total;
    scrollTo(nxt);
  }, [current, total, scrollTo]);

  const prev = useCallback(() => {
    const prv = (current - 1 + total) % total;
    scrollTo(prv);
  }, [current, total, scrollTo]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    autoRef.current = setInterval(next, 4500);
    return () => clearInterval(autoRef.current);
  }, [isPaused, next]);

  // Detect manual scroll and snap current dot
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.children);
      const trackLeft = track.getBoundingClientRect().left;
      let closest = 0;
      let minDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - trackLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setCurrent(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      className={`w-full bg-[#FAF8F5] py-16 sm:py-24 ${className}`}
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

        {/* Track */}
        <div
          ref={trackRef}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {reviewList.map((rev, idx) => (
            <div
              key={idx}
              data-testid={`review-card-${idx}`}
              className="bg-white border border-[#E6E0D6] p-7 sm:p-8 rounded-2xl flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow snap-start flex-shrink-0"
              style={{ width: "min(360px, 85vw)" }}
            >
              <div>
                {/* Stars */}
                <div className="flex items-center gap-1 text-[#B8860B] mb-4">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                {/* Quote */}
                <p className="font-serif italic text-sm sm:text-base text-[#1C1815] leading-relaxed">
                  "{rev.quote}"
                </p>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-5 border-t border-[#E6E0D6]/80 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-1.5 font-medium text-xs text-[#1C1815]">
                    <span>{rev.name}</span>
                    <CheckCircle2 size={13} className="text-emerald-600" title="Verified Customer" />
                  </div>
                  <span className="text-[11px] text-[#6E685E] block mt-0.5">{rev.city}</span>
                </div>

                {rev.product_name && (
                  <div className="flex items-center gap-2 max-w-[140px] text-right">
                    {rev.product_image && (
                      <div className="w-9 h-9 rounded-sm overflow-hidden bg-[#F3EFEA] flex-shrink-0 border border-[#E6E0D6]">
                        <img
                          src={rev.product_image.startsWith("http") ? rev.product_image : fileUrl(rev.product_image)}
                          alt={rev.product_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <span className="text-[10px] text-[#6E685E] line-clamp-2 leading-tight">
                      {rev.product_name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
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
            {reviewList.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollTo(i)}
                aria-label={`Go to review ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? "w-6 bg-[#B8860B]" : "w-1.5 bg-[#D6CCBF] hover:bg-[#6E685E]"
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
      </div>
    </section>
  );
}
