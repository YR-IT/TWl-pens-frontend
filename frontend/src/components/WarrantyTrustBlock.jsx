import { Shield, Sparkles, HeartHandshake } from "lucide-react";

export default function WarrantyTrustBlock({ className = "" }) {
  return (
    <section className={`w-full bg-[#1C1815] text-[#FAF8F5] py-14 sm:py-18 border-t border-[#3D4838] relative overflow-hidden ${className}`} data-testid="warranty-trust-block">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
        {/* Minimalist Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold block mb-2">
            ASSURANCE OF EXCELLENCE
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#FAF8F5] tracking-wide">
            1-Year Comprehensive Atelier Warranty
          </h3>
          <p className="text-xs sm:text-sm text-[#FAF8F5]/70 mt-2 font-light leading-relaxed">
            Every fine writing instrument from The WL Pens is inspected, tuned, and backed against mechanism or nib imperfections.
          </p>
        </div>

        {/* 3 Minimalist Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 border-t border-white/10 pt-10">
          {/* Pillar 1 */}
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 text-[#B8860B] mb-1">
              <Sparkles size={16} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Hand-Tuned Precision</span>
            </div>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
              Nibs are individually tested in our studio for balanced ink flow and buttery paper glide before dispatch.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="text-center md:text-left space-y-2 border-y md:border-y-0 md:border-x border-white/10 py-6 md:py-0 md:px-8">
            <div className="inline-flex items-center gap-2 text-[#B8860B] mb-1">
              <Shield size={16} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">100% Genuine Provenance</span>
            </div>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
              Direct brand authorized distribution. Delivered in custom packaging with certificates of authenticity.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="text-center md:text-left space-y-2">
            <div className="inline-flex items-center gap-2 text-[#B8860B] mb-1">
              <HeartHandshake size={16} />
              <span className="text-[11px] uppercase tracking-[0.2em] font-medium">Dedicated Studio Care</span>
            </div>
            <p className="text-xs text-[#FAF8F5]/70 leading-relaxed font-light">
              Direct concierge assistance via WhatsApp for ink pairing, nib care advice, and complimentary refills.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
