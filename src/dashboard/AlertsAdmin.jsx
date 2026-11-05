import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase.js";
import { when } from "./csv.js";
import { S, msgStyle } from "./ui.js";

const DAYS = [[1, "Mon"], [2, "Tue"], [3, "Wed"], [4, "Thu"], [5, "Fri"], [6, "Sat"], [0, "Sun"]];
const BLANK = { name: "", telegram_chat_id: "", email: "", level: 1, days: [0, 1, 2, 3, 4, 5, 6], active: true };

function ago(iso) {
  const m = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return m + " min ago";
  if (m < 1440) return Math.floor(m / 60) + " h " + (m % 60) + " min ago";
  return Math.floor(m / 1440) + " day(s) ago";
}

export default function AlertsAdmin({ isAdmin, onChange }) {
  const [alerts, setAlerts] = useState(null);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState(null);
  const [tick, setTick] = useState(0);
  const [msg, setMsg] = useState(null);
  const [form, setForm] = useState(BLANK);
  const [editing, setEditing] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let off = false;
    Promise.all([
      supabase.from("lead_alerts").select("*").order("created_at", { ascending: false }).limit(60),
      supabase.from("team_contacts").select("*").order("level").order("name"),
      supabase.from("alert_settings").select("*").eq("id", 1).maybeSingle(),
    ]).then(([a, t, s]) => {
      if (off) return;
      const err = a.error || t.error || s.error;
      if (err) setMsg({ ok: false, text: "Could not load alerts: " + err.message + " (has 02-peacock-alerts.sql been run?)" });
      else { setAlerts(a.data); setTeam(t.data); setSettings(s.data); }
    });
    return () => { off = true; };
  }, [tick]);
  useEffect(() => { const t = setInterval(() => setTick(x => x + 1), 30000); return () => clearInterval(t); }, []);

  const refresh = () => { setTick(t => t + 1); if (onChange) onChange(); };
  const fail = (what, error) => setMsg({ ok: false, text: what + ": " + error.message });

  async function take(a) {
    const { error } = await supabase.rpc("take_alert", { p_id: a.id });
    if (error) fail("Could not take it", error); else { setMsg({ ok: true, text: "Done. Reminders for this request have stopped." }); refresh(); }
  }
  async function saveContact(e) {
    e.preventDefault();
    const row = { name: form.name.trim(), telegram_chat_id: form.telegram_chat_id.trim() || null, email: form.email.trim() || null, level: Number(form.level), days: form.days, active: form.active };
    if (!row.name) return setMsg({ ok: false, text: "Enter a name." });
    if (!row.telegram_chat_id && !row.email) return setMsg({ ok: false, text: "Enter a Telegram chat id or an email, otherwise this person cannot be alerted." });
    if (!row.days.length) return setMsg({ ok: false, text: "Tick at least one day." });
    setBusy(true);
    const { error } = editing ? await supabase.from("team_contacts").update(row).eq("id", editing) : await supabase.from("team_contacts").insert(row);
    setBusy(false);
    if (error) return fail("Could not save", error);
    setMsg({ ok: true, text: "Saved." }); setForm(BLANK); setEditing(null); refresh();
  }
  async function removeContact(c) {
    if (!window.confirm("Remove " + c.name + " from the alert list?")) return;
    const { error } = await supabase.from("team_contacts").delete().eq("id", c.id);
    if (error) fail("Could not remove", error); else refresh();
  }
  async function saveSettings(patch) {
    const { error } = await supabase.from("alert_settings").update(patch).eq("id", 1);
    if (error) fail("Could not save settings", error); else { setMsg({ ok: true, text: "Settings saved." }); refresh(); }
  }
  async function test() {
    setBusy(true);
    const { data, error } = await supabase.rpc("send_test_alert");
    setBusy(false);
    if (error) fail("Test failed", error);
    else setMsg({ ok: true, text: data ? "Test sent to " + data + " person(s). Check Telegram in a few seconds." : "No active team member to send to. Add someone first." });
  }
  const toggleDay = d => setForm(f => ({ ...f, days: f.days.includes(d) ? f.days.filter(x => x !== d) : [...f.days, d] }));
  const edit = c => { setEditing(c.id); setForm({ name: c.name, telegram_chat_id: c.telegram_chat_id || "", email: c.email || "", level: c.level, days: c.days, active: c.active }); };

  const open = (alerts || []).filter(a => a.status === "open");
  const done = (alerts || []).filter(a => a.status === "taken").slice(0, 15);
  const num = (k, label, min, max) => (
    <label style={{ fontSize: 13, color: "#444" }}>{label}
      <input type="number" min={min} max={max} defaultValue={settings[k]} key={k + settings[k]} style={{ ...S.input, marginTop: 4 }}
        onBlur={e => { const v = Number(e.target.value); if (v >= min && v <= max && v !== settings[k]) saveSettings({ [k]: v }); }} />
    </label>
  );

  return (
    <div>
      <h2 style={{ fontSize: 22, marginBottom: 8 }}>Alerts and reminders</h2>
      <p style={{ fontSize: 13, color: "#777", marginBottom: 16, lineHeight: 1.6 }}>Every new quote request, contact message and distributor application creates an alert. The first person on call is told at once, then reminded until someone presses "I'll take it" (or changes the request's status). If nobody does, the second-level people are told.</p>
      {msg && <div role="alert" style={msgStyle(msg.ok)}>{msg.text}</div>}
      {alerts === null && !msg && <p style={{ color: "#777" }}>Loading...</p>}

      {alerts && (
        <>
          <h3 style={{ fontSize: 17, margin: "10px 0 10px" }}>Waiting for someone ({open.length})</h3>
          {open.length === 0 && <div style={S.card}><p style={{ fontSize: 15, color: "#555" }}>Nothing waiting. Everything has been picked up.</p></div>}
          {open.map(a => (
            <div key={a.id} style={{ ...S.card, marginBottom: 12, borderColor: a.escalated_at ? "#e8a39b" : "#e8e8e8" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <strong style={{ fontSize: 16 }}>{a.title}</strong>
                  <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>Received {when(a.created_at)} ({ago(a.created_at)}) · reminders sent: {a.reminders_sent}{a.escalated_at ? " · escalated to second level" : ""}{!a.first_sent_at ? " · nobody alerted yet" : ""}</div>
                  {a.summary && <p style={{ fontSize: 14, color: "#444", margin: "8px 0 0", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{a.summary}</p>}
                  <div style={{ fontSize: 13, color: "#555", marginTop: 6 }}>{[a.customer_name, a.customer_phone, a.customer_email].filter(Boolean).join(" · ")}</div>
                </div>
                <button style={S.btn} onClick={() => take(a)}>I'll take it</button>
              </div>
            </div>
          ))}
          {done.length > 0 && (
            <>
              <h3 style={{ fontSize: 17, margin: "26px 0 10px" }}>Recently taken</h3>
              <div style={S.card}>
                {done.map(a => <div key={a.id} style={{ fontSize: 14, padding: "7px 0", borderBottom: "1px solid #f0f0f0", color: "#444" }}>{a.title} <span style={{ color: "#888" }}>· taken by {a.taken_by_label || "staff"} {a.taken_at ? ago(a.taken_at) : ""}</span></div>)}
              </div>
            </>
          )}
        </>
      )}

      {alerts && (
        <>
          <h3 style={{ fontSize: 17, margin: "30px 0 10px" }}>Who gets alerted</h3>
          <div style={S.card}>
            {team.length === 0 && <p style={{ fontSize: 14, color: "#a12b1f", marginBottom: 10 }}>No one is set up yet, so no alerts can be sent. {isAdmin ? "Add yourself below." : "Ask an administrator to add people."}</p>}
            {team.map(c => (
              <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", padding: "9px 0", borderBottom: "1px solid #f0f0f0", fontSize: 14, opacity: c.active ? 1 : .5 }}>
                <span><strong>{c.name}</strong> · level {c.level}{c.active ? "" : " (paused)"}<br /><span style={{ color: "#777", fontSize: 13 }}>{c.telegram_chat_id ? "Telegram " + c.telegram_chat_id : "no Telegram"} · {c.email || "no email"} · {DAYS.filter(([d]) => c.days.includes(d)).map(([, n]) => n).join(" ") || "no days"}</span></span>
                {isAdmin && <span style={{ display: "flex", gap: 8 }}><button style={S.small} onClick={() => edit(c)}>Edit</button><button style={S.small} onClick={() => removeContact(c)}>Remove</button></span>}
              </div>
            ))}
            {isAdmin && (
              <form onSubmit={saveContact} style={{ marginTop: 16 }}>
                <strong style={{ fontSize: 14 }}>{editing ? "Edit person" : "Add a person"}</strong>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12, marginTop: 8 }}>
                  <input style={S.input} placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                  <input style={S.input} placeholder="Telegram chat id" value={form.telegram_chat_id} onChange={e => setForm({ ...form, telegram_chat_id: e.target.value })} />
                  <input style={S.input} placeholder="Email (used once email is switched on)" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  <select style={S.input} value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}><option value={1}>Level 1: told first</option><option value={2}>Level 2: escalation</option></select>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", margin: "12px 0", fontSize: 13 }}>
                  {DAYS.map(([d, n]) => <label key={d}><input type="checkbox" checked={form.days.includes(d)} onChange={() => toggleDay(d)} /> {n}</label>)}
                  <label><input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} /> Active</label>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button style={S.btn} disabled={busy}>{editing ? "Save changes" : "Add person"}</button>
                  {editing && <button type="button" style={S.btnGhost} onClick={() => { setEditing(null); setForm(BLANK); }}>Cancel</button>}
                </div>
                <p style={S.hint}>Level 1 people on call that day are told first. If nobody is ticked for today, all level 1 people are told. Days are Kampala time.</p>
              </form>
            )}
          </div>
        </>
      )}

      {alerts && settings && isAdmin && (
        <>
          <h3 style={{ fontSize: 17, margin: "30px 0 10px" }}>Settings</h3>
          <div style={S.card}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              {num("reminder_every_minutes", "Remind every (minutes)", 1, 120)}
              {num("reminder_count", "Number of reminders", 0, 12)}
              {num("customer_ack_after_minutes", "Customer acknowledgement after (minutes)", 1, 60)}
            </div>
            <label style={{ display: "block", fontSize: 13, color: "#444", marginTop: 14 }}><input type="checkbox" checked={settings.customer_ack_enabled} onChange={e => saveSettings({ customer_ack_enabled: e.target.checked })} /> Email an acknowledgement to customers after the wait (needs a verified email domain, see the setup notes)</label>
            <label style={{ display: "block", fontSize: 13, color: "#444", marginTop: 8 }}><input type="checkbox" checked={settings.admin_email_enabled} onChange={e => saveSettings({ admin_email_enabled: e.target.checked })} /> Also email the team (needs a verified email domain)</label>
            <button style={{ ...S.btnGhost, marginTop: 16 }} disabled={busy} onClick={test}>Send a test alert to everyone</button>
          </div>
        </>
      )}
    </div>
  );
}
