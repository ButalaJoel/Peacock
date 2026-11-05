import { supabase } from "./supabase.js";
import { newReference } from "./forms.js";

const cut = (v, n) => { const s = String(v == null ? "" : v).trim().slice(0, n); return s || null; };

// Saves a professional's technical support request. Returns { ok: true, reference } or { ok: false, error }.
export async function submitProfessional(v) {
  if (!supabase) return { ok: false, error: "The form is not connected yet. Please contact us on WhatsApp instead." };
  for (let attempt = 0; attempt < 3; attempt++) {
    const reference = newReference("PP-PRO");
    const { error } = await supabase.from("professional_requests").insert({
      reference, name: cut(v.name, 120), phone: cut(v.phone, 40), email: cut(v.email, 254),
      profession: v.profession, profession_other: v.profession === "Other" ? cut(v.professionOther, 120) : null,
      years_experience: Math.max(0, Math.min(80, parseInt(v.years, 10) || 0)),
      organisation: cut(v.organisation, 160), data_wanted: v.wanted.slice(0, 8), problem: cut(v.problem, 2000), consent: true,
    });
    if (!error) return { ok: true, reference };
    if (error.code !== "23505") return { ok: false, error: "Your request could not be saved (" + error.message + "). Please try again, or contact us on WhatsApp." };
  }
  return { ok: false, error: "Please try again in a moment." };
}
