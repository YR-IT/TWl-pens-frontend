import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, User, Menu, Search, X } from "lucide-react";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth";
import { useState } from "react";

const NAV = [
  { label: "Fountain", to: "/shop?category=Fountain%20Pens" },
  { label: "Rollerball", to: "/shop?category=Rollerball" },
  { label: "Ballpoint", to: "/shop?category=Ballpoint" },
  { label: "Pencils", to: "/shop?category=Mechanical%20Pencils" },
  { label: "Inks", to: "/shop?category=Inks" },
  { label: "Accessories", to: "/shop?category=Accessories" },
  { label: "Limited", to: "/shop?category=Limited%20Editions" },
];

export default function Header() {
  const { count, setOpen } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-[#FAF8F5]/85 backdrop-blur-md border-b border-[#E6E0D6]">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 h-[76px] flex items-center justify-between">
        <button className="lg:hidden text-[#1C1815]" onClick={() => setMobile(!mobile)} data-testid="mobile-menu-toggle">
          {mobile ? <X size={22}/> : <Menu size={22}/>}
        </button>
        <Link to="/" className="font-serif text-xl lg:text-2xl tracking-wider text-[#1C1815]" data-testid="header-nav-brand">
          ATELIER <span className="text-[#B8860B]">ink</span> &amp; STEEL
        </Link>
        <nav className="hidden lg:flex items-center gap-7">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className="text-xs uppercase tracking-[0.2em] text-[#6E685E] hover:text-[#1C1815] transition-colors" data-testid={`nav-${n.label.toLowerCase()}`}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <button onClick={() => nav("/shop")} className="hidden sm:flex text-[#6E685E] hover:text-[#1C1815]" data-testid="search-btn">
            <Search size={18}/>
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              {user.role === "admin" && (
                <Link to="/admin" className="hidden sm:inline text-xs uppercase tracking-[0.15em] text-[#3D4838] hover:text-[#1C1815]" data-testid="admin-link">Admin</Link>
              )}
              <Link to="/account" className="text-[#6E685E] hover:text-[#1C1815]" data-testid="account-link"><User size={18}/></Link>
              <button onClick={logout} className="text-xs uppercase tracking-[0.15em] text-[#6E685E] hover:text-[#1C1815]" data-testid="logout-btn">Sign out</button>
            </div>
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
            {NAV.map((n) => (
              <Link key={n.to} to={n.to} onClick={() => setMobile(false)} className="text-lg font-serif text-[#1C1815]" data-testid={`mobile-nav-${n.label.toLowerCase()}`}>{n.label}</Link>
            ))}
            {user?.role === "admin" && (
              <Link to="/admin" onClick={() => setMobile(false)} className="text-lg font-serif text-[#3D4838]" data-testid="mobile-admin-link">Admin dashboard</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
