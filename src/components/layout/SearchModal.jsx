import { CloseIcon } from "../icons/Icons.jsx";
import { useApp } from "../../context/useApp.js";

export default function SearchModal() {
  const { searchOpen, setSearchOpen } = useApp();
  return (
    <>
      {searchOpen && (<div className="so" onClick={() => setSearchOpen(false)}><div style={{ background: "#fff", borderRadius: 8, padding: 32, width: 600, maxWidth: "90vw", boxShadow: "0 20px 60px rgba(0,0,0,.2)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h3 style={{ fontSize: 18, fontWeight: 600 }}>Search</h3><button onClick={() => setSearchOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><CloseIcon /></button></div>
        <input className="si" placeholder="Search colours, paints, inspiration..." autoFocus />
      </div></div>)}
    </>
  );
}
