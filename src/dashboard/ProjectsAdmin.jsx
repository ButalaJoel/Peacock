import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { PRODUCTS } from "../data/products.js";
import { PROJECT_TYPES } from "../data/projects.js";
import { uploadImage } from "./uploads.js";
import { S, msgStyle } from "./ui.js";

const blank = () => ({ id: null, name: "", location: "Kampala", type: PROJECT_TYPES[0], year: String(new Date().getFullYear()), summary: "", body: "", cover_url: "", cover_alt: "", gallery: [], product_ids: [], client: "", client_consent: false, status: "draft", published_at: null });
const fromRow = r => ({ id: r.id, name: r.name || "", location: r.location || "", type: r.type, year: r.year || "", summary: r.summary || "", body: r.body || "", cover_url: r.cover_url || "", cover_alt: r.cover_alt || "", gallery: Array.isArray(r.gallery) ? r.gallery : [], product_ids: r.product_ids || [], client: r.client || "", client_consent: !!r.client_consent, status: r.status, published_at: r.published_at });

function problem(f, status) {
  if (f.name.trim().length < 2) return "Please give the project a name.";
  if (status === "published") {
    if (!f.summary.trim()) return "Add a short summary before publishing.";
    if (!f.client_consent) return "Tick the box to confirm the client has agreed to us showing this project. A project cannot be published without it.";
  }
  return "";
}

export default function ProjectsAdmin() {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [pick, setPick] = useState("");
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let off = false;
    supabase.from("projects").select("*").order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (off) return;
        if (error) setMsg({ ok: false, text: "Could not load projects: " + error.message });
        else setRows(data);
      });
    return () => { off = true; };
  }, [tick]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function addImages(files, toCover) {
    setBusy(true); setMsg(null);
    try {
      const added = [];
      for (const file of Array.from(files)) added.push(await uploadImage(file, "projects"));
      if (toCover) setForm(f => ({ ...f, cover_url: added[0] }));
      else setForm(f => ({ ...f, gallery: f.gallery.concat(added.map(src => ({ src, alt: "" }))) }));
    } catch (e) { setMsg({ ok: false, text: "Upload failed: " + e.message }); }
    setBusy(false);
  }

  async function save(status) {
    const err = problem(form, status);
    if (err) { setMsg({ ok: false, text: err }); window.scrollTo(0, 0); return; }
    setBusy(true); setMsg(null);
    const row = {
      name: form.name.trim(), location: form.location.trim() || null, type: form.type, year: form.year.trim() || null,
      summary: form.summary.trim(), body: form.body, cover_url: form.cover_url || null, cover_alt: form.cover_alt.trim() || null,
      gallery: form.gallery, product_ids: form.product_ids, client: form.client.trim() || null, client_consent: form.client_consent,
      status, published_at: status === "published" ? (form.published_at || new Date().toISOString()) : form.published_at,
    };
    const { error } = form.id ? await supabase.from("projects").update(row).eq("id", form.id) : await supabase.from("projects").insert(row);
    setBusy(false);
    if (error) { setMsg({ ok: false, text: "Could not save: " + error.message }); window.scrollTo(0, 0); return; }
    setMsg({ ok: true, text: status === "published" ? "Saved and published. It is now on the website." : "Saved as a draft. It is not on the website yet." });
    setForm(null); reload(); window.scrollTo(0, 0);
  }

  async function toggle(r) {
    if (r.status === "draft" && !r.client_consent) { setMsg({ ok: false, text: "Open this project and tick the client consent box before publishing." }); return; }
    const next = r.status === "published" ? "draft" : "published";
    const { error } = await supabase.from("projects").update({ status: next, published_at: next === "published" ? (r.published_at || new Date().toISOString()) : r.published_at }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not change status: " + error.message });
    else { setMsg({ ok: true, text: next === "published" ? "Published." : "Moved back to drafts. It is no longer on the website." }); reload(); }
  }

  async function remove(r) {
    if (!window.confirm("Delete \"" + r.name + "\" for good? This cannot be undone.")) return;
    const { error } = await supabase.from("projects").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message });
    else { setMsg({ ok: true, text: "Deleted." }); reload(); }
  }

  if (form) {
    const shown = PRODUCTS.filter(p => !pick || p.name.toLowerCase().includes(pick.toLowerCase()));
    const toggleProduct = id => set("product_ids", form.product_ids.includes(id) ? form.product_ids.filter(x => x !== id) : form.product_ids.concat(id));
    return (
      <div style={S.card}>
        <h2 style={{ fontSize: 22 }}>{form.id ? "Edit project" : "New project"}</h2>
        {msg && <div role="alert" style={{ ...msgStyle(msg.ok), marginTop: 14 }}>{msg.text}</div>}

        <label style={S.label} htmlFor="p-name">Project name</label>
        <input id="p-name" style={S.input} value={form.name} onChange={e => set("name", e.target.value)} maxLength={160} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          <div><label style={S.label} htmlFor="p-type">Type</label>
            <select id="p-type" style={S.input} value={form.type} onChange={e => set("type", e.target.value)}>{PROJECT_TYPES.map(t => <option key={t}>{t}</option>)}</select></div>
          <div><label style={S.label} htmlFor="p-loc">Location</label>
            <input id="p-loc" style={S.input} value={form.location} onChange={e => set("location", e.target.value)} maxLength={160} /></div>
          <div><label style={S.label} htmlFor="p-year">Year</label>
            <input id="p-year" style={S.input} value={form.year} onChange={e => set("year", e.target.value)} maxLength={12} /></div>
        </div>

        <label style={S.label} htmlFor="p-sum">Short summary (shown on the card)</label>
        <textarea id="p-sum" rows={2} style={S.input} value={form.summary} onChange={e => set("summary", e.target.value)} maxLength={400} />
        <p style={S.hint}>{form.summary.length} of 400 characters</p>

        <label style={S.label} htmlFor="p-body">The full story</label>
        <textarea id="p-body" rows={8} style={S.input} value={form.body} onChange={e => set("body", e.target.value)} />
        <p style={S.hint}>Describe the surfaces, the colours chosen, the challenge and the result. Leave a blank line between paragraphs.</p>

        <label style={S.label}>Cover photo</label>
        {form.cover_url && <img src={form.cover_url} alt="" style={{ width: 240, height: 150, objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 10 }} />}
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { if (e.target.files.length) addImages(e.target.files, true); e.target.value = ""; }} />
        {form.cover_url && <input style={{ ...S.input, marginTop: 10 }} placeholder="Describe the photo in a few words (for screen readers)" value={form.cover_alt} onChange={e => set("cover_alt", e.target.value)} maxLength={200} />}
        <p style={S.hint}>Photos are shrunk to web size automatically, so large originals are fine.</p>

        <label style={S.label}>More photos (gallery)</label>
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={e => { if (e.target.files.length) addImages(e.target.files, false); e.target.value = ""; }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12, marginTop: 12 }}>
          {form.gallery.map((g, i) => (
            <div key={g.src} style={{ border: "1px solid #eee", borderRadius: 10, padding: 8 }}>
              <img src={g.src} alt="" style={{ width: "100%", height: 110, objectFit: "cover", borderRadius: 6, display: "block" }} />
              <input style={{ ...S.input, marginTop: 8, padding: "7px 9px", fontSize: 13 }} placeholder="Short description" value={g.alt} onChange={e => set("gallery", form.gallery.map((x, j) => j === i ? { ...x, alt: e.target.value } : x))} />
              <button type="button" style={{ ...S.small, marginTop: 8 }} onClick={() => set("gallery", form.gallery.filter((_, j) => j !== i))}>Remove</button>
            </div>
          ))}
        </div>

        <label style={S.label}>Peacock products used</label>
        <input style={S.input} placeholder="Search products..." value={pick} onChange={e => setPick(e.target.value)} />
        <div style={{ maxHeight: 180, overflow: "auto", border: "1px solid #eee", borderRadius: 9, padding: 10, marginTop: 8, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: 4 }}>
          {shown.map(p => (
            <label key={p.id} style={{ fontSize: 14, display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input type="checkbox" checked={form.product_ids.includes(p.id)} onChange={() => toggleProduct(p.id)} /> {p.name}
            </label>
          ))}
        </div>
        <p style={S.hint}>{form.product_ids.length} selected</p>

        <label style={S.label} htmlFor="p-client">Client name (optional)</label>
        <input id="p-client" style={S.input} value={form.client} onChange={e => set("client", e.target.value)} />
        <label style={{ display: "flex", gap: 10, alignItems: "flex-start", marginTop: 16, fontSize: 14, lineHeight: 1.5, cursor: "pointer" }}>
          <input type="checkbox" style={{ marginTop: 4 }} checked={form.client_consent} onChange={e => set("client_consent", e.target.checked)} />
          <span>The client has agreed that we may show this project, its photos and their name (if entered) on the website. <strong>Required to publish.</strong></span>
        </label>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 26 }}>
          <button style={{ ...S.btn, opacity: busy ? .6 : 1 }} disabled={busy} onClick={() => save("published")}>{busy ? "Working..." : "Save and publish"}</button>
          <button style={S.btnGhost} disabled={busy} onClick={() => save("draft")}>Save as draft</button>
          <button style={S.btnGhost} disabled={busy} onClick={() => { setForm(null); setMsg(null); }}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22 }}>Projects</h2>
        <button style={S.btn} onClick={() => { setForm(blank()); setMsg(null); setPick(""); window.scrollTo(0, 0); }}>+ New project</button>
      </div>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && rows.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>No projects yet. Click "New project" to add the first one. Until a real project is published, the website shows sample layouts.</p></div>}
      <div style={{ display: "grid", gap: 12 }}>
        {(rows || []).map(r => (
          <div key={r.id} style={{ ...S.card, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", padding: 14 }}>
            {r.cover_url ? <img src={r.cover_url} alt="" style={{ width: 96, height: 64, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 96, height: 64, borderRadius: 8, background: "#f0ece6" }} />}
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{r.name}</div>
              <div style={{ fontSize: 13, color: "#777" }}>{[r.type, r.location, r.year].filter(Boolean).join(" · ")}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: r.status === "published" ? "#e9f6ee" : "#f2f2f2", color: r.status === "published" ? "#1d6b3a" : "#666" }}>{r.status === "published" ? "Published" : "Draft"}</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={S.small} onClick={() => { setForm(fromRow(r)); setMsg(null); setPick(""); window.scrollTo(0, 0); }}>Edit</button>
              <button style={S.small} onClick={() => toggle(r)}>{r.status === "published" ? "Unpublish" : "Publish"}</button>
              <button style={{ ...S.small, color: "#a12b1f" }} onClick={() => remove(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
