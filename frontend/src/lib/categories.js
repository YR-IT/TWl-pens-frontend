import { useEffect, useState } from "react";
import { api } from "./api";

let cache = null;
let listeners = [];

async function load() {
  const r = await api.get("/categories");
  cache = r.data;
  listeners.forEach((l) => l(cache));
  return cache;
}

export function useCategories() {
  const [cats, setCats] = useState(cache || []);
  useEffect(() => {
    if (cache) setCats(cache); else load();
    const listener = (v) => setCats(v);
    listeners.push(listener);
    return () => { listeners = listeners.filter((x) => x !== listener); };
  }, []);
  return cats;
}

export async function refreshCategories() {
  return await load();
}
