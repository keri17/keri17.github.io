"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "ስህተት ተከስቷል");
        return;
      }

      router.push("/admin");
    } catch {
      setError("ግንኙነት አልተቻለም");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex items-center justify-center p-4">
      <div className="bg-stone-800 border border-stone-700 rounded-3xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <span className="text-5xl">🔐</span>
          <h1 className="text-2xl font-black text-yadi-cream mt-3">
            ያዲ ክትፎ አስተዳደር
          </h1>
          <p className="text-stone-500 text-sm mt-1">Admin Panel Login</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <div className="bg-red-900/30 border border-red-800 text-red-400 text-sm p-3 rounded-xl text-center">
              ⚠️ {error}
            </div>
          )}

          <div>
            <label className="text-stone-400 text-sm font-bold block mb-2 text-right">
              የተጠቃሚ ስም
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white placeholder:text-stone-500 focus:border-yadi-gold focus:outline-none text-right"
              placeholder="admin"
              required
            />
          </div>

          <div>
            <label className="text-stone-400 text-sm font-bold block mb-2 text-right">
              ይለፍ ቃል
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-3 text-white placeholder:text-stone-500 focus:border-yadi-gold focus:outline-none text-right"
              placeholder="••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yadi-green to-yadi-green-light text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
          >
            {loading ? "⏳ እየገባ ነው..." : "🔓 ግባ"}
          </button>
        </form>

        <p className="text-stone-600 text-xs text-center mt-6">
          Default: admin / admin123
        </p>
      </div>
    </div>
  );
}
