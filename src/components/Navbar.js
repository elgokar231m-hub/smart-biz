"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Admin emails - add yours here
const ADMIN_EMAILS = ["elgokar231m@gmail.com"];

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get current session
    supabase.auth.getUser().then(({ data }) => {
      const u = data?.user || null;
      setUser(u);
      setIsAdmin(u ? ADMIN_EMAILS.includes(u.email) : false);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user || null;
      setUser(u);
      setIsAdmin(u ? ADMIN_EMAILS.includes(u.email) : false);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
  }

  const linkStyle = {
    color: "#aaa", textDecoration: "none", fontSize: 14, transition: "color 0.2s",
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(15,15,15,0.97)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid #2a2a2a",
      padding: "0 32px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, fontWeight: 900, color: "#000",
        }}>S</div>
        <span style={{ fontSize: 20, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
          Smart<span style={{ color: "var(--accent)" }}>Biz</span>
        </span>
      </Link>

      {/* Nav Links */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {[["#slider","Home"],["#categories","Categories"],["#new-arrivals","New Arrivals"],["#all-products","All Products"]].map(([href, label]) => (
          <a key={label} href={href} style={linkStyle}
            onMouseOver={e => e.target.style.color="#fff"}
            onMouseOut={e => e.target.style.color="#aaa"}>{label}</a>
        ))}

        {/* Auth buttons — smart logic */}
        {!loading && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            {user ? (
              <>
                {/* Logged in: show user info */}
                <span style={{ fontSize: 12, color: "#555", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.email}
                </span>
                {isAdmin && (
                  <Link href="/admin" style={{
                    fontSize: 13, padding: "7px 16px",
                    background: "var(--accent)", color: "#000",
                    borderRadius: 8, textDecoration: "none",
                    fontWeight: 800,
                  }}>Dashboard</Link>
                )}
                <button onClick={handleLogout} style={{
                  fontSize: 13, padding: "7px 16px",
                  border: "1px solid #333", color: "#aaa",
                  borderRadius: 8, background: "none", cursor: "pointer",
                }}>Logout</button>
              </>
            ) : (
              <>
                {/* Not logged in: show Login + Register */}
                <Link href="/login" style={{
                  fontSize: 13, padding: "7px 16px",
                  border: "1px solid #444", color: "#fff",
                  borderRadius: 8, textDecoration: "none",
                }}>Login</Link>
                <Link href="/register" style={{
                  fontSize: 13, padding: "7px 16px",
                  background: "var(--accent)", color: "#000",
                  borderRadius: 8, textDecoration: "none",
                  fontWeight: 700,
                }}>Register</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
