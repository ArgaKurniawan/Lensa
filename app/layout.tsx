// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces" });

export const metadata: Metadata = {
  title: "Lensa — Warm Film Journal",
  description: "Platform sosial untuk komunitas fotografi film.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="antialiased min-h-screen flex flex-col">
        {/* Nanti komponen Navbar & Sidebar akan masuk di sini */}
        <main className="flex-1">
          {children}
        </main>
      </body>
    </html>
  );
}