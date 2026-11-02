import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { makeReference, whatsappReady, whatsappUrl, mailtoUrl } from "../utils/messaging.js";
import PageHero from "../components/common/PageHero.jsx";
import { PhoneIcon, MailIcon, GlobeIcon } from "../components/icons/Icons.jsx";

const TOPICS = ["Ask an expert", "Product enquiry", "Colour matching", "Something else"];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", topic: TOPICS[0], message: "" });
  const [reference] = useState(() => makeReference("PP-MSG"));
  const [touched, setTouched] = useState(false);
  const [sentVia, setSentVia] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const missing = !form.name.trim() || !form.phone.trim() || !form.message.trim();
  const ready = whatsappReady(CONTACT.whatsappNumber);

  const text = [
    "Message - " + CONTACT.companyName + " website",
    "Reference: " + reference,
    "Topic: " + form.topic,
    "",
    "Name: " + form.name.trim(),
    "Phone: " + form.phone.trim(),
    form.email.trim() ? "Email: " + form.email.trim() : null,
    "",
    form.message.trim(),
  ].filter(l => l !== null).join("\n");

  const send = kind => {
    setTouched(true);
    if (missing) return;
    if (kind === "whatsapp") { window.open(whatsappUrl(CONTACT.whatsappNumber, text), "_blank", "noopener"); setSentVia("WhatsApp"); }
    else { window.location.href = mailtoUrl(CONTACT.salesEmail, "Message " + reference, text); setSentVia("your email app"); }
  };

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };
  const bad = key => (touched && !form[key].trim() ? { borderColor: "#c0392b" } : null);
  const detail = { display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 16, fontSize: 14.5, lineHeight: 1.6, color: "#444" };

  return (
    <div>
      <PageHero kicker="Contact us" title="Talk to our team" subtitle="From colour selection and surface preparation to on-site technical guidance, our team is here to help." gradient={"linear-gradient(135deg, " + B.coral + "ee, " + B.coralDk + ")"} />
      <section className="g2" style={{ maxWidth: 1100, margin: "0 auto", padding: "50px 24px 70px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 28, alignItems: "start" }}>
        <div style={card}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 20 }}>{CONTACT.companyName}</h2>
          <div style={detail}><GlobeIcon /><span>{CONTACT.address}</span></div>
          <div style={detail}><PhoneIcon /><span>{CONTACT.phones.map((p, i) => (<span key={p}>{i > 0 ? " / " : ""}<a href={"tel:" + p.replace(/[^+\d]/g, "")} style={{ color: "inherit" }}>{p}</a></span>))}</span></div>
          <div style={detail}><MailIcon /><a href={"mailto:" + CONTACT.salesEmail} style={{ color: "inherit" }}>{CONTACT.salesEmail}</a></div>
          <div style={detail}><GlobeIcon /><span>{CONTACT.website}</span></div>
        </div>

        <div style={card}>
          <h2 style={{ fontSize: 20, marginBottom: 4 }}>Send us a message</h2>
          <p style={{ fontSize: 13, color: "#888", marginBottom: 18 }}>Reference {reference}. This opens WhatsApp or your email app with your message ready to send.</p>
          <div style={{ marginBottom: 14 }}><label style={label}>Your name *</label><input className="si" value={form.name} onChange={set("name")} style={bad("name")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Phone number *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} style={bad("phone")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
          <div style={{ marginBottom: 14 }}><label style={label}>Topic</label>
            <select className="si" value={form.topic} onChange={set("topic")}>{TOPICS.map(t => <option key={t}>{t}</option>)}</select>
          </div>
          <div style={{ marginBottom: 14 }}><label style={label}>Message *</label><textarea className="si" rows={4} value={form.message} onChange={set("message")} style={{ resize: "vertical", ...(bad("message") || {}) }} /></div>
          {touched && missing && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>Please add your name, phone number and a message.</p>}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button className="btn bp" onClick={() => send("whatsapp")} disabled={!ready} style={{ flex: 1, justifyContent: "center", background: ready ? B.teal : "#ccc", cursor: ready ? "pointer" : "not-allowed" }}>Send on WhatsApp</button>
            <button className="btn bd" onClick={() => send("email")} style={{ flex: 1, justifyContent: "center" }}>Send by email</button>
          </div>
          {sentVia && <p style={{ fontSize: 13, marginTop: 16, padding: 14, background: "#eef7f4", borderRadius: 8, lineHeight: 1.6 }}>Your message is ready in {sentVia}. <strong>Press send there</strong> so it reaches our team. Nothing has been sent until you do.</p>}
        </div>
      </section>
    </div>
  );
}
