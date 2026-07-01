import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "💕 Abate & Abebaye — Our Love Game",
  description: "A special couples quiz game for Abate and Abebaye ❤️",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
