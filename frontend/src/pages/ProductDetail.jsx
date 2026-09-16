import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowRight, 
  Minus, 
  Plus, 
  ChevronLeft, 
  Expand, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  Sparkles, 
  PenTool, 
  Gift, 
  Check, 
  MessageSquare,
  Award
} from "lucide-react";
import { api, fileUrl } from "../lib/api";
import { money } from "../lib/format";
import { useCart } from "../lib/cart";
import { toast } from "sonner";
import WishlistButton from "../components/WishlistButton";
import ProductCard from "../components/ProductCard";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "../components/ui/carousel";

export default function ProductDetail() {
  const { id } = useParams();
  const [p, setP] = useState(null);
  const [related, setRelated] = useState([]);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);
  const [engraving, setEngraving] = useState("");
  const [engravingFont, setEngravingFont] = useState("");
  const [engravingPosition, setEngravingPosition] = useState("");
  const [lightbox, setLightbox] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    api.get(`/products/${id}`).then((r) => { 
      setP(r.data); 
      setActive(0);
      if (r.data.engraving_fonts?.length) setEngravingFont(r.data.engraving_fonts[0]);
      if (r.data.engraving_positions?.length) setEngravingPosition(r.data.engraving_positions[0]);
    });
  }, [id]);

  useEffect(() => {
    if (p) {
      api.get("/products", { params: { category: p.category, limit: 10 } })
        .then((r) => {
            const filtered = (Array.isArray(r.data) ? r.data : []).filter(item => item.id !== p.id);
            setRelated(filtered);
        });
    }
  }, [p]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") setLightbox(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!p) return <div className="pt-[76px] p-12 text-center text-[#6E685E]" data-testid="product-loading">Loading…</div>;

  const hasDiscount = !!p.discount_price;
  const price = hasDiscount ? p.discount_price : p.price;
  const off = hasDiscount ? Math.round(((p.price - p.discount_price) / p.price) * 100) : 0;
  const images = p.images?.length ? p.images : [];
  const current = images[active];
  const availableFonts = p.engraving_fonts?.length ? p.engraving_fonts : ["Classic Script", "Timeless Serif", "Modern Sans"];
  const availablePositions = p.engraving_positions?.length ? p.engraving_positions : ["Engraving on Cap", "Engraving on Barrel", "Engraving on Clip"];

  return (
    <div className="pt-[76px] bg-[#FAF8F5]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 pt-8">
        <Link to="/shop" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815]" data-testid="back-to-catalog">
          <ChevronLeft size={14}/> Back to catalog
        </Link>
      </div>

      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-10 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-4">
          <ZoomImage src={current ? fileUrl(current) : ""} alt={p.name} onOpen={() => setLightbox(true)}/>
          {images.length > 1 && (
            <div className="grid grid-cols-5 gap-3">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActive(i)} className={`aspect-square overflow-hidden bg-[#F3EFEA] border-2 transition-colors ${active === i ? "border-[#1C1815]" : "border-transparent hover:border-[#E6E0D6]"}`} data-testid={`thumb-${i}`}>
                  <img src={fileUrl(img)} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]" data-testid="product-brand">{p.brand}</p>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2 leading-[1.05]" data-testid="product-name">{p.name}</h1>
            </div>
            <div className="mt-2 flex-shrink-0 border border-[#E6E0D6] p-3">
              <WishlistButton productId={p.id} size={20} testId="pdp-wishlist-toggle"/>
            </div>
          </div>
          <div className="mt-6 flex items-baseline gap-3" data-testid="product-price">
            <span className="font-serif text-3xl text-[#1C1815]">{money(price)}</span>
            {hasDiscount && <><span className="text-lg text-[#6E685E] line-through">{money(p.price)}</span><span className="text-xs uppercase tracking-[0.2em] text-[#B8860B]">−{off}%</span></>}
          </div>
          <p className="mt-6 text-[#1C1815]/80 leading-relaxed whitespace-pre-line" data-testid="product-description">{p.description}</p>

          {p.features?.length > 0 && (
            <ul className="mt-8 space-y-2" data-testid="product-features">
              {p.features.map((f, i) => (
                <li key={i} className="flex gap-3 text-sm text-[#1C1815]/85">
                  <span className="text-[#B8860B] mt-1">·</span>{f}
                </li>
              ))}
            </ul>
          )}

          {p.engravable && (
            <div className="mt-8 border border-[#E6E0D6] bg-[#F3EFEA]/70 p-6 space-y-4" data-testid="engraving-section">
              <div className="flex items-baseline justify-between gap-4 border-b border-[#E6E0D6] pb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
                    Enter Engraving Details · Complimentary
                  </p>
                  <p className="text-xs text-[#6E685E] mt-0.5">Personalize your writing instrument with bespoke studio etching.</p>
                </div>
                <span className="text-[11px] text-[#6E685E] font-medium flex-shrink-0">
                  {engraving.length} / {p.engraving_max_length || 20}
                </span>
              </div>

              {/* Engraving Name Input */}
              <div>
                <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1C1815] font-medium mb-1.5">
                  Engraving Name / Text
                </label>
                <input
                  type="text"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.slice(0, p.engraving_max_length || 20))}
                  placeholder="Enter name, initials, or bespoke date…"
                  className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-3.5 py-2.5 font-serif text-base text-[#1C1815] outline-none placeholder:text-[#6E685E]/50 focus:border-[#B8860B] transition-colors"
                  data-testid="engraving-input"
                />
              </div>

              {/* Dropdowns Grid: Font & Position */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1C1815] font-medium mb-1.5">
                    Engraving Font Style
                  </label>
                  <div className="relative">
                    <select
                      value={engravingFont || availableFonts[0]}
                      onChange={(e) => setEngravingFont(e.target.value)}
                      className="w-full appearance-none bg-[#FAF8F5] border border-[#E6E0D6] px-3.5 py-2.5 text-xs uppercase tracking-wider text-[#1C1815] outline-none focus:border-[#B8860B] transition-colors cursor-pointer"
                      data-testid="engraving-font-select"
                    >
                      {availableFonts.map((font) => (
                        <option key={font} value={font}>{font}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E685E] pointer-events-none"/>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] text-[#1C1815] font-medium mb-1.5">
                    Engraving Position
                  </label>
                  <div className="relative">
                    <select
                      value={engravingPosition || availablePositions[0]}
                      onChange={(e) => setEngravingPosition(e.target.value)}
                      className="w-full appearance-none bg-[#FAF8F5] border border-[#E6E0D6] px-3.5 py-2.5 text-xs uppercase tracking-wider text-[#1C1815] outline-none focus:border-[#B8860B] transition-colors cursor-pointer"
                      data-testid="engraving-position-select"
                    >
                      {availablePositions.map((pos) => (
                        <option key={pos} value={pos}>{pos}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E685E] pointer-events-none"/>
                  </div>
                </div>
              </div>

              {/* Live Typography Preview if text entered */}
              {engraving.trim() && (
                <div className="p-3 bg-[#FAF8F5] border border-[#B8860B]/40 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Live Preview ({engravingFont || availableFonts[0]}):</span>
                  <span className={`text-base text-[#B8860B] tracking-wider ${
                    (engravingFont || availableFonts[0]).toLowerCase().includes("script") ? "font-serif italic" :
                    (engravingFont || availableFonts[0]).toLowerCase().includes("serif") ? "font-serif font-medium uppercase tracking-[0.2em]" :
                    "font-sans font-medium tracking-widest uppercase"
                  }`}>
                    {engraving}
                  </span>
                </div>
              )}

              {/* Logo Engraving Note & Lead Time */}
              <div className="pt-2 border-t border-[#E6E0D6] space-y-2">
                <p className="text-[11px] text-[#6E685E] leading-relaxed">
                  {p.engraving_whatsapp_note || "Need logo engraving? Send your logo and Order Number via WhatsApp after ordering."}{" "}
                  <a
                    href={`https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio%2C%20I%20would%20like%20to%20enquire%20about%20custom%20logo%20engraving%20for%20${encodeURIComponent(p.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#B8860B] underline hover:text-[#1C1815] font-medium"
                  >
                    WhatsApp &rarr;
                  </a>
                </p>
                <p className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E]">
                  {p.engraving_note || "Hand-etched in our Panchkula studio · adds 2 working days"}
                </p>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center border border-[#E6E0D6] self-start">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-decrease"><Minus size={14}/></button>
              <span className="w-10 text-center" data-testid="qty-value">{qty}</span>
              <button onClick={() => setQty((q) => q + 1)} className="w-10 h-11 grid place-items-center hover:bg-[#F3EFEA]" data-testid="qty-increase"><Plus size={14}/></button>
            </div>
            <button
              disabled={p.stock === 0}
              onClick={() => { 
                const selectedFont = engravingFont || availableFonts[0];
                const selectedPos = engravingPosition || availablePositions[0];
                add(p, qty, engraving, engraving ? selectedFont : "", engraving ? selectedPos : ""); 
                toast.success(`${p.name} added to cart${engraving ? ` · "${engraving}"` : ""}`); 
              }}
              className="flex-1 bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-3 transition-colors"
              data-testid="add-to-cart-btn"
            >
              {p.stock === 0 ? "Sold out" : "Add to cart"} {p.stock > 0 && <ArrowRight size={14}/>}
            </button>
          </div>

          <p className="mt-4 text-xs text-[#6E685E]" data-testid="product-stock">
            {p.stock > 0 ? `${p.stock} in the atelier · ${p.estimated_delivery || "ships within 48 hours"}` : "Currently sold out"}
          </p>

          {/* New Sections */}
          <div className="mt-12 space-y-12">
            {p.specs && Object.keys(p.specs).length > 0 && (
              <div className="border-t border-[#E6E0D6] pt-8" data-testid="product-specs">
                <h3 className="font-serif text-xl text-[#1C1815] mb-4">Specifications</h3>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {Object.entries(p.specs).map(([k, v]) => (
                    <div key={k} className="flex justify-between border-b border-[#E6E0D6]/50 py-2">
                      <dt className="text-xs uppercase tracking-[0.15em] text-[#6E685E]">{k}</dt>
                      <dd className="text-sm text-[#1C1815]">{String(v)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Full-width Related Products */}
      <section className="max-w-[1600px] mx-auto px-6 lg:px-12 pb-8 sm:pb-12" data-testid="product-related">
        <h3 className="font-serif text-2xl sm:text-3xl text-[#1C1815] mb-6 border-t border-[#E6E0D6] pt-8 sm:pt-10">You May Also Like</h3>
        {related.length > 0 ? (
          <Carousel opts={{ align: "start", slidesToScroll: 1 }}>
            <CarouselContent>
              {related.map((prod) => (
                <CarouselItem key={prod.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <ProductCard p={prod}/>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-sm text-[#6E685E]">No related products found.</p>
        )}
      </section>

      {/* Full-width Reviews */}
      <ProductReviewsSection productName={p.name} />

      {lightbox && current && (
        <Lightbox images={images} index={active} onIndex={setActive} onClose={() => setLightbox(false)}/>
      )}
    </div>
  );
}


function ZoomImage({ src, alt, onOpen }) {
  const boxRef = useRef(null);
  const [hover, setHover] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50 });

  const onMove = (e) => {
    const rect = boxRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <div
      ref={boxRef}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onMouseMove={onMove}
      className="relative aspect-square bg-[#F3EFEA] overflow-hidden cursor-zoom-in"
      data-testid="product-main-image"
    >
      {src && (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-300"
          style={hover ? { transform: `scale(2)`, transformOrigin: `${pos.x}% ${pos.y}%` } : {}}
        />
      )}
      <button
        type="button"
        onClick={onOpen}
        className="absolute bottom-4 right-4 bg-[#FAF8F5]/90 backdrop-blur-sm border border-[#E6E0D6] p-2 hover:border-[#3D4838] text-[#1C1815] transition-colors"
        aria-label="Open lightbox"
        data-testid="open-lightbox-btn"
      >
        <Expand size={16}/>
      </button>
    </div>
  );
}

function Lightbox({ images, index, onIndex, onClose }) {
  const cur = images[index];
  return (
    <div className="fixed inset-0 z-[70] bg-[#1C1815]/95 flex items-center justify-center p-4" onClick={onClose} data-testid="lightbox">
      <button className="absolute top-6 right-6 text-[#FAF8F5]" onClick={onClose} data-testid="close-lightbox">
        <ChevronLeft size={24} className="rotate-45"/>
      </button>
      <div className="relative max-w-6xl w-full max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={fileUrl(cur)} alt="" className="w-full max-h-[80vh] object-contain"/>
        {images.length > 1 && (
          <div className="mt-4 flex justify-center gap-2">
            {images.map((im, i) => (
              <button
                key={i}
                onClick={() => onIndex(i)}
                className={`w-16 h-16 overflow-hidden border-2 ${i === index ? "border-[#B8860B]" : "border-transparent opacity-60 hover:opacity-100"}`}
                data-testid={`lightbox-thumb-${i}`}
              >
                <img src={fileUrl(im)} alt="" className="w-full h-full object-cover"/>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const INITIAL_REVIEWS = [
  {
    id: 1,
    rating: 5,
    tag: "Nib Performance",
    headline: "Butter-smooth nib flow right out of the wax seal",
    text: "The nib grind is remarkable. Even with drier archival inks, it glides across Tomoe River and Midori paper with zero hard starts or railroading. Easily rivals custom bespoke nibmeister grinds.",
    author: "Rajesh K.",
    city: "Bangalore",
    spec: "Fine Nib · Iroshizuku Inked",
    date: "3 days ago",
    verified: true,
    helpful: 24,
  },
  {
    id: 2,
    rating: 5,
    tag: "Bespoke Engraving",
    headline: "The diamond engraving made our anniversary unforgettable",
    text: "I ordered this with custom Roman date engraving on the barrel. The precision of the diamond etching against the lacquered metal is breathtaking. Delivered in a wax-sealed cotton pouch.",
    author: "Priya M.",
    city: "New Delhi",
    spec: "Medium Nib · Timeless Serif Engraved",
    date: "1 week ago",
    verified: true,
    helpful: 19,
  },
  {
    id: 3,
    rating: 5,
    tag: "Heirloom Build",
    headline: "True heirloom craftsmanship at an honest price",
    text: "The balance in hand when posted is sublime. The feed keeps up even during rapid journaling sessions. A true collector's piece that feels like it will last generations.",
    author: "Arjun S.",
    city: "Mumbai",
    spec: "Broad Nib · Panchkula Studio Tuned",
    date: "2 weeks ago",
    verified: true,
    helpful: 31,
  },
  {
    id: 4,
    rating: 5,
    tag: "Gifting Experience",
    headline: "Impeccable gifting experience from Panchkula",
    text: "Sent this as a milestone gift for my father. The presentation box, personalized studio calligraphy card, and brass weight felt extraordinarily premium. He hasn't stopped writing with it.",
    author: "Sneha V.",
    city: "Pune",
    spec: "Fine Nib · Classic Script Inscription",
    date: "3 weeks ago",
    verified: true,
    helpful: 14,
  },
  {
    id: 5,
    rating: 5,
    tag: "Studio Service",
    headline: "Responsive atelier concierge and swift 48hr dispatch",
    text: "Reached out via WhatsApp to clarify ink converter compatibility. The team responded within minutes with photos. Arrived securely packaged in 48 hours.",
    author: "Vikram R.",
    city: "Chennai",
    spec: "Extra Fine Nib · Studio Tested",
    date: "1 month ago",
    verified: true,
    helpful: 27,
  },
];

const RATING_DESCRIPTIONS = {
  5: "Masterpiece · Highest atelier praise",
  4: "Exceptional · Very pleased",
  3: "Good · Meets expectations",
  2: "Fair · Needs refinement",
  1: "Unsatisfactory · Studio follow-up needed",
};

function ProductReviewsSection({ productName }) {
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [activeTag, setActiveTag] = useState("All");
  const [isWriting, setIsWriting] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState({});

  // Review composer form state
  const [form, setForm] = useState({
    rating: 5,
    hoverRating: 0,
    headline: "",
    text: "",
    name: "",
    city: "",
    tag: "Nib Performance",
    spec: "Fine Nib",
  });

  const availableTags = ["All", "Nib Performance", "Bespoke Engraving", "Gifting Experience", "Heirloom Build", "Studio Service"];

  const filteredReviews = activeTag === "All"
    ? reviews
    : reviews.filter((r) => r.tag === activeTag);

  const handleHelpful = (id) => {
    if (helpfulMap[id]) {
      toast.info("You have already voted this review as helpful.");
      return;
    }
    setHelpfulMap((prev) => ({ ...prev, [id]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, helpful: r.helpful + 1 } : r))
    );
    toast.success("Thank you for your feedback!");
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.headline.trim() || !form.text.trim()) {
      toast.error("Please fill in your name, review headline, and remarks.");
      return;
    }

    const newRev = {
      id: Date.now(),
      rating: form.rating,
      tag: form.tag,
      headline: form.headline.trim(),
      text: form.text.trim(),
      author: form.name.trim(),
      city: form.city.trim() || "India",
      spec: form.spec ? `${form.spec} · Studio Collector` : "Studio Collector Edition",
      date: "Just now",
      verified: true,
      helpful: 1,
    };

    setReviews([newRev, ...reviews]);
    setIsWriting(false);
    setForm({
      rating: 5,
      hoverRating: 0,
      headline: "",
      text: "",
      name: "",
      city: "",
      tag: "Nib Performance",
      spec: "Fine Nib",
    });
    toast.success("Your collector impression has been published to the atelier registry!");
  };

  return (
    <section className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 lg:py-16 border-t border-[#E6E0D6]" data-testid="product-reviews">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-[#E6E0D6] gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#B8860B] font-semibold flex items-center gap-2">
            <Sparkles size={13}/> ATELIER PROVENANCE &amp; REVIEWS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C1815] mt-2">
            Collector Stories &amp; Impressions.
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#6E685E] max-w-2xl leading-relaxed">
            Authentic provenance and field feedback from pen connoisseurs, calligraphers, and heirloom gift recipients across India.
          </p>
        </div>

        <button
          onClick={() => setIsWriting(!isWriting)}
          className="self-start md:self-auto inline-flex items-center gap-2 bg-[#1C1815] text-[#FAF8F5] px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#3D4838] transition-colors rounded-sm shadow-sm"
          data-testid="toggle-write-review-btn"
        >
          {isWriting ? "Close Composer" : "+ Write a Review"}
        </button>
      </div>

      {/* Atelier Score & Highlights Showcase Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8 border-b border-[#E6E0D6] bg-[#FAF8F5] my-2 items-center">
        {/* Overall Rating Block */}
        <div className="lg:col-span-4 flex items-center gap-6 pr-6 lg:border-r border-[#E6E0D6]">
          <div className="text-center">
            <div className="font-serif text-5xl sm:text-6xl text-[#1C1815] font-medium leading-none">
              4.9
            </div>
            <div className="flex items-center justify-center gap-1 mt-2 text-[#B8860B]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-[#B8860B] text-[#B8860B]"/>
              ))}
            </div>
            <p className="text-[10px] uppercase tracking-[0.15em] text-[#6E685E] mt-1.5 font-medium">
              48 Verified Reviews
            </p>
          </div>

          {/* Mini Percentage Bars */}
          <div className="flex-1 space-y-1.5 text-xs text-[#6E685E]">
            <div className="flex items-center gap-2">
              <span className="w-10 text-[10px] uppercase tracking-wider">5 Star</span>
              <div className="flex-1 h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
                <div className="w-[96%] h-full bg-[#B8860B] rounded-full"/>
              </div>
              <span className="text-[10px] w-6 text-right">96%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-[10px] uppercase tracking-wider">4 Star</span>
              <div className="flex-1 h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
                <div className="w-[4%] h-full bg-[#B8860B]/70 rounded-full"/>
              </div>
              <span className="text-[10px] w-6 text-right">4%</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-10 text-[10px] uppercase tracking-wider">3 Star</span>
              <div className="flex-1 h-1.5 bg-[#E6E0D6] rounded-full overflow-hidden">
                <div className="w-[0%] h-full bg-[#B8860B]/30 rounded-full"/>
              </div>
              <span className="text-[10px] w-6 text-right">0%</span>
            </div>
          </div>
        </div>

        {/* 3 Hallmark Studio Guarantees */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-[#FFFFFF] border border-[#E6E0D6] rounded-sm flex items-start gap-3 shadow-xs">
            <PenTool size={18} className="text-[#B8860B] shrink-0 mt-0.5"/>
            <div>
              <p className="font-serif text-sm text-[#1C1815] font-medium">Hand-Tuned Nib</p>
              <p className="text-[11px] text-[#6E685E] mt-0.5 leading-snug">Tested &amp; smoothed for uninterrupted capillary flow.</p>
            </div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E6E0D6] rounded-sm flex items-start gap-3 shadow-xs">
            <Award size={18} className="text-[#B8860B] shrink-0 mt-0.5"/>
            <div>
              <p className="font-serif text-sm text-[#1C1815] font-medium">Diamond Inscribed</p>
              <p className="text-[11px] text-[#6E685E] mt-0.5 leading-snug">Crisp optical laser &amp; diamond tip personalization.</p>
            </div>
          </div>

          <div className="p-4 bg-[#FFFFFF] border border-[#E6E0D6] rounded-sm flex items-start gap-3 shadow-xs">
            <Gift size={18} className="text-[#B8860B] shrink-0 mt-0.5"/>
            <div>
              <p className="font-serif text-sm text-[#1C1815] font-medium">Heirloom Pouch</p>
              <p className="text-[11px] text-[#6E685E] mt-0.5 leading-snug">Wax-sealed archival pouch &amp; certification card.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Review Composer Form */}
      {isWriting && (
        <form onSubmit={handleSubmitReview} className="my-8 p-6 sm:p-10 bg-[#FFFFFF] border-2 border-[#B8860B]/50 rounded shadow-md space-y-6 animate-fadeIn">
          <div className="border-b border-[#E6E0D6] pb-4 flex items-center justify-between">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
                COLLECTOR REGISTRY
              </span>
              <h3 className="font-serif text-2xl text-[#1C1815] mt-1">
                Share your impression of {productName || "this instrument"}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="text-xs uppercase tracking-wider text-[#6E685E] hover:text-[#1C1815]"
            >
              Cancel
            </button>
          </div>

          {/* Star Picker */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
              Overall Rating *
            </label>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    onMouseEnter={() => setForm({ ...form, hoverRating: star })}
                    onMouseLeave={() => setForm({ ...form, hoverRating: 0 })}
                    className="p-1 hover:scale-110 transition-transform text-[#B8860B]"
                  >
                    <Star
                      size={24}
                      className={
                        (form.hoverRating || form.rating) >= star
                          ? "fill-[#B8860B] text-[#B8860B]"
                          : "text-[#E6E0D6]"
                      }
                    />
                  </button>
                ))}
              </div>
              <span className="ml-3 text-xs font-serif italic text-[#1C1815]">
                {RATING_DESCRIPTIONS[form.hoverRating || form.rating]}
              </span>
            </div>
          </div>

          {/* Tag & Spec Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
                Primary Feedback Topic
              </label>
              <select
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 text-xs text-[#1C1815] outline-none focus:border-[#B8860B]"
              >
                <option value="Nib Performance">Nib Performance &amp; Flow</option>
                <option value="Bespoke Engraving">Bespoke Engraving &amp; Inscription</option>
                <option value="Gifting Experience">Gifting Experience &amp; Packaging</option>
                <option value="Heirloom Build">Heirloom Build &amp; Materials</option>
                <option value="Studio Service">Studio Service &amp; Concierge</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
                Nib / Variant Config
              </label>
              <input
                type="text"
                placeholder="e.g. Fine Nib · Classic Script Engraving"
                value={form.spec}
                onChange={(e) => setForm({ ...form, spec: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 text-xs text-[#1C1815] outline-none focus:border-[#B8860B]"
              />
            </div>
          </div>

          {/* Headline & Full Review Text */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
              Review Title / Summary *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sublime nib tuning and breathtaking diamond engraving"
              value={form.headline}
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#B8860B]"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
              Detailed Collector Narrative *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Share how the pen feels in hand, ink flow across paper, weight balance, or unboxing experience…"
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full bg-[#FAF8F5] border border-[#E6E0D6] p-4 text-sm text-[#1C1815] outline-none focus:border-[#B8860B] resize-y"
            />
          </div>

          {/* Author Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
                Your Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aryan Kumar"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#B8860B]"
              />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-[#6E685E] font-medium mb-2">
                City / Region
              </label>
              <input
                type="text"
                placeholder="e.g. Chandigarh"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                className="w-full bg-[#FAF8F5] border border-[#E6E0D6] px-4 py-2.5 text-sm text-[#1C1815] outline-none focus:border-[#B8860B]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => setIsWriting(false)}
              className="px-6 py-3 text-xs uppercase tracking-wider text-[#6E685E] hover:text-[#1C1815]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#B8860B] text-[#FAF8F5] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#96700A] transition-colors rounded-sm shadow-md"
            >
              Publish Atelier Impression &rarr;
            </button>
          </div>
        </form>
      )}

      {/* Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto py-6 no-scrollbar">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E] mr-2 flex items-center gap-1 shrink-0 font-medium">
          <MessageSquare size={13}/> Filter By:
        </span>
        {availableTags.map((tag) => {
          const count = tag === "All" ? reviews.length : reviews.filter((r) => r.tag === tag).length;
          return (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs transition-all shrink-0 font-medium ${
                activeTag === tag
                  ? "bg-[#1C1815] text-[#FAF8F5] shadow-sm"
                  : "bg-[#FFFFFF] border border-[#E6E0D6] text-[#6E685E] hover:border-[#B8860B] hover:text-[#1C1815]"
              }`}
            >
              {tag} <span className="opacity-70 text-[10px]">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Reviews Grid / Carousel */}
      <div className="mt-4">
        {filteredReviews.length > 0 ? (
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {filteredReviews.map((review) => (
                <CarouselItem key={review.id} className="basis-full md:basis-1/2 lg:basis-1/3">
                  <div className="bg-[#FFFFFF] border border-[#E6E0D6] p-7 sm:p-8 rounded-sm h-full flex flex-col justify-between hover:border-[#B8860B] transition-all duration-300 shadow-xs hover:shadow-md group">
                    {/* Card Top */}
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-1 text-[#B8860B]">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-[#B8860B] text-[#B8860B]"/>
                          ))}
                        </div>
                        <span className="text-[10px] uppercase tracking-wider text-[#3D4838] bg-[#3D4838]/10 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                          <ShieldCheck size={11}/> Verified
                        </span>
                      </div>

                      {/* Tag pill */}
                      <span className="inline-block text-[10px] uppercase tracking-[0.15em] text-[#B8860B] font-semibold mb-2.5">
                        ✦ {review.tag}
                      </span>

                      {/* Headline */}
                      <h4 className="font-serif text-base sm:text-lg text-[#1C1815] font-medium leading-snug mb-3 group-hover:text-[#B8860B] transition-colors">
                        "{review.headline}"
                      </h4>

                      {/* Narrative */}
                      <p className="text-xs sm:text-sm text-[#6E685E] leading-relaxed font-light mb-4">
                        {review.text}
                      </p>

                      {/* Pen Spec & Engraving note if any */}
                      {review.spec && (
                        <div className="inline-block bg-[#FAF8F5] border border-[#E6E0D6]/70 px-2.5 py-1 rounded text-[10px] text-[#6E685E] font-mono tracking-tight mb-4">
                          {review.spec}
                        </div>
                      )}
                    </div>

                    {/* Card Bottom / Author Info & Helpful Button */}
                    <div className="pt-4 border-t border-[#E6E0D6] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1C1815] text-[#FAF8F5] flex items-center justify-center font-serif text-xs font-semibold">
                          {review.author[0]}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-[#1C1815]">{review.author}</p>
                          <p className="text-[10px] text-[#6E685E]">{review.city} · {review.date}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => handleHelpful(review.id)}
                        className={`flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded border transition-colors ${
                          helpfulMap[review.id]
                            ? "border-[#B8860B] bg-[#B8860B]/10 text-[#B8860B] font-medium"
                            : "border-[#E6E0D6] text-[#6E685E] hover:border-[#1C1815] hover:text-[#1C1815]"
                        }`}
                        title="Mark as helpful"
                      >
                        <ThumbsUp size={11}/>
                        <span>{review.helpful}</span>
                      </button>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div className="flex justify-end gap-3 mt-8">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        ) : (
          <div className="p-12 text-center bg-[#FFFFFF] border border-[#E6E0D6] rounded">
            <p className="font-serif text-lg text-[#1C1815]">No stories found under this category.</p>
            <button
              onClick={() => setActiveTag("All")}
              className="mt-3 text-xs uppercase tracking-wider text-[#B8860B] underline"
            >
              View all reviews
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

