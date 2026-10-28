import { B } from "../../data/theme.js";
import { trendingColours } from "../../data/colours.js";
import { CloseIcon } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, removeFromCart, cartCount } = useApp();
  return (
    <>
      {cartOpen && (<>
        <div className="mo" onClick={() => setCartOpen(false)} />
        <div className="cart-drawer">
          <div style={{ padding: "20px 24px", borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600 }}>Your Cart ({cartCount})</h3>
            <button onClick={() => setCartOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button>
          </div>
          {cart.length === 0 ? (
            <div style={{ padding: "60px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 48, marginBottom: 16, opacity: .3 }}>🛒</div>
              <p style={{ fontSize: 15, color: "#999" }}>Your cart is empty</p>
              <button onClick={() => setCartOpen(false)} className="btn bp" style={{ marginTop: 20 }}>Continue Shopping</button>
            </div>
          ) : (<>
            <div style={{ padding: "16px 24px", flex: 1 }}>
              {cart.map((item, i) => {
                const colourData = item.colour ? trendingColours.find(c => c.name === item.colour) : null;
                return (
                <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 64, height: 64, background: B.off, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, position: "relative" }}>
                    {item.product.img ? <img src={item.product.img} alt="" style={{ maxHeight: 54, maxWidth: 54, objectFit: "contain" }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: colourData?.color || B.coral, border: "2px solid #fff", boxShadow: "0 2px 8px rgba(0,0,0,.12)" }} />}
                    {colourData && <div style={{ position: "absolute", bottom: -4, right: -4, width: 22, height: 22, borderRadius: "50%", background: colourData.color, border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.15)" }} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{item.product.name}</h4>
                    {item.colour && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        {colourData && <div style={{ width: 14, height: 14, borderRadius: "50%", background: colourData.color, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />}
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#555" }}>{item.colour}</span>
                      </div>
                    )}
                    <p style={{ fontSize: 12, color: "#999" }}>{item.size} × {item.qty}</p>
                    
                  </div>
                  <button onClick={() => removeFromCart(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "#ccc", fontSize: 18, alignSelf: "flex-start" }}>×</button>
                </div>
              );})}
            </div>
            <div style={{ padding: "20px 24px", borderTop: "2px solid #eee" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                <span style={{ fontSize: 16, fontWeight: 600 }}>Items in your list</span>
                <span style={{ fontSize: 20, fontWeight: 700, color: B.coral }}>{cartCount}</span>
              </div>
              <p style={{ fontSize: 13, color: "#777", marginBottom: 12, lineHeight: 1.5 }}>Submit your list and our sales team will send you a quotation.</p>
              <button className="btn bp" style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: 15 }}>Request a Quote</button>
            </div>
          </>)}
        </div>
      </>)}
    </>
  );
}
