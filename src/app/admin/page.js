"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Admin() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [stock, setStock] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    checkAuth();
    loadProducts();
  }, []);

  async function checkAuth() {
    const { data } = await supabase.auth.getUser();
    if (!data.user) router.push("/login");
  }

  async function loadProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  }

  async function addProduct() {
    if (!name || !price) return setMsg("Name and price are required");
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: Number(price), image, stock: Number(stock) }),
    });
    setName(""); setPrice(""); setImage(""); setStock("");
    setMsg("Product added! ✅");
    loadProducts();
    setTimeout(() => setMsg(""), 3000);
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await fetch("/api/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    loadProducts();
  }

  const inputStyle = {
    background: "#1a1a1a", border: "1px solid #333", color: "#fff",
    padding: "10px 14px", borderRadius: 8, fontSize: 14, outline: "none",
    width: "100%"
  };

  return (
    <div style={{ background: "#0f0f0f", minHeight: "100vh", padding: "32px 24px", color: "#fff" }}>
       <p style={{ textAlign: "center", marginTop: 20, color: "#22c55e", fontSize: 12 , fontWeight: 500, background: "#1a1a1a", display: "inline-block", padding: "8px 12px", borderRadius: 6  ,boxShadow: "rgb(114 229 101 / 20%) 0px 7px 29px 0px" }}>
          <Link href="/" style={{ color: "#22c55e", textDecoration: "none" }}>← Back to store</Link>
        </p>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
       
        <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 32 }}>Admin Dashboard 🛠️</h1>

        <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Add Product</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <input placeholder="Product Name" style={inputStyle} value={name} onChange={e => setName(e.target.value)} />
            <input placeholder="Price (EGP)" type="number" style={inputStyle} value={price} onChange={e => setPrice(e.target.value)} />
            <input placeholder="Image URL" style={inputStyle} value={image} onChange={e => setImage(e.target.value)} />
            <input placeholder="Stock Quantity" type="number" style={inputStyle} value={stock} onChange={e => setStock(e.target.value)} />
          </div>
          <button onClick={addProduct} style={{ marginTop: 16, background: "#22c55e", color: "#000", fontWeight: 700, padding: "10px 24px", borderRadius: 8, border: "none", cursor: "pointer", fontSize: 14 }}>
            + Add Product
          </button>
          {msg && <p style={{ marginTop: 12, color: "#22c55e", fontSize: 14 }}>{msg}</p>}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
          {products.map(p => (
            <div key={p.id} style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 14, overflow: "hidden" }}>
              <img src={p.image || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70"} alt={p.name}
                style={{ width: "100%", height: 160, objectFit: "cover" }}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=70"; }} />
              <div style={{ padding: "12px 16px" }}>
                <p style={{ fontWeight: 700, marginBottom: 4 }}>{p.name}</p>
                <p style={{ color: "#22c55e", fontWeight: 700 }}>{p.price} EGP</p>
                <p style={{ color: "#666", fontSize: 12 }}>Stock: {p.stock}</p>
                <button onClick={() => deleteProduct(p.id)} style={{ marginTop: 10, background: "#ef4444", color: "#fff", fontWeight: 700, padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 12, width: "100%" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
