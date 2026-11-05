import { useState } from "react";
import { CONTACT } from "../../config/contact.js";
import { B } from "../../data/theme.js";
import { whatsappReady, whatsappUrl } from "../../utils/messaging.js";
import { submitProfessional } from "../../lib/professionals.js";

const PROFESSIONS = ["Architect", "Engineer", "Contractor", "Painter or applicator", "Interior designer", "Project or procurement manager", "Developer or property owner", "Other"];
const WANTS = ["Product guidance for a specification", "Surface preparation and application advice", "Colour specification support", "Quantities and bill of quantities support", "A site visit or technical meeting", "Something else"];
const EMPTY = { name: "", phone: "", email: "", profession: "", professionOther: "", years: "", organisation: "", wanted: [], problem: "", consent: false, website: "" };
const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };

// "Request technical support": details are checked by our team, then our team talks to the professional directly.
export default function ProfessionalRequestForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const toggle = w => setForm(f => ({ ...f, wanted: f.wanted.includes(w) ? f.wanted.filter(x => x !== w) : f.wanted.concat([w]) }));
  const ready = whatsappReady(CONTACT.whatsappNumber);

  async function submit() {
    const e = [];
    if (!form.name.trim()) e.push("Enter your name.");
    if (form.phone.replace(/\D/g, "").length < 7) e.push("Enter a phone number we can reach you on.");
    if (!form.profession) e.push("Choose your profession.");
    if (form.profession === "Other" && !form.professionOther.trim()) e.push("Tell us your profession.");
    if (form.years === "" || Number(form.years) < 0 || Number(form.years) > 80) e.push("Enter your years of experience (0 if just starting).");
    if (form.problem.trim().length < 10) e.push("Tell us a little about what you need or the problem you are solving.");
    if (!form.consent) e.push("Please tick the box to confirm.");
    setErrors(e);
    if (e.length || busy) return;
    if (form.website) { setDone({ reference: "PP-PRO-0000" }); return; }
    setBusy(true);
    const r = await submitProfessional(form);
    setBusy(false);
    if (r.ok) setDone({ reference: r.reference }); else setErrors([r.error]);
  }

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  return (
    <section id="technical-support" style={{ maxWidth: 760, margin: "0 auto", padding: "10px 24px 80px" }}>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, marginBottom: 8 }}>Request technical support</h2>
      <p style={{ fontSize: 15, color: "#666", lineHeight: 1.7, marginBottom: 22 }}>Technical guidance is shared directly by our team, not published online. Tell us about yourself and what you need. We check your details, then someone from our team contacts you.</p>
      {done ? (
        <div style={{ ...card, textAlign: "center" }}>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>Your reference</p>
          <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 14 }}>{done.reference}</p>
          <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 18 }}>Thank you. Our team will verify your details and contact you. Please quote this reference if you speak to us.</p>
          {ready && <a className="btn bp" href={whatsappUrl(CONTACT.whatsappNumber, "Hello Peacock Paints, I sent a technical support request. Reference: " + done.reference)} target="_blank" rel="noopener noreferrer" style={{ background: B.teal, justifyContent: "center", textDecoration: "none" }}>Follow up on WhatsApp</a>}
        </div>
      ) : (
        <div style={card}>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={label}>Full name *</label><input className="si" value={form.name} onChange={set("name")} /></div>
            <div><label style={label}>Phone *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} /></div>
            <div><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
            <div><label style={label}>Company or organisation (optional)</label><input className="si" value={form.organisation} onChange={set("organisation")} /></div>
            <div><label style={label}>Profession *</label>
              <select className="si" value={form.profession} onChange={set("profession")}><option value="">Choose...</option>{PROFESSIONS.map(p => <option key={p}>{p}</option>)}</select></div>
            <div><label style={label}>Years of experience *</label><input className="si" type="number" min="0" max="80" value={form.years} onChange={set("years")} /></div>
          </div>
          {form.profession === "Other" && <div style={{ marginBottom: 14 }}><label style={label}>Your profession *</label><input className="si" value={form.professionOther} onChange={set("professionOther")} /></div>}
          <div style={{ marginBottom: 14 }}>
            <label style={label}>What would you like help with? (tick any)</label>
            {WANTS.map(w => <label key={w} style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14, color: "#444", margin: "6px 0", cursor: "pointer" }}><input type="checkbox" checked={form.wanted.includes(w)} onChange={() => toggle(w)} style={{ accentColor: B.coral }} /> {w}</label>)}
          </div>
          <div style={{ marginBottom: 14 }}><label style={label}>What do you need, or what problem are you solving? *</label><textarea className="si" rows={5} value={form.problem} onChange={set("problem")} style={{ resize: "vertical" }} placeholder="For example the surface, the project, and what is going wrong or what you need to specify." /></div>
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></div>
          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#444", lineHeight: 1.6, cursor: "pointer", marginBottom: 14 }}>
            <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} style={{ marginTop: 4, accentColor: B.coral }} />
            <span>I confirm these details are true and agree that Peacock Paints may use them to verify me and contact me about my request.</span>
          </label>
          {errors.length > 0 && <div role="alert" style={{ marginBottom: 14, padding: "11px 14px", borderRadius: 9, background: "#fdecea", color: "#a12b1f", fontSize: 14 }}>{errors.map(m => <div key={m}>{m}</div>)}</div>}
          <button type="button" className="btn bp" onClick={submit} disabled={busy} style={{ width: "100%", justifyContent: "center" }}>{busy ? "Sending..." : "Send request"}</button>
        </div>
      )}
    </section>
  );
}
