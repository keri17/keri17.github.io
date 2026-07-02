import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "ያዲ ክትፎ | Yadi Ketfo Menu",
  description: "የያዲ ክትፎ ምግብ ቤት ዲጂታል ሜኑ - Yadi Ketfo Digital Menu",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="am">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Ethiopic:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-stone-50 text-stone-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
