const DEFAULT_OFFERS = [
  "FREE PAN-INDIA SHIPPING ON ORDERS ABOVE ₹1499",
  "COMPLIMENTARY EXTRA INK REFILL WITH SELECTED ROLLERBALLS",
  "FLAT 10% OFF ON ORDERS ABOVE ₹5000 · USE CODE 'ATELIER10'",
  "BESPOKE LASER & DIAMOND NAME ENGRAVING AVAILABLE",
];

export default function OffersTicker({ offers, className = "" }) {
  const offerList = Array.isArray(offers) && offers.length > 0 ? offers : DEFAULT_OFFERS;
  const loopItems = [...offerList, ...offerList, ...offerList, ...offerList];

  return (
    <div
      className={`announcement-bar w-full bg-[#1C1815] text-[#FAF8F5] py-3 overflow-hidden border-y border-[#3D4838] group cursor-pointer ${className}`}
      data-testid="offers-marquee-ticker"
    >
      <div className="animate-marquee-infinite flex items-center whitespace-nowrap group-hover:[animation-play-state:paused]">
        {loopItems.map((offer, i) => (
          <div key={i} className="flex items-center">
            <span className="mx-6 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-[#FAF8F5]/90 hover:text-[#B8860B] transition-colors">
              {offer}
            </span>
            <span className="text-[#B8860B] font-bold text-sm">|</span>
          </div>
        ))}
      </div>
    </div>
  );
}
