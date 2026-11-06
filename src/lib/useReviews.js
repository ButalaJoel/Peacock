import { useEffect, useState } from "react";
import { supabase } from "./supabase.js";

// Published customer reviews (null while loading, [] when there are none or the database is not connected).
export function useReviews() {
  const [reviews, setReviews] = useState(null);
  useEffect(() => {
    if (!supabase) return undefined;
    let off = false;
    supabase.from("reviews").select("id, display_name, rating, body, product, place, created_at").eq("published", true).order("created_at", { ascending: false }).limit(200)
      .then(({ data, error }) => { if (!off) setReviews(error ? [] : data); });
    return () => { off = true; };
  }, []);
  return supabase ? reviews : [];
}
