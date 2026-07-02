"use client";

import { useState, useEffect, useRef } from "react";

interface QRData {
  menuUrl: string;
  qrDataUrl: string;
  sizes: {
    small: string;
    medium: string;
    large: string;
  };
}

export default function QRPageClient() {
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [printMode, setPrintMode] = useState<
    "single" | "table-tent" | "multi"
  >("single");
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/qrcode")
      .then((r) => r.json())
      .then((data) => {
        setQrData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl animate-bounce mb-4">📱</div>
          <p className="text-yadi-gold text-xl font-bold animate-pulse">
            QR Code እየተሰራ ነው...
          </p>
        </div>
      </div>
    );
  }

  if (!qrData) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <p className="text-red-400 font-bold">❌ QR Code ሊሰራ አልቻለም</p>
      </div>
    );
  }

  return (
    <>
      {/* Screen UI (hidden when printing) */}
      <div className="min-h-screen bg-gradient-to-b from-stone-900 via-stone-800 to-stone-900 print:hidden">
        {/* Header */}
        <header className="bg-gradient-to-r from-yadi-green to-yadi-green-light shadow-xl">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📱</span>
              <div>
                <h1 className="text-xl font-black text-yadi-cream">
                  ያዲ ክትፎ - QR Code
                </h1>
                <p className="text-green-200 text-xs">
                  ለደንበኞች QR Code ያትሙ
                </p>
              </div>
            </div>
            <a
              href="/admin"
              className="text-green-200 hover:text-white text-sm font-bold transition"
            >
              ↩️ ወደ አስተዳደር
            </a>
          </div>
        </header>

        {/* Print Mode Selector */}
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            {[
              {
                key: "single" as const,
                icon: "🖼️",
                label: "ነጠላ",
                desc: "Single Large QR",
              },
              {
                key: "table-tent" as const,
                icon: "🏷️",
                label: "የጠረጴዛ ካርድ",
                desc: "Table Tent Card",
              },
              {
                key: "multi" as const,
                icon: "📄",
                label: "ብዙ ቅጂ",
                desc: "Multiple Copies",
              },
            ].map((mode) => (
              <button
                key={mode.key}
                onClick={() => setPrintMode(mode.key)}
                className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
                  printMode === mode.key
                    ? "bg-yadi-gold text-stone-900 shadow-lg shadow-yellow-900/30"
                    : "bg-stone-800 text-stone-400 border border-stone-700 hover:border-stone-500"
                }`}
              >
                {mode.icon} {mode.label}
                <span className="block text-xs font-normal mt-0.5 opacity-70">
                  {mode.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Print Button */}
          <div className="text-center mb-8 space-y-3">
            <button
              onClick={handlePrint}
              className="bg-gradient-to-r from-yadi-green to-yadi-green-light text-white font-black text-lg px-10 py-4 rounded-2xl hover:shadow-2xl hover:shadow-green-900/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              🖨️ ፕሪንት ያድርጉ / Print
            </button>
            <div className="flex justify-center gap-3">
              <a
                href="/api/qrcode?format=png&size=800"
                download="yadi-ketfo-qr.png"
                className="text-yadi-gold hover:text-yadi-gold-light text-sm font-bold transition"
              >
                📥 PNG አውርድ
              </a>
              <span className="text-stone-700">|</span>
              <a
                href="/api/qrcode?format=svg&size=800"
                download="yadi-ketfo-qr.svg"
                className="text-yadi-gold hover:text-yadi-gold-light text-sm font-bold transition"
              >
                📥 SVG አውርድ
              </a>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-stone-800 rounded-3xl border border-stone-700 p-8 shadow-2xl">
            <h3 className="text-stone-400 text-sm font-bold text-center mb-6">
              👁️ ቅድመ-ዕይታ / Preview
            </h3>
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl p-2 shadow-lg max-w-full overflow-auto">
                {printMode === "single" && (
                  <SingleQR qrData={qrData} />
                )}
                {printMode === "table-tent" && (
                  <TableTentQR qrData={qrData} />
                )}
                {printMode === "multi" && (
                  <MultiQR qrData={qrData} />
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-stone-800 rounded-2xl border border-stone-700 p-6">
            <h3 className="text-yadi-gold font-bold text-lg mb-4 text-center">
              💡 የአጠቃቀም መመሪያ
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  step: "1",
                  icon: "🖨️",
                  title: "ፕሪንት ያድርጉ",
                  desc: "ከላይ ያለውን ፕሪንት ቁልፍ ይጫኑ",
                },
                {
                  step: "2",
                  icon: "✂️",
                  title: "ቆርጠው ያዘጋጁ",
                  desc: "የታተመውን ቆርጠው ያስቀምጡ",
                },
                {
                  step: "3",
                  icon: "🪑",
                  title: "ጠረጴዛ ላይ ያድርጉ",
                  desc: "በእያንዳንዱ ጠረጴዛ ላይ ያስቀምጡ",
                },
                {
                  step: "4",
                  icon: "📱",
                  title: "ደንበኞች ይስካኑ",
                  desc: "ካሜራቸውን ተጠቅመው ሜኑ ያያሉ!",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className="flex items-start gap-3 bg-stone-700/50 rounded-xl p-4"
                >
                  <div className="w-10 h-10 rounded-full bg-yadi-green/20 flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white font-bold text-sm">
                      {item.step}. {item.title}
                    </p>
                    <p className="text-stone-400 text-xs mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* URL info */}
          <div className="mt-6 text-center">
            <p className="text-stone-600 text-xs">
              Menu URL:{" "}
              <span className="text-stone-400 font-mono">
                {qrData.menuUrl}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ========== PRINT-ONLY CONTENT ========== */}
      <div className="hidden print:block" ref={printRef}>
        {printMode === "single" && <SingleQR qrData={qrData} />}
        {printMode === "table-tent" && <TableTentQR qrData={qrData} />}
        {printMode === "multi" && <MultiQR qrData={qrData} />}
      </div>
    </>
  );
}

/* ================= Single Large QR ================= */
function SingleQR({ qrData }: { qrData: QRData }) {
  return (
    <div
      className="bg-[#fefae0] flex flex-col items-center justify-center p-10"
      style={{ width: "400px" }}
    >
      {/* Top decorative border */}
      <div className="w-full flex items-center gap-2 mb-4">
        <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
        <div className="text-[#d4a017] text-lg">✦ ✦ ✦</div>
        <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
      </div>

      {/* Restaurant name */}
      <h1
        className="text-4xl font-black text-[#2d6a4f] tracking-wide"
        style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
      >
        ያዲ ክትፎ
      </h1>
      <p className="text-[#6b4226] text-sm font-medium mt-1">
        Yadi Ketfo Restaurant
      </p>

      {/* Divider */}
      <div className="w-24 h-0.5 bg-[#d4a017] my-4" />

      {/* QR Code */}
      <div className="border-4 border-[#2d6a4f] rounded-2xl p-3 bg-white shadow-md">
        <img
          src={qrData.sizes.large}
          alt="QR Code"
          className="w-56 h-56"
          style={{ imageRendering: "pixelated" }}
        />
      </div>

      {/* Instructions */}
      <div className="mt-5 text-center">
        <p
          className="text-[#2d6a4f] font-bold text-lg"
          style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
        >
          📱 ሜኑ ለማየት ስካን ያድርጉ
        </p>
        <p className="text-[#6b4226] text-xs mt-1">
          Scan to view our menu
        </p>
      </div>

      {/* Decorative elements */}
      <div className="flex items-center gap-2 mt-4 text-[#d4a017] text-xs">
        <span>🍽️</span>
        <span>ምርጥ ክትፎ እና ባህላዊ ምግቦች</span>
        <span>🍽️</span>
      </div>

      {/* Bottom border */}
      <div className="w-full flex items-center gap-2 mt-4">
        <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
        <div className="text-[#d4a017] text-lg">✦ ✦ ✦</div>
        <div className="flex-1 h-0.5 bg-[#2d6a4f]" />
      </div>
    </div>
  );
}

/* ================= Table Tent Card ================= */
function TableTentQR({ qrData }: { qrData: QRData }) {
  return (
    <div style={{ width: "500px" }}>
      {/* Front Side */}
      <div className="bg-[#fefae0] border-2 border-[#2d6a4f] rounded-2xl overflow-hidden">
        {/* Top banner */}
        <div className="bg-[#2d6a4f] py-4 px-6 text-center">
          <h1
            className="text-3xl font-black text-[#fefae0] tracking-wider"
            style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
          >
            🍽️ ያዲ ክትፎ
          </h1>
          <p className="text-[#d4a017] text-sm font-medium mt-1">
            Yadi Ketfo Restaurant
          </p>
        </div>

        {/* Content */}
        <div className="p-8 flex flex-col items-center">
          {/* QR with frame */}
          <div className="relative">
            <div className="absolute -inset-3 border-2 border-dashed border-[#d4a017] rounded-2xl" />
            <div className="bg-white rounded-xl p-3 shadow-lg relative">
              <img
                src={qrData.sizes.large}
                alt="QR Code"
                className="w-48 h-48"
                style={{ imageRendering: "pixelated" }}
              />
            </div>
          </div>

          {/* Scan instruction */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-[#2d6a4f] text-[#fefae0] px-6 py-3 rounded-full">
              <span className="text-xl">📱</span>
              <span
                className="font-bold text-base"
                style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
              >
                ሜኑ ለማየት ስካን ያድርጉ
              </span>
            </div>
            <p className="text-[#6b4226] text-sm mt-3 font-medium">
              Scan with your camera to view our menu
            </p>
          </div>

          {/* Features */}
          <div className="mt-6 flex gap-6 text-[#2d6a4f]">
            <div className="text-center">
              <span className="text-2xl block">🥩</span>
              <span
                className="text-xs font-bold block mt-1"
                style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
              >
                ክትፎ
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl block">🍖</span>
              <span
                className="text-xs font-bold block mt-1"
                style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
              >
                ጥብስ
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl block">🥗</span>
              <span
                className="text-xs font-bold block mt-1"
                style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
              >
                የጾም
              </span>
            </div>
            <div className="text-center">
              <span className="text-2xl block">🥤</span>
              <span
                className="text-xs font-bold block mt-1"
                style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
              >
                መጠጥ
              </span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="bg-[#2d6a4f] py-3 px-6 text-center">
          <p className="text-[#d4a017] text-xs font-medium">
            ✨ ስለ ምርጫዎ እናመሰግናለን! — Thank you for choosing us! ✨
          </p>
        </div>
      </div>

      {/* Cut line */}
      <div className="border-t-2 border-dashed border-gray-300 my-4 relative">
        <span className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-gray-400 text-xs px-3">
          ✂️ ከዚህ ቆርጡ / Cut here
        </span>
      </div>

      {/* Back side (fold section for tent) */}
      <div className="bg-[#2d6a4f] border-2 border-[#2d6a4f] rounded-2xl p-8 text-center">
        <h2
          className="text-4xl font-black text-[#fefae0] tracking-wider"
          style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
        >
          ያዲ ክትፎ
        </h2>
        <div className="w-20 h-0.5 bg-[#d4a017] mx-auto my-4" />
        <p
          className="text-[#d4a017] font-bold text-lg"
          style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
        >
          ምርጥ ክትፎ እና ባህላዊ ምግቦች
        </p>
        <p className="text-green-200 text-sm mt-2">
          Premium Kitfo &amp; Traditional Ethiopian Cuisine
        </p>
        <div className="mt-6 flex justify-center gap-3 text-3xl">
          <span>🥩</span>
          <span>🍖</span>
          <span>🥗</span>
          <span>🍽️</span>
        </div>
      </div>
    </div>
  );
}

/* ================= Multiple Small QR Copies ================= */
function MultiQR({ qrData }: { qrData: QRData }) {
  const copies = Array.from({ length: 6 });

  return (
    <div
      className="bg-white p-4 grid grid-cols-2 gap-4"
      style={{ width: "500px" }}
    >
      {copies.map((_, i) => (
        <div
          key={i}
          className="bg-[#fefae0] border-2 border-[#2d6a4f] rounded-xl p-4 flex flex-col items-center"
        >
          {/* Name */}
          <h3
            className="text-lg font-black text-[#2d6a4f]"
            style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
          >
            🍽️ ያዲ ክትፎ
          </h3>

          {/* QR */}
          <div className="bg-white rounded-lg p-2 mt-2 shadow-sm border border-[#2d6a4f]/20">
            <img
              src={qrData.sizes.medium}
              alt="QR Code"
              className="w-28 h-28"
              style={{ imageRendering: "pixelated" }}
            />
          </div>

          {/* Label */}
          <p
            className="text-[#2d6a4f] font-bold text-xs mt-2 text-center"
            style={{ fontFamily: "Noto Sans Ethiopic, sans-serif" }}
          >
            📱 ስካን ያድርጉ
          </p>
          <p className="text-[#6b4226] text-[10px]">
            Scan for menu
          </p>
        </div>
      ))}
    </div>
  );
}
