import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage, uploadPdf } from "./uploads.js";
import { S, msgStyle } from "./ui.js";

const CATS = ["Product news", "Colour tips", "Company", "Newsletter"];
const LINK_PAGES = [["", "No button"], ["contact", "Contact us"], ["decorative-paints", "Decorative paints"], ["estimator", "Paint estimator"], ["colour-picker", "Colour picker"], ["all-colours", "All colours"], ["projects", "Our projects"], ["news", "News & updates"], ["professionals", "Professionals"], ["distributor", "Become a distributor"]];
const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ id: null, cat: CATS[0], title: "", news_date: today(), summary: "", body: "", image_url: "", image_alt: "", pdf_url: "", gallery: [], cta_label: "", cta_page: "", status: "draft" });
const fromRow = r => ({ id: r.id, cat: r.cat, title: r.title || "", news_date: r.news_date || today(), summary: r.summary || "", body: r.body || "", image_url: r.image_url || "", image_alt: r.image_alt || "", pdf_url: r.pdf_url || "", gallery: Array.isArray(r.gallery) ? r.gallery : [], cta_label: r.cta_label || "", cta_page: r.cta_page || "", status: r.status });

function problem(f, status) {
  if (f.title.trim().length < 2) return "Please give the item a title.";
  if (status === "published" && !f.summary.trim()) return "Add a short summary before publishing.";
  if (f.cta_page && !f.cta_label.trim()) return "You chose a button page, so please type the button's words (for example: Browse products).";
  return "";
}

export default function NewsAdmin() {
  const [rows, setRows] = useState(null);
  const [tick, setTick] = useState(0);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let off = false;
    supabase.from("news_items").select("*").order("news_date", { ascending: false }).order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (off) return;
        if (error) setMsg({ ok: false, text: "Could not load news: " + error.message });
        else setRows(data);
      });
    return () => { off = true; };
  }, [tick]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function addImages(files, toCover) {
    setBusy(true); setMsg(null);
    try {
      const added = [];
      for (const file of Array.from(files)) added.push(await uploadImage(file, "news"));
      if (toCover) setForm(f => ({ ...f, image_url: added[0] }));
      else setForm(f => ({ ...f, gallery: f.gallery.concat(added.map(src => ({ src, alt: "" }))) }));
    } catch (e) { setMsg({ ok: false, text: "Upload failed: " + e.message }); }
    setBusy(false);
  }

  async function addPdf(file) {
    setBusy(true); setMsg(null);
    try { const url = await uploadPdf(file, "news"); setForm(f => ({ ...f, pdf_url: url })); }
    catch (e) { setMsg({ ok: false, text: "Upload failed: " + e.message }); }
    setBusy(false);
  }

  async function save(status) {
    const err = problem(form, status);
    if (err) { setMsg({ ok: false, text: err }); window.scrollTo(0, 0); return; }
    setBusy(true); setMsg(null);
    const row = {
      cat: form.cat, title: form.title.trim(), news_date: form.news_date || today(), summary: form.summary.trim(), body: form.body,
      image_url: form.image_url || null, image_alt: form.image_alt.trim() || null, pdf_url: form.pdf_url || null, gallery: form.gallery,
      cta_label: form.cta_page ? form.cta_label.trim() : null, cta_page: form.cta_page || null, status,
    };
    const { error } = form.id ? await supabase.from("news_items").update(row).eq("id", form.id) : await supabase.from("news_items").insert(row);
    setBusy(false);
    if (error) { setMsg({ ok: false, text: "Could not save: " + error.message }); window.scrollTo(0, 0); return; }
    setMsg({ ok: true, text: status === "published" ? "Saved and published. It is now on the website." : "Saved as a draft. It is not on the website yet." });
    setForm(null); reload(); window.scrollTo(0, 0);
  }

  async function toggle(r) {
    const next = r.status === "published" ? "draft" : "published";
    if (next === "published" && !(r.summary || "").trim()) { setMsg({ ok: false, text: "Open this item and add a short summary before publishing." }); return; }
    const { error } = await supabase.from("news_items").update({ status: next }).eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not change status: " + error.message });
    else { setMsg({ ok: true, text: next === "published" ? "Published." : "Moved back to drafts. It is no longer on the website." }); reload(); }
  }

  async function remove(r) {
    if (!window.confirm("Delete \"" + r.title + "\" for good? This cannot be undone.")) return;
    const { error } = await supabase.from("news_items").delete().eq("id", r.id);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message });
    else { setMsg({ ok: true, text: "Deleted." }); reload(); }
  }

  if (form) {
    return (
      <div style={S.card}>
        <h2 style={{ fontSize: 22 }}>{form.id ? "Edit news item" : "New news item"}</h2>
        {msg && <div role="alert" style={{ ...msgStyle(msg.ok), marginTop: 14 }}>{msg.text}</div>}

        <label style={S.label} htmlFor="n-title">Title</label>
        <input id="n-title" style={S.input} value={form.title} onChange={e => set("title", e.target.value)} maxLength={160} />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <div><label style={S.label} htmlFor="n-cat">Category</label>
            <select id="n-cat" style={S.input} value={form.cat} onChange={e => set("cat", e.target.value)}>{CATS.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={S.label} htmlFor="n-date">Date shown</label>
            <input id="n-date" type="date" style={S.input} value={form.news_date} onChange={e => set("news_date", e.target.value)} /></div>
        </div>

        <label style={S.label} htmlFor="n-sum">Short summary (shown on the card)</label>
        <textarea id="n-sum" rows={2} style={S.input} value={form.summary} onChange={e => set("summary", e.target.value)} maxLength={400} />
        <p style={S.hint}>{form.summary.length} of 400 characters</p>

        <label style={S.label} htmlFor="n-body">Full text (optional)</label>
        <textarea id="n-body" rows={8} style={S.input} value={form.body} onChange={e => set("body", e.target.value)} />
        <p style={S.hint}>Leave a blank line between paragraphs.</p>

        <label style={S.label}>Cover photo</label>
        {form.image_url && <img src={form.image_url} alt="" style={{ width: 240, height: 150, objectFit: "cover", borderRadius: 10, display: "block", marginBottom: 10 }} />}
        <input type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} onChange={e => { if (e.target.files.length) addImages(e.target.files, true); e.target.value = ""; }} />
        {form.image_url && <input style={{ ...S.input, marginTop: 10 }} placeholder="Describe the photo in a few words (for screen readers)" value={form.image_alt} onChange={e => set("image_alt", e.target.value)} maxLength={200} />}

        <label style={S.label}>More photos (gallery, for awards, exhibitions and events)</label>
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

        <label style={S.label}>PDF (finished newsletter, flyer or mock-up)</label>
        {form.pdf_url ? (
          <p style={{ fontSize: 14, marginBottom: 8 }}><a href={form.pdf_url} target="_blank" rel="noopener noreferrer">View the uploaded PDF</a> <button type="button" style={{ ...S.small, marginLeft: 10 }} onClick={() => set("pdf_url", "")}>Remove</button></p>
        ) : null}
        <input type="file" accept="application/pdf" disabled={busy} onChange={e => { if (e.target.files.length) addPdf(e.target.files[0]); e.target.value = ""; }} />
        <p style={S.hint}>Visitors can open, preview and download it. Up to 50 MB.</p>

        <label style={S.label} htmlFor="n-link">Button that links to a page on the website (optional)</label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          <select id="n-link" style={S.input} value={form.cta_page} onChange={e => set("cta_page", e.target.value)}>{LINK_PAGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
          <input style={S.input} placeholder="Button words, e.g. Browse products" value={form.cta_label} disabled={!form.cta_page} onChange={e => set("cta_label", e.target.value)} maxLength={40} />
        </div>

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
        <h2 style={{ fontSize: 22 }}>News & updates</h2>
        <button style={S.btn} onClick={() => { setForm(blank()); setMsg(null); window.scrollTo(0, 0); }}>+ New item</button>
      </div>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      {rows === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {rows && rows.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing here yet. Click "New item" to add the first one. Until a real item is published, the website shows sample items.</p></div>}
      <div style={{ display: "grid", gap: 12 }}>
        {(rows || []).map(r => (
          <div key={r.id} style={{ ...S.card, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", padding: 14 }}>
            {r.image_url ? <img src={r.image_url} alt="" style={{ width: 96, height: 64, objectFit: "cover", borderRadius: 8 }} /> : <div style={{ width: 96, height: 64, borderRadius: 8, background: "#f0ece6" }} />}
            <div style={{ flex: "1 1 220px", minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{r.title}</div>
              <div style={{ fontSize: 13, color: "#777" }}>{[r.cat, r.news_date, r.pdf_url ? "PDF attached" : ""].filter(Boolean).join(" · ")}</div>
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 20, background: r.status === "published" ? "#e9f6ee" : "#f2f2f2", color: r.status === "published" ? "#1d6b3a" : "#666" }}>{r.status === "published" ? "Published" : "Draft"}</span>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={S.small} onClick={() => { setForm(fromRow(r)); setMsg(null); window.scrollTo(0, 0); }}>Edit</button>
              <button style={S.small} onClick={() => toggle(r)}>{r.status === "published" ? "Unpublish" : "Publish"}</button>
              <button style={{ ...S.small, color: "#a12b1f" }} onClick={() => remove(r)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
