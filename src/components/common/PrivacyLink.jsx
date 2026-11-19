import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";

// One-line notice shown beside every form that collects personal details.
export default function PrivacyLink({ dark = false }) {
  const { nav, makeHref, setQuoteOpen } = useApp();
  const go = e => { e.preventDefault(); if (setQuoteOpen) setQuoteOpen(false); nav("privacy"); };
  return (
    <p style={{ fontSize: 12, color: dark ? "rgba(255,255,255,.75)" : "#777", marginTop: 10, lineHeight: 1.6 }}>
      We use your details only to reply to you. Read our <a href={makeHref("privacy")} onClick={go} style={{ color: dark ? "#fff" : B.coral, textDecoration: "underline" }}>privacy notice</a>.
    </p>
  );
}
