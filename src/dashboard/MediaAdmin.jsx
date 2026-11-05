import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { uploadImage } from "./uploads.js";
import { S, msgStyle } from "./ui.js";

const FOLDERS = ["projects", "news", "awards", "general"];
const isImage = n => /\.(jpe?g|png|webp|gif)$/i.test(n);

// Lists every file in the public "media" storage (project photos, news pictures, award photos, PDFs).
async function listAll() {
  const bucket = supabase.storage.from("media");
  const root = await bucket.list("", { limit: 200 });
  if (root.error) throw new Error(root.error.message);
  const out = [];
  for (const e of root.data || []) {
    if (e.id) { out.push({ path: e.name, folder: "other", name: e.name, size: e.metadata ? e.metadata.size : 0, created: e.created_at }); continue; }
    const inner = await bucket.list(e.name, { limit: 500, sortBy: { column: "created_at", order: "desc" } });
    if (inner.error) throw new Error(inner.error.message);
    for (const f of inner.data || []) if (f.id) out.push({ path: e.name + "/" + f.name, folder: e.name, name: f.name, size: f.metadata ? f.metadata.size : 0, created: f.created_at });
  }
  return out.map(f => ({ ...f, url: bucket.getPublicUrl(f.path).data.publicUrl })).sort((a, b) => String(b.created).localeCompare(String(a.created)));
}
const kb = n => (n > 1048576 ? (n / 1048576).toFixed(1) + " MB" : Math.max(1, Math.round((n || 0) / 1024)) + " KB");

export default function MediaAdmin() {
  const [files, setFiles] = useState(null);
  const [tick, setTick] = useState(0);
  const [folder, setFolder] = useState("all");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState("general");
  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let off = false;
    listAll().then(list => { if (!off) setFiles(list); }).catch(e => { if (!off) setMsg({ ok: false, text: "Could not load the library: " + e.message }); });
    return () => { off = true; };
  }, [tick]);

  async function upload(fileList) {
    const list = Array.from(fileList || []);
    if (!list.length) return;
    setBusy(true); setMsg(null);
    try { for (const f of list) await uploadImage(f, target); setMsg({ ok: true, text: "Uploaded " + list.length + " photo(s) to " + target + "." }); reload(); }
    catch (e) { setMsg({ ok: false, text: "Upload failed: " + e.message }); }
    setBusy(false);
  }
  async function copy(f) {
    try { await navigator.clipboard.writeText(f.url); setMsg({ ok: true, text: "Link copied." }); }
    catch { window.prompt("Copy this link:", f.url); }
  }
  async function remove(f) {
    if (!window.confirm("Delete " + f.name + " for good?\n\nIf a project, news story or award still uses this file, its picture will disappear from the website. This cannot be undone.")) return;
    const { error } = await supabase.storage.from("media").remove([f.path]);
    if (error) setMsg({ ok: false, text: "Could not delete: " + error.message }); else { setMsg({ ok: true, text: "Deleted." }); reload(); }
  }

  const names = files ? Array.from(new Set(files.map(f => f.folder))) : [];
  const shown = (files || []).filter(f => folder === "all" || f.folder === folder);
  const chip = on => ({ padding: "7px 16px", borderRadius: 30, border: "1px solid " + (on ? "#222" : "#ccc"), background: on ? "#222" : "#fff", color: on ? "#fff" : "#333", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" });

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 6 }}>Media library</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Every photo and PDF uploaded to the website. Copy a link to use a file somewhere else, upload a new photo here, or delete files nothing uses any more. Photos added from the Projects, News and Awards tabs appear here too.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      <div style={{ ...S.card, marginBottom: 18, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <label style={{ fontSize: 13, fontWeight: 600 }}>Upload photos to</label>
        <select aria-label="Upload folder" style={{ ...S.input, width: "auto", padding: "8px 10px", fontSize: 14 }} value={target} onChange={e => setTarget(e.target.value)}>{FOLDERS.map(f => <option key={f}>{f}</option>)}</select>
        <input aria-label="Choose photos" type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} onChange={e => { upload(e.target.files); e.target.value = ""; }} />
        {busy && <span style={{ fontSize: 13, color: "#777" }}>Uploading...</span>}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        <button style={chip(folder === "all")} onClick={() => setFolder("all")}>All ({(files || []).length})</button>
        {names.map(n => <button key={n} style={chip(folder === n)} onClick={() => setFolder(n)}>{n} ({files.filter(f => f.folder === n).length})</button>)}
      </div>
      {files === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}
      {files && shown.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>No files here yet.</p></div>}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 14 }}>
        {shown.map(f => (
          <div key={f.path} style={{ ...S.card, padding: 10 }}>
            <div style={{ height: 120, borderRadius: 8, background: "#f3f3f3", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", marginBottom: 8 }}>
              {isImage(f.name) ? <img src={f.url} alt={f.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: 13, fontWeight: 700, color: "#888" }}>{(f.name.split(".").pop() || "file").toUpperCase()}</span>}
            </div>
            <div title={f.name} style={{ fontSize: 12, color: "#555", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{f.name}</div>
            <div style={{ fontSize: 11, color: "#999", marginBottom: 8 }}>{f.folder} · {kb(f.size)}</div>
            <div style={{ display: "flex", gap: 6 }}>
              <button style={S.small} onClick={() => copy(f)}>Copy link</button>
              <button style={S.small} onClick={() => remove(f)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
