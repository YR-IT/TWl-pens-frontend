import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "../lib/auth";
import { toast } from "sonner";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await register(form.email, form.password, form.name);
      toast.success("Welcome to the atelier");
      nav("/account");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Sign up failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pt-[76px] bg-[#FAF8F5] min-h-screen">
      <div className="max-w-md mx-auto px-6 py-20">
        <p className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B]">JOIN THE ATELIER</p>
        <h1 className="font-serif text-4xl lg:text-5xl text-[#1C1815] mt-3">Create account.</h1>
        <form onSubmit={submit} className="mt-10 space-y-6" data-testid="register-form">
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Name</span>
            <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="register-name-input"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Email</span>
            <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="register-email-input"/>
          </label>
          <label className="block">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#6E685E]">Password (min 6)</span>
            <input required type="password" minLength={6} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="mt-2 w-full bg-transparent border-b border-[#E6E0D6] py-2.5 outline-none focus:border-[#3D4838]" data-testid="register-password-input"/>
          </label>
          <button disabled={busy} className="mt-4 w-full bg-[#1C1815] text-[#FAF8F5] py-4 text-xs uppercase tracking-[0.25em] hover:bg-[#3D4838] disabled:bg-[#6E685E] flex items-center justify-center gap-3 transition-colors" data-testid="register-submit-btn">
            {busy ? "Creating…" : <>Create account <ArrowRight size={14}/></>}
          </button>
        </form>
        <p className="mt-8 text-sm text-[#6E685E]">
          Already a member? <Link to="/login" className="underline text-[#3D4838]" data-testid="go-to-login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
