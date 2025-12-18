
# 🌿 Sistem Manajemen Inventori Toko Dian Sehat 

![Toko Dian Sehat Dashboard](<blockquote class="imgur-embed-pub" lang="en" data-id="a/56b2BDE" data-context="false" ><a href="//imgur.com/a/56b2BDE"></a></blockquote><script async src="//s.imgur.com/min/embed.js" charset="utf-8"></script>)

**Sistem manajemen inventori obat digital untuk Toko Dian Sehat, Pagujaten, Jakarta Selatan.**
Dibangun untuk menggantikan catatan manual (buku stok & nota kertas) dengan web app modern. Fokus: Tracking stok masuk, alert expired, dan partial FEFO (First Expired First Out)—prioritas keluarkan obat mendekati kadaluarsa. Phase 1: Input stok & monitoring. Next: Full out transaksi & barcode scan.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/) [![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=flat&logo=supabase)](https://supabase.com/) [![Tailwind CSS](https://img.shields.io/badge/Tailwind-v3-blue?style=flat&logo=tailwindcss)](https://tailwindcss.com/) [![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-%23000000.svg?style=flat&logo=vercel)](https://sistemtokodiansehat-lac.vercel.app) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🎯 Fitur Utama
- **Dashboard Monitoring**: Statistik real-time (total stok, low stock, expired) dengan chart tren masuk/keluar (gunakan Recharts).
- **Input Stok Baru**: Modal form cerdas—auto-generate barcode jika kosong, validasi required fields.
- **Pencarian & Filter**: Cari obat via nama, batch, atau barcode. Alert visual (merah untuk expired).
- **Partial FEFO**: Sort stok by expired date—prioritas keluarkan yang mendekati kadaluarsa (belum full out, coming soon).
- **Autentikasi Admin**: Login aman via Supabase Auth. Middleware proteksi rute (hanya admin akses /inventory).
- **Tema Responsif**: Light/dark mode toggle. UI glowy dengan spotlight effect (custom komponen).
- **Realtime Clock**: Jam server lock ke WIB (Asia/Jakarta) untuk timestamp akurat.
- **Soft Delete**: Arsip stok tanpa hapus permanen—update `dihapus_pada` di DB.

Ini bukan app biasa. Dari buku catatan manual ke digital precision. Kurangi kerugian expired obat, pump efisiensi toko.

## 🛠 Tech Stack
- **Frontend**: Next.js 14 (SSR/CSR hybrid), React 18, TypeScript.
- **Backend/DB**: Supabase (PostgreSQL) dengan RPC custom (`tambah_stok_lengkap` untuk input lengkap).
- **Styling**: Tailwind CSS, Lucide Icons, Custom animations (shimmer, float).
- **Charts**: Recharts untuk tren stok.
- **Deployment**: Vercel (auto-deploy dari GitHub).
- **Lainnya**: ESLint, PostCSS, Middleware auth.

Struktur folder (dari screenshot Anda):
```
sistemtokodiansehat
├── public/             # Aset statis (SVG, JPG)
├── src/
│   ├── app/            # Pages (inventory, login, home)
│   ├── components/     # UI (GridBackground, InventoryCard, Navbar, SpotlightCard, ThemeToggle)
│   ├── lib/            # Supabase clients (client.ts, server.ts)
│   └── ...             # Globals, layout, etc.
├── middleware.ts       # Auth guard
├── next.config.js      # Konfig Next.js
├── tailwind.config.ts  # Tema emerald/primary
└── tsconfig.json       # TypeScript setup
```

## 🚀 Getting Started
### Prasyarat
- Node.js 18+ (gunakan `nvm` untuk switch).
- Akun Supabase (gratis tier cukup).
- GitHub repo (fork ini untuk start).

### Instalasi
1. Clone repo:
   ```bash
   git clone https://github.com/Doni-i/sistemtokodiansehat.git
   cd sistemtokodiansehat
   ```

2. Install dependencies:
   ```bash
   npm install
   # atau yarn/pnpm
   ```

3. Setup env vars (buat `.env.local`):
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   *Ambil dari Supabase Dashboard > Settings > API.*

4. Jalankan dev server:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000). Edit `app/page.tsx` untuk test hot-reload.

### Contoh Kode: Input Stok (dari inventory/page.tsx)
```tsx
// Snippet: Handle submit stok baru dengan RPC Supabase
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  try {
    const { error } = await supabase.rpc('tambah_stok_lengkap', { /* params */ })
    if (error) throw error
    alert('✅ Stok Berhasil Ditambahkan!')
    fetchData() // Refresh list
  } catch (err: any) {
    alert('❌ Gagal: ' + err.message)
  }
}
```
Ini integrate DB insert atomik—masuk batch, stok, transaksi sekaligus.

## 📊 Usage
- **Login**: `/login` (email/password via Supabase Auth).
- **Dashboard**: `/inventory`—Input stok via modal (+ button), search, delete (arsip).
- **Dark Mode**: Toggle ikon sudut kanan bawah.
- **Demo Data**: Jalankan SQL dummy untuk populate DB (lihat issue #1 jika butuh script).

App secure: Middleware redirect unauth ke login. Partial FEFO via sort expired date di tabel.

## ☁️ Deployment
Deploy instan ke Vercel:
1. Push ke GitHub.
2. Connect repo di [Vercel Dashboard](https://vercel.com).
3. Set env vars sama seperti `.env.local`.
4. Auto-build. URL: e.g., https://sistemtokodiansehat-lac.vercel.app.

Vercel handle SSR, static export, dan scaling gratis.

## 🤝 Contributing
laporkan bug atau ide (e.g., integrasi WhatsApp alert expired).

## 📜 License
MIT—free use, modified, credit @Doni-i. Lihat [LICENSE](LICENSE).