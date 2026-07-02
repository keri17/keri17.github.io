"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface MenuItem {
  id: number;
  categoryId: number;
  name: string;
  nameAm: string;
  description: string | null;
  descriptionAm: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  sortOrder: number;
}

interface Category {
  id: number;
  name: string;
  nameAm: string;
  sortOrder: number;
  items: MenuItem[];
}

type Tab = "menu" | "qrcode" | "add" | "categories";

export default function AdminDashboard() {
  const [menuData, setMenuData] = useState<Category[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>("menu");
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [qrData, setQrData] = useState<{
    qrDataUrl: string;
    menuUrl: string;
  } | null>(null);
  const router = useRouter();

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu");
    const data = await res.json();
    setMenuData(data);
    setCategories(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMenu();
  }, [fetchMenu]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleAvailability = async (item: MenuItem) => {
    await fetch(`/api/admin/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isAvailable: !item.isAvailable }),
    });
    fetchMenu();
  };

  const toggleFeatured = async (item: MenuItem) => {
    await fetch(`/api/admin/items/${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...item, isFeatured: !item.isFeatured }),
    });
    fetchMenu();
  };

  const deleteItem = async (id: number) => {
    if (!confirm("እርግጠኛ ነዎት ይህን ምግብ ማጥፋት ይፈልጋሉ?")) return;
    await fetch(`/api/admin/items/${id}`, { method: "DELETE" });
    fetchMenu();
  };

  const fetchQR = async () => {
    const res = await fetch("/api/qrcode");
    const data = await res.json();
    setQrData(data);
  };

  useEffect(() => {
    if (activeTab === "qrcode") fetchQR();
  }, [activeTab]);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-yadi-gold text-xl font-bold animate-pulse">
          ⏳ እየጫነ ነው...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-yadi-green to-yadi-green-light shadow-xl">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">⚙️</span>
            <div>
              <h1 className="text-xl font-black text-yadi-cream">
                ያዲ ክትፎ - አስተዳደር
              </h1>
              <p className="text-green-200 text-xs">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-900/50 text-red-300 px-4 py-2 rounded-xl text-sm font-bold hover:bg-red-800 transition"
          >
            🚪 ውጣ
          </button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-stone-800 border-b border-stone-700">
        <div className="max-w-6xl mx-auto px-4 flex gap-1 overflow-x-auto">
          {[
            { key: "menu" as Tab, label: "📋 ሜኑ አስተዳደር", en: "Menu" },
            { key: "add" as Tab, label: "➕ አዲስ ምግብ", en: "Add Item" },
            {
              key: "categories" as Tab,
              label: "📂 ምድቦች",
              en: "Categories",
            },
            { key: "qrcode" as Tab, label: "📱 QR Code", en: "QR Code" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                setEditingItem(null);
              }}
              className={`px-5 py-3 text-sm font-bold whitespace-nowrap transition border-b-2 ${
                activeTab === tab.key
                  ? "border-yadi-gold text-yadi-gold"
                  : "border-transparent text-stone-400 hover:text-stone-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "menu" && !editingItem && (
          <MenuManager
            menuData={menuData}
            onToggleAvailability={toggleAvailability}
            onToggleFeatured={toggleFeatured}
            onDelete={deleteItem}
            onEdit={(item) => {
              setEditingItem(item);
              setActiveTab("add");
            }}
          />
        )}

        {activeTab === "add" && (
          <ItemForm
            categories={categories}
            editingItem={editingItem}
            onSaved={() => {
              setEditingItem(null);
              setActiveTab("menu");
              fetchMenu();
            }}
            onCancel={() => {
              setEditingItem(null);
              setActiveTab("menu");
            }}
          />
        )}

        {activeTab === "categories" && (
          <CategoryManager
            categories={categories}
            onRefresh={fetchMenu}
          />
        )}

        {activeTab === "qrcode" && <QRCodePanel qrData={qrData} />}
      </main>
    </div>
  );
}

/* ===================== Menu Manager ===================== */

function MenuManager({
  menuData,
  onToggleAvailability,
  onToggleFeatured,
  onDelete,
  onEdit,
}: {
  menuData: Category[];
  onToggleAvailability: (item: MenuItem) => void;
  onToggleFeatured: (item: MenuItem) => void;
  onDelete: (id: number) => void;
  onEdit: (item: MenuItem) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-yadi-cream">
          📋 የምግብ ዝርዝር አስተዳደር
        </h2>
        <span className="text-stone-500 text-sm">
          {menuData.reduce((acc, cat) => acc + cat.items.length, 0)} ምግቦች
        </span>
      </div>

      {menuData.map((cat) => (
        <div
          key={cat.id}
          className="bg-stone-800 rounded-2xl border border-stone-700 overflow-hidden"
        >
          <div className="bg-stone-750 px-5 py-3 border-b border-stone-700">
            <h3 className="text-yadi-gold font-bold">
              {cat.nameAm}{" "}
              <span className="text-stone-500 text-sm">({cat.name})</span>
            </h3>
          </div>
          <div className="divide-y divide-stone-700">
            {cat.items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center gap-4 p-4 transition ${
                  !item.isAvailable ? "opacity-50" : ""
                }`}
              >
                {item.imageUrl && (
                  <img
                    src={item.imageUrl}
                    alt={item.nameAm}
                    className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-white font-bold">{item.nameAm}</h4>
                    {item.isFeatured && (
                      <span className="text-xs bg-yadi-gold/20 text-yadi-gold px-2 py-0.5 rounded-full">
                        ⭐ ልዩ
                      </span>
                    )}
                    {!item.isAvailable && (
                      <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded-full">
                        🚫 የለም
                      </span>
                    )}
                  </div>
                  <p className="text-stone-500 text-xs">{item.name}</p>
                </div>
                <div className="text-yadi-gold font-black text-lg flex-shrink-0">
                  {item.price} ብር
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => onToggleAvailability(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      item.isAvailable
                        ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                        : "bg-red-900/30 text-red-400 hover:bg-red-900/50"
                    }`}
                    title={item.isAvailable ? "ደብቅ" : "አሳይ"}
                  >
                    {item.isAvailable ? "👁️" : "🚫"}
                  </button>
                  <button
                    onClick={() => onToggleFeatured(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                      item.isFeatured
                        ? "bg-yellow-900/30 text-yellow-400"
                        : "bg-stone-700 text-stone-400"
                    }`}
                    title="ልዩ"
                  >
                    ⭐
                  </button>
                  <button
                    onClick={() => onEdit(item)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900/30 text-blue-400 hover:bg-blue-900/50 transition"
                    title="አስተካክል"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-900/30 text-red-400 hover:bg-red-900/50 transition"
                    title="ሰርዝ"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            {cat.items.length === 0 && (
              <p className="text-stone-600 text-sm text-center py-4">
                ምንም ምግብ የለም
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ===================== Item Form ===================== */

function ItemForm({
  categories,
  editingItem,
  onSaved,
  onCancel,
}: {
  categories: Category[];
  editingItem: MenuItem | null;
  onSaved: () => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    categoryId: editingItem?.categoryId || categories[0]?.id || 0,
    name: editingItem?.name || "",
    nameAm: editingItem?.nameAm || "",
    description: editingItem?.description || "",
    descriptionAm: editingItem?.descriptionAm || "",
    price: editingItem?.price || 0,
    imageUrl: editingItem?.imageUrl || "",
    isAvailable: editingItem?.isAvailable ?? true,
    isFeatured: editingItem?.isFeatured ?? false,
    sortOrder: editingItem?.sortOrder || 0,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = editingItem
        ? `/api/admin/items/${editingItem.id}`
        : "/api/admin/items";
      const method = editingItem ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      onSaved();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-xl font-black text-yadi-cream mb-6">
        {editingItem ? "✏️ ምግብ አስተካክል" : "➕ አዲስ ምግብ ጨምር"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-stone-800 rounded-2xl border border-stone-700 p-6 space-y-5"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              ምድብ (Category)
            </label>
            <select
              value={form.categoryId}
              onChange={(e) =>
                setForm({ ...form, categoryId: parseInt(e.target.value) })
              }
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.nameAm} ({cat.name})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              ዋጋ (Price in ETB)
            </label>
            <input
              type="number"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              ስም (Amharic)
            </label>
            <input
              type="text"
              value={form.nameAm}
              onChange={(e) => setForm({ ...form, nameAm: e.target.value })}
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
              placeholder="ለምሳሌ: ክትፎ"
              required
            />
          </div>
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              Name (English)
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
              placeholder="e.g. Kitfo"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              ማብራሪያ (Amharic)
            </label>
            <textarea
              value={form.descriptionAm}
              onChange={(e) =>
                setForm({ ...form, descriptionAm: e.target.value })
              }
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
              rows={2}
            />
          </div>
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              Description (English)
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
              rows={2}
            />
          </div>
        </div>

        <div>
          <label className="text-stone-400 text-sm font-bold block mb-1">
            ፎቶ URL (Image URL)
          </label>
          <input
            type="url"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
            placeholder="https://..."
          />
          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 h-32 rounded-xl object-cover"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-stone-400 text-sm font-bold block mb-1">
              ቅደም ተከተል (Sort Order)
            </label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) =>
                setForm({
                  ...form,
                  sortOrder: parseInt(e.target.value) || 0,
                })
              }
              className="w-full bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={form.isAvailable}
              onChange={(e) =>
                setForm({ ...form, isAvailable: e.target.checked })
              }
              className="w-5 h-5 rounded accent-green-500"
            />
            <span className="text-stone-300 font-bold text-sm">
              ይገኛል (Available)
            </span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer mt-6">
            <input
              type="checkbox"
              checked={form.isFeatured}
              onChange={(e) =>
                setForm({ ...form, isFeatured: e.target.checked })
              }
              className="w-5 h-5 rounded accent-yellow-500"
            />
            <span className="text-stone-300 font-bold text-sm">
              ⭐ ልዩ (Featured)
            </span>
          </label>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-yadi-green to-yadi-green-light text-white font-bold py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50"
          >
            {saving
              ? "⏳ እየተቀመጠ ነው..."
              : editingItem
                ? "✅ አስተካክል"
                : "✅ ጨምር"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-stone-700 text-stone-300 font-bold rounded-xl hover:bg-stone-600 transition"
          >
            ↩️ ተመለስ
          </button>
        </div>
      </form>
    </div>
  );
}

/* ===================== Category Manager ===================== */

function CategoryManager({
  categories,
  onRefresh,
}: {
  categories: Category[];
  onRefresh: () => void;
}) {
  const [name, setName] = useState("");
  const [nameAm, setNameAm] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nameAm, sortOrder }),
      });
      setName("");
      setNameAm("");
      setSortOrder(0);
      onRefresh();
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-xl font-black text-yadi-cream">
        📂 ምድቦች (Categories)
      </h2>

      <div className="bg-stone-800 rounded-2xl border border-stone-700 overflow-hidden">
        <div className="divide-y divide-stone-700">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <h3 className="text-white font-bold">{cat.nameAm}</h3>
                <p className="text-stone-500 text-xs">{cat.name}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-stone-500 text-xs">
                  ቅ.ተ: {cat.sortOrder}
                </span>
                <span className="bg-stone-700 text-stone-400 px-3 py-1 rounded-full text-xs">
                  {cat.items.length} ምግቦች
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleAdd}
        className="bg-stone-800 rounded-2xl border border-stone-700 p-6 space-y-4"
      >
        <h3 className="text-yadi-gold font-bold">➕ አዲስ ምድብ ጨምር</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            value={nameAm}
            onChange={(e) => setNameAm(e.target.value)}
            placeholder="ስም (አማርኛ)"
            className="bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
            required
          />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (English)"
            className="bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
            required
          />
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(parseInt(e.target.value) || 0)}
            placeholder="ቅ.ተ"
            className="bg-stone-700 border border-stone-600 rounded-xl px-4 py-2.5 text-white focus:border-yadi-gold focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-yadi-green text-white font-bold px-6 py-2.5 rounded-xl hover:bg-yadi-green-light transition disabled:opacity-50"
        >
          {saving ? "⏳..." : "✅ ጨምር"}
        </button>
      </form>
    </div>
  );
}

/* ===================== QR Code Panel ===================== */

function QRCodePanel({
  qrData,
}: {
  qrData: { qrDataUrl: string; menuUrl: string } | null;
}) {
  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      <h2 className="text-xl font-black text-yadi-cream">
        📱 QR Code ለሜኑ
      </h2>
      <p className="text-stone-400 text-sm">
        ደንበኞች ይህን QR Code ስካን ሲያደርጉ ሜኑ ይታያቸዋል
      </p>

      {qrData ? (
        <div className="bg-[#fefae0] rounded-3xl p-8 inline-block shadow-2xl border-4 border-yadi-green/20">
          {/* Top decoration */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
            <div className="text-[#d4a017] text-sm">✦ ✦ ✦</div>
            <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
          </div>

          <h3 className="text-2xl font-black text-[#2d6a4f]">🍽️ ያዲ ክትፎ</h3>
          <p className="text-[#6b4226] text-xs mt-1">Yadi Ketfo Restaurant</p>

          <div className="w-16 h-0.5 bg-[#d4a017] mx-auto my-3" />

          <div className="border-3 border-[#2d6a4f] rounded-2xl p-2 bg-white inline-block shadow-md">
            <img
              src={qrData.qrDataUrl}
              alt="Menu QR Code"
              className="w-56 h-56 mx-auto"
              style={{ imageRendering: "pixelated" as const }}
            />
          </div>

          <p className="text-[#2d6a4f] font-bold text-base mt-4">
            📱 ሜኑ ለማየት ስካን ያድርጉ
          </p>
          <p className="text-[#6b4226] text-xs mt-1">Scan to view our menu</p>

          {/* Bottom decoration */}
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
            <div className="text-[#d4a017] text-sm">✦ ✦ ✦</div>
            <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
          </div>
        </div>
      ) : (
        <div className="text-stone-500 animate-pulse py-12">
          <div className="text-5xl mb-3 animate-bounce">📱</div>
          ⏳ QR Code እየተሰራ ነው...
        </div>
      )}

      {qrData && (
        <div className="space-y-4">
          <p className="text-stone-500 text-xs break-all bg-stone-800 rounded-xl px-4 py-2 border border-stone-700 font-mono">
            🔗 {qrData.menuUrl}
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href="/api/qrcode?format=png&size=800"
              download="yadi-ketfo-qr.png"
              className="bg-yadi-green text-white font-bold px-5 py-2.5 rounded-xl hover:bg-yadi-green-light transition text-sm"
            >
              📥 PNG አውርድ
            </a>
            <a
              href="/api/qrcode?format=svg&size=800"
              download="yadi-ketfo-qr.svg"
              className="bg-stone-700 text-stone-300 font-bold px-5 py-2.5 rounded-xl hover:bg-stone-600 transition text-sm border border-stone-600"
            >
              📥 SVG አውርድ
            </a>
            <a
              href="/qr"
              target="_blank"
              className="bg-yadi-gold text-stone-900 font-bold px-5 py-2.5 rounded-xl hover:bg-yadi-gold-light transition text-sm"
            >
              🖨️ ለፕሪንት ክፈት
            </a>
          </div>
        </div>
      )}

      {/* Print page promo */}
      <div className="bg-gradient-to-r from-yadi-green/10 to-yadi-green/5 rounded-2xl border border-yadi-green/20 p-6">
        <h3 className="text-yadi-gold font-bold text-lg mb-2">
          🖨️ የፕሪንት ገፅ
        </h3>
        <p className="text-stone-400 text-sm mb-4">
          ለጠረጴዛ ካርድ፣ ለግድግዳ ፖስተር ወይም ብዙ ቅጂ ለማትመ የፕሪንት ገፁን ይክፈቱ
        </p>
        <a
          href="/qr"
          target="_blank"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-yadi-green to-yadi-green-light text-white font-bold px-8 py-3 rounded-xl hover:shadow-lg transition text-sm"
        >
          <span className="text-lg">🖨️</span>
          የፕሪንት ገፅ ክፈት — Open Print Page
        </a>
      </div>

      <div className="bg-stone-800 rounded-2xl border border-stone-700 p-6 text-right">
        <h3 className="text-yadi-gold font-bold mb-3">💡 እንዴት ይጠቀሙ?</h3>
        <ol className="text-stone-400 text-sm space-y-2 list-decimal list-inside">
          <li>QR Code ን ያውርዱ ወይም ፕሪንት ያድርጉ</li>
          <li>በጠረጴዛ ላይ ወይም ግድግዳ ላይ ይለጥፉ</li>
          <li>ደንበኞች ካሜራ ወይም QR Scanner ተጠቅመው ይስካኑ</li>
          <li>ሜኑ በስልካቸው ይታያቸዋል!</li>
        </ol>
      </div>
    </div>
  );
}
