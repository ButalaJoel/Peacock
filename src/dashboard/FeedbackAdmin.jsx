import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const STATUSES = [["new", "New"], ["investigating", "Investigating"], ["resolved", "Resolved"], ["closed", "Closed"]];
const TONE = { new: ["#fff1e6", "#a4510f"], investigating: ["#eef3fb", "#1f4f94"], resolved: ["#e9f6ee", "#1d6b3a"], closed: ["#f2f2f2", "#666"] };
const TYPES = [["all", "All"], ["complaint", "Complaints"], ["feedback", "Feedback"], ["compliment", "Compliments"]];

export default function FeedbackAdmin({ isAdmin, onChange }) {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    let off = false;
    supabase.from("feedback").select("*").order("created_at", { ascending: false }).limit(1000)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load feedback: " + error.message + " (has 03-peacock-forms.sql been run?)" }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);
  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };

  async function changeStatus(r, next) {
    const patch = { status: next, resolved_at: next === "resolved" || next === "closed" ? (r.resolved_at || new Date().toISOString()) : null };
    const { error } = await supabase.from("feedback").update(patch).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else refresh();
  }
  async function saveResolution(r) {
    const { error } = await supabase.from("feedback").update({ resolution: (notes[r.id] != null ? notes[r.id] : r.resolution || "").trim() || null }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not save: " + error.message }); else { setMsg({ ok: true, text: "Saved." }); refresh(); }
  }
  async function remove(r) {
    if (!window.confirm("Delete this message from " + r.name + " for good?")) return;
    const { error } = await supabase.from("feedback").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); refresh(); }
  }

  const shown = (rows || []).filter(r => (type === "all" || r.type === type) && (status === "all" || r.status === status));
  const exportCsv = () => downloadCsv("peacock-feedback.csv", toCsv(shown, [
    ["reference", "Reference"], [r => when(r.created_at), "Received"], ["type", "Type"], ["status", "Status"], ["name", "Name"], ["phone", "Phone"], ["email", "Email"],
    ["product", "Product"], ["place", "Bought at"], ["rating", "Rating"], ["message", "Message"], ["resolution", "What we did"], [r => when(r.resolved_at), "Resolved"],
  ]));
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Complaints and feedback</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Messages from the Complaints and feedback page. Contact the customer yourself, write what was done under "What we did", then set the status to Resolved. Changing the status from New marks the alert as handled.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>{TYPES.map(([v, l]) => <button key={v} style={chip(type === v)} onClick={() => setType(v)}>{l}</button>)}</div>
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
          <div key={r.id} style={{ ...S.card, marginBottom: 12, borderColor: r.type === "complaint" && r.status === "new" ? "#e8a39b" : "#e8e8e8" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: 240 }}>
                <strong style={{ fontSize: 16, textTransform: "capitalize" }}>{r.type}</strong> <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: bg, color: fg, fontWeight: 700 }}>{STATUSES.find(s => s[0] === r.status)[1]}</span>
                {r.rating ? <span style={{ marginLeft: 8, color: "#c9772b" }}>{"★".repeat(r.rating)}</span> : null}
                <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{r.reference} · {when(r.created_at)}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{r.name}{r.phone ? " · " + r.phone : ""}{r.email ? " · " + r.email : ""}</div>
                <p style={{ fontSize: 14, color: "#333", margin: "8px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{isOpen ? r.message : r.message.length > 160 ? r.message.slice(0, 160) + "..." : r.message}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <select aria-label="Status" style={{ ...S.input, width: "auto", padding: "7px 10px", fontSize: 13 }} value={r.status} onChange={e => changeStatus(r, e.target.value)}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <button style={S.small} onClick={() => setOpen(isOpen ? null : r.id)}>{isOpen ? "Hide" : "Details"}</button>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee" }}>
                {(r.product || r.place) && <div style={{ fontSize: 14, color: "#444", marginBottom: 8 }}>{r.product ? "Product: " + r.product : ""}{r.product && r.place ? " · " : ""}{r.place ? "Bought at: " + r.place : ""}</div>}
                <label style={S.label}>What we did (private)</label>
                <textarea style={{ ...S.input, minHeight: 70 }} defaultValue={r.resolution || ""} onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))} />
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  <button style={S.btn} onClick={() => saveResolution(r)}>Save</button>
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
