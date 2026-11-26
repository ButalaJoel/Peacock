import { useState } from "react";
import { supabase } from "../lib/supabase.js";
import { S, msgStyle } from "./ui.js";

export default function Login() {
  const [mode, setMode] = useState("signin"); // "signin" | "forgot"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState(null);
  const [busy, setBusy] = useState(false);

  async function signIn(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setMsg({ ok: false, text: "That email and password did not match. Please try again." });
  }

  async function sendReset(e) {
    e.preventDefault();
    setBusy(true); setMsg(null);
    // The link brings the person back to the dashboard, which then asks for a new password.
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: window.location.origin + "/dashboard" });
    setBusy(false);
    // Same answer whether or not the email has an account, so the form can't be used to find staff emails.
    setMsg({ ok: true, text: "If that email belongs to a staff account, a reset link is on its way. Check the inbox (and spam) in a few minutes." });
  }

  const switchTo = m => { setMode(m); setMsg(null); setPassword(""); };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "70px 24px" }}>
      <form onSubmit={mode === "signin" ? signIn : sendReset} style={S.card}>
        <h1 style={{ fontSize: 24, marginBottom: 4 }}>{mode === "signin" ? "Staff sign in" : "Reset your password"}</h1>
        <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
          {mode === "signin" ? "Peacock Paints website dashboard" : "Enter your staff email and we'll send you a link to set a new password."}
        </p>
        {msg && <div role={msg.ok ? "status" : "alert"} style={msgStyle(msg.ok)}>{msg.text}</div>}
        <label style={S.label} htmlFor="d-email">Email</label>
        <input id="d-email" type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} style={S.input} />
        {mode === "signin" && (
          <>
            <label style={S.label} htmlFor="d-pass">Password</label>
            <input id="d-pass" type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} style={S.input} />
          </>
        )}
        <button type="submit" disabled={busy} style={{ ...S.btn, marginTop: 22, width: "100%", opacity: busy ? .6 : 1 }}>
          {busy ? "Please wait..." : mode === "signin" ? "Sign in" : "Send reset link"}
        </button>
        <button type="button" onClick={() => switchTo(mode === "signin" ? "forgot" : "signin")}
          style={{ marginTop: 14, background: "none", border: "none", color: "#555", fontSize: 14, textDecoration: "underline", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
          {mode === "signin" ? "Forgot your password?" : "Back to sign in"}
        </button>
      </form>
    </div>
  );
}
