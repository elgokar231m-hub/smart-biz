"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  async function handleRegister() {
    if (!email || !password || !confirm) return setError("Please fill in all fields");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirm) return setError("Passwords do not match");
    setLoading(true);
    setError("");

    const { data, error: err } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Skip email confirmation - user can log in immediately
        emailRedirectTo: undefined,
      }
    });

    setLoading(false);

    if (err) {
      if (err.message.includes("rate limit") || err.message.includes("email")) {
        setError("Too many signups right now. Please wait a few minutes and try again, or ask the admin to create your account.");
      } else if (err.message.includes("already registered") || err.message.includes("already been registered")) {
        setError("This email is already registered. Try logging in instead.");
      } else {
        setError(err.message);
      }
    } else if (data?.user?.identities?.length === 0) {
      // User already exists but unconfirmed
      setError("This email is already registered. Try logging in instead.");
    } else {
      setSuccess(true);
      // Auto redirect to login after 3 seconds
      setTimeout(() => router.push("/login"), 3000);
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
      minHeight: "100vh", background: "#0f0f0f",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ position: "fixed", top: "20%", left: "50%", transform: "translateX(-50%)", width: 500, height: 300, background: "radial-gradient(ellipse, rgba(34,197,94,0.07) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: 420, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: "#000" }}>S</div>
            <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Smart<span style={{ color: "var(--accent)" }}>Biz</span></span>
          </Link>
          <p style={{ color: "#555", fontSize: 14, marginTop: 8 }}>Create your account</p>
        </div>

        <div style={{ background: "#161616", border: "1px solid #2a2a2a", borderRadius: 20, padding: 36 }}>
          {success ? (
            <div style={{ textAlign: "center", padding: "20px 0" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Account Created!</h2>
              <p style={{ color: "#666", fontSize: 14, marginBottom: 8, lineHeight: 1.6 }}>
                Your account is ready. Redirecting to login...
              </p>
              <div style={{ width: "100%", height: 3, background: "#1a1a1a", borderRadius: 2, overflow: "hidden", marginBottom: 24 }}>
                <div style={{ height: "100%", background: "var(--accent)", borderRadius: 2, animation: "progress 3s linear forwards" }} />
              </div>
              <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
              <Link href="/login" style={{ display: "inline-block", background: "var(--accent)", color: "#000", fontWeight: 800, padding: "12px 28px", borderRadius: 10, textDecoration: "none", fontSize: 14 }}>
                Go to Login →
              </Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, color: "#fff" }}>Create account</h1>

              {[
                { label: "Email", type: "email", val: email, set: setEmail, ph: "you@example.com" },
                { label: "Password", type: "password", val: password, set: setPassword, ph: "Min. 6 characters" },
                { label: "Confirm Password", type: "password", val: confirm, set: setConfirm, ph: "Repeat your password" },
              ].map(({ label, type, val, set, ph }) => (
                <div key={label} style={{ marginBottom: 18 }}>
                  <label style={{ fontSize: 13, color: "#888", display: "block", marginBottom: 8, fontWeight: 600 }}>{label}</label>
                  <input
                    type={type} placeholder={ph} style={inputStyle} value={val}
                    onChange={e => set(e.target.value)}
                    onFocus={e => e.target.style.borderColor = "#22c55e"}
                    onBlur={e => e.target.style.borderColor = "#2a2a2a"}
                    onKeyDown={e => e.key === "Enter" && handleRegister()}
                  />
                </div>
              ))}

              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 8, padding: "10px 14px", marginBottom: 20, color: "#ef4444", fontSize: 13 }}>
                  ⚠️ {error}
                </div>
              )}

              <button onClick={handleRegister} disabled={loading} style={{
                width: "100%", background: loading ? "#166534" : "var(--accent)", color: "#000",
                fontWeight: 800, padding: "13px 0", borderRadius: 10, border: "none",
                cursor: loading ? "not-allowed" : "pointer", fontSize: 15, transition: "background 0.2s",
              }}>
                {loading ? "Creating account..." : "Create Account →"}
              </button>

              <p style={{ textAlign: "center", marginTop: 20, color: "#555", fontSize: 13 }}>
                Already have an account?{" "}
                <Link href="/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
        <p style={{ textAlign: "center", marginTop: 20 }}>
          <Link href="/" style={{ color: "#555", textDecoration: "none", fontSize: 12 }}>← Back to store</Link>
        </p>
      </div>
    </div>
  );
}
