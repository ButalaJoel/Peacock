import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { S, msgStyle } from "./ui.js";

// Used twice: after opening a password-reset email link, and from "Change password" while signed in.
export default function SetPassword({ title, intro, onDone, onCancel }) {
  const [pass, setPass] = useState("");
  const [again, setAgain] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (pass.length < 10) return setMsg({ ok: false, text: "Use at least 10 characters." });
    if (pass !== again) return setMsg({ ok: false, text: "The two passwords do not match." });
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.updateUser({ password: pass });
    setBusy(false);
    if (error) return setMsg({ ok: false, text: error.message.includes("different") ? "Choose a password you have not used before." : "Could not save the new password. Open the reset link again, or sign in and try once more." });
    setPass(""); setAgain("");
    setMsg({ ok: true, text: "Password saved. Use it next time you sign in." });
    if (onDone) setTimeout(onDone, 1500);
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "50px 24px" }}>
      <form onSubmit={submit} style={S.card}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>{title}</h1>
        {intro && <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>{intro}</p>}
        {msg && <div role={msg.ok ? "status" : "alert"} style={msgStyle(msg.ok)}>{msg.text}</div>}
        <label style={S.label} htmlFor="sp-pass">New password</label>
        <input id="sp-pass" type="password" autoComplete="new-password" required minLength={10} value={pass} onChange={e => setPass(e.target.value)} style={S.input} />
        <p style={S.hint}>At least 10 characters. A short sentence is easy to remember and hard to guess.</p>
        <label style={S.label} htmlFor="sp-again">Type it again</label>
        <input id="sp-again" type="password" autoComplete="new-password" required value={again} onChange={e => setAgain(e.target.value)} style={S.input} />
        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button type="submit" disabled={busy} style={{ ...S.btn, flex: 1, opacity: busy ? .6 : 1 }}>{busy ? "Saving..." : "Save password"}</button>
          {onCancel && <button type="button" style={S.btnGhost} onClick={onCancel}>Cancel</button>}
        </div>
      </form>
    </div>
  );
}
