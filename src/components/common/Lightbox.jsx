import { useEffect } from "react";

// Full-screen image viewer. images = [{ src, alt }], index = which one is open, null = closed.
export default function Lightbox({ images, index, onChange }) {
  const open = index !== null && index !== undefined && images[index];
  useEffect(() => {
    if (!open) return undefined;
    const onKey = e => {
      if (e.key === "Escape") onChange(null);
      else if (e.key === "ArrowRight") onChange((index + 1) % images.length);
      else if (e.key === "ArrowLeft") onChange((index - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length, onChange]);
  if (!open) return null;
  const btn = { position: "absolute", background: "rgba(255,255,255,.15)", color: "#fff", border: "none", width: 44, height: 44, borderRadius: "50%", fontSize: 22, cursor: "pointer", fontFamily: "inherit" };
  return (
    <div role="dialog" aria-modal="true" aria-label="Image viewer" onClick={() => onChange(null)}
      style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,.88)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <img src={images[index].src} alt={images[index].alt || ""} onClick={e => e.stopPropagation()} style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", borderRadius: 8 }} />
      <button onClick={() => onChange(null)} aria-label="Close" style={{ ...btn, top: 20, right: 20 }}>&#215;</button>
      {images.length > 1 && <button onClick={e => { e.stopPropagation(); onChange((index - 1 + images.length) % images.length); }} aria-label="Previous image" style={{ ...btn, left: 20, top: "50%" }}>&#8592;</button>}
      {images.length > 1 && <button onClick={e => { e.stopPropagation(); onChange((index + 1) % images.length); }} aria-label="Next image" style={{ ...btn, right: 20, top: "50%" }}>&#8594;</button>}
    </div>
  );
}
