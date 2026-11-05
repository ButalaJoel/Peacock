import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const STATUSES = [["new", "New"], ["verifying", "Verifying"], ["verified", "Verified"], ["declined", "Declined"]];
const TONE = { new: ["#fff1e6", "#a4510f"], verifying: ["#eef3fb", "#1f4f94"], verified: ["#e9f6ee", "#1d6b3a"], declined: ["#f2f2f2", "#666"] };

export default function ProfessionalsAdmin({ isAdmin, onChange }) {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    let off = false;
    supabase.from("professional_requests").select("*").order("created_at", { ascending: false }).limit(1000)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load requests: " + error.message + " (has 06-peacock-professionals.sql been run?)" }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);
  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };

  async function changeStatus(r, next) {
    const { error } = await supabase.from("professional_requests").update({ status: next }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else refresh();
  }
  async function saveNotes(r) {
    const { error } = await supabase.from("professional_requests").update({ staff_notes: (notes[r.id] != null ? notes[r.id] : r.staff_notes || "").trim() || null }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not save notes: " + error.message }); else { setMsg({ ok: true, text: "Notes saved." }); refresh(); }
  }
  async function remove(r) {
    if (!window.confirm("Delete the request from " + r.name + " for good?")) return;
    const { error } = await supabase.from("professional_requests").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); refresh(); }
  }
  const prof = r => r.profession === "Other" && r.profession_other ? "Other: " + r.profession_other : r.profession;
  const shown = (rows || []).filter(r => status === "all" || r.status === status);
  const exportCsv = () => downloadCsv("peacock-professionals.csv", toCsv(shown, [
    ["reference", "Reference"], [r => when(r.created_at), "Received"], ["status", "Status"], ["name", "Name"], ["phone", "Phone"], ["email", "Email"], [prof, "Profession"],
    ["years_experience", "Years"], ["organisation", "Organisation"], [r => (r.data_wanted || []).join("; "), "Help wanted"], ["problem", "Problem"], ["staff_notes", "Staff notes"],
  ]));
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Professionals' requests</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Requests from the Professionals page. Check who they are (call them, look at their company), set the status to Verifying then Verified, and note what you agreed. Technical information is shared by our team directly, never through the website. Changing the status marks the alert as handled.</p>
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
              <div style={{ flex: 1, minWidth: 240 }}>
                <strong style={{ fontSize: 16 }}>{r.name}</strong> <span style={{ fontSize: 12, padding: "3px 10px", borderRadius: 20, background: bg, color: fg, fontWeight: 700 }}>{STATUSES.find(s => s[0] === r.status)[1]}</span>
                <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>{r.reference} · {prof(r)} · {r.years_experience} yr(s) · {when(r.created_at)}</div>
                <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{r.phone}{r.email ? " · " + r.email : ""}{r.organisation ? " · " + r.organisation : ""}</div>
                <p style={{ fontSize: 14, color: "#333", margin: "8px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{isOpen || r.problem.length <= 160 ? r.problem : r.problem.slice(0, 160) + "..."}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                <select aria-label="Status" style={{ ...S.input, width: "auto", padding: "7px 10px", fontSize: 13 }} value={r.status} onChange={e => changeStatus(r, e.target.value)}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                <button style={S.small} onClick={() => setOpen(isOpen ? null : r.id)}>{isOpen ? "Hide" : "Details"}</button>
              </div>
            </div>
            {isOpen && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee" }}>
                <div style={{ fontSize: 14, color: "#444", marginBottom: 10 }}><strong>Help wanted:</strong> {(r.data_wanted || []).length ? r.data_wanted.join("; ") : "not specified"}</div>
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
