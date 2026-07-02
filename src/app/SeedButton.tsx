"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSeed = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setDone(true);
        setTimeout(() => router.refresh(), 1000);
      } else {
        alert(data.error || "ስህተት ተከስቷል");
      }
    } catch {
      alert("ግንኙነት አልተቻለም");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="mt-8 bg-green-900/30 border border-green-800 rounded-2xl p-6 text-center max-w-md">
        <p className="text-green-400 font-bold text-lg">✅ በተሳካ ሁኔታ ገብቷል!</p>
        <p className="text-green-300/60 text-sm mt-2">
          ገፁ እንደገና ይጫናል...
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-stone-800 border border-yadi-gold/30 rounded-2xl p-6 text-center max-w-md">
      <p className="text-yadi-gold font-bold mb-2">⚠️ ዳታ ማስገባት ያስፈልጋል</p>
      <p className="text-stone-400 text-sm mb-4">
        የመጀመሪያ ምግቦችን ለማስገባት ከታች ይጫኑ
      </p>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-yadi-gold text-stone-900 font-bold px-6 py-3 rounded-xl hover:bg-yadi-gold-light transition disabled:opacity-50"
      >
        {loading ? "⏳ እየገባ ነው..." : "🌱 ዳታ አስገባ (Seed Data)"}
      </button>
    </div>
  );
}
