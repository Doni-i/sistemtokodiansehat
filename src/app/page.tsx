'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react'

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-900 text-white selection:bg-green-500 selection:text-white">
      
      {/* --- Efek Background) --- */}
      {/* Aurora Hijau Kiri */}
      <div className="absolute top-[-10%] left-[-10%] h-[500px] w-[500px] rounded-full bg-green-500/20 blur-[120px] animate-pulse" />
      {/* Aurora Biru Kanan */}
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-blue-600/20 blur-[120px]" />
      {/* Grid Pattern Halus */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />

      <div className="container relative z-10 mx-auto px-4 text-center">
        
        {/* BADGE DI ATAS */}
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm font-medium text-green-300 backdrop-blur-md transition-all hover:bg-white/10">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          System v2.0 Live
        </div>

        {/* Title */}
        <h1 className="mb-6 bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-7xl drop-shadow-sm">
          Sistem Inventori <br />
          <span className="text-green-500">Toko Dian Sehat</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-400 sm:text-xl leading-relaxed">
          Platform manajemen farmasi generasi terbaru dengan integrasi 
          <span className="text-white font-semibold"> Atomic Transaction</span>, 
          <span className="text-white font-semibold"> Audit Trail</span>, dan 
          <span className="text-white font-semibold"> Real-time Monitoring</span>.
          <br/> Selamat datang di masa depan.
        </p>

        {/* Tombol CTA (Call to Action) */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/login"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-green-600 px-8 py-4 text-base font-semibold text-white transition-all duration-300 hover:bg-green-500 hover:shadow-[0_0_40px_-10px_rgba(34,197,94,0.5)] hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Akses Sistem Admin <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
            {/* Efek Cahaya di tombol */}
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
          </Link>

          <a 
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-slate-300 transition-colors hover:text-white hover:bg-white/5"
            onClick={(e) => { e.preventDefault(); alert("Dokumentasi teknis tersedia di repository kampus."); }}
          >
            Pelajari Arsitektur
          </a>
        </div>

        {/* FITUR GRID (Biar kelihatan teknis banget) */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-green-500/30 hover:bg-white/10 hover:-translate-y-1">
            <div className="mb-4 inline-block rounded-lg bg-green-500/10 p-3 text-green-400">
              <Zap size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Next.js 15 Engine</h3>
            <p className="text-sm text-slate-400">Performa secepat kilat dengan Server Side Rendering dan App Router terbaru.</p>
          </div>

          <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-blue-500/30 hover:bg-white/10 hover:-translate-y-1">
            <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3 text-blue-400">
              <Database size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Supabase RPC</h3>
            <p className="text-sm text-slate-400">Integritas data terjamin dengan prosedur transaksi atomik di level database.</p>
          </div>

          <div className="group rounded-2xl border border-white/5 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-purple-500/30 hover:bg-white/10 hover:-translate-y-1">
            <div className="mb-4 inline-block rounded-lg bg-purple-500/10 p-3 text-purple-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Row Level Security</h3>
            <p className="text-sm text-slate-400">Keamanan tingkat enterprise. Hanya personel terotorisasi yang memiliki akses.</p>
          </div>
        </div>

      </div>

      {/* Footer kecil */}
      <div className="absolute bottom-6 text-xs text-slate-600">
        Toko Dian Sehat &copy; 2025
      </div>
    </main>
  )
}