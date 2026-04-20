"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        const found = Array.isArray(data) ? data.find(p => p.id === id) : null;
        setProduct(found || null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  function handleAddToCart() {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <button onClick={() => router.back()}
          style={{ background: "none", border: "1px solid #333", color: "#aaa", padding: "8px 18px", borderRadius: 8, cursor: "pointer", fontSize: 13, marginBottom: 32 }}>
          ← Back
        </button>

        {loading ? (
          <div style={{ display: "flex", gap: 40 }}>
            <div style={{ width: 420, height: 420, borderRadius: 20, background: "#1a1a1a" }} />
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
              {[200, 120, 80, 60, 100].map((w, i) => (
                <div key={i} style={{ width: w, height: 20, background: "#1a1a1a", borderRadius: 8 }} />
              ))}
            </div>
          </div>
        ) : !product ? (
          <div style={{ textAlign: "center", paddingTop: 80 }}>
            <p style={{ fontSize: 64 }}>😕</p>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginTop: 16 }}>Product not found</h2>
            <button className="btn-primary" style={{ marginTop: 24 }} onClick={() => router.push("/")}>Go Home</button>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
            <div style={{ flex: "0 0 420px", maxWidth: "100%" }}>
              <div style={{ width: "100%", height: 420, borderRadius: 20, overflow: "hidden", border: "1px solid #2a2a2a", background: "#111" }}>
                <img src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"} alt={product.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  onError={e => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80"; }} />
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 280 }}>
              <span style={{
                display: "inline-block", marginBottom: 16,
                background: "rgba(34,197,94,0.12)", border: "1px solid rgba(34,197,94,0.3)",
                color: "#22c55e", fontSize: 12, fontWeight: 700,
                padding: "4px 12px", borderRadius: 20,
              }}>In Stock</span>
              <h1 style={{ fontSize: 34, fontWeight: 900, letterSpacing: "-1px", marginBottom: 12, lineHeight: 1.2 }}>{product.name}</h1>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 24 }}>
                <span style={{ fontSize: 36, fontWeight: 900, color: "var(--accent)" }}>{product.price}</span>
                <span style={{ fontSize: 18, color: "#666" }}>EGP</span>
              </div>

              <div style={{ background: "#161616", borderRadius: 12, padding: "16px 20px", marginBottom: 28, border: "1px solid #2a2a2a" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span style={{ color: "#666", fontSize: 14 }}>Availability</span>
                  <span style={{ color: product.stock > 0 ? "var(--accent)" : "#ef4444", fontWeight: 700, fontSize: 14 }}>
                    {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                  </span>
                </div>
              </div>

              {/* Qty */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
                <span style={{ color: "#aaa", fontSize: 14 }}>Qty:</span>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #333", borderRadius: 10, overflow: "hidden" }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 40, background: "#1a1a1a", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>−</button>
                  <span style={{ width: 44, textAlign: "center", fontWeight: 700, fontSize: 16 }}>{qty}</span>
                  <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{ width: 40, height: 40, background: "#1a1a1a", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>+</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={handleAddToCart}
                  style={{
                    flex: 1, fontSize: 15, padding: "14px 0",
                    background: added ? "#166534" : "var(--accent)",
                    color: "#000", fontWeight: 800, border: "none",
                    borderRadius: 10, cursor: "pointer", transition: "background 0.3s",
                  }}>
                  {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
                </button>
                <button style={{ padding: "14px 20px", borderRadius: 10, border: "1px solid #333", background: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>♡</button>
              </div>

              <div style={{ marginTop: 24, padding: "16px 20px", background: "#111", borderRadius: 12, border: "1px solid #1e1e1e" }}>
                <p style={{ fontSize: 13, color: "#555", lineHeight: 1.8 }}>
                  🚚 Free delivery on orders above 200 EGP<br />
                  🔄 Easy returns within 24 hours<br />
                  ✅ Quality guaranteed
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
