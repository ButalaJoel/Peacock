import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { whatsappReady, whatsappUrl } from "../utils/messaging.js";
import { submitFeedback } from "../lib/forms.js";
import PageHero from "../components/common/PageHero.jsx";

const TYPES = [["complaint", "Complaint"], ["feedback", "Feedback"], ["compliment", "Compliment"]];
const EMPTY = { type: "complaint", name: "", phone: "", email: "", product: "", place: "", message: "", rating: 0, website: "" };
const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };

export default function FeedbackPage() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const ready = whatsappReady(CONTACT.whatsappNumber);

  async function submit() {
    const e = [];
    if (!form.name.trim()) e.push("Enter your name.");
    if (!form.phone.trim() && !form.email.trim()) e.push("Enter a phone number or an email so we can reply.");
    if (form.message.trim().length < 5) e.push("Please tell us a little more in the message box.");
    setErrors(e);
    if (e.length || busy) return;
    if (form.website) { setDone({ reference: "PP-FB-0000" }); return; }
    setBusy(true);
    const r = await submitFeedback(form);
    setBusy(false);
    if (r.ok) setDone({ reference: r.reference }); else setErrors([r.error]);
  }

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const pill = active => ({ padding: "8px 20px", borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff", color: active ? "#fff" : "#555" });
  const isComplaint = form.type === "complaint";

  if (done) {
    return (
      <div>
        <PageHero kicker="Customer care" title="Thank you" subtitle={isComplaint ? "We are sorry something went wrong. Our team will look into it." : "We appreciate you taking the time to tell us."} gradient="linear-gradient(135deg, #1F6F78, #2A9AA5)" />
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "50px 24px 70px" }}>
          <div style={{ ...card, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>Your reference</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 14 }}>{done.reference}</p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 18 }}>Please quote this reference if you speak to us about it. We will contact you using the details you gave.</p>
            {ready && <a className="btn bp" href={whatsappUrl(CONTACT.whatsappNumber, "Hello Peacock Paints, I sent a " + form.type + ". Reference: " + done.reference)} target="_blank" rel="noopener noreferrer" style={{ background: B.teal, justifyContent: "center", textDecoration: "none" }}>Follow up on WhatsApp</a>}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero kicker="Customer care" title="Complaints and feedback" subtitle="Tell us what went well and what did not. Every message is read by our team and tracked until it is resolved." gradient="linear-gradient(135deg, #1F6F78, #2A9AA5)" />
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 70px" }}>
        <div style={card}>
          <label style={label}>I want to send a</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>{TYPES.map(([v, l]) => <button type="button" key={v} style={pill(form.type === v)} onClick={() => setForm(f => ({ ...f, type: v }))}>{l}</button>)}</div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
            <div><label style={label}>Your name *</label><input className="si" value={form.name} onChange={set("name")} /></div>
            <div><label style={label}>Phone</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} /></div>
            <div><label style={label}>Email</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
            <div><label style={label}>Product (if it is about one)</label><input className="si" value={form.product} onChange={set("product")} /></div>
          </div>
          <p style={{ fontSize: 12, color: "#999", margin: "-6px 0 14px" }}>Give a phone number or an email (or both) so we can reply.</p>
          <div style={{ marginBottom: 14 }}><label style={label}>Where did you buy it? (shop or town, optional)</label><input className="si" value={form.place} onChange={set("place")} /></div>
          <div style={{ marginBottom: 14 }}>
            <label style={label}>How would you rate Peacock Paints? (optional)</label>
            <div style={{ display: "flex", gap: 4 }}>
              {[1, 2, 3, 4, 5].map(n => <button type="button" key={n} aria-label={n + " out of 5"} aria-pressed={form.rating === n} onClick={() => setForm(f => ({ ...f, rating: f.rating === n ? 0 : n }))} style={{ fontSize: 26, lineHeight: 1, border: "none", background: "none", cursor: "pointer", color: n <= form.rating ? B.coral : "#ccc" }}>★</button>)}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}><label style={label}>Your message *</label><textarea className="si" rows={5} value={form.message} onChange={set("message")} style={{ resize: "vertical" }} placeholder={isComplaint ? "What happened? Include the product, the colour and when you bought it if you can." : "Tell us what you think."} /></div>
          <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></div>
          {errors.length > 0 && <div role="alert" style={{ marginBottom: 14, padding: "11px 14px", borderRadius: 9, background: "#fdecea", color: "#a12b1f", fontSize: 14 }}>{errors.map(m => <div key={m}>{m}</div>)}</div>}
          <button type="button" className="btn bp" onClick={submit} disabled={busy} style={{ width: "100%", justifyContent: "center" }}>{busy ? "Sending..." : "Send"}</button>
          <p style={{ fontSize: 12, color: "#999", marginTop: 12, lineHeight: 1.6 }}>We use your details only to respond to your message.</p>
        </div>
      </section>
    </div>
  );
}
