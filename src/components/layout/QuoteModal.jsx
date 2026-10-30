import { useState } from "react";
import { useApp } from "../../context/useApp.js";
import { CONTACT } from "../../config/contact.js";
import { B } from "../../data/theme.js";
import { CloseIcon } from "../icons/Icons.jsx";

const makeReference = () => {
  const d = new Date();
  const pad = n => String(n).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return "PP-" + String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate()) + "-" + rand;
};

export default function QuoteModal() {
  const { quoteOpen, setQuoteOpen, cart, setCart } = useApp();
  const [form, setForm] = useState({ name: "", phone: "", email: "", location: "", notes: "" });
  const [reference, setReference] = useState(makeReference);
  const [touched, setTouched] = useState(false);
  const [sentVia, setSentVia] = useState(null);
  if (!quoteOpen) return null;

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const missing = !form.name.trim() || !form.phone.trim();
  const whatsappReady = /^\d{8,15}$/.test(CONTACT.whatsappNumber);

  const lines = cart.map((item, i) =>
    (i + 1) + ". " + item.product.name + " - " + item.size + " x " + item.qty + (item.colour ? " (colour: " + item.colour + ")" : "")
  );
  const message = [
    "Quote request - " + CONTACT.companyName + " website",
    "Reference: " + reference,
    "",
    "Name: " + form.name.trim(),
    "Phone: " + form.phone.trim(),
    form.email.trim() ? "Email: " + form.email.trim() : null,
    form.location.trim() ? "Location: " + form.location.trim() : null,
    "",
    "Products:",
    ...lines,
    form.notes.trim() ? "" : null,
    form.notes.trim() ? "Project notes: " + form.notes.trim() : null,
    "",
    "Please send me a quotation.",
  ].filter(line => line !== null).join("\n");

  const guard = action => {
    setTouched(true);
    if (missing || cart.length === 0) return;
    action();
  };
  const sendWhatsApp = () => guard(() => {
    window.open("https://wa.me/" + CONTACT.whatsappNumber + "?text=" + encodeURIComponent(message), "_blank", "noopener");
    setSentVia("WhatsApp");
  });
  const sendEmail = () => guard(() => {
    window.location.href = "mailto:" + CONTACT.salesEmail + "?subject=" + encodeURIComponent("Quote request " + reference) + "&body=" + encodeURIComponent(message);
    setSentVia("your email app");
  });
  const startNew = () => { setCart([]); setSentVia(null); setReference(makeReference()); setForm({ name: "", phone: "", email: "", location: "", notes: "" }); setTouched(false); setQuoteOpen(false); };

  const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };
  const field = { marginBottom: 14 };
  const err = key => touched && !form[key].trim() ? { borderColor: "#c0392b" } : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setQuoteOpen(false)}>
      <div style={{ background: "#fff", borderRadius: 12, width: 560, maxWidth: "100%", maxHeight: "92vh", overflowY: "auto", padding: 28, boxShadow: "0 24px 70px rgba(0,0,0,.3)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
          <h3 style={{ fontSize: 22, fontWeight: 600, fontFamily: "'Playfair Display', serif" }}>Request a quote</h3>
          <button onClick={() => setQuoteOpen(false)} aria-label="Close" style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
        </div>
        <p style={{ fontSize: 13, color: "#777", marginBottom: 18 }}>Reference <strong>{reference}</strong>. Our sales team will reply with a quotation.</p>

        {cart.length === 0 ? (
          <p style={{ fontSize: 14, color: "#777", padding: "20px 0" }}>Your list is empty. Add products to your cart first, then request a quote.</p>
        ) : (
          <>
            <div style={{ background: "#faf8f5", borderRadius: 8, padding: "12px 16px", marginBottom: 20, maxHeight: 150, overflowY: "auto" }}>
              {cart.map((item, i) => (
                <div key={i} style={{ fontSize: 13, padding: "4px 0", display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <span>{item.product.name}{item.colour ? " - " + item.colour : ""}</span>
                  <span style={{ color: "#777", whiteSpace: "nowrap" }}>{item.size} x {item.qty}</span>
                </div>
              ))}
            </div>

            <div style={field}><label style={label}>Your name *</label><input className="si" value={form.name} onChange={set("name")} style={err("name")} /></div>
            <div style={field}><label style={label}>Phone number *</label><input className="si" type="tel" value={form.phone} onChange={set("phone")} style={err("phone")} /></div>
            <div style={field}><label style={label}>Email (optional)</label><input className="si" type="email" value={form.email} onChange={set("email")} /></div>
            <div style={field}><label style={label}>Location / delivery area (optional)</label><input className="si" value={form.location} onChange={set("location")} /></div>
            <div style={field}><label style={label}>Project notes (optional)</label><textarea className="si" rows={3} value={form.notes} onChange={set("notes")} placeholder="Surface, area to cover, timing..." style={{ resize: "vertical" }} /></div>

            {touched && missing && <p style={{ fontSize: 13, color: "#c0392b", marginBottom: 12 }}>Please add your name and phone number.</p>}

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <button className="btn bp" onClick={sendWhatsApp} disabled={!whatsappReady} title={whatsappReady ? "" : "WhatsApp number not set yet"}
                style={{ flex: 1, justifyContent: "center", background: whatsappReady ? B.teal : "#ccc", cursor: whatsappReady ? "pointer" : "not-allowed" }}>
                Send on WhatsApp
              </button>
              <button className="btn bd" onClick={sendEmail} style={{ flex: 1, justifyContent: "center" }}>Send by email</button>
            </div>
            {!whatsappReady && <p style={{ fontSize: 12, color: "#999", marginTop: 8 }}>WhatsApp sending is not available yet. You can send your request by email.</p>}

            {sentVia && (
              <div style={{ marginTop: 18, padding: 14, background: "#eef7f4", borderRadius: 8, fontSize: 13, lineHeight: 1.6 }}>
                Your request is ready in {sentVia}. <strong>Press send there</strong> so it reaches our sales team. Nothing has been sent until you do.
                <div style={{ marginTop: 10 }}>
                  <button onClick={startNew} style={{ background: "none", border: "none", color: B.coral, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}>I have sent it - clear my list</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
