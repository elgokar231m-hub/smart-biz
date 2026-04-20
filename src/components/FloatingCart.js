"use client";
import { useCart } from "@/context/CartContext";

export default function FloatingCart() {
  const { items, removeFromCart, updateQty, total, count, open, setOpen, clearCart } = useCart();

  return (
    <>
      {/* Floating Cart Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: "fixed", bottom: 28, right: 28, zIndex: 200,
          width: 60, height: 60, borderRadius: "50%",
          background: "var(--accent)", border: "none",
          cursor: "pointer", fontSize: 24,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(34,197,94,0.5)"; }}
        onMouseOut={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(34,197,94,0.35)"; }}
      >
        🛒
        {count > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4,
            background: "#ef4444", color: "#fff",
            fontSize: 11, fontWeight: 900,
            width: 22, height: 22, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #0f0f0f",
          }}>{count}</span>
        )}
      </button>

      {/* Backdrop */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, zIndex: 199,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
          }}
        />
      )}

      {/* Cart Drawer */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0,
        width: 380, zIndex: 200,
        background: "#161616",
        borderLeft: "1px solid #2a2a2a",
        transform: open ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #2a2a2a",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Your Cart</h2>
            <p style={{ color: "#666", fontSize: 13, marginTop: 2 }}>{count} item{count !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{ background: "#222", border: "none", color: "#aaa", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}
          >×</button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          {items.length === 0 ? (
            <div style={{ textAlign: "center", paddingTop: 60 }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>🛒</p>
              <p style={{ color: "#555", fontSize: 14 }}>Your cart is empty</p>
              <p style={{ color: "#444", fontSize: 12, marginTop: 6 }}>Add some products to get started</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} style={{
                display: "flex", gap: 14, alignItems: "center",
                padding: "14px 0",
                borderBottom: "1px solid #1e1e1e",
              }}>
                <img
                  src={item.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60"}
                  alt={item.name}
                  style={{ width: 60, height: 60, borderRadius: 10, objectFit: "cover", background: "#111" }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&q=60"; }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f0f0", marginBottom: 4 }}>{item.name}</p>
                  <p style={{ fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>{item.price} EGP</p>
                  {/* Qty controls */}
                  <div style={{ display: "flex", alignItems: "center", gap: 0, marginTop: 8, border: "1px solid #2a2a2a", borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
                    <button onClick={() => updateQty(item.id, item.qty - 1)}
                      style={{ width: 30, height: 28, background: "#1a1a1a", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>−</button>
                    <span style={{ width: 32, textAlign: "center", fontSize: 13, fontWeight: 700 }}>{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)}
                      style={{ width: 30, height: 28, background: "#1a1a1a", border: "none", color: "#fff", cursor: "pointer", fontSize: 16 }}>+</button>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <p style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>{(item.price * item.qty).toFixed(0)} EGP</p>
                  <button onClick={() => removeFromCart(item.id)}
                    style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#ef4444", padding: "4px 10px", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "20px 24px", borderTop: "1px solid #2a2a2a" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{ color: "#aaa", fontSize: 15 }}>Total</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: "#fff" }}>{total.toFixed(0)} <span style={{ fontSize: 13, color: "#666" }}>EGP</span></span>
            </div>
            <button
              style={{
                width: "100%", background: "var(--accent)", color: "#000",
                fontWeight: 800, padding: "14px 0", borderRadius: 12,
                border: "none", cursor: "pointer", fontSize: 15,
                marginBottom: 10,
              }}
            >
              Checkout →
            </button>
            <button onClick={clearCart}
              style={{
                width: "100%", background: "transparent", color: "#555",
                fontWeight: 600, padding: "10px 0", borderRadius: 12,
                border: "1px solid #222", cursor: "pointer", fontSize: 13,
              }}
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
