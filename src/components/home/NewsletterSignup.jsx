import { useState } from "react";
import { CONTACT } from "../../config/contact.js";
import { B } from "../../data/theme.js";
import { mailtoUrl } from "../../utils/messaging.js";
import { isEmail } from "../../utils/format.js";
import { subscribe } from "../../lib/inbox.js";

// Email signup. The address is saved to the website database (visible to staff in the dashboard).
// If the database cannot be reached, it falls back to opening the visitor's email app with a message to us.
export default function NewsletterSignup({ dark = false }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async e => {
    e.preventDefault();
    if (!isEmail(email)) { setError("Please enter a valid email address."); return; }
    setError(""); setBusy(true);
    const r = await subscribe(email);
    setBusy(false);
    if (r === "ok" || r === "duplicate") { setStatus(r); return; }
    window.location.href = mailtoUrl(CONTACT.salesEmail, "Newsletter signup", "Please add me to the Peacock Paints monthly newsletter.\n\nEmail: " + email.trim());
    setStatus("mail");
  };
  const muted = dark ? "rgba(255,255,255,.75)" : "#666";
  return (
    <form onSubmit={submit} noValidate>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 8 }}>Inspiration in your inbox</h3>
      <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 16 }}>One email a month with colour ideas, painting tips and news from Peacock Paints.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address"
          style={{ flex: "1 1 220px", padding: "13px 18px", borderRadius: 30, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit" }} />
        <button type="submit" disabled={busy} className="btn bp" style={{ background: B.coral, opacity: busy ? .6 : 1 }}>{busy ? "Saving..." : "Subscribe"}</button>
      </div>
      {error && <p style={{ color: dark ? "#ffb4a8" : "#c0392b", fontSize: 13, marginTop: 8 }}>{error}</p>}
      {status === "ok" && <p role="status" style={{ fontSize: 13, color: muted, marginTop: 8, lineHeight: 1.6 }}>Thank you, you are subscribed.</p>}
      {status === "duplicate" && <p role="status" style={{ fontSize: 13, color: muted, marginTop: 8, lineHeight: 1.6 }}>You are already subscribed. Thank you.</p>}
      {status === "mail" && <p style={{ fontSize: 13, color: muted, marginTop: 8, lineHeight: 1.6 }}>Your email app has opened with a message to us. Please press send to finish subscribing.</p>}
      <p style={{ fontSize: 11.5, color: muted, marginTop: 10, lineHeight: 1.6 }}>By subscribing you agree that Peacock Paints may email you news and colour ideas. You can ask us to remove you at any time.</p>
    </form>
  );
}
