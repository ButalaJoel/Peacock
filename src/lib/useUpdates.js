import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { UPDATES } from "../data/updates.js";

export const NEWS_TONES = { "Product news": "#c0512f", "Colour tips": "#2d4a3e", "Company": "#5C2D6D", "Newsletter": "#1a3a5c" };

// Turns a database row into the shape the News page and home slider already use.
export function mapUpdate(r) {
  return {
    id: r.id,
    cat: r.cat,
    date: r.news_date,
    title: r.title,
    summary: r.summary || "",
    body: String(r.body || "").split(/\n\s*\n/).map(t => t.trim()).filter(Boolean),
    image: r.image_url || undefined,
    imageAlt: r.image_alt || undefined,
    pdf: r.pdf_url || undefined,
    gallery: Array.isArray(r.gallery) ? r.gallery.filter(g => g && g.src) : [],
    cta: r.cta_page ? (r.cta_label || "Learn more") : undefined,
    page: r.cta_page || undefined,
    tone: NEWS_TONES[r.cat] || "#444",
  };
}

let cache = null;
let inflight = null;
function load() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = supabase.from("news_items").select("*").eq("status", "published").order("news_date", { ascending: false })
      .then(({ data, error }) => { inflight = null; if (error || !data || data.length === 0) return null; cache = data.map(mapUpdate); return cache; }, () => { inflight = null; return null; });
  }
  return inflight;
}

// Published news from the database. If the database is not set up, is unreachable, or has nothing
// published yet, the sample items from src/data/updates.js are shown (sample: true).
export function useUpdates() {
  const [state, setState] = useState(() => (cache ? { items: cache, loading: false, sample: false } : supabase ? { items: [], loading: true, sample: false } : { items: UPDATES, loading: false, sample: true }));
  useEffect(() => {
    if (!supabase || cache) return undefined;
    let off = false;
    load().then(items => { if (!off) setState(items ? { items, loading: false, sample: false } : { items: UPDATES, loading: false, sample: true }); });
    return () => { off = true; };
  }, []);
  return state;
}
