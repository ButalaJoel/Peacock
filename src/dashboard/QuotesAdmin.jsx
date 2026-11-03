import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const STATUSES = [["new", "New"], ["contacted", "Contacted"], ["quoted", "Quoted"], ["closed", "Closed"]];
const TONE = { new: ["#fff1e6", "#a4510f"], contacted: ["#e8f0fb", "#1f4f8f"], quoted: ["#efe9fb", "#5a2d9c"], closed: ["#f2f2f2", "#666"] };
const itemLine = i => (i.name || i.product || "Item") + (i.size ? " - " + i.size : "") + (i.qty ? " x " + i.qty : "") + (i.colour ? " (colour: " + i.colour + ")" : "");

export default function QuotesAdmin({ onChange }) {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState(null);
  const [notes, setNotes] = useState({});

  useEffect(() => {
    let off = false;
    supabase.from("quote_requests").select("*").order("created_at", { ascending: false }).limit(1000)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load quote requests: " + error.message }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);

  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };

  async function setStatus(r, status) {
    const { error } = await supabase.from("quote_requests").update({ status }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else refresh();
  }
  async function saveNote(r) {
    const { error } = await supabase.from("quote_requests").update({ internal_note: (notes[r.id] ?? r.internal_note ?? "").trim() || null }).eq("id", r.id);
    setMsg(error ? { ok: false, text: "Could not save the note: " + error.message } : { ok: true, text: "Note saved." });
    if (!error) refresh();
  }
  async function remove(r) {
    if (!window.confirm("Delete request " + r.reference + " for good?")) return;
    const { error } = await supabase.from("quote_requests").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); refresh(); }
  }

  const shown = (rows || []).filter(r => filter === "all" || r.status === filter);
  const count = s => (rows || []).filter(r => r.status === s).length;
  const exportCsv = () => downloadCsv("peacock-quote-requests.csv", toCsv(shown, [
    ["reference", "Reference"], [r => when(r.created_at), "Received"], ["status", "Status"], [r => r.customer && r.customer.name, "Name"], [r => r.customer && r.customer.phone, "Phone"],
    [r => r.customer && r.customer.email, "Email"], [r => r.customer && r.customer.location, "Location"], [r => (r.items || []).map(itemLine).join("; "), "Products"], ["note", "Project notes"], ["channel", "Sent via"], ["internal_note", "Internal note"],
  ]));
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Quote requests</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>A request appears here when a visitor presses the WhatsApp or email button on the quote form. Reply to them from your own WhatsApp or email, then mark the status.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button style={chip(filter === "all")} onClick={() => setFilter("all")}>All ({(rows || []).length})</button>
        {STATUSES.map(([v, l]) => <button key={v} style={chip(filter === v)} onClick={() => setFilter(v)}>{l} ({count(v)})</button>)}
      </div>
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && shown.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing here.</p></div>}
      <div style={{ display: "grid", gap: 12 }}>
        {shown.map(r => {
          const c = r.customer || {}, isOpen = open === r.id, tone = TONE[r.status] || TONE.closed;
          return (
            <div key={r.id} style={{ ...S.card, padding: 16 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 240px", minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{c.name || "No name"} <span style={{ fontWeight: 400, color: "#888", fontSize: 13 }}>· {r.reference}</span></div>
                  <div style={{ fontSize: 13, color: "#777" }}>{[c.phone, c.location, (r.items || []).length + " item(s)", "via " + r.channel, when(r.created_at)].filter(Boolean).join(" · ")}</div>
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: tone[0], color: tone[1] }}>{(STATUSES.find(s => s[0] === r.status) || [0, r.status])[1]}</span>
                <button style={S.small} aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : r.id)}>{isOpen ? "Hide" : "Details"}</button>
              </div>
              {isOpen && (
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #eee", fontSize: 14, lineHeight: 1.7 }}>
                  <p><strong>Phone:</strong> {c.phone ? <a href={"tel:" + c.phone}>{c.phone}</a> : "-"}{c.email ? <span> &nbsp; <strong>Email:</strong> <a href={"mailto:" + c.email}>{c.email}</a></span> : null}</p>
                  {c.location && <p><strong>Location:</strong> {c.location}</p>}
                  <p style={{ marginTop: 8 }}><strong>Products</strong></p>
                  <ul style={{ margin: "4px 0 8px 20px" }}>{(r.items || []).map((i, k) => <li key={k}>{itemLine(i)}</li>)}</ul>
                  {r.note && <p><strong>Project notes:</strong> {r.note}</p>}
                  <label style={S.label} htmlFor={"st-" + r.id}>Status</label>
                  <select id={"st-" + r.id} style={{ ...S.input, maxWidth: 220 }} value={r.status} onChange={e => setStatus(r, e.target.value)}>{STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
                  <label style={S.label} htmlFor={"nt-" + r.id}>Internal note (visitors never see this)</label>
                  <textarea id={"nt-" + r.id} rows={2} style={S.input} value={notes[r.id] ?? r.internal_note ?? ""} onChange={e => setNotes(n => ({ ...n, [r.id]: e.target.value }))} />
                  <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                    <button style={S.small} onClick={() => saveNote(r)}>Save note</button>
                    <button style={{ ...S.small, color: "#a12b1f" }} onClick={() => remove(r)}>Delete request</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
