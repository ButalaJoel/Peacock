import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const STATUSES = [["new", "New"], ["replied", "Replied"], ["closed", "Closed"]];
const TONE = { new: ["#fff1e6", "#a4510f"], replied: ["#e9f6ee", "#1d6b3a"], closed: ["#f2f2f2", "#666"] };
const KINDS = [["all", "All"], ["contact", "Contact messages"], ["distributor", "Distributor / dealer"]];

export default function EnquiriesAdmin({ onChange }) {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [kind, setKind] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);

  useEffect(() => {
    let off = false;
    supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(1000)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load enquiries: " + error.message }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);

  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };

  async function changeStatus(r, next) {
    const { error } = await supabase.from("enquiries").update({ status: next }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else refresh();
  }
  async function remove(r) {
    if (!window.confirm("Delete this enquiry from " + r.name + " for good?")) return;
    const { error } = await supabase.from("enquiries").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); refresh(); }
  }

  const shown = (rows || []).filter(r => (kind === "all" || r.kind === kind) && (status === "all" || r.status === status));
  const exportCsv = () => downloadCsv("peacock-enquiries.csv", toCsv(shown, [
    [r => (r.details && r.details.reference) || "", "Reference"], [r => when(r.created_at), "Received"], ["kind", "Type"], ["status", "Status"], ["name", "Name"], ["phone", "Phone"], ["email", "Email"],
    [r => (r.details && (r.details.topic || r.details.business)) || "", "Topic or business"], [r => (r.details && r.details.location) || "", "Location"], ["message", "Message"], [r => (r.details && r.details.channel) || "", "Sent via"],
  ]));
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Enquiries</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Messages from the Contact page and expressions of interest from the Distributor page appear here when the visitor presses the WhatsApp or email button. Reply from your own WhatsApp or email, then mark the status. Only authorised staff approve distributors.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        {KINDS.map(([v, l]) => <button key={v} style={chip(kind === v)} onClick={() => setKind(v)}>{l}</button>)}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button style={chip(status === "all")} onClick={() => setStatus("all")}>Any status</button>
        {STATUSES.map(([v, l]) => <button key={v} style={chip(status === v)} onClick={() => setStatus(v)}>{l} ({(rows || []).filter(r => r.status === v).length})</button>)}
      </div>
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && shown.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing here.</p></div>}
      <div style={{ display: "grid", gap: 12 }}>
        {shown.map(r => {
          const d = r.details || {}, isOpen = open === r.id, tone = TONE[r.status] || TONE.closed, dist = r.kind === "distributor";
          return (
            <div key={r.id} style={{ ...S.card, padding: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{r.name} <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>· {d.reference || ""}</span></div>
                  <div style={{ fontSize: 13, color: "#777" }}>{[dist ? "Wants to be a " + (d.role || "distributor").toLowerCase() : d.topic || "Message", dist ? d.business : "", r.phone, when(r.created_at)].filter(Boolean).join(" · ")}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: tone[0], color: tone[1] }}>{(STATUSES.find(s => s[0] === r.status) || [0, r.status])[1]}</span>
                <button style={S.small} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)}>{isOpen ? "Hide" : "Details"}</button>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee", fontSize: 14, lineHeight: 1.7 }}>
                  <p><strong>Phone:</strong> {r.phone ? <a href={"tel:" + r.phone}>{r.phone}</a> : "-"}{r.email ? <span> &nbsp; <strong>Email:</strong> <a href={"mailto:" + r.email}>{r.email}</a></span> : null}</p>
                  {dist && <p><strong>Business:</strong> {d.business || "-"} &nbsp; <strong>Operates in:</strong> {d.location || "-"}</p>}
                  {r.message && <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}><strong>{dist ? "Business experience:" : "Message:"}</strong> {r.message}</p>}
                  {d.channel && <p style={{ color: "#888", fontSize: 13 }}>Sent via {d.channel}</p>}
                  <label style={S.label} htmlFor={"es-" + r.id}>Status</label>
                  <select id={"es-" + r.id} style={{ ...S.input, maxWidth: 220 }} value={r.status} onChange={e => changeStatus(r, e.target.value)}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <div style={{ marginTop: 12 }}><button style={{ ...S.small, color: "#a12b1f" }} onClick={() => remove(r)}>Delete</button></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
