import { useState } from "react";
import { CONTACT } from "../config/contact.js";
import { B } from "../data/theme.js";
import { whatsappReady, whatsappUrl } from "../utils/messaging.js";
import { submitApplication } from "../lib/forms.js";
import PageHero from "../components/common/PageHero.jsx";

const STEPS = ["Your business", "Shop location", "Shop photos", "Registration", "Next of kin", "Review"];
const PHOTO_SLOTS = ["Shop front (outside)", "Inside the shop", "Shelves or stock", "Street or surroundings"];
const REG = [["registered", "Registered business"], ["in_progress", "Registration in progress"], ["not_registered", "Not registered yet"]];
const TAX = [["has_tin", "I have a TIN (tax number)"], ["applying", "Applying for a TIN"], ["none", "No TIN yet"]];
const EMPTY = { kind: "Distributor", business: "", person: "", phone: "", email: "", town: "", address: "", years: "", regStatus: "", regNumber: "", taxStatus: "", tin: "", kinName: "", kinPhone: "", kinRelation: "", consent: false, website: "" };
const label = { fontSize: 12, fontWeight: 600, color: "#555", display: "block", marginBottom: 6 };

export default function DistributorPage() {
  const [form, setForm] = useState(EMPTY);
  const [step, setStep] = useState(0);
  const [photos, setPhotos] = useState([null, null, null, null]);
  const [previews, setPreviews] = useState([null, null, null, null]);
  const [errors, setErrors] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));
  const ready = whatsappReady(CONTACT.whatsappNumber);

  const pick = (i, file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/.test(file.type)) { setErrors(["Please use a JPG, PNG or WebP photo."]); return; }
    if (file.size > 25 * 1024 * 1024) { setErrors(["That photo is very large. Please choose one under 25 MB."]); return; }
    setErrors([]);
    if (previews[i]) URL.revokeObjectURL(previews[i]);
    setPhotos(p => p.map((x, k) => (k === i ? file : x)));
    setPreviews(p => p.map((x, k) => (k === i ? URL.createObjectURL(file) : x)));
  };

  const check = s => {
    const e = [];
    const need = (v, msg) => { if (!String(v).trim()) e.push(msg); };
    if (s === 0) { need(form.business, "Enter your business name."); need(form.person, "Enter the contact person's name."); if (form.phone.replace(/\D/g, "").length < 7) e.push("Enter a phone number."); }
    if (s === 1) need(form.town, "Enter the town or district of your shop.");
    if (s === 2 && photos.some(p => !p)) e.push("Please add all 4 photos.");
    if (s === 3) {
      if (form.years === "" || Number(form.years) < 0 || Number(form.years) > 100) e.push("Enter how many years you have been in business (0 if new).");
      if (!form.regStatus) e.push("Choose your registration status.");
      if (!form.taxStatus) e.push("Choose your tax (TIN) status.");
    }
    if (s === 4) { need(form.kinName, "Enter your next of kin's name."); if (form.kinPhone.replace(/\D/g, "").length < 7) e.push("Enter your next of kin's phone number."); need(form.kinRelation, "Enter how they are related to you."); }
    if (s === 5 && !form.consent) e.push("Please tick the box to confirm.");
    return e;
  };
  const next = () => { const e = check(step); setErrors(e); if (!e.length) setStep(step + 1); };
  const back = () => { setErrors([]); setStep(step - 1); };
  async function submit() {
    const e = check(5);
    for (let s = 0; s < 5 && !e.length; s++) { const x = check(s); if (x.length) { setStep(s); setErrors(x); return; } }
    setErrors(e);
    if (e.length || busy) return;
    if (form.website) { setDone({ reference: "PP-DIST-0000" }); return; }
    setBusy(true);
    const r = await submitApplication(form, photos);
    setBusy(false);
    if (r.ok) setDone({ reference: r.reference }); else setErrors([r.error]);
  }

  const card = { background: "#fff", border: "1px solid #eee", borderRadius: 14, padding: 28 };
  const pill = active => ({ padding: "8px 20px", borderRadius: 22, fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", border: "2px solid " + (active ? B.coral : "#ddd"), background: active ? B.coral : "#fff", color: active ? "#fff" : "#555" });
  const field = (key, text, props = {}) => <div style={{ marginBottom: 14 }}><label style={label}>{text}</label><input className="si" value={form[key]} onChange={set(key)} {...props} /></div>;
  const choose = (key, options, text) => (
    <div style={{ marginBottom: 14 }}>
      <label style={label}>{text}</label>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{options.map(([v, l]) => <button type="button" key={v} style={pill(form[key] === v)} onClick={() => setForm(f => ({ ...f, [key]: v }))}>{l}</button>)}</div>
    </div>
  );
  const lab = (opts, v) => (opts.find(o => o[0] === v) || [0, "-"])[1];

  if (done) {
    const text = "Hello Peacock Paints, I have submitted a " + form.kind.toLowerCase() + " application. Reference: " + done.reference + ". Business: " + form.business.trim() + ".";
    return (
      <div>
        <PageHero kicker="Work with us" title="Application received" subtitle="Thank you. Our team will review it and get back to you." gradient="linear-gradient(135deg, #5C2D6D, #8B4AAD)" />
        <section style={{ maxWidth: 640, margin: "0 auto", padding: "50px 24px 70px" }}>
          <div style={{ ...card, textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "#888", marginBottom: 6 }}>Your reference</p>
            <p style={{ fontSize: 28, fontWeight: 700, marginBottom: 14 }}>{done.reference}</p>
            <p style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 18 }}>Please keep this reference. Sending this form does not make you a Peacock Paints dealer or distributor. Terms and conditions are agreed with you when a contract is signed.</p>
            {ready && <a className="btn bp" href={whatsappUrl(CONTACT.whatsappNumber, text)} target="_blank" rel="noopener noreferrer" style={{ background: B.teal, justifyContent: "center", textDecoration: "none" }}>Tell us on WhatsApp that you applied</a>}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHero kicker="Work with us" title="Become a Peacock Paints distributor" subtitle="We are looking for businesses across East Africa who want to grow with a trusted, locally manufactured paint brand." gradient="linear-gradient(135deg, #5C2D6D, #8B4AAD)" />
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px 70px" }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }} aria-label={"Step " + (step + 1) + " of " + STEPS.length}>
          {STEPS.map((s, i) => <div key={s} style={{ flex: 1 }}><div style={{ height: 5, borderRadius: 3, background: i <= step ? B.coral : "#e5e5e5" }} /><div style={{ fontSize: 11, color: i === step ? "#222" : "#999", fontWeight: i === step ? 700 : 500, marginTop: 6 }}>{i + 1}. {s}</div></div>)}
        </div>
        <div style={card}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 26, marginBottom: 18 }}>{STEPS[step]}</h2>

          {step === 0 && (
            <div>
              <label style={label}>I am interested in becoming a</label>
              <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>{["Distributor", "Dealer"].map(k => <button type="button" key={k} style={pill(form.kind === k)} onClick={() => setForm(f => ({ ...f, kind: k }))}>{k}</button>)}</div>
              {field("business", "Business name *")}
              {field("person", "Your full name *")}
              {field("phone", "Phone number *", { type: "tel" })}
              {field("email", "Email (optional)", { type: "email" })}
            </div>
          )}
          {step === 1 && (
            <div>
              {field("town", "Town or district of your shop *")}
              {field("address", "Street, building or landmark (optional)")}
            </div>
          )}
          {step === 2 && (
            <div>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>Add 4 clear photos of your shop. Only our team can see them.</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
                {PHOTO_SLOTS.map((name, i) => (
                  <div key={name}>
                    <label style={label}>{i + 1}. {name} *</label>
                    <label style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 130, border: "2px dashed " + (photos[i] ? B.teal : "#ccc"), borderRadius: 10, overflow: "hidden", cursor: "pointer", background: "#fafafa", color: "#888", fontSize: 13 }}>
                      {previews[i] ? <img src={previews[i]} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "Tap to add photo"}
                      <input type="file" accept="image/jpeg,image/png,image/webp" data-slot={i} style={{ display: "none" }} onChange={e => { pick(i, e.target.files && e.target.files[0]); e.target.value = ""; }} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              {field("years", "Years in business *", { type: "number", min: 0, max: 100 })}
              {choose("regStatus", REG, "Business registration *")}
              {form.regStatus === "registered" && field("regNumber", "Registration number (optional)")}
              {choose("taxStatus", TAX, "Tax status *")}
              {form.taxStatus === "has_tin" && field("tin", "TIN (optional)")}
            </div>
          )}
          {step === 4 && (
            <div>
              <p style={{ fontSize: 13.5, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>Someone we can contact if we cannot reach you.</p>
              {field("kinName", "Next of kin's full name *")}
              {field("kinPhone", "Next of kin's phone number *", { type: "tel" })}
              {field("kinRelation", "Relationship to you *")}
            </div>
          )}
          {step === 5 && (
            <div>
              <div style={{ fontSize: 14, color: "#444", lineHeight: 1.9, marginBottom: 16 }}>
                <div><strong>{form.kind}:</strong> {form.business} ({form.person}, {form.phone}{form.email ? ", " + form.email : ""})</div>
                <div><strong>Shop:</strong> {form.town}{form.address ? ", " + form.address : ""}</div>
                <div><strong>Photos:</strong> {photos.filter(Boolean).length} of 4 added</div>
                <div><strong>In business:</strong> {form.years} year(s) · {lab(REG, form.regStatus)} · {lab(TAX, form.taxStatus)}</div>
                <div><strong>Next of kin:</strong> {form.kinName} ({form.kinRelation}, {form.kinPhone})</div>
              </div>
              <div style={{ position: "absolute", left: "-9999px" }} aria-hidden="true"><input tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} /></div>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13.5, color: "#444", lineHeight: 1.6, cursor: "pointer" }}>
                <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} style={{ marginTop: 4, accentColor: B.coral }} />
                <span>I confirm these details are true. I understand that sending this form does not make me a Peacock Paints dealer or distributor, that terms are agreed when a contract is signed, and that Peacock Paints may use these details and photos to assess my application.</span>
              </label>
            </div>
          )}

          {errors.length > 0 && <div role="alert" style={{ margin: "16px 0 0", padding: "11px 14px", borderRadius: 9, background: "#fdecea", color: "#a12b1f", fontSize: 14 }}>{errors.map(m => <div key={m}>{m}</div>)}</div>}
          <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
            {step > 0 && <button type="button" className="btn bd" onClick={back} disabled={busy}>Back</button>}
            {step < STEPS.length - 1
              ? <button type="button" className="btn bp" onClick={next} style={{ marginLeft: "auto" }}>Next</button>
              : <button type="button" className="btn bp" onClick={submit} disabled={busy} style={{ marginLeft: "auto" }}>{busy ? "Sending..." : "Send application"}</button>}
          </div>
        </div>
      </section>
    </div>
  );
}
