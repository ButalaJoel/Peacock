import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { S, msgStyle } from "./ui.js";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr("That email and password did not match. Please try again.");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "70px 24px" }}>
      <form onSubmit={submit} style={S.card}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>Staff sign in</h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>Peacock Paints website dashboard</p>
        {err && <div role="alert" style={msgStyle(false)}>{err}</div>}
        <label style={S.label} htmlFor="d-email">Email</label>
        <input id="d-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} style={S.input} />
        <label style={S.label} htmlFor="d-pass">Password</label>
        <input id="d-pass" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} style={S.input} />
        <button type="submit" disabled={busy} style={{ ...S.btn, marginTop: 22, width: "100%", opacity: busy ? .6 : 1 }}>{busy ? "Signing in..." : "Sign in"}</button>
      </form>
    </div>
  );
}
