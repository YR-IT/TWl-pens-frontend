import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, X, Heart, Sparkles } from "lucide-react";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { useWishlist } from "../lib/wishlist";
import { useCategories } from "../lib/categories";
import { SITE } from "../lib/site";
import { useState } from "react";
import SearchModal from "./SearchModal";
import logo from "../logo.png";

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const { count: wcount } = useWishlist();
  const cats = useCategories();
  const safeCats = Array.isArray(cats) ? cats : [];
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);

  const navCats = safeCats.slice(0, 7);

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
        <nav className="hidden lg:flex items-center gap-6">
          <Link to="/new-arrivals" className="text-xs uppercase tracking-[0.2em] font-semibold text-[#B8860B] hover:text-[#1C1815] transition-colors flex items-center gap-1.5" data-testid="nav-new-arrivals">
            <span>New Arrivals</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B]"></span>
          </Link>
          {navCats.map((c) => (
            <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`} className="text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815] transition-colors" data-testid={`nav-${c.name.toLowerCase().replaceAll(' ', '-')}`}>
              {c.name.split(" ")[0]}
            </Link>
          ))}
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
      {mobile && (
        <div className="lg:hidden border-t border-[#E6E0D6] bg-[#FAF8F5]">
          <div className="px-6 py-6 flex flex-col gap-4">
            <Link to="/new-arrivals" onClick={() => setMobile(false)} className="text-lg font-serif text-[#B8860B] font-medium flex items-center justify-between" data-testid="mobile-nav-new-arrivals">
              <span>New Arrivals</span>
              <span className="text-[10px] uppercase tracking-[0.2em] bg-[#B8860B]/15 text-[#B8860B] px-2 py-0.5">Fresh</span>
            </Link>
            {safeCats.map((c) => (
              <Link key={c.id} to={`/shop?category=${encodeURIComponent(c.name)}`} onClick={() => setMobile(false)} className="text-lg font-serif text-[#1C1815]" data-testid={`mobile-nav-${c.name.toLowerCase().replaceAll(' ', '-')}`}>{c.name}</Link>
            ))}
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
