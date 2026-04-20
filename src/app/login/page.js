"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin() {
    if (!email || !password) return setError("Please fill in all fields");
    setLoading(true);
    setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) {
      setError("Invalid email or password. Please try again.");
    } else {
      router.push("/admin");
    }
  }

  const inputStyle = {
    width: "100%",
    background: "#1a1a1a",
    border: "1px solid #2a2a2a",
    color: "#fff",
    padding: "13px 16px",
    borderRadius: 10,
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      {/* Background glow */}
      <div style={{
        position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)",
        width: 500, height: 300,
        background: "radial-gradient(ellipse, rgba(34,197,94,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 900, color: "#000"
            }}>S</div>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>
              Smart<span style={{ color: "var(--accent)" }}>Biz</span>
            </span>
          </Link>
          <p style={{ color: "#555", fontSize: 14, marginTop: 8 }}>Sign in to your account</p>
        </div>

        {/* Card */}
        <div style={{
          background: "#161616",
          border: "1px solid #2a2a2a",
          borderRadius: 20,
          padding: 36,
        }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, color: "#fff" }}>Welcome back</h1>

          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 8, fontWeight: 600 }}>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              style={inputStyle}
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#22c55e"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 8, fontWeight: 600 }}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              style={inputStyle}
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={e => e.target.style.borderColor = "#22c55e"}
              onBlur={e => e.target.style.borderColor = "#2a2a2a"}
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          {error && (
            <div style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.3)",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 20,
              color: "#ef4444",
              fontSize: 13,
            }}>
              ⚠️ {error}
            </div>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              width: "100%",
              background: loading ? "#166534" : "var(--accent)",
              color: "#000",
              fontWeight: 800,
              padding: "13px 0",
              borderRadius: 10,
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              fontSize: 15,
              transition: "background 0.2s",
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>

          <p style={{ textAlign: "center", marginTop: 20, color: "#555", fontSize: 13 }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
              Register
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, color: "#333", fontSize: 12 }}>
          <Link href="/" style={{ color: "#555", textDecoration: "none" }}>← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
