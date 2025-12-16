import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna diambil dari identitas spanduk Toko Dian Sehat
        ds: {
          green: {
             DEFAULT: '#006837', // Hijau tua dominan di logo DS
             dark: '#004d29',
             light: '#008f4d'
          },
          red: {
            DEFAULT: '#E30613', // Merah aksen pada teks DIANSEHAT
          },
          gold: {
            DEFAULT: '#FDB913', // Kuning/Emas pada teks PAGUJATEN
          },
          cream: '#FAFAFA' // Latar belakang bersih
        }
      },
      // Animasi ringan untuk "denyut" data, aman untuk LibreWolf
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ping-slow': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' },
        },
         marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 3s ease-in-out infinite',
        'ping-slow': 'ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite',
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;