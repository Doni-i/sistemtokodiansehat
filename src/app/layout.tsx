import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; 
import "./globals.css";
import ThemeToggle from '@/components/layout/ThemeToggle'

const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-jakarta', 
});

export const metadata: Metadata = {
  title: "Sistem Inventori Toko Dian Sehat",
  description: "Manajemen Stok Obat Digital",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${jakarta.className} antialiased`}>
        {children}
        <ThemeToggle /> 
      </body>
    </html>
  );
}