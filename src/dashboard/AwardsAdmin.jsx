import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "./uploads.js";
import { S, msgStyle } from "./ui.js";

const KINDS = [["award", "Award"], ["certificate", "Certificate"]];
const blank = () => ({ id: null, kind: "award", title: "", year: "", description: "", image_url: "", published: false });
const fromRow = r => ({ id: r.id, kind: r.kind, title: r.title, year: r.year || "", description: r.description || "", image_url: r.image_url || "", published: r.published });

export default function AwardsAdmin() {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let off = false;
    supabase.from("awards").select("*").order("sort_order").order("created_at")
      .then(({ data, error }) => { if (off) return; if (error) setMsg({ ok: false, text: "Could not load awards: " + error.message + " (has 04-peacock-awards.sql been run?)" }); else setRows(data); });
    return () => { off = true; };
  }, [tick]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  async function addPhoto(file) {
    if (!file) return;
    setBusy(true); setMsg(null);
    try { const url = await uploadImage(file, "awards"); set("image_url", url); }
    catch (e) { setMsg({ ok: false, text: "Upload failed: " + e.message }); }
    setBusy(false);
  }
  async function save() {
    if (form.title.trim().length < 2) return setMsg({ ok: false, text: "Please give it a title." });
    if (form.published && !form.image_url) return setMsg({ ok: false, text: "Add a photo before publishing. Nothing shows on the website without one." });
    setBusy(true);
    const row = { kind: form.kind, title: form.title.trim(), year: form.year.trim() || null, description: form.description.trim() || null, image_url: form.image_url || null, published: form.published };
    const { error } = form.id
      ? await supabase.from("awards").update(row).eq("id", form.id)
      : await supabase.from("awards").insert({ ...row, sort_order: ((rows || []).reduce((m, r) => Math.max(m, r.sort_order), 0)) + 10 });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: "Could not save: " + error.message });
    setMsg({ ok: true, text: form.published ? "Saved. It is now on the home page." : "Saved (not shown on the website)." }); setForm(null); reload();
  }
  async function togglePublish(r) {
    if (!r.published && !r.image_url) return setMsg({ ok: false, text: "Add a photo first (Edit), then publish." });
    const { error } = await supabase.from("awards").update({ published: !r.published }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not update: " + error.message }); else reload();
  }
  async function move(i, dir) {
    const j = i + dir;
    if (j < 0 || j >= rows.length) return;
    const ids = rows.map(r => r.id);
    [ids[i], ids[j]] = [ids[j], ids[i]];
    for (let k = 0; k < ids.length; k++) {
      const { error } = await supabase.from("awards").update({ sort_order: (k + 1) * 10 }).eq("id", ids[k]);
      if (error) return setMsg({ ok: false, text: "Could not reorder: " + error.message });
    }
    reload();
  }
  async function remove(r) {
    if (!window.confirm("Delete \"" + r.title + "\" for good?")) return;
    const { error } = await supabase.from("awards").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); reload(); }
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Awards and certificates</h2>
        {!form && <button style={S.btn} onClick={() => { setMsg(null); setForm(blank()); }}>Add award or certificate</button>}
      </div>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Published items appear in the "Awards and certificates" section on the home page. Visitors can click a photo to enlarge it and use the arrows to move between them. An item without a photo is never shown.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}

      {form && (
        <div style={{ ...S.card, marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, marginBottom: 6 }}>{form.id ? "Edit" : "New"}</h3>
          <label style={S.label}>Type</label>
          <select style={S.input} value={form.kind} onChange={e => set("kind", e.target.value)}>{KINDS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <label style={S.label}>Title</label>
          <input style={S.input} value={form.title} onChange={e => set("title", e.target.value)} />
          <label style={S.label}>Year (optional)</label>
          <input style={S.input} value={form.year} onChange={e => set("year", e.target.value)} placeholder="2026" />
          <label style={S.label}>Short note (optional)</label>
          <textarea style={{ ...S.input, minHeight: 70 }} value={form.description} onChange={e => set("description", e.target.value)} />
          <label style={S.label}>Photo</label>
          {form.image_url && <img src={form.image_url} alt="" style={{ display: "block", maxWidth: 260, maxHeight: 200, objectFit: "contain", border: "1px solid #ddd", borderRadius: 8, marginBottom: 8 }} />}
          <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { addPhoto(e.target.files && e.target.files[0]); e.target.value = ""; }} />
          <p style={S.hint}>Photos are shrunk automatically before upload. Use a clear photo of the trophy, plaque or certificate.</p>
          <label style={{ display: "block", fontSize: 14, margin: "16px 0" }}><input type="checkbox" checked={form.published} onChange={e => set("published", e.target.checked)} /> Show on the website</label>
          <div style={{ display: "flex", gap: 10 }}>
            <button style={S.btn} disabled={busy} onClick={save}>{busy ? "Working..." : "Save"}</button>
            <button style={S.btnGhost} disabled={busy} onClick={() => setForm(null)}>Cancel</button>
          </div>
        </div>
      )}

      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && rows.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing yet. Add your first award or certificate.</p></div>}
      {rows && rows.map((r, i) => (
        <div key={r.id} style={{ ...S.card, marginBottom: 10, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 90, height: 66, background: "#f4f2ef", border: "1px solid #e5e5e5", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 11, color: "#999" }}>
            {r.image_url ? <img src={r.image_url} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : "No photo"}
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <strong style={{ fontSize: 15 }}>{r.title}</strong>
            <div style={{ fontSize: 13, color: "#777", marginTop: 3 }}>{r.kind === "award" ? "Award" : "Certificate"}{r.year ? " · " + r.year : ""} · {r.published ? "Shown on the website" : "Not shown"}</div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <button style={S.small} aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>Up</button>
            <button style={S.small} aria-label="Move down" disabled={i === rows.length - 1} onClick={() => move(i, 1)}>Down</button>
            <button style={S.small} onClick={() => togglePublish(r)}>{r.published ? "Hide" : "Publish"}</button>
            <button style={S.small} onClick={() => { setMsg(null); setForm(fromRow(r)); window.scrollTo(0, 0); }}>Edit</button>
            <button style={S.small} onClick={() => remove(r)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
