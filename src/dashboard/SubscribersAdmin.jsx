import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { toCsv, downloadCsv, when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

export default function SubscribersAdmin() {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    let off = false;
    supabase.from("subscribers").select("*").order("created_at", { ascending: false }).limit(5000)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load subscribers: " + error.message }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);

  async function remove(r) {
    if (!window.confirm("Remove " + r.email + " from the list?")) return;
    const { error } = await supabase.from("subscribers").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not remove: " + error.message });
    else { setMsg({ ok: true, text: "Removed." }); setTick(t => t + 1); }
  }

  const shown = (rows || []).filter(r => !q.trim() || r.email.toLowerCase().includes(q.trim().toLowerCase()));
  const exportCsv = () => downloadCsv("peacock-subscribers.csv", toCsv(shown, [["email", "Email"], [r => when(r.created_at), "Subscribed"], ["source", "Source"]]));

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Newsletter subscribers {rows && <span style={{ fontSize: 15, color: "#888", fontWeight: 400 }}>({rows.length})</span>}</h2>
        <button style={S.btnGhost} disabled={!shown.length} onClick={exportCsv}>Download as spreadsheet (CSV)</button>
      </div>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <input style={{ ...S.input, marginBottom: 14, maxWidth: 380 }} placeholder="Search emails..." value={q} onChange={e => setQ(e.target.value)} />
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && rows.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>No subscribers yet. Signups from the website appear here.</p></div>}
      <div style={{ display: "grid", gap: 8 }}>
        {shown.map(r => (
          <div key={r.id} style={{ ...S.card, padding: "10px 16px", display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 240px", fontWeight: 600, wordBreak: "break-all" }}>{r.email}</div>
            <div style={{ fontSize: 13, color: "#888" }}>{when(r.created_at)}</div>
            <button style={{ ...S.small, color: "#a12b1f" }} onClick={() => remove(r)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}
