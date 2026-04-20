"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

const SLIDES = [
  {
    title: "Fresh Groceries Delivered Fast",
    subtitle: "Top quality products from local farms straight to your door",
    cta: "Shop Now",
    bg: "linear-gradient(135deg, #064e3b 0%, #0f0f0f 60%)",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    badge: "🌿 100% Fresh",
  },
  {
    title: "Weekly Deals & Discounts",
    subtitle: "Save big on everyday essentials – limited time offers every week",
    cta: "See Deals",
    bg: "linear-gradient(135deg, #1e3a5f 0%, #0f0f0f 60%)",
    img: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80",
    badge: "🔥 Hot Deals",
  },
  {
    title: "Premium Bakery & Dairy",
    subtitle: "Freshly baked breads, pastries, and premium dairy products daily",
    cta: "Browse",
    bg: "linear-gradient(135deg, #4a1942 0%, #0f0f0f 60%)",
    img: "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?w=600&q=80",
    badge: "🥐 Fresh Baked",
  },
];

const CATEGORIES = [
  { name: "Fruits & Vegetables", icon: "🥦", color: "#14532d", img: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&q=70" },
  { name: "Dairy & Eggs", icon: "🥛", color: "#1e3a5f", img: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300&q=70" },
  { name: "Bakery", icon: "🍞", color: "#4a2c0a", img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&q=70" },
  { name: "Meat & Seafood", icon: "🥩", color: "#5f1e1e", img: "https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?w=300&q=70" },
  { name: "Beverages", icon: "🧃", color: "#1a3a4a", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=300&q=70" },
  { name: "Snacks", icon: "🍿", color: "#3a2a0a", img: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300&q=70" },
];

function ProductCard({ product, badge }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart(e) {
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div
      className="product-card"
      onClick={() => router.push(`/product/${product.id}`)}
      style={{ minWidth: 220, flex: "0 0 220px" }}
    >
      <div style={{ position: "relative", height: 180, background: "#111", overflow: "hidden" }}>
        <img
          src={product.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70"}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
          onMouseOver={e => e.target.style.transform = "scale(1.07)"}
          onMouseOut={e => e.target.style.transform = "scale(1)"}
          onError={e => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70"; }}
        />
        {/* Badge with glassmorphism backdrop */}
        {badge && (
          <span style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(34,197,94,0.4)",
            color: "#22c55e",
            fontSize: 11, fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 20,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}>{badge}</span>
        )}
      </div>
      <div style={{ padding: "14px 16px" }}>
        <p style={{ fontSize: 15, fontWeight: 700, color: "#f0f0f0", marginBottom: 6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {product.name}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)" }}>
            {product.price} <span style={{ fontSize: 12, fontWeight: 600 }}>EGP</span>
          </span>
          <span style={{ fontSize: 11, color: "#666", background: "#222", padding: "3px 8px", borderRadius: 6 }}>
            Stock: {product.stock}
          </span>
        </div>
        <button
          className="btn-primary"
          style={{
            width: "100%", fontSize: 13,
            background: added ? "#166534" : "var(--accent)",
            transition: "background 0.3s",
          }}
          onClick={handleAddToCart}
        >
          {added ? "✓ Added!" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}

function HScroll({ children }) {
  return (
    <div style={{ overflowX: "auto", paddingBottom: 16 }}
      onWheel={e => { e.currentTarget.scrollLeft += e.deltaY; }}>
      <div style={{ display: "flex", gap: 18, width: "max-content" }}>
        {children}
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(d => { setProducts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const t = setInterval(() => setSlide(s => (s + 1) % SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Slider */}
      <section id="slider" style={{ position: "relative", height: 480, overflow: "hidden" }}>
        {SLIDES.map((s, i) => (
          <div key={i} style={{
            position: "absolute", inset: 0,
            background: s.bg,
            display: "flex", alignItems: "center",
            padding: "0 60px",
            opacity: slide === i ? 1 : 0,
            transition: "opacity 0.7s ease",
            pointerEvents: slide === i ? "auto" : "none",
          }}>
            <div style={{ flex: 1, maxWidth: 520 }}>
              <span style={{
                display: "inline-block", marginBottom: 16,
                background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                border: "1px solid rgba(34,197,94,0.35)",
                color: "#22c55e", fontSize: 12, fontWeight: 700,
                padding: "5px 12px", borderRadius: 20, letterSpacing: "0.5px",
              }}>{s.badge}</span>
              <h1 style={{ fontSize: 42, fontWeight: 900, lineHeight: 1.15, letterSpacing: "-1px", marginBottom: 16 }}>{s.title}</h1>
              <p style={{ color: "#aaa", fontSize: 16, lineHeight: 1.6, marginBottom: 28 }}>{s.subtitle}</p>
              <button className="btn-primary" style={{ fontSize: 15, padding: "12px 28px" }}>{s.cta}</button>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
              <img src={s.img} alt="" style={{ height: 340, width: 420, objectFit: "cover", borderRadius: 20, boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}
                onError={e => e.target.style.display = "none"} />
            </div>
          </div>
        ))}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: slide === i ? 24 : 8, height: 8, borderRadius: 4,
              border: "none", background: slide === i ? "var(--accent)" : "#444",
              cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>
        <button onClick={() => setSlide(s => (s - 1 + SLIDES.length) % SLIDES.length)}
          style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>‹</button>
        <button onClick={() => setSlide(s => (s + 1) % SLIDES.length)}
          style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>›</button>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>

        {/* Categories */}
        <section id="categories" style={{ padding: "56px 0 40px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 24, letterSpacing: "-0.5px" }}>
            Shop by <span style={{ color: "var(--accent)" }}>Category</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {CATEGORIES.map(cat => (
              <div key={cat.name} style={{
                borderRadius: 16, overflow: "hidden", cursor: "pointer",
                border: "1px solid var(--border)", position: "relative", height: 140,
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
                onMouseOver={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.4)"; }}
                onMouseOut={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.45)" }}
                  onError={e => e.target.style.display = "none"} />
                <div style={{ position: "absolute", inset: 0, background: `${cat.color}99`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <span style={{ fontSize: 28 }}>{cat.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, textAlign: "center", padding: "0 8px" }}>{cat.name}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section id="new-arrivals" style={{ padding: "40px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px" }}>
              New <span style={{ color: "var(--accent)" }}>Arrivals</span>
            </h2>
            <span style={{ color: "var(--accent)", fontSize: 13, cursor: "pointer" }}>View all →</span>
          </div>
          {loading ? (
            <div style={{ display: "flex", gap: 18 }}>
              {[...Array(4)].map((_, i) => (
                <div key={i} style={{ minWidth: 220, height: 300, borderRadius: 16, background: "#1a1a1a" }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "40px 0", color: "#555", textAlign: "center" }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>📦</p>
              <p>No products yet. Add some from the admin panel!</p>
            </div>
          ) : (
            <HScroll>
              {products.slice(0, 8).map((p, i) => (
                <ProductCard key={p.id} product={p} badge={i < 3 ? "New" : null} />
              ))}
            </HScroll>
          )}
        </section>

        {/* All Products */}
        <section id="all-products" style={{ padding: "40px 0 60px" }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px", marginBottom: 24 }}>
            All <span style={{ color: "var(--accent)" }}>Products</span>
          </h2>
          {loading ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {[...Array(8)].map((_, i) => (
                <div key={i} style={{ height: 300, borderRadius: 16, background: "#1a1a1a" }} />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div style={{ padding: "40px 0", color: "#555", textAlign: "center" }}>
              <p style={{ fontSize: 48, marginBottom: 12 }}>🛒</p>
              <p>Your store is empty. Add products from the admin panel!</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 20 }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer */}
      <footer style={{ background: "#0a0a0a", borderTop: "1px solid var(--border)", padding: "40px 24px 24px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 900, color: "#000" }}>S</div>
                <span style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>Smart<span style={{ color: "var(--accent)" }}>Biz</span></span>
              </div>
              <p style={{ color: "#555", fontSize: 13, maxWidth: 240 }}>Your neighborhood supermarket, now online.</p>
            </div>
            <div style={{ display: "flex", gap: 48 }}>
              <div>
                <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Shop</p>
                {["All Products", "New Arrivals", "Deals", "Categories"].map(l => (
                  <p key={l} style={{ color: "#555", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</p>
                ))}
              </div>
              <div>
                <p style={{ fontWeight: 700, marginBottom: 12, fontSize: 14 }}>Help</p>
                {["Contact", "Shipping", "Returns", "FAQ"].map(l => (
                  <p key={l} style={{ color: "#555", fontSize: 13, marginBottom: 8, cursor: "pointer" }}>{l}</p>
                ))}
              </div>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 20, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <p style={{ color: "#444", fontSize: 12 }}>© 2025 SmartBiz. All rights reserved.</p>
            <p style={{ color: "#444", fontSize: 12 }}>Built with <span style={{color: "#22c55e", fontSize: 12}}>MO</span> for fresh shopping</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
