import { useState } from "react";
import { B } from "../data/theme.js";
import { trendingColours } from "../data/colours.js";
import { ROOM_META } from "../data/inspirations.js";

const RoomInspirationPage = ({ roomName, inspirations, onBack, nav, onAddSample, onAddSampleBundle }) => {
  const [selected, setSelected] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const meta = ROOM_META[roomName] || {};

  const openDetail = (item) => { setSelected(item); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const back = () => { setSelected(null); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const otherRooms = Object.entries(ROOM_META).filter(([name]) => name !== roomName).map(([name, m]) => ({
    name, slug: m.slug,
    bg: name === "Bedroom" ? "linear-gradient(135deg, #2d4a3e, #1a3a5c)" : name === "Living Room" ? "linear-gradient(135deg, #c87856, #a05040)" : name === "Dining Room" ? "linear-gradient(135deg, #7E2038, #3E5030)" : name === "Kitchen" ? "linear-gradient(135deg, #2d6b4f, #1a4a3a)" : "linear-gradient(135deg, #1a4a5e, #2868a8)",
    hasPage: !!({ "Bedroom": true, "Living Room": true, "Dining Room": true, "Kitchen": true, "Bathroom": true })[name],
  }));

  if (selected) {
    return (
      <div>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px" }}>
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#999" }}>
            <span onClick={onBack} style={{ color: B.coral, cursor: "pointer" }}>Home</span>
            <span>/</span><span onClick={back} style={{ color: B.coral, cursor: "pointer" }}>{roomName} Inspiration</span>
            <span>/</span><span style={{ color: "#333" }}>{selected.title}</span>
          </div>
        </div>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "16px 24px 60px" }}>
          {/* Hero Image */}
          <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 40, cursor: "pointer" }} onClick={() => setLightbox(selected.img)}>
            <img src={selected.img} alt={selected.title} style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }} />
          </div>

          <div className="g2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
            {/* Left: Details */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <div style={{ width: 48, height: 48, borderRadius: "50%", background: selected.colorHex, border: "3px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.15)" }} />
                <div>
                  <span style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600 }}>{selected.style}</span>
                  <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 700, lineHeight: 1.2 }}>{selected.title}</h1>
                </div>
              </div>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: "#555", marginBottom: 32 }}>{selected.desc}</p>

              {/* Colour Used */}
              <div style={{ background: B.off, borderRadius: 12, padding: "20px 24px", marginBottom: 32, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 56, height: 56, borderRadius: 12, background: selected.colorHex, flexShrink: 0, boxShadow: "inset 0 2px 4px rgba(0,0,0,.1)" }} />
                <div>
                  <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 1, color: "#999", marginBottom: 2 }}>Featured Colour</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{selected.color}</div>
                </div>
                <button className="btn bp" onClick={() => {
                  const colourName = selected.color.replace(/®/g, "").trim();
                  const match = trendingColours.find(c => c.name === colourName);
                  if (match) onAddSample(match.name);
                }} style={{ marginLeft: "auto", fontSize: 12, padding: "10px 20px" }}>Order Sample</button>
              </div>

              {/* Recommended Products */}
              <div style={{ marginBottom: 32 }}>
                <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 16, color: "#333" }}>Recommended Products</h3>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  {selected.products.map((p, i) => (
                    <span key={i} style={{ padding: "10px 20px", borderRadius: 8, background: "#fff", border: "1px solid #e0e0e0", fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all .2s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = B.coral; e.currentTarget.style.color = B.coral; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "#e0e0e0"; e.currentTarget.style.color = "#1a1a1a"; }}>
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Tips */}
            <div>
              <div style={{ background: `linear-gradient(135deg, ${selected.colorHex}18, ${selected.colorHex}08)`, borderRadius: 16, padding: 32, border: `1px solid ${selected.colorHex}30` }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Styling Tips</h3>
                {selected.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < selected.tips.length - 1 ? 20 : 0 }}>
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: selected.colorHex, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ fontSize: 15, lineHeight: 1.7, color: "#555" }}>{tip}</p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div style={{ marginTop: 24, background: B.black, borderRadius: 16, padding: 32, color: "#fff", textAlign: "center" }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, marginBottom: 8 }}>Love this look?</h3>
                <p style={{ fontSize: 14, opacity: .7, marginBottom: 20 }}>Get colour samples delivered to your door</p>
                <button className="btn bp" onClick={onAddSampleBundle} style={{ fontSize: 14 }}>Order Samples</button>
              </div>
            </div>
          </div>

          {/* More Inspiration */}
          <div style={{ marginTop: 60, paddingTop: 40, borderTop: "1px solid #e8e4de" }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 600, marginBottom: 24 }}>More {roomName.toLowerCase()} looks</h2>
            <div className="g3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
              {inspirations.filter(x => x.id !== selected.id).slice(0, 3).map(item => (
                <div key={item.id} onClick={() => openDetail(item)} style={{ borderRadius: 12, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                  <img src={item.img} alt={item.title} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                  <div style={{ padding: 16, background: "#fff", border: "1px solid #eee", borderTop: "none", borderRadius: "0 0 12px 12px" }}>
                    <h4 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>{item.title}</h4>
                    <p style={{ fontSize: 13, color: "#777" }}>{item.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out", padding: 40 }}>
            <img src={lightbox} alt="" style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 8 }} />
          </div>
        )}
      </div>
    );
  }

  // Gallery view
  const roomLower = roomName.toLowerCase();
  return (
    <div>
      {/* Hero Banner */}
      <section style={{ background: meta.gradient, padding: "80px 0 60px", color: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
          <p style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: 3, marginBottom: 16, opacity: .8 }}>Inspiration / By Room</p>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 48, fontWeight: 700, marginBottom: 16 }}>{roomName} Inspiration</h1>
          <p style={{ fontSize: 20, opacity: .9, fontWeight: 300 }}>{meta.subtitle}</p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#1a1a1a", color: "#fff", padding: "28px 0" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[{ n: String(inspirations.length), l: "Curated Looks" }, { n: "80+", l: "Colours Available" }, { n: "Free", l: "Colour Samples" }].map((s, i) => (
            <div key={i}><div style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 700, color: B.coral }}>{s.n}</div><div style={{ fontSize: 12, opacity: .7, textTransform: "uppercase", letterSpacing: 1 }}>{s.l}</div></div>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ marginBottom: 40 }}>
          <h2 className="st" style={{ marginBottom: 8 }}>Curated {roomLower} looks</h2>
          <p style={{ fontSize: 15, color: "#666" }}>Click any look for colour details, styling tips, and product recommendations</p>
        </div>

        {/* Featured (first two items large) */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 20, marginBottom: 20 }}>
          <div onClick={() => openDetail(inspirations[0])} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <img src={inspirations[0].img} alt={inspirations[0].title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
              <span style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: 2, color: B.coral, fontWeight: 600 }}>Featured</span>
              <h3 style={{ color: "#fff", fontSize: 24, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{inspirations[0].title}</h3>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{inspirations[0].subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: inspirations[0].colorHex, border: "2px solid #fff" }} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{inspirations[0].color}</span>
              </div>
            </div>
          </div>
          <div onClick={() => openDetail(inspirations[1])} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
            onMouseEnter={e => e.currentTarget.style.transform = "scale(1.01)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
            <img src={inspirations[1].img} alt={inspirations[1].title} style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "24px 28px" }}>
              <h3 style={{ color: "#fff", fontSize: 22, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{inspirations[1].title}</h3>
              <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14 }}>{inspirations[1].subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: inspirations[1].colorHex, border: "2px solid #fff" }} />
                <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>{inspirations[1].color}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Remaining items */}
        {inspirations.length > 2 && (
          <div className="g3" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(inspirations.length - 2, 3)}, 1fr)`, gap: 20 }}>
            {inspirations.slice(2).map(item => (
              <div key={item.id} onClick={() => openDetail(item)} style={{ position: "relative", borderRadius: 16, overflow: "hidden", cursor: "pointer", transition: "transform .3s" }}
                onMouseEnter={e => e.currentTarget.style.transform = "scale(1.02)"} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <img src={item.img} alt={item.title} style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,.7) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 24px" }}>
                  <h3 style={{ color: "#fff", fontSize: 18, fontFamily: "'Playfair Display', serif", fontWeight: 600, marginBottom: 4 }}>{item.title}</h3>
                  <p style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>{item.subtitle}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: item.colorHex, border: "2px solid #fff" }} />
                    <span style={{ color: "#fff", fontSize: 12, fontWeight: 500 }}>{item.color}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Browse Other Rooms */}
      <section style={{ background: B.warm, padding: "60px 0" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, textAlign: "center", marginBottom: 36 }}>Explore other rooms</h2>
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${otherRooms.length}, 1fr)`, gap: 20 }}>
            {otherRooms.map((room, i) => (
              <div key={i} onClick={() => { if (room.hasPage) nav(room.slug); }} style={{ background: room.bg, borderRadius: 12, padding: 28, color: "#fff", cursor: room.hasPage ? "pointer" : "default", transition: "transform .3s", minHeight: 120, display: "flex", flexDirection: "column", justifyContent: "flex-end", opacity: room.hasPage ? 1 : .7 }}
                onMouseEnter={e => { if (room.hasPage) e.currentTarget.style.transform = "translateY(-4px)"; }} onMouseLeave={e => e.currentTarget.style.transform = ""}>
                <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>{room.name}</h3>
                <p style={{ fontSize: 13, opacity: .8 }}>{room.hasPage ? "View inspiration" : "Coming soon"}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default RoomInspirationPage;
