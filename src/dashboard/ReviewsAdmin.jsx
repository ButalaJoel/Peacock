import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

export default function ReviewsAdmin() {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [edit, setEdit] = useState({});
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let off = false;
    supabase.from("reviews").select("*").order("created_at", { ascending: false }).limit(500)
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load reviews: " + error.message + " (has 07-peacock-reviews.sql been run?)" }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);

  const val = (r, k) => (edit[r.id] && edit[r.id][k] != null ? edit[r.id][k] : r[k] || "");
  const setField = (r, k, v) => setEdit(e => ({ ...e, [r.id]: { ...(e[r.id] || {}), [k]: v } }));
  async function save(r, published) {
    const patch = { display_name: val(r, "display_name").trim(), body: val(r, "body").trim(), product: val(r, "product").trim() || null, place: val(r, "place").trim() || null, published };
    if (!patch.display_name || patch.body.length < 5) { setMsg({ ok: false, text: "A review needs a name and some text." }); return; }
    const { error } = await supabase.from("reviews").update(patch).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not save: " + error.message }); else { setMsg({ ok: true, text: published ? "Saved and shown on the Reviews page." : "Saved (not shown on the website)." }); setEdit(e => ({ ...e, [r.id]: {} })); reload(); }
  }
  async function remove(r) {
    if (!window.confirm("Delete this review for good?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); reload(); }
  }

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Reviews</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Only reviews you publish here appear on the website. Create one from the Feedback tab (4 or 5 stars, where the customer agreed to be shown), check the wording, then publish. Use first names only.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && rows.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>No reviews yet.</p></div>}
      {(rows || []).map(r => (
        <div key={r.id} style={{ ...S.card, marginBottom: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 6 }}>
            <span style={{ fontSize: 13, color: "#777" }}><span style={{ color: "#c9772b" }}>{"★".repeat(r.rating)}</span> · {when(r.created_at)}</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: r.published ? "#e9f6ee" : "#f2f2f2", color: r.published ? "#1d6b3a" : "#666" }}>{r.published ? "Shown on the website" : "Draft"}</span>
          </div>
          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
            <div><label style={S.label}>Name shown</label><input aria-label="Name shown" style={S.input} value={val(r, "display_name")} onChange={e => setField(r, "display_name", e.target.value)} /></div>
            <div><label style={S.label}>Product</label><input style={S.input} value={val(r, "product")} onChange={e => setField(r, "product", e.target.value)} /></div>
            <div><label style={S.label}>Town or shop</label><input style={S.input} value={val(r, "place")} onChange={e => setField(r, "place", e.target.value)} /></div>
          </div>
          <label style={S.label}>Review text</label>
          <textarea aria-label="Review text" style={{ ...S.input, minHeight: 80 }} value={val(r, "body")} onChange={e => setField(r, "body", e.target.value)} />
          <div style={{ display: "flex", gap: 10, marginTop: 10, flexWrap: "wrap" }}>
            <button style={S.btn} onClick={() => save(r, true)}>{r.published ? "Save changes" : "Publish"}</button>
            {r.published && <button style={S.btnGhost} onClick={() => save(r, false)}>Hide from website</button>}
            <button style={S.btnGhost} onClick={() => remove(r)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
