import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import { CartProvider } from "@/lib/cart";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Catalog from "@/pages/Catalog";
import ProductDetail from "@/pages/ProductDetail";
import Checkout from "@/pages/Checkout";
import PaymentSuccess from "@/pages/PaymentSuccess";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Account from "@/pages/Account";
import Admin from "@/pages/Admin";
import "@/App.css";

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1815] antialiased">
            <Header/>
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/shop" element={<Catalog/>}/>
                <Route path="/product/:id" element={<ProductDetail/>}/>
                <Route path="/checkout" element={<Checkout/>}/>
                <Route path="/checkout/success" element={<PaymentSuccess/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/register" element={<Register/>}/>
                <Route path="/account" element={<Account/>}/>
                <Route path="/admin" element={<Admin/>}/>
              </Routes>
            </main>
            <Footer/>
            <CartDrawer/>
            <Toaster position="bottom-right" theme="light" toastOptions={{
              style: { background: "#1C1815", color: "#FAF8F5", border: "1px solid #3D4838", borderRadius: 0 }
            }}/>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
