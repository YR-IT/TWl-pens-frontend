import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, X, Heart, Sparkles, ArrowRight, ChevronDown } from "lucide-react";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { useWishlist } from "../lib/wishlist";
import { useCategories } from "../lib/categories";
import { useState } from "react";
import SearchModal from "./SearchModal";
import logo from "../logo.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const { count: wcount } = useWishlist();
  const cats = useCategories();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 w-full">
      {/* Announcement Carousel */}
      <div className="bg-[#1C1815] text-[#FAF8F5] py-2 overflow-hidden border-b border-[#3D4838]">
        <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
          {[
            { text: "COMPLIMENTARY BESPOKE STUDIO ENGRAVING", color: "text-[#B8860B]" },
            { text: "CALL / WHATSAPP: +91 93519 96272", color: "text-[#FAF8F5]/80" },
            { text: "SHIPS WITHIN 48 HOURS FROM PANCHKULA", color: "text-[#FAF8F5]/80" },
            { text: "SS/26 ATELIER COLLECTION", color: "text-[#B8860B]" },
            { text: "HAND-GROUND IRIDIUM NIBS", color: "text-[#FAF8F5]/80" }
          ].map((item, i) => (
            <span key={i} className={`mx-8 text-[11px] font-medium uppercase tracking-[0.25em] ${item.color}`}>
              {item.text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {[
            { text: "COMPLIMENTARY BESPOKE STUDIO ENGRAVING", color: "text-[#B8860B]" },
            { text: "CALL / WHATSAPP: +91 93519 96272", color: "text-[#FAF8F5]/80" },
            { text: "SHIPS WITHIN 48 HOURS FROM PANCHKULA", color: "text-[#FAF8F5]/80" },
            { text: "SS/26 ATELIER COLLECTION", color: "text-[#B8860B]" },
            { text: "HAND-GROUND IRIDIUM NIBS", color: "text-[#FAF8F5]/80" }
          ].map((item, i) => (
            <span key={`dup-${i}`} className={`mx-8 text-[11px] font-medium uppercase tracking-[0.25em] ${item.color}`}>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E6E0D6] w-full">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-[80px] flex items-center justify-between">
          <button className="lg:hidden text-[#1C1815]" onClick={() => setMobile(!mobile)} data-testid="mobile-menu-toggle">
            {mobile ? <X size={22}/> : <Menu size={22}/>}
          </button>
          
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" data-testid="header-nav-brand">
            <img src={logo} alt="The WL Pens" className="h-12 w-auto" />
            <span className="font-serif text-2xl tracking-[0.15em] text-[#1C1815]">
              The <span className="text-[#B8860B]">WL</span> PENS
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {["Home", "New Arrivals", "Contact Us"].map(link => (
              <Link 
                key={link}
                to={link === "Home" ? "/" : `/${link.toLowerCase().replace(" ", "-")}`}
                className={`text-[11px] uppercase tracking-[0.25em] font-medium transition-colors flex items-center gap-1.5 ${
                  link === "New Arrivals" 
                    ? "text-[#B8860B] hover:text-[#1C1815] font-semibold"
                    : "text-[#6E685E] hover:text-[#1C1815]"
                }`}
              >
                {link}
                {link === "New Arrivals" && <span className="w-1 h-1 rounded-full bg-[#B8860B]"></span>}
              </Link>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-5">
            <button onClick={() => setSearch(true)} className="text-[#6E685E] hover:text-[#1C1815]" data-testid="open-search-btn"><Search size={18}/></button>
            
            {user ? (
              <Link to={user.role === "admin" ? "/admin" : "/account"} className="text-[#6E685E] hover:text-[#1C1815]" data-testid="account-link">
                <User size={18}/>
              </Link>
            ) : (
              <Link to="/login" className="text-[11px] uppercase tracking-[0.25em] text-[#6E685E] hover:text-[#1C1815] font-medium" data-testid="login-link">
                Sign in
              </Link>
            )}

            <Link to="/wishlist" className="relative text-[#6E685E] hover:text-[#B8860B]" data-testid="wishlist-link">
              <Heart size={18}/>
              {wcount > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#B8860B] text-[#FAF8F5] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{wcount}</span>}
            </Link>
            <button onClick={() => setOpen(true)} className="relative text-[#1C1815] hover:text-[#3D4838]" data-testid="open-cart-btn">
              <ShoppingBag size={20}/>
              {count > 0 && <span className="absolute -top-1.5 -right-1.5 bg-[#1C1815] text-[#FAF8F5] text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
            </button>
          </div>
        </div>
      </div>

      {mobile && (
        <div className="lg:hidden border-b border-[#E6E0D6] bg-[#FAF8F5] p-6">
          <div className="flex flex-col gap-4">
            <Link to="/" onClick={() => setMobile(false)} className="text-lg font-serif text-[#1C1815]">Home</Link>
            <div className="flex flex-col gap-2">
              <span className="text-lg font-serif text-[#1C1815]">Categories</span>
              <Link to="/shop" onClick={() => setMobile(false)} className="text-sm text-[#6E685E] ml-4">All Products</Link>
              {Array.isArray(cats) && cats.map(c => (
                <Link to={`/shop?category=${encodeURIComponent(c.name)}`} key={c.id} onClick={() => setMobile(false)} className="text-sm text-[#6E685E] ml-4">
                  {c.name}
                </Link>
              ))}
            </div>
            <Link to="/new-arrivals" onClick={() => setMobile(false)} className="text-lg font-serif text-[#B8860B]">New Arrivals</Link>
            <Link to="/best-sellers" onClick={() => setMobile(false)} className="text-lg font-serif text-[#1C1815]">Best Sellers</Link>
            <Link to="/contact" onClick={() => setMobile(false)} className="text-lg font-serif text-[#1C1815]">Contact Us</Link>
            {user && <Link to="/wishlist" onClick={() => setMobile(false)} className="text-lg font-serif text-[#B8860B]">Wishlist</Link>}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobile(false)} className="text-lg font-serif text-[#3D4838]">Admin dashboard</Link>
            )}
          </div>
        </div>
      )}
    </header>
    <SearchModal open={search} onClose={() => setSearch(false)}/>
    </>
  );
}
