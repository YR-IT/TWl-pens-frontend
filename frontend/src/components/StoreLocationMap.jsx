import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";

const DEFAULT_STORE = {
  title: "Visit Our Panchkula Atelier",
  address: "SCO 42, Sector 11, Panchkula, Haryana 134109",
  phone: "+91 93519 96272",
  email: "thewlpens@gmail.com",
  hours: "Monday – Saturday: 10:30 AM – 7:30 PM",
  parent_company: "A Unit of The WL Pens Studio",
  map_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109741.02912911311!2d76.77111075!3d30.6942091!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390f937d2f9a9c7b%3A0x6a2c9183416e91!2sPanchkula%2C%20Haryana!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
};

export default function StoreLocationMap({ info, className = "" }) {
  const store = info || DEFAULT_STORE;

  return (
    <section className={`max-w-[1600px] mx-auto px-6 lg:px-12 py-16 sm:py-24 ${className}`} data-testid="store-location-section">
      <div className="bg-white border border-[#E6E0D6] rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
        {/* Left Information Block (5 Cols) */}
        <div className="p-8 sm:p-12 lg:col-span-5 flex flex-col justify-between space-y-8 bg-[#FAF8F5]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-semibold">
              FLAGSHIP ATELIER
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#1C1815] mt-2">
              {store.title || "The WL Pens Studio"}
            </h3>
            <p className="text-xs text-[#6E685E] mt-2 leading-relaxed">
              Experience the balance and flow of our pens in person. Book a private nib consultation or drop by our studio.
            </p>
          </div>

          <div className="space-y-4 text-xs text-[#1C1815]">
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#B8860B] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-medium">Studio Address</strong>
                <span className="text-[#6E685E]">{store.address}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone size={16} className="text-[#B8860B] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-medium">Studio Hotline &amp; WhatsApp</strong>
                <a href={`tel:${store.phone}`} className="text-[#6E685E] hover:text-[#1C1815]">
                  {store.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail size={16} className="text-[#B8860B] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-medium">Email Inquiries</strong>
                <a href={`mailto:${store.email}`} className="text-[#6E685E] hover:text-[#1C1815]">
                  {store.email}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock size={16} className="text-[#B8860B] mt-0.5 flex-shrink-0" />
              <div>
                <strong className="block font-medium">Visiting Hours</strong>
                <span className="text-[#6E685E]">{store.hours}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E0D6] flex items-center gap-2 text-[11px] text-[#6E685E]">
            <Building2 size={14} className="text-[#B8860B]" />
            <span>{store.parent_company}</span>
          </div>
        </div>

        {/* Right Embedded Google Map (7 Cols) */}
        <div className="lg:col-span-7 h-[360px] lg:h-auto min-h-[360px] bg-[#E6E0D6] relative">
          <iframe
            title="The WL Pens Studio Location"
            src={store.map_embed_url}
            className="w-full h-full border-0"
            loading="lazy"
            allowFullScreen=""
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
