import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, X, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { useWishlist } from "../lib/wishlist";
import { useState } from "react";
import SearchModal from "./SearchModal";
import logo from "../logo.png";

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const { count: wcount } = useWishlist();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);

  const tickerContent = (
    <div className="flex items-center gap-8 px-4 shrink-0">
      <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold">
        <Sparkles size={11} className="text-[#B8860B] shrink-0" />
        NEW ARRIVALS
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-[#FAF8F5]/90 font-medium">
        SS/26 ATELIER COLLECTION
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-[#FAF8F5]/90 font-medium">
        HAND-GROUND IRIDIUM NIBS
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-[#B8860B] font-semibold">
        COMPLIMENTARY BESPOKE STUDIO ENGRAVING
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-[#FAF8F5]/90 font-medium">
        CALL / WHATSAPP: +91 93519 96272
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center text-[10px] uppercase tracking-[0.2em] text-[#FAF8F5]/90 font-medium">
        SHIPS WITHIN 48 HOURS FROM PANCHKULA
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />

      <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.25em] text-[#B8860B] font-semibold underline underline-offset-4 group-hover:text-[#FAF8F5] transition-colors">
        EXPLORE NEW EDITIONS <ArrowRight size={10} className="shrink-0 ml-0.5" />
      </span>
      <span className="w-1 h-1 rounded-full bg-[#B8860B]/60" />
    </div>
  );

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E6E0D6]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between">
        <button className="lg:hidden text-[#1C1815]" onClick={() => setMobile(!mobile)} data-testid="mobile-menu-toggle">
          {mobile ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group" data-testid="header-nav-brand">
          <img src={logo} alt="The WL Pens" className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span className="font-serif text-xl lg:text-2xl tracking-[0.15em] text-[#1C1815] flex items-center gap-1.5">
            <span className="text-[#6E685E] italic font-normal text-sm sm:text-base">The</span>
            <span className="text-[#B8860B] font-semibold">WL</span>
            <span className="hidden sm:inline">PENS</span>
          </span>
        </Link>

        {/* Navigation: Home · Products · New Arrivals · Best Sellers · Contact Us */}
        <nav className="hidden lg:flex items-center gap-7">
          <Link
            to="/"
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-0.5 ${
              loc.pathname === "/"
                ? "text-[#1C1815] font-semibold border-b border-[#1C1815]"
                : "text-[#6E685E] hover:text-[#1C1815]"
            }`}
            data-testid="nav-home"
          >
            Home
          </Link>
          <Link
            to="/products"
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-0.5 ${
              loc.pathname === "/products" || loc.pathname === "/shop"
                ? "text-[#1C1815] font-semibold border-b border-[#1C1815]"
                : "text-[#6E685E] hover:text-[#1C1815]"
            }`}
            data-testid="nav-products"
          >
            Products
          </Link>
          <Link
            to="/new-arrivals"
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-0.5 flex items-center gap-1.5 ${
              loc.pathname === "/new-arrivals"
                ? "text-[#B8860B] font-semibold border-b border-[#B8860B]"
                : "text-[#B8860B] hover:text-[#1C1815] font-medium"
            }`}
            data-testid="nav-new-arrivals"
          >
            <span>New Arrivals</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></span>
          </Link>
          <Link
            to="/best-sellers"
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-0.5 ${
              loc.pathname === "/best-sellers"
                ? "text-[#1C1815] font-semibold border-b border-[#1C1815]"
                : "text-[#6E685E] hover:text-[#1C1815]"
            }`}
            data-testid="nav-best-sellers"
          >
            Best Sellers
          </Link>
          <Link
            to="/contact"
            className={`text-xs uppercase tracking-[0.2em] transition-colors pb-0.5 ${
              loc.pathname === "/contact"
                ? "text-[#1C1815] font-semibold border-b border-[#1C1815]"
                : "text-[#6E685E] hover:text-[#1C1815]"
            }`}
            data-testid="nav-contact"
          >
            Contact Us
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button onClick={() => setSearch(true)} className="text-[#6E685E] hover:text-[#1C1815]" data-testid="open-search-btn" aria-label="Open search">
            <Search size={18}/>
          </button>
          {user ? (
            <>
              <Link to="/wishlist" className="relative text-[#6E685E] hover:text-[#B8860B]" data-testid="wishlist-link" aria-label="Wishlist">
                <Heart size={18}/>
                {wcount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#B8860B] text-[#FAF8F5] text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center" data-testid="wishlist-count">{wcount}</span>
                )}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="hidden sm:inline text-xs uppercase tracking-[0.15em] text-[#3D4838] hover:text-[#1C1815]" data-testid="admin-link">Admin</Link>
              )}
              <Link to="/account" className="text-[#6E685E] hover:text-[#1C1815]" data-testid="account-link"><User size={18}/></Link>
              <button onClick={logout} className="hidden sm:inline text-xs uppercase tracking-[0.15em] text-[#6E685E] hover:text-[#1C1815]" data-testid="logout-btn">Sign out</button>
            </>
          ) : (
            <Link to="/login" className="text-xs uppercase tracking-[0.15em] text-[#6E685E] hover:text-[#1C1815]" data-testid="login-link">Sign in</Link>
          )}
          <button onClick={() => setOpen(true)} className="relative text-[#1C1815] hover:text-[#3D4838]" data-testid="open-cart-btn">
            <ShoppingBag size={20}/>
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#1C1815] text-[#FAF8F5] text-[10px] font-medium w-5 h-5 rounded-full flex items-center justify-center" data-testid="cart-count">{count}</span>
            )}
          </button>
        </div>
      </div>

      {/* Continuous Motion Strip Right Under Navbar */}
      <div className="border-t border-[#3D4838]/40 bg-[#1C1815] text-[#FAF8F5] py-2 overflow-hidden select-none cursor-pointer group" data-testid="header-sub-ticker">
        <Link to="/new-arrivals" className="block focus:outline-none" title="Explore New Arrivals">
          <div className="animate-marquee-infinite flex items-center">
            {tickerContent}
            {tickerContent}
          </div>
        </Link>
      </div>

      {mobile && (
        <div className="lg:hidden border-t border-[#E6E0D6] bg-[#FAF8F5]">
          <div className="px-6 py-6 flex flex-col gap-4">
            <Link
              to="/"
              onClick={() => setMobile(false)}
              className={`text-lg font-serif transition-colors ${
                loc.pathname === "/" ? "text-[#B8860B] font-medium" : "text-[#1C1815]"
              }`}
              data-testid="mobile-nav-home"
            >
              Home
            </Link>
            <Link
              to="/products"
              onClick={() => setMobile(false)}
              className={`text-lg font-serif transition-colors ${
                loc.pathname === "/products" || loc.pathname === "/shop" ? "text-[#B8860B] font-medium" : "text-[#1C1815]"
              }`}
              data-testid="mobile-nav-products"
            >
              Products
            </Link>
            <Link
              to="/new-arrivals"
              onClick={() => setMobile(false)}
              className="text-lg font-serif text-[#B8860B] font-medium flex items-center justify-between"
              data-testid="mobile-nav-new-arrivals"
            >
              <span>New Arrivals</span>
              <span className="text-[10px] uppercase tracking-[0.2em] bg-[#B8860B]/15 text-[#B8860B] px-2 py-0.5">Fresh</span>
            </Link>
            <Link
              to="/best-sellers"
              onClick={() => setMobile(false)}
              className={`text-lg font-serif transition-colors ${
                loc.pathname === "/best-sellers" ? "text-[#B8860B] font-medium" : "text-[#1C1815]"
              }`}
              data-testid="mobile-nav-best-sellers"
            >
              Best Sellers
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobile(false)}
              className={`text-lg font-serif transition-colors ${
                loc.pathname === "/contact" ? "text-[#B8860B] font-medium" : "text-[#1C1815]"
              }`}
              data-testid="mobile-nav-contact"
            >
              Contact Us
            </Link>
            {user && <Link to="/wishlist" onClick={() => setMobile(false)} className="text-lg font-serif text-[#B8860B]" data-testid="mobile-wishlist-link">Wishlist</Link>}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobile(false)} className="text-lg font-serif text-[#3D4838]" data-testid="mobile-admin-link">Admin dashboard</Link>
            )}
          </div>
        </div>
      )}
    </header>
    <SearchModal open={search} onClose={() => setSearch(false)}/>
    </>
  );
}
