import { createContext, useContext, useEffect, useState } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = localStorage.getItem("atelier_token");
    if (!t) { setReady(true); return; }
    api.get("/auth/me")
      .then((r) => setUser(r.data))
      .catch(() => localStorage.removeItem("atelier_token"))
      .finally(() => setReady(true));
  }, []);

  const login = async (email, password) => {
    const r = await api.post("/auth/login", { email, password });
    localStorage.setItem("atelier_token", r.data.access_token);
    setUser(r.data.user);
    return r.data.user;
  };

  const register = async (email, password, name) => {
    const r = await api.post("/auth/register", { email, password, name });
    localStorage.setItem("atelier_token", r.data.access_token);
    setUser(r.data.user);
    return r.data.user;
  };

  const logout = () => {
    localStorage.removeItem("atelier_token");
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, register, logout, ready }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);
