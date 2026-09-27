import { Mail, ArrowRight } from "lucide-react";
import { fileUrl } from "../lib/api";

const DEFAULT_BULK = {
  title: "Bulk Orders",
  description: "Looking to stock up? Exclusive discounts on bulk purchases — perfect for retailers, offices, or events.",
  email: "bulkorders@wlpens.com",
  image: "https://images.unsplash.com/photo-1583195764036-5d2c7b0b5e3f?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
};

const DEFAULT_CORP = {
  title: "Corporate Gifts",
  description: "Want memorable business gifts? We personalize select pens — perfect for clients, employees, and events.",
  email: "corporate@wlpens.com",
  image: "https://images.unsplash.com/photo-1617177435596-1c9e30d6d608?crop=entropy&cs=srgb&fm=jpg&q=85&w=800",
};

export default function BulkAndCorporateGifts({ bulkCard, corpCard, className = "" }) {
  const bulk = { ...DEFAULT_BULK, ...bulkCard };
  const corp = { ...DEFAULT_CORP, ...corpCard };

  return (
    <section className={`max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-20 ${className}`} data-testid="bulk-corporate-section">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Card: Bulk Orders */}
        <div className="bg-white border border-[#E6E0D6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#B8860B]/60 transition-all duration-300 flex flex-col group">
          {/* Top Image */}
          <div className="aspect-[16/10] sm:aspect-[16/9] bg-[#F3EFEA] overflow-hidden relative">
            <img
              src={fileUrl(bulk.image)}
              alt={bulk.title}
              loading="lazy"
              decoding="async"
              width={800}
              height={450}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          </div>

          {/* Bottom Content */}
          <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold">
                QUANTITY &amp; RETAIL PARTNERSHIP
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1815] leading-tight">
                {bulk.title}
              </h3>
              <p className="text-sm sm:text-base text-[#6E685E] leading-relaxed font-light">
                {bulk.description}
              </p>
            </div>

            {/* Contact Email Block */}
            <div className="pt-4 border-t border-[#E6E0D6]/80">
              <a
                href={`mailto:${bulk.email}?subject=Bulk%20Order%20Inquiry%20-%20The%20WL%20Pens`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#FAF8F5] border border-[#E6E0D6] hover:border-[#B8860B] hover:bg-[#1C1815] hover:text-[#FAF8F5] text-[#1C1815] transition-all duration-200 group/btn"
                data-testid="bulk-orders-mailto"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center text-[#B8860B] group-hover/btn:bg-white/10 group-hover/btn:border-white/20">
                  <Mail size={15} />
                </div>
                <div className="text-left pr-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#6E685E] group-hover/btn:text-[#FAF8F5]/80 block font-medium">
                    Send Inquiry
                  </span>
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    {bulk.email}
                  </span>
                </div>
                <ArrowRight size={14} className="text-[#6E685E] group-hover/btn:text-[#FAF8F5] transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>

        {/* Right Card: Corporate Gifts */}
        <div className="bg-white border border-[#E6E0D6] rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-[#B8860B]/60 transition-all duration-300 flex flex-col group">
          {/* Top Image */}
          <div className="aspect-[16/10] sm:aspect-[16/9] bg-[#F3EFEA] overflow-hidden relative">
            <img
              src={fileUrl(corp.image)}
              alt={corp.title}
              loading="lazy"
              decoding="async"
              width={800}
              height={450}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60" />
          </div>

          {/* Bottom Content */}
          <div className="p-8 sm:p-10 flex-1 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold">
                BESPOKE BRANDED INSTRUMENTS
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1C1815] leading-tight">
                {corp.title}
              </h3>
              <p className="text-sm sm:text-base text-[#6E685E] leading-relaxed font-light">
                {corp.description}
              </p>
            </div>

            {/* Contact Email Block */}
            <div className="pt-4 border-t border-[#E6E0D6]/80">
              <a
                href={`mailto:${corp.email}?subject=Corporate%20Gifting%20Inquiry%20-%20The%20WL%20Pens`}
                className="inline-flex items-center gap-3 px-5 py-3 rounded-full bg-[#FAF8F5] border border-[#E6E0D6] hover:border-[#B8860B] hover:bg-[#1C1815] hover:text-[#FAF8F5] text-[#1C1815] transition-all duration-200 group/btn"
                data-testid="corporate-gifts-mailto"
              >
                <div className="w-8 h-8 rounded-full bg-white border border-[#E6E0D6] flex items-center justify-center text-[#B8860B] group-hover/btn:bg-white/10 group-hover/btn:border-white/20">
                  <Mail size={15} />
                </div>
                <div className="text-left pr-2">
                  <span className="text-[9px] uppercase tracking-[0.2em] text-[#6E685E] group-hover/btn:text-[#FAF8F5]/80 block font-medium">
                    Send Inquiry
                  </span>
                  <span className="text-xs sm:text-sm font-medium tracking-wide">
                    {corp.email}
                  </span>
                </div>
                <ArrowRight size={14} className="text-[#6E685E] group-hover/btn:text-[#FAF8F5] transition-transform group-hover/btn:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
