import { Link, useNavigate, useLocation } from "react-router-dom";
import { 
  ShoppingBag, 
  User, 
  Menu, 
  Search, 
  X, 
  Heart, 
  Sparkles, 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  LogOut, 
  Phone, 
  MessageCircle, 
  ShieldCheck 
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { useWishlist } from "../lib/wishlist";
import { useCategories } from "../lib/categories";
import { useState } from "react";
import SearchModal from "./SearchModal";
import logo from "../logo.png";

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const { count: wcount } = useWishlist();
  const cats = useCategories();
  const loc = useLocation();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  const [catsOpen, setCatsOpen] = useState(true);

  return (
    <>
    <header className="fixed top-0 left-0 right-0 z-40 w-full bg-[#FAF8F5]">
      {/* Announcement Carousel */}
      <div className="bg-[#1C1815] text-[#FAF8F5] py-2 overflow-hidden border-b border-[#3D4838] w-full">
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
      <div className="bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E6E0D6] w-full">
        <div className="w-full max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-12 h-[68px] sm:h-[80px] flex items-center justify-between gap-2">
          
          {/* Left: Mobile Menu Toggle Button */}
          <button 
            className="lg:hidden text-[#1C1815] p-1.5 -ml-1 rounded-md hover:bg-[#E6E0D6]/50 transition-colors flex-shrink-0" 
            onClick={() => setMobile(true)} 
            data-testid="mobile-menu-toggle"
            aria-label="Open navigation menu"
          >
            <Menu size={22}/>
          </button>
          
          {/* Brand Logo & Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group flex-shrink-0" data-testid="header-nav-brand">
            <img src={logo} alt="The WL Pens" className="h-8.5 sm:h-12 w-auto max-h-[36px] sm:max-h-[48px]" />
            <span className="font-serif text-lg xs:text-xl sm:text-2xl tracking-[0.1em] sm:tracking-[0.15em] text-[#1C1815] font-medium whitespace-nowrap">
              The <span className="text-[#B8860B]">WL</span> PENS
            </span>
          </Link>

          {/* Desktop Navigation Links */}
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

          {/* Right Action Icons (Search, Sign In / Account, Wishlist, Cart) */}
          <div className="flex items-center gap-2 sm:gap-5 flex-shrink-0">
            {/* Search Trigger */}
            <button 
              onClick={() => setSearch(true)} 
              className="p-1.5 text-[#6E685E] hover:text-[#1C1815] transition-colors" 
              data-testid="open-search-btn"
              aria-label="Search"
            >
              <Search size={18}/>
            </button>
            
            {/* Sign in / Account Link (Visible on mobile as icon & desktop with text) */}
            <Link 
              to={user ? (user.role === "admin" ? "/admin" : "/account") : "/login"} 
              className="p-1.5 text-[#6E685E] hover:text-[#1C1815] transition-colors flex items-center gap-1.5" 
              data-testid="account-link"
              title={user ? (user.name || "Account") : "Sign In"}
              aria-label={user ? "Account" : "Sign In"}
            >
              <User size={18}/>
              {!user && (
                <span className="hidden sm:inline text-[11px] uppercase tracking-[0.25em] text-[#6E685E] hover:text-[#1C1815] font-medium" data-testid="login-link">
                  Sign in
                </span>
              )}
            </Link>

            {/* Wishlist Link */}
            <Link to="/wishlist" className="p-1.5 relative text-[#6E685E] hover:text-[#B8860B] transition-colors" data-testid="wishlist-link" aria-label="Wishlist">
              <Heart size={18}/>
              {wcount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#B8860B] text-[#FAF8F5] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wcount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button 
              onClick={() => setOpen(true)} 
              className="p-1.5 relative text-[#1C1815] hover:text-[#3D4838] transition-colors" 
              data-testid="open-cart-btn"
              aria-label="Shopping Bag"
            >
              <ShoppingBag size={20}/>
              {count > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#1C1815] text-[#FAF8F5] text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>

    {/* Search Modal */}
    <SearchModal open={search} onClose={() => setSearch(false)}/>

    {/* Modern Luxury Mobile Drawer Navigation */}
    <AnimatePresence>
      {mobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-[#1C1815]/60 backdrop-blur-sm"
            onClick={() => setMobile(false)}
          />

          {/* Slide-in Drawer Container */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 26, stiffness: 220 }}
            className="fixed top-0 left-0 bottom-0 w-[88%] max-w-[360px] bg-[#FAF8F5] z-50 shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-[#E6E0D6]"
          >
            {/* Top Section */}
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-[#E6E0D6] flex items-center justify-between bg-[#F3EFEA]">
                <Link to="/" onClick={() => setMobile(false)} className="flex items-center gap-2">
                  <img src={logo} alt="The WL Pens" className="h-8 w-auto" />
                  <span className="font-serif text-lg tracking-[0.12em] text-[#1C1815] font-medium">
                    The <span className="text-[#B8860B]">WL</span> PENS
                  </span>
                </Link>
                <button 
                  onClick={() => setMobile(false)} 
                  className="w-8 h-8 rounded-full border border-[#E6E0D6] flex items-center justify-center text-[#1C1815] hover:bg-[#FAF8F5] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18}/>
                </button>
              </div>

              {/* User Account / Auth Card */}
              <div className="p-5 border-b border-[#E6E0D6] bg-[#FAF8F5]">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1C1815] text-[#FAF8F5] flex items-center justify-center font-serif text-lg font-bold">
                        {user.name ? user.name[0].toUpperCase() : <User size={18}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1815] truncate">{user.name || "Collector"}</p>
                        <p className="text-[11px] text-[#6E685E] truncate">{user.email}</p>
                      </div>
                      {user.role === "admin" && (
                        <span className="text-[9px] uppercase tracking-wider bg-[#3D4838] text-[#FAF8F5] px-2 py-0.5 rounded font-medium">
                          Admin
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <Link 
                        to={user.role === "admin" ? "/admin" : "/account"} 
                        onClick={() => setMobile(false)}
                        className="text-center py-2 px-3 text-xs bg-[#1C1815] text-[#FAF8F5] rounded uppercase tracking-wider hover:bg-[#3D4838] transition-colors"
                      >
                        {user.role === "admin" ? "Admin Panel" : "My Account"}
                      </Link>
                      <button 
                        onClick={() => { logout(); setMobile(false); }}
                        className="py-2 px-3 text-xs border border-[#E6E0D6] text-[#6E685E] rounded uppercase tracking-wider hover:text-[#1C1815] hover:border-[#1C1815] transition-colors flex items-center justify-center gap-1.5"
                      >
                        <LogOut size={13}/> Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-[#B8860B] font-medium">Atelier Membership</p>
                    <p className="text-xs text-[#6E685E]">Sign in for order tracking, wishlist syncing and bespoke engraving.</p>
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link 
                        to="/login" 
                        onClick={() => setMobile(false)}
                        className="text-center py-2 px-3 text-xs bg-[#1C1815] text-[#FAF8F5] rounded uppercase tracking-wider font-medium hover:bg-[#3D4838] transition-colors"
                      >
                        Sign In
                      </Link>
                      <Link 
                        to="/register" 
                        onClick={() => setMobile(false)}
                        className="text-center py-2 px-3 text-xs border border-[#B8860B] text-[#B8860B] rounded uppercase tracking-wider font-medium hover:bg-[#B8860B] hover:text-[#FAF8F5] transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Search Bar inside drawer */}
              <div className="p-4 border-b border-[#E6E0D6]">
                <button 
                  onClick={() => { setMobile(false); setSearch(true); }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#F3EFEA] border border-[#E6E0D6] rounded text-xs text-[#6E685E] hover:border-[#B8860B] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Search size={14} className="text-[#B8860B]"/> Search pens, inks, brands...
                  </span>
                  <span className="text-[10px] uppercase tracking-wider bg-[#FAF8F5] px-1.5 py-0.5 rounded border border-[#E6E0D6]">
                    Browse
                  </span>
                </button>
              </div>

              {/* Primary Navigation Links */}
              <nav className="p-5 space-y-1.5">
                <Link 
                  to="/" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#1C1815] hover:text-[#B8860B] border-b border-[#E6E0D6]/60 transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight size={15} className="text-[#6E685E]/50"/>
                </Link>

                <Link 
                  to="/new-arrivals" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#B8860B] hover:text-[#1C1815] border-b border-[#E6E0D6]/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    New Arrivals <span className="text-[9px] uppercase tracking-widest bg-[#B8860B] text-[#FAF8F5] px-1.5 py-0.5 rounded font-sans font-medium">New</span>
                  </span>
                  <ChevronRight size={15} className="text-[#B8860B]"/>
                </Link>

                <Link 
                  to="/best-sellers" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#1C1815] hover:text-[#B8860B] border-b border-[#E6E0D6]/60 transition-colors"
                >
                  <span>Best Sellers</span>
                  <ChevronRight size={15} className="text-[#6E685E]/50"/>
                </Link>

                <Link 
                  to="/shop" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#1C1815] hover:text-[#B8860B] border-b border-[#E6E0D6]/60 transition-colors"
                >
                  <span>All Collections</span>
                  <ChevronRight size={15} className="text-[#6E685E]/50"/>
                </Link>

                {/* Categories Collapsible Section */}
                <div className="py-2 border-b border-[#E6E0D6]/60">
                  <button 
                    onClick={() => setCatsOpen(!catsOpen)}
                    className="w-full flex items-center justify-between py-1 text-base font-serif text-[#1C1815] hover:text-[#B8860B] transition-colors"
                  >
                    <span>Categories</span>
                    <ChevronDown size={16} className={`text-[#6E685E] transition-transform duration-200 ${catsOpen ? "rotate-180" : ""}`}/>
                  </button>

                  {catsOpen && (
                    <div className="mt-2 ml-3 pl-3 border-l border-[#B8860B]/30 space-y-2 py-1">
                      <Link 
                        to="/shop" 
                        onClick={() => setMobile(false)}
                        className="block text-xs uppercase tracking-wider text-[#6E685E] hover:text-[#1C1815] transition-colors py-1"
                      >
                        All Categories
                      </Link>
                      {Array.isArray(cats) && cats.map(c => (
                        <Link 
                          key={c.id || c.name}
                          to={`/shop?category=${encodeURIComponent(c.name)}`}
                          onClick={() => setMobile(false)}
                          className="block text-xs uppercase tracking-wider text-[#6E685E] hover:text-[#B8860B] transition-colors py-1"
                        >
                          {c.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <Link 
                  to="/wishlist" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#1C1815] hover:text-[#B8860B] border-b border-[#E6E0D6]/60 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    Wishlist {wcount > 0 && <span className="text-xs text-[#B8860B] font-sans font-medium">({wcount})</span>}
                  </span>
                  <Heart size={15} className="text-[#6E685E]/60"/>
                </Link>

                <Link 
                  to="/contact" 
                  onClick={() => setMobile(false)}
                  className="flex items-center justify-between py-2.5 text-base font-serif text-[#1C1815] hover:text-[#B8860B] transition-colors"
                >
                  <span>Contact Atelier</span>
                  <ChevronRight size={15} className="text-[#6E685E]/50"/>
                </Link>
              </nav>
            </div>

            {/* Bottom Concierge / Support Card */}
            <div className="p-5 border-t border-[#E6E0D6] bg-[#F3EFEA] space-y-3">
              <p className="text-[10px] uppercase tracking-[0.25em] text-[#6E685E] font-medium">Studio Concierge</p>
              <a 
                href="https://wa.me/919351996272?text=Hello%20The%20WL%20Pens%20Studio"
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#25D366] text-[#FAF8F5] rounded text-xs uppercase tracking-wider font-semibold hover:bg-[#1EBE5B] transition-colors shadow-sm"
              >
                <MessageCircle size={15}/> WhatsApp Concierge
              </a>
              <div className="flex items-center justify-between text-[11px] text-[#6E685E] pt-1">
                <a href="tel:+919351996272" className="flex items-center gap-1.5 hover:text-[#1C1815]">
                  <Phone size={12} className="text-[#B8860B]"/> +91 93519 96272
                </a>
                <span className="flex items-center gap-1 text-[#3D4838]">
                  <ShieldCheck size={12}/> Ships 48h
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
    </>
  );
}
