"use client";

import { useState } from "react";

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

interface CategoryWithItems {
  id: number;
  name: string;
  nameAm: string;
  sortOrder: number;
  items: MenuItem[];
}

export default function MenuClient({
  menuData,
}: {
  menuData: CategoryWithItems[];
}) {
  const [activeCategory, setActiveCategory] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const categoryIcons: Record<string, string> = {
    "Kitfo Special": "🥩",
    "Meat Dishes": "🍖",
    "Fasting Food": "🥗",
    Beverages: "🥤",
    Extras: "➕",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-yadi-green to-yadi-green-light shadow-xl">
        <div className="max-w-2xl mx-auto px-4 py-4 text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl">🍽️</span>
            <div>
              <h1 className="text-3xl font-black text-yadi-cream tracking-wide">
                ያዲ ክትፎ
              </h1>
              <p className="text-yadi-gold text-sm font-medium">
                Yadi Ketfo Restaurant
              </p>
            </div>
          </div>
          <p className="text-green-200 text-xs mt-1">
            ✨ የምግብ ዝርዝር / Menu ✨
          </p>
        </div>
      </header>

      {/* Category Navigation */}
      <nav className="sticky top-[88px] z-40 bg-stone-800/95 backdrop-blur-sm border-b border-stone-700">
        <div className="max-w-2xl mx-auto px-2 py-2 flex gap-1 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => setActiveCategory(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              activeCategory === null
                ? "bg-yadi-gold text-stone-900 shadow-lg"
                : "bg-stone-700 text-stone-300 hover:bg-stone-600"
            }`}
          >
            ሁሉም
          </button>
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === cat.id
                  ? "bg-yadi-gold text-stone-900 shadow-lg"
                  : "bg-stone-700 text-stone-300 hover:bg-stone-600"
              }`}
            >
              {categoryIcons[cat.name] || "📋"} {cat.nameAm}
            </button>
          ))}
        </div>
      </nav>

      {/* Menu Content */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        {/* Featured Items Banner */}
        {activeCategory === null && (
          <div className="mb-6">
            <h2 className="text-yadi-gold font-bold text-lg mb-3 flex items-center gap-2">
              ⭐ ልዩ ምግቦች
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {menuData
                .flatMap((cat) => cat.items)
                .filter((item) => item.isFeatured)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="flex-shrink-0 w-44 bg-gradient-to-b from-yadi-green/30 to-stone-800 rounded-2xl overflow-hidden border border-yadi-green/30 hover:border-yadi-gold/50 transition-all shadow-lg group"
                  >
                    {item.imageUrl && (
                      <div className="relative h-28 overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.nameAm}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 right-2 bg-yadi-gold text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full">
                          ⭐
                        </div>
                      </div>
                    )}
                    <div className="p-3 text-right">
                      <p className="text-white font-bold text-sm">
                        {item.nameAm}
                      </p>
                      <p className="text-yadi-gold font-black text-lg mt-1">
                        {item.price} ብር
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        )}

        {/* Categories and Items */}
        {menuData
          .filter(
            (cat) => activeCategory === null || cat.id === activeCategory
          )
          .map((cat) => (
            <section key={cat.id}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">
                  {categoryIcons[cat.name] || "📋"}
                </span>
                <div>
                  <h2 className="text-xl font-black text-yadi-cream">
                    {cat.nameAm}
                  </h2>
                  <p className="text-stone-500 text-xs">{cat.name}</p>
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-yadi-gold/30 to-transparent ml-2" />
              </div>

              <div className="space-y-3">
                {cat.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="w-full bg-stone-800/80 rounded-2xl overflow-hidden border border-stone-700 hover:border-yadi-gold/40 transition-all shadow-md group text-right"
                  >
                    <div className="flex">
                      {item.imageUrl && (
                        <div className="w-28 h-28 flex-shrink-0 overflow-hidden">
                          <img
                            src={item.imageUrl}
                            alt={item.nameAm}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="flex-1 p-3 flex flex-col justify-between">
                        <div>
                          <h3 className="text-white font-bold text-base">
                            {item.nameAm}
                          </h3>
                          {item.descriptionAm && (
                            <p className="text-stone-400 text-xs mt-1 line-clamp-2">
                              {item.descriptionAm}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-stone-500 text-xs">
                            {item.name}
                          </span>
                          <span className="bg-yadi-gold/20 text-yadi-gold font-black text-base px-3 py-1 rounded-full">
                            {item.price} ብር
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 mt-8 py-6 text-center">
        <p className="text-yadi-gold font-bold text-lg">ያዲ ክትፎ</p>
        <p className="text-stone-500 text-sm mt-1">
          🙏 ስለ ምርጫዎ እናመሰግናለን!
        </p>
        <p className="text-stone-600 text-xs mt-2">
          © 2024 Yadi Ketfo Restaurant
        </p>
      </footer>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-stone-800 rounded-t-3xl sm:rounded-3xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto border border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedItem.imageUrl && (
              <div className="relative h-56 overflow-hidden rounded-t-3xl">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.nameAm}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-800/80 to-transparent" />
                <button
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="p-6 text-right">
              {selectedItem.isFeatured && (
                <span className="inline-block bg-yadi-gold/20 text-yadi-gold text-xs font-bold px-3 py-1 rounded-full mb-2">
                  ⭐ ልዩ ምግብ
                </span>
              )}
              <h3 className="text-2xl font-black text-yadi-cream">
                {selectedItem.nameAm}
              </h3>
              <p className="text-stone-500 text-sm">{selectedItem.name}</p>
              {selectedItem.descriptionAm && (
                <p className="text-stone-300 mt-3 text-sm leading-relaxed">
                  {selectedItem.descriptionAm}
                </p>
              )}
              <div className="mt-6 flex items-center justify-between">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-stone-500 hover:text-white transition px-4 py-2"
                >
                  ✕ ዝጋ
                </button>
                <div className="bg-gradient-to-r from-yadi-green to-yadi-green-light text-white font-black text-2xl px-6 py-3 rounded-2xl">
                  {selectedItem.price} ብር
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
