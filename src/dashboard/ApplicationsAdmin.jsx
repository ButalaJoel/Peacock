import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const STATUSES = [["new", "New"], ["reviewing", "Reviewing"], ["approved", "Approved"], ["declined", "Declined"]];
const TONE = { new: ["#fff1e6", "#a4510f"], reviewing: ["#eef3fb", "#1f4f94"], approved: ["#e9f6ee", "#1d6b3a"], declined: ["#f2f2f2", "#666"] };
const REG = { registered: "Registered business", in_progress: "Registration in progress", not_registered: "Not registered yet" };
const TAX = { has_tin: "Has a TIN", applying: "Applying for a TIN", none: "No TIN yet" };

function Photos({ paths }) {
  const [urls, setUrls] = useState(null);
  const key = paths ? paths.join("|") : "";
  useEffect(() => {
    let off = false;
    if (!key) return undefined;
    supabase.storage.from("applications").createSignedUrls(key.split("|"), 3600).then(({ data }) => { if (!off) setUrls((data || []).map(d => d.signedUrl).filter(Boolean)); });
    return () => { off = true; };
  }, [key]);
  if (!paths || !paths.length) return <p style={{ fontSize: 13, color: "#888" }}>No photos.</p>;
  if (!urls) return <p style={{ fontSize: 13, color: "#888" }}>Loading photos...</p>;
  if (!urls.length) return <p style={{ fontSize: 13, color: "#a12b1f" }}>The photos could not be loaded.</p>;
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {urls.map((u, i) => <a key={u} href={u} target="_blank" rel="noopener noreferrer" title="Open full size"><img src={u} alt={"Shop photo " + (i + 1)} style={{ width: 150, height: 110, objectFit: "cover", borderRadius: 8, border: "1px solid #ddd" }} /></a>)}
    </div>
  );
}

export default function ApplicationsAdmin({ isAdmin, onChange }) {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    let off = false;
    supabase.from("dealer_applications").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load applications: " + error.message + " (has 03-peacock-forms.sql been run?)" }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);
  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };

  async function changeStatus(r, next) {
    const { error } = await supabase.from("dealer_applications").update({ status: next }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else refresh();
  }
  async function saveNotes(r) {
    const { error } = await supabase.from("dealer_applications").update({ staff_notes: (notes[r.id] != null ? notes[r.id] : r.staff_notes || "").trim() || null }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not save notes: " + error.message }); else { setMsg({ ok: true, text: "Notes saved." }); refresh(); }
  }
  async function remove(r) {
    if (!window.confirm("Delete the application from " + r.business_name + " and its photos for good?")) return;
    if (r.photos && r.photos.length) await supabase.storage.from("applications").remove(r.photos);
    const { error } = await supabase.from("dealer_applications").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); refresh(); }
  }

  const shown = (rows || []).filter(r => status === "all" || r.status === status);
  const exportCsv = () => downloadCsv("peacock-applications.csv", toCsv(shown, [
    ["reference", "Reference"], [r => when(r.created_at), "Received"], ["kind", "Type"], ["status", "Status"], ["business_name", "Business"], ["contact_person", "Contact person"], ["phone", "Phone"], ["email", "Email"],
    ["shop_town", "Town"], ["shop_address", "Address"], ["years_in_business", "Years in business"], [r => REG[r.registration_status], "Registration"], ["registration_number", "Registration no."],
    [r => TAX[r.tax_status], "Tax"], ["tin_number", "TIN"], ["kin_name", "Next of kin"], ["kin_phone", "Next of kin phone"], ["kin_relationship", "Relationship"], ["staff_notes", "Staff notes"],
  ]));
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });
  const line = (k, v) => v ? <div style={{ fontSize: 14, color: "#444", lineHeight: 1.8 }}><strong>{k}:</strong> {v}</div> : null;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Distributor and dealer applications</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Applications from the Distributor page, with the four shop photos. Only these details are collected now; terms are agreed when a contract is signed. Photos open in a private link that expires after an hour. Changing the status marks the alert as handled.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button style={chip(status === "all")} onClick={() => setStatus("all")}>Any status</button>
        {STATUSES.map(([v, l]) => <button key={v} style={chip(status === v)} onClick={() => setStatus(v)}>{l} ({(rows || []).filter(r => r.status === v).length})</button>)}
      </div>
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && shown.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing here.</p></div>}
      {shown.map(r => {
        const [bg, fg] = TONE[r.status] || TONE.new;
        const isOpen = open === r.id;
        return (
          <div key={r.id} style={{ ...S.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <strong style={{ fontSize: 16 }}>{r.business_name}</strong> <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: bg, color: fg, fontWeight: 700 }}>{STATUSES.find(s => s[0] === r.status)[1]}</span>
                <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{r.reference} · {r.kind} · {r.shop_town} · {when(r.created_at)}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{r.contact_person} · {r.phone}{r.email ? " · " + r.email : ""}</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <select aria-label="Status" style={{ ...S.input, width: "auto", padding: "7px 10px", fontSize: 13 }} value={r.status} onChange={e => changeStatus(r, e.target.value)}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <button style={S.small} onClick={() => setOpen(isOpen ? null : r.id)}>{isOpen ? "Hide" : "Details"}</button>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee" }}>
                {line("Address", r.shop_address)}
                {line("Years in business", String(r.years_in_business))}
                {line("Registration", REG[r.registration_status] + (r.registration_number ? " (" + r.registration_number + ")" : ""))}
                {line("Tax", TAX[r.tax_status] + (r.tin_number ? " (" + r.tin_number + ")" : ""))}
                {line("Next of kin", r.kin_name + ", " + r.kin_relationship + ", " + r.kin_phone)}
                <div style={{ margin: "12px 0" }}><Photos paths={r.photos} /></div>
                <label style={S.label}>Staff notes (private)</label>
                <textarea style={{ ...S.input, minHeight: 70 }} defaultValue={r.staff_notes || ""} onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))} />
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button style={S.btn} onClick={() => saveNotes(r)}>Save notes</button>
                  {isAdmin && <button style={S.btnGhost} onClick={() => remove(r)}>Delete</button>}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
