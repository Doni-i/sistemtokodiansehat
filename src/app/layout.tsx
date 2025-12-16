// src/app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // Font Sultan
import "./globals.css";

// Load font dengan konfigurasi lengkap
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta'
});

export const metadata: Metadata = {
  title: "Toko Dian Sehat",
  description: "Selamat Datang di Sistem Informasi Toko Dian Sehat",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${jakarta.className} antialiased bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  );
}