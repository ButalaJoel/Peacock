import { supabase } from "./supabase.js";

const saved = new Set();

// Keeps a copy of a quote request in the dashboard inbox. Never blocks or breaks the visitor's own
// WhatsApp / email message: if the database is unreachable the request simply is not copied.
export async function saveQuote({ reference, customer, items, note, channel }) {
  if (!supabase || !reference || saved.has(reference)) return false;
  saved.add(reference);
  try {
    const { error } = await supabase.from("quote_requests").insert({
      reference: String(reference).slice(0, 40),
      customer: customer || {},
      items: items || [],
      note: note ? String(note).slice(0, 2000) : null,
      channel: channel === "email" ? "email" : "whatsapp",
    });
    if (error) { saved.delete(reference); return false; }
    return true;
  } catch { saved.delete(reference); return false; }
}

// Adds an email address to the newsletter list. Returns "ok", "duplicate", "offline" or "error".
export async function subscribe(email, source = "website") {
  if (!supabase) return "offline";
  try {
    const { error } = await supabase.from("subscribers").insert({ email: String(email).trim().slice(0, 254), source });
    if (!error) return "ok";
    return error.code === "23505" ? "duplicate" : "error";
  } catch { return "error"; }
}
