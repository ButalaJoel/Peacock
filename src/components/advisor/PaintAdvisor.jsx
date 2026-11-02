import { useEffect, useMemo, useRef, useState } from "react";
import { useApp } from "../../context/useApp.js";
import { B } from "../../data/theme.js";
import { PRODUCTS } from "../../data/products.js";
import { CONTACT } from "../../config/contact.js";
import { BUSINESS } from "../../config/business.js";
import { whatsappReady, whatsappUrl } from "../../utils/messaging.js";
import { createAdvisor, START_CHIPS } from "../../utils/advisor.js";

// Floating chat helper. It answers only from the catalogue (see utils/advisor.js). No AI model, no prices.
export default function PaintAdvisor() {
  const { nav, openProduct, addToCart, setQuoteOpen } = useApp();
  const advisor = useMemo(() => createAdvisor(PRODUCTS, { contact: CONTACT, business: BUSINESS }), []);
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(() => [{ role: "bot", ...advisor.greeting() }]);
  const logRef = useRef(null);
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [voiceNote, setVoiceNote] = useState("");
  const [speak, setSpeak] = useState(false);
  const SR = typeof window !== "undefined" ? (window.SpeechRecognition || window.webkitSpeechRecognition) : null;
  const canSpeak = typeof window !== "undefined" && "speechSynthesis" in window;
  const waOk = whatsappReady(CONTACT.whatsappNumber);

  useEffect(() => { if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight; }, [messages, open]);

  const stopSpeaking = () => { try { if (canSpeak) window.speechSynthesis.cancel(); } catch { /* ignore */ } };
  const say = (t, force) => {
    if (!(speak || force) || !canSpeak) return;
    try { stopSpeaking(); const u = new SpeechSynthesisUtterance(String(t || "").replace(/\s+/g, " ")); u.lang = "en-GB"; window.speechSynthesis.speak(u); } catch { /* ignore */ }
  };
  const stopListening = () => { try { if (recRef.current) recRef.current.abort(); } catch { /* ignore */ } recRef.current = null; setListening(false); };
  useEffect(() => () => { try { if (recRef.current) recRef.current.abort(); if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); } catch { /* ignore */ } }, []);

  const send = (raw, forceSpeak) => {
    const q = String(raw || "").trim();
    if (!q) return;
    const answer = advisor.reply(q);
    say(answer.text, forceSpeak);
    setMessages(m => m.concat([{ role: "user", text: q }, { role: "bot", ...answer }]));
    setText("");
  };

  const startListening = () => {
    if (!SR) return;
    if (listening) { stopListening(); return; }
    stopSpeaking();
    setVoiceNote("");
    try {
      const rec = new SR();
      rec.lang = "en-GB";
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      let finalText = "";
      rec.onresult = e => {
        let interim = "";
        for (let i = e.resultIndex; i < e.results.length; i++) {
          const t = e.results[i][0].transcript;
          if (e.results[i].isFinal) finalText += t; else interim += t;
        }
        setText((finalText + interim).trim());
      };
      rec.onerror = e => {
        setListening(false);
        if (e.error === "not-allowed" || e.error === "service-not-allowed") setVoiceNote("The microphone is blocked. Allow it in your browser's site settings, then try again.");
        else if (e.error === "no-speech") setVoiceNote("I didn't hear anything. Tap the microphone and try again.");
        else if (e.error !== "aborted") setVoiceNote("Voice input is not working right now. You can type your question.");
      };
      rec.onend = () => { setListening(false); recRef.current = null; if (finalText.trim()) { setSpeak(true); send(finalText, true); } };
      recRef.current = rec;
      rec.start();
      setListening(true);
    } catch { setListening(false); setVoiceNote("Voice input is not available here. You can type your question."); }
  };

  const runAction = a => {
    if (a.type === "page") nav(a.page);
    else if (a.type === "quote") setQuoteOpen(true);
    else if (a.type === "product") { const p = advisor.byId[a.id]; if (p) openProduct(p); }
    else if (a.type === "link") window.open(a.href, "_blank", "noopener");
    else if (a.type === "whatsapp") window.open(whatsappUrl(CONTACT.whatsappNumber, "Hello Peacock Paints, I have a question."), "_blank", "noopener");
  };

  const addToQuote = p => {
    addToCart({ product: p, size: p.packSizes[0], qty: 1 });
    setMessages(m => m.concat([{ role: "bot", text: p.name + " (" + p.packSizes[0] + ") is on your quote list. Change the size or quantity when you request your quote.", products: [], actions: [{ type: "quote", label: "Request a quote" }] }]));
  };

  const shortLine = p => [p.coverage ? "Coverage " + p.coverage : null, p.packSizes && p.packSizes.length ? p.packSizes.join(", ") : null].filter(Boolean).join(" · ");
  const first = s => { const t = String(s || ""); const i = t.search(/[.!?](\s|$)/); return i > 20 ? t.slice(0, i + 1) : t; };
  const chipLast = messages[messages.length - 1];
  const chips = chipLast && chipLast.role === "bot" && chipLast.chips && chipLast.chips.length ? chipLast.chips : (messages.length <= 1 ? START_CHIPS : []);
  const pill = { border: "1px solid " + B.coral, color: B.coral, background: "#fff", borderRadius: 20, padding: "7px 14px", fontSize: 13, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 };

  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} aria-label="Open the Paint Advisor"
          style={{ position: "fixed", right: 20, bottom: 20, zIndex: 850, background: B.coral, color: "#fff", border: "none", borderRadius: 40, padding: "14px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 26px rgba(0,0,0,.25)", fontFamily: "inherit" }}>
          Paint Advisor
        </button>
      )}
      {open && (
        <div role="dialog" aria-label="Paint Advisor" style={{ position: "fixed", right: 20, bottom: 20, zIndex: 850, width: 380, maxWidth: "calc(100vw - 24px)", height: 560, maxHeight: "calc(100vh - 40px)", background: "#fff", borderRadius: 18, boxShadow: "0 14px 50px rgba(0,0,0,.28)", display: "flex", flexDirection: "column", overflow: "hidden", border: "1px solid #eee" }}>
          <div style={{ background: B.coral, color: "#fff", padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Paint Advisor</div>
              <div style={{ fontSize: 12, opacity: .9 }}>Answers from the Peacock catalogue</div>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              {canSpeak && <button onClick={() => { if (speak) stopSpeaking(); setSpeak(!speak); }} aria-pressed={speak} aria-label={speak ? "Turn read-aloud off" : "Turn read-aloud on"} title={speak ? "Read-aloud is on" : "Read answers aloud"} style={{ background: speak ? "#fff" : "rgba(255,255,255,.2)", color: speak ? B.coral : "#fff", border: "none", height: 32, padding: "0 12px", borderRadius: 16, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>{speak ? "Voice on" : "Voice off"}</button>}
            <button onClick={() => { stopListening(); stopSpeaking(); setOpen(false); }} aria-label="Close the Paint Advisor" style={{ background: "rgba(255,255,255,.2)", color: "#fff", border: "none", width: 32, height: 32, borderRadius: "50%", fontSize: 18, cursor: "pointer", fontFamily: "inherit" }}>&#215;</button>
            </div>
          </div>

          <div ref={logRef} role="log" aria-live="polite" style={{ flex: 1, overflowY: "auto", padding: 16, background: "#faf8f5" }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: m.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div style={{ maxWidth: "88%", background: m.role === "user" ? B.coral : "#fff", color: m.role === "user" ? "#fff" : "#222", border: m.role === "user" ? "none" : "1px solid #eee", borderRadius: 14, padding: "10px 14px", fontSize: 14, lineHeight: 1.6, whiteSpace: "pre-line" }}>{m.text}</div>
                {m.role === "bot" && (m.products || []).map(id => {
                  const p = advisor.byId[id];
                  if (!p) return null;
                  return (
                    <div key={id} style={{ width: "88%", background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 10, marginTop: 8, display: "flex", gap: 10 }}>
                      {p.img && <img src={p.img} alt="" loading="lazy" style={{ width: 54, height: 54, objectFit: "contain", flexShrink: 0, background: "#fff" }} />}
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: "#666", lineHeight: 1.5, margin: "2px 0 4px" }}>{first(p.desc)}</div>
                        {shortLine(p) && <div style={{ fontSize: 12, color: "#999", marginBottom: 6 }}>{shortLine(p)}</div>}
                        <div style={{ display: "flex", gap: 14 }}>
                          <button onClick={() => openProduct(p)} style={{ background: "none", border: "none", padding: 0, color: B.coral, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>View</button>
                          <button onClick={() => addToQuote(p)} style={{ background: "none", border: "none", padding: 0, color: "#444", fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}>Add to quote</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {m.role === "bot" && m.note && <div style={{ maxWidth: "88%", fontSize: 12, color: "#888", marginTop: 6, lineHeight: 1.5 }}>{m.note}</div>}
                {m.role === "bot" && (m.actions || []).length > 0 && (
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8, maxWidth: "92%" }}>
                    {m.actions.filter(a => a.type !== "whatsapp" || waOk).map((a, k) => <button key={k} onClick={() => runAction(a)} style={pill}>{a.label}</button>)}
                  </div>
                )}
              </div>
            ))}
            {chips.length > 0 && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {chips.map(c => <button key={c} onClick={() => send(c)} style={pill}>{c}</button>)}
              </div>
            )}
          </div>

          <form onSubmit={e => { e.preventDefault(); send(text); }} style={{ display: "flex", gap: 8, padding: 12, borderTop: "1px solid #eee", background: "#fff" }}>
            {SR && <button type="button" onClick={startListening} aria-pressed={listening} aria-label={listening ? "Stop listening" : "Speak your question"} title={listening ? "Listening... tap to stop" : "Speak your question"} style={{ width: 42, height: 42, borderRadius: "50%", border: "1px solid " + (listening ? B.coral : "#ddd"), background: listening ? B.coral : "#fff", color: listening ? "#fff" : "#444", cursor: "pointer", fontSize: 18, flexShrink: 0, fontFamily: "inherit" }}>{listening ? "\u25A0" : "\uD83C\uDFA4"}</button>}
            <input value={text} onChange={e => setText(e.target.value)} placeholder={listening ? "Listening..." : "Ask about a product or surface"} aria-label="Your question" maxLength={300}
              style={{ flex: 1, padding: "11px 16px", borderRadius: 24, border: "1px solid #ddd", fontSize: 14, fontFamily: "inherit", minWidth: 0 }} />
            <button type="submit" className="btn bp" style={{ background: B.coral, padding: "0 20px" }}>Send</button>
          </form>
          {(voiceNote || SR) && <div style={{ padding: "0 14px 10px", fontSize: 11, color: voiceNote ? "#c0392b" : "#aaa", lineHeight: 1.5, background: "#fff" }}>{voiceNote || "Voice uses your browser's speech recognition. In Chrome the audio is processed by Google."}</div>}
        </div>
      )}
    </>
  );
}
