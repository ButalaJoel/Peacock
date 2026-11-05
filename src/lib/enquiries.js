import { supabase } from "./supabase.js";

const saved = new Set();
const cut = (v, n) => { const s = String(v == null ? "" : v).trim().slice(0, n); return s || null; };

// Keeps a copy of a Contact or Distributor message in the dashboard. Never blocks the visitor's own
// WhatsApp / email message: if the database is unreachable the copy is simply skipped.
export async function saveEnquiry({ reference, kind, name, email, phone, message, details }) {
  if (!supabase || !reference || saved.has(reference)) return false;
  saved.add(reference);
  try {
    const { error } = await supabase.from("enquiries").insert({
      kind: kind === "distributor" ? "distributor" : "contact",
      name: cut(name, 160) || "No name",
      email: cut(email, 254),
      phone: cut(phone, 40),
      message: cut(message, 4000),
      details: { ...(details || {}), reference },
    });
    if (error) { saved.delete(reference); return false; }
    return true;
  } catch { saved.delete(reference); return false; }
}
