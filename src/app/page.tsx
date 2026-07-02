import Link from "next/link";
import { db } from "@/db";
import { menuItems, categories } from "@/db/schema";
import { sql } from "drizzle-orm";
import SeedButton from "./SeedButton";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let totalItems = 0;
  let totalCategories = 0;
  let seeded = false;

  try {
    const itemCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(menuItems);
    const catCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(categories);

    totalItems = Number(itemCount[0]?.count || 0);
    totalCategories = Number(catCount[0]?.count || 0);
    seeded = totalItems > 0;
  } catch {
    // Tables might not exist yet
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-4">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-7xl mb-4">🍽️</div>
        <h1 className="text-5xl font-black text-yadi-cream tracking-wide mb-2">
          ያዲ ክትፎ
        </h1>
        <p className="text-yadi-gold text-lg font-medium">
          Yadi Ketfo Restaurant
        </p>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-yadi-gold to-transparent mx-auto mt-4" />
        <p className="text-stone-400 mt-4 max-w-md">
          ምርጥ ክትፎ እና ባህላዊ ኢትዮጵያዊ ምግቦች
        </p>
        <p className="text-stone-500 text-sm">
          Premium Kitfo &amp; Traditional Ethiopian Cuisine
        </p>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl w-full">
        <Link
          href="/menu"
          className="group bg-gradient-to-br from-yadi-green to-yadi-green-light rounded-2xl p-8 text-center hover:shadow-2xl hover:shadow-green-900/30 transition-all hover:-translate-y-1"
        >
          <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">
            📱
          </span>
          <h2 className="text-2xl font-black text-yadi-cream">ሜኑ ይመልከቱ</h2>
          <p className="text-green-200 text-sm mt-2">View Menu</p>
          {seeded && (
            <p className="text-green-300/60 text-xs mt-3">
              {totalItems} ምግቦች • {totalCategories} ምድቦች
            </p>
          )}
        </Link>

        <Link
          href="/admin/login"
          className="group bg-gradient-to-br from-stone-700 to-stone-800 border border-stone-600 rounded-2xl p-8 text-center hover:shadow-2xl hover:border-yadi-gold/40 transition-all hover:-translate-y-1"
        >
          <span className="text-5xl block mb-3 group-hover:scale-110 transition-transform">
            ⚙️
          </span>
          <h2 className="text-2xl font-black text-yadi-cream">አስተዳደር</h2>
          <p className="text-stone-400 text-sm mt-2">Admin Panel</p>
          <p className="text-stone-500 text-xs mt-3">
            ዋጋ ይቀይሩ • ምግብ ያስተዳድሩ
          </p>
        </Link>
      </div>

      {/* QR Code Card */}
      <div className="max-w-xl w-full mt-4">
        <Link
          href="/qr"
          className="group flex items-center gap-4 bg-gradient-to-r from-yadi-gold/10 to-yadi-gold/5 border border-yadi-gold/20 rounded-2xl p-5 hover:border-yadi-gold/40 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          <span className="text-4xl group-hover:scale-110 transition-transform">
            📱
          </span>
          <div className="text-right flex-1">
            <h3 className="text-lg font-black text-yadi-cream">
              QR Code ያትሙ
            </h3>
            <p className="text-stone-400 text-xs mt-1">
              ለጠረጴዛ ካርድ QR Code ፕሪንት ያድርጉ — Print QR for tables
            </p>
          </div>
          <span className="text-yadi-gold text-2xl group-hover:translate-x-1 transition-transform">
            →
          </span>
        </Link>
      </div>

      {/* Seed Button */}
      {!seeded && <SeedButton />}

      {/* Footer */}
      <footer className="mt-16 text-center">
        <p className="text-stone-600 text-sm">© 2024 ያዲ ክትፎ | Yadi Ketfo</p>
      </footer>
    </div>
  );
}
