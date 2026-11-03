import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";
import { PROJECTS } from "../data/projects.js";

// Turns a database row into the shape the Projects page already uses.
export function mapProject(r) {
  return {
    id: r.id,
    name: r.name,
    location: r.location || "",
    type: r.type,
    year: r.year || "",
    summary: r.summary || "",
    body: String(r.body || "").split(/\n\s*\n/).map(t => t.trim()).filter(Boolean),
    image: r.cover_url || undefined,
    imageAlt: r.cover_alt || undefined,
    gallery: Array.isArray(r.gallery) ? r.gallery.filter(g => g && g.src) : [],
    products: Array.isArray(r.product_ids) ? r.product_ids : [],
    client: r.client_consent && r.client ? r.client : undefined,
  };
}

let cache = null;

// Published projects from the database. If the database is not set up, is unreachable, or has no
// published projects yet, the sample layouts from src/data/projects.js are shown instead.
export function useProjects() {
  const [state, setState] = useState(() => (cache ? { items: cache, loading: false } : supabase ? { items: [], loading: true } : { items: PROJECTS, loading: false }));
  useEffect(() => {
    if (!supabase || cache) return undefined;
    let off = false;
    supabase.from("projects").select("*").eq("status", "published")
      .order("sort_order", { ascending: true }).order("year", { ascending: false }).order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (off) return;
        if (error || !data || data.length === 0) { setState({ items: PROJECTS, loading: false }); return; }
        cache = data.map(mapProject);
        setState({ items: cache, loading: false });
      }, () => { if (!off) setState({ items: PROJECTS, loading: false }); });
    return () => { off = true; };
  }, []);
  return state;
}
