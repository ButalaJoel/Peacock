import { supabase } from "./supabase.js";
import { compressImage } from "../dashboard/uploads.js";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const code = () => Array.from({ length: 4 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join("");
export const newReference = prefix => prefix + "-" + code();
const cut = (v, n) => { const s = String(v == null ? "" : v).trim().slice(0, n); return s || null; };

// Saves a distributor / dealer application: first the 4 shop photos (private storage), then the details.
// Returns { ok: true, reference } or { ok: false, error } with a message the visitor can read.
export async function submitApplication(v, photos) {
  if (!supabase) return { ok: false, error: "The form is not connected yet. Please contact us on WhatsApp instead." };
  let compressed;
  try { compressed = await Promise.all(photos.map(f => compressImage(f, 1600, 0.8))); }
  catch (e) { return { ok: false, error: e.message || "One of the photos could not be processed. Please use JPG, PNG or WebP photos." }; }

  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = newReference("PP-DIST");
    const paths = [];
    for (let i = 0; i < compressed.length; i++) {
      const path = reference + "/" + (i + 1) + ".jpg";
      const { error } = await supabase.storage.from("applications").upload(path, compressed[i], { contentType: "image/jpeg", upsert: false });
      if (error) return { ok: false, error: "A photo could not be uploaded (" + error.message + "). Check your connection and try again." };
      paths.push(path);
    }
    const { error } = await supabase.from("dealer_applications").insert({
      reference, kind: v.kind === "Dealer" ? "Dealer" : "Distributor",
      business_name: cut(v.business, 160), contact_person: cut(v.person, 120), phone: cut(v.phone, 40), email: cut(v.email, 254),
      shop_town: cut(v.town, 120), shop_address: cut(v.address, 300),
      years_in_business: Math.max(0, Math.min(100, parseInt(v.years, 10) || 0)),
      registration_status: v.regStatus, registration_number: cut(v.regNumber, 60),
      tax_status: v.taxStatus, tin_number: cut(v.tin, 40),
      kin_name: cut(v.kinName, 120), kin_phone: cut(v.kinPhone, 40), kin_relationship: cut(v.kinRelation, 60),
      photos: paths, consent: true,
    });
    if (!error) return { ok: true, reference };
    if (error.code !== "23505") return { ok: false, error: "Your application could not be saved (" + error.message + "). Please try again, or contact us on WhatsApp." };
  }
  return { ok: false, error: "Please try again in a moment." };
}

// Saves a complaint, feedback or compliment.
export async function submitFeedback(v) {
  if (!supabase) return { ok: false, error: "The form is not connected yet. Please contact us on WhatsApp instead." };
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = newReference("PP-FB");
    const { error } = await supabase.from("feedback").insert({
      reference, type: v.type, name: cut(v.name, 120), phone: cut(v.phone, 40), email: cut(v.email, 254),
      product: cut(v.product, 160), place: cut(v.place, 160), message: cut(v.message, 4000), rating: v.rating ? Number(v.rating) : null, publish_ok: !!v.publishOk,
    });
    if (!error) return { ok: true, reference };
    if (error.code !== "23505") return { ok: false, error: "Your message could not be saved (" + error.message + "). Please try again, or contact us on WhatsApp." };
  }
  return { ok: false, error: "Please try again in a moment." };
}
