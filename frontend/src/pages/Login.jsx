import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const u = await login(email, password);
      toast.success(`Welcome back, ${u.name || u.email}`);
      nav(u.role === "admin" ? "/admin" : "/account");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Sign in failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">WELCOME BACK</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-3">Sign in.</h1>
        <form onSubmit={submit} className="mt-10 space-y-6" data-testid="login-form">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Email</span>
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="login-email-input"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Password</span>
            <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 text-[#1C1815] outline-none focus:border-[#3D4838]" data-testid="login-password-input"/>
          </label>
          <button disabled={busy} className="mt-4 w-full bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-3 transition-colors" data-testid="login-submit-btn">
            {busy ? "Signing in…" : <>Enter atelier <ArrowRight size={14}/></>}
          </button>
        </form>
        <p className="mt-8 text-sm text-[#6E685E]">
          New to the atelier? <Link to="/register" className="underline text-[#3D4838]" data-testid="go-to-register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
