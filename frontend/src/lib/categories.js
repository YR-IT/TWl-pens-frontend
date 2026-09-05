import { useEffect, useState } from "react";
import { api } from "./api";

let cache = null;
let listeners = [];

async function load() {
  try {
    const r = await api.get("/categories");
    cache = Array.isArray(r.data) ? r.data : (Array.isArray(r.data?.categories) ? r.data.categories : []);
  } catch {
    cache = [];
  }
  listeners.forEach((l) => l(cache));
  return cache;
}

export function useCategories() {
  const [cats, setCats] = useState(Array.isArray(cache) ? cache : []);
  useEffect(() => {
    if (Array.isArray(cache)) setCats(cache); else load();
    const listener = (v) => setCats(Array.isArray(v) ? v : []);
    listeners.push(listener);
    return () => { listeners = listeners.filter((x) => x !== listener); };
  }, []);
  return Array.isArray(cats) ? cats : [];
}

export async function refreshCategories() {
  return await load();
}
