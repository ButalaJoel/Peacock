import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { makeReference, whatsappReady, whatsappUrl, mailtoUrl } from "../utils/messaging.js";
import PageHero from "../components/common/PageHero.jsx";

const STEPS = [
  { n: "1", t: "Tell us about your business", d: "Fill in the short form below with your business details and where you operate." },
  { n: "2", t: "We review your request", d: "Our team looks at every request and may contact you for more information." },
  { n: "3", t: "We get back to you", d: "If it is a good fit, our sales team will talk you through the next steps." },
];

export default function DistributorPage() {
  const empty = { kind: "Distributor", business: "", person: "", phone: "", email: "", location: "", experience: "", ack: false };
  const [form, setForm] = useState(empty);
  const [reference] = useState(() => makeReference("PP-DIST"));
  const [touched, setTouched] = useState(false);
  const [sentVia, setSentVia] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const missing = !form.business.trim() || !form.person.trim() || !form.phone.trim() || !form.location.trim() || !form.ack;
  const ready = whatsappReady(CONTACT.whatsappNumber);

  const text = [
    "Expression of interest: " + form.kind + " - " + CONTACT.companyName + " website",
    "Reference: " + reference,
    "",
    "Business: " + form.business.trim(),
    "Contact person: " + form.person.trim(),
    "Phone: " + form.phone.trim(),
    form.email.trim() ? "Email: " + form.email.trim() : null,
    "Location: " + form.location.trim(),
    form.experience.trim() ? "" : null,
    form.experience.trim() ? "Business experience: " + form.experience.trim() : null,
    "",
    "I understand this is an expression of interest and does not make me a dealer or distributor.",
  ].filter(l => l !== null).join("\n");

  const send = kind => {
    setTouched(true);
    if (missing) return;
    if (kind === "whatsapp") { window.open(whatsappUrl(CONTACT.whatsappNumber, text), "_blank", "noopener"); setSentVia("WhatsApp"); }
    else { window.location.href = mailtoUrl(CONTACT.salesEmail, "Distributor interest " + reference, text); setSentVia("your email app"); }
  };

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };
  const bad = key => (touched && !form[key].trim() ? { borderColor: "#c0392b" } : null);
  const pill = active => ({ padding: "8px 20px", borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff", color: active ? "#fff" : "#555" });

  return (
    <div>
      <PageHero kicker="Work with us" title="Become a Peacock Paints distributor" subtitle="We are looking for businesses across East Africa who want to grow with a trusted, locally manufactured paint brand." gradient="linear-gradient(135deg, #5C2D6D, #8B4AAD)" />
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 70px" }}>
        <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginBottom: 40 }}>
          {STEPS.map(s => (
            <div key={s.n} style={{ ...card, padding: 22 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: B.coral, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, marginBottom: 12 }}>{s.n}</div>
              <h3 style={{ fontSize: 16, marginBottom: 6 }}>{s.t}</h3>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6 }}>{s.d}</p>
            </div>
          ))}
        </div>

        <div style={{ ...card, maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 6 }}>Express your interest</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 20 }}>Reference {reference}. This opens WhatsApp or your email app with your details ready to send.</p>

          <label style={label}>I am interested in becoming a</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["Distributor", "Dealer"].map(k => <button key={k} style={pill(form.kind === k)} onClick={() => setForm(f => ({ ...f, kind: k }))}>{k}</button>)}
          </div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={label}>Business name *</label><input className="si" value={form.business} onChange={set("business")} style={bad("business")} /></div>
            <div><label style={label}>Contact person *</label><input className="si" value={form.person} onChange={set("person")} style={bad("person")} /></div>
            <div><label style={label}>Phone number *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} style={bad("phone")} /></div>
            <div><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
          </div>
          <div style={{ marginBottom: 14 }}><label style={label}>Town or district where you operate *</label><input className="si" value={form.location} onChange={set("location")} style={bad("location")} /></div>
          <div style={{ marginBottom: 16 }}><label style={label}>Business experience (optional)</label><textarea className="si" rows={3} value={form.experience} onChange={set("experience")} style={{ resize: "vertical" }} placeholder="Tell us about your shop, your customers and the products you sell." /></div>

          <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#444", lineHeight: 1.6, cursor: "pointer", marginBottom: 6 }}>
            <input type="checkbox" checked={form.ack} onChange={e => setForm(f => ({ ...f, ack: e.target.checked }))} style={{ marginTop: 4, accentColor: B.coral }} />
            <span>I understand this is an expression of interest. Sending it does not make me a Peacock Paints dealer or distributor, and only authorised Peacock Paints staff can approve an application.</span>
          </label>
          <p style={{ fontSize: 12, color: "#999", marginBottom: 16 }}>Terms and conditions for dealers and distributors will be added here once approved by Peacock Paints management.</p>

          {touched && missing && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>Please fill in the fields marked * and tick the box.</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn bp" onClick={() => send("whatsapp")} disabled={!ready} style={{ flex: 1, justifyContent: "center", background: ready ? B.teal : "#ccc", cursor: ready ? "pointer" : "not-allowed" }}>Send on WhatsApp</button>
            <button className="btn bd" onClick={() => send("email")} style={{ flex: 1, justifyContent: "center" }}>Send by email</button>
          </div>
          {sentVia && <p style={{ fontSize: 13, marginTop: 16, padding: 14, background: "#eef7f4", borderRadius: 8, lineHeight: 1.6 }}>Your details are ready in {sentVia}. <strong>Press send there</strong> so they reach our team. Nothing has been sent until you do.</p>}
        </div>
      </section>
    </div>
  );
}
