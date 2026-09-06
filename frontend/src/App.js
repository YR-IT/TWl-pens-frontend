import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import { WishlistProvider } from "@/lib/wishlist";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Splash from "@/components/Splash";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import NewArrivals from "@/pages/NewArrivals";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import OrderPlaced from "@/pages/OrderPlaced";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import Admin from "@/pages/Admin";
import Wishlist from "@/pages/Wishlist";
import WishlistShared from "@/pages/WishlistShared";
import "@/App.css";

function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.22, 0.9, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageFade><Home/></PageFade>}/>
        <Route path="/shop" element={<PageFade><Catalog/></PageFade>}/>
        <Route path="/new-arrivals" element={<PageFade><NewArrivals/></PageFade>}/>
        <Route path="/product/:id" element={<PageFade><ProductDetail/></PageFade>}/>
        <Route path="/checkout" element={<PageFade><Checkout/></PageFade>}/>
        <Route path="/order/placed" element={<PageFade><OrderPlaced/></PageFade>}/>
        <Route path="/login" element={<PageFade><Login/></PageFade>}/>
        <Route path="/register" element={<PageFade><Register/></PageFade>}/>
        <Route path="/account" element={<PageFade><Account/></PageFade>}/>
        <Route path="/wishlist" element={<PageFade><Wishlist/></PageFade>}/>
        <Route path="/wishlist/shared/:token" element={<PageFade><WishlistShared/></PageFade>}/>
        <Route path="/admin" element={<PageFade><Admin/></PageFade>}/>
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <BrowserRouter>
            <Splash/>
            <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1815] antialiased">
              <Header/>
              <main className="flex-1">
                <AnimatedRoutes/>
              </main>
              <Footer/>
              <CartDrawer/>
              <Toaster position="bottom-right" theme="light" toastOptions={{
                style: { background: "#1C1815", color: "#FAF8F5", border: "1px solid #3D4838", borderRadius: 0 }
              }}/>
            </div>
          </BrowserRouter>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}
