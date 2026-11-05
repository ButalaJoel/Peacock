import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

let cache = null;
let inflight = null;
function load() {
  if (cache) return Promise.resolve(cache);
  if (!inflight) {
    inflight = supabase.from("awards").select("*").eq("published", true).order("sort_order").order("created_at")
      .then(({ data, error }) => { inflight = null; if (error || !data) return []; cache = data.filter(a => a.image_url); return cache; }, () => { inflight = null; return []; });
  }
  return inflight;
}

// Published awards and certificates. Empty (so the section stays hidden) if there are none or the database cannot be reached.
export function useAwards() {
  const [items, setItems] = useState(cache || []);
  useEffect(() => {
    if (!supabase || cache) return undefined;
    let off = false;
    load().then(list => { if (!off) setItems(list); });
    return () => { off = true; };
  }, []);
  return items;
}
