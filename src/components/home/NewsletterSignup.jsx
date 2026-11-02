import { useState } from "react";
import { CONTACT } from "../../config/contact.js";
import { B } from "../../data/theme.js";
import { mailtoUrl } from "../../utils/messaging.js";
import { isEmail } from "../../utils/format.js";

// Email signup. There is no server yet, so this opens the visitor's email app with a ready message to us.
// When the dashboard and backend exist, this will save the address and send the monthly newsletter.
export default function NewsletterSignup({ dark = false }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const submit = e => {
    e.preventDefault();
    if (!isEmail(email)) { setError("Please enter a valid email address."); return; }
    setError("");
    window.location.href = mailtoUrl(CONTACT.salesEmail, "Newsletter signup", "Please add me to the Peacock Paints monthly newsletter.\n\nEmail: " + email.trim());
    setDone(true);
  };
  const muted = dark ? "rgba(255,255,255,.75)" : "#666";
  return (
    <form onSubmit={submit} noValidate>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 8 }}>Inspiration in your inbox</h3>
      <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 16 }}>One email a month with colour ideas, painting tips and news from Peacock Paints.</p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address"
          style={{ flex: "1 1 220px", padding: "13px 18px", borderRadius: 30, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit" }} />
        <button type="submit" className="btn bp" style={{ background: B.coral }}>Subscribe</button>
      </div>
      {error && <p style={{ color: dark ? "#ffb4a8" : "#c0392b", fontSize: 13, marginTop: 8 }}>{error}</p>}
      {done && <p style={{ fontSize: 13, color: muted, marginTop: 8, lineHeight: 1.6 }}>Your email app has opened with a message to us. Please press send to finish subscribing.</p>}
    </form>
  );
}
