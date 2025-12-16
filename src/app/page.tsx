'use client'

import Link from 'next/link'
// FIX 1: Menambahkan 'Database' ke dalam import
import { ArrowRight, Activity, Lock, Server, Wifi, Database } from 'lucide-react'

export default function Home() {
  return (
    // Latar belakang menggunakan warna hijau tua brand
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-ds-green-dark text-white selection:bg-ds-red selection:text-white font-sans">
      
      {/* --- BACKGROUND ELEMENTS --- */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      {/* Watermark Logo DS */}
      <div className="absolute right-[-10%] top-[-10%] text-[40rem] font-black text-white/5 pointer-events-none select-none leading-none tracking-tighter">
        DS
      </div>

      {/* --- TOP NAVIGATION BAR --- */}
      <header className="relative z-20 w-full border-b border-white/10 bg-ds-green-dark/50 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-3 w-3 relative">
              <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-ds-green-light opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-ds-green-light"></span>
            </div>
            <span className="text-sm font-mono text-ds-green-light/80 tracking-wider">SYSTEM OPERATIONAL // TOKO DIAN SEHAT PAGUJATEN</span>
          </div>
          <div className="text-xs text-white/50 font-mono">
            Latency: 24ms | Region: Jakarta-South
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <div className="container relative z-20 mx-auto flex flex-1 flex-col items-start justify-center px-4 pt-10 lg:flex-row lg:items-center lg:gap-20">
        
        {/* KOLOM KIRI */}
        <div className="flex-1 lg:max-w-2xl">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl lg:text-8xl">
            <span className="block text-white">Enterprise</span>
            <span className="block text-ds-red">Inventory</span>
            <span className="block text-ds-green-light">Control.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-white/70 sm:text-xl leading-relaxed border-l-2 border-ds-gold pl-6">
            Platform manajemen farmasi terpusat untuk Toko Dian Sehat. 
            Dirancang untuk visibilitas *real-time*, integritas data absolut, dan kecepatan eksekusi tingkat tinggi.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link 
              href="/login"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-md bg-ds-red px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:bg-ds-red/90 hover:shadow-[0_0_30px_-5px_rgba(227,6,19,0.5)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                Akses Command Center <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
             <div className="flex items-center gap-2 px-4 py-2 text-sm text-ds-gold/80 font-mono bg-white/5 rounded-md border border-white/10">
                <Wifi size={16} className="animate-pulse-subtle"/> Live Connection Established
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: Visualisasi Data */}
        <div className="mt-16 flex-1 lg:mt-0 lg:flex lg:justify-end">
            <div className="relative h-[400px] w-[400px] rounded-full border border-ds-green-light/20 bg-ds-green-dark/50 backdrop-blur-sm flex items-center justify-center">
                {/* Radar Rings */}
                <div className="absolute h-[80%] w-[80%] rounded-full border border-ds-green-light/10 animate-[spin_20s_linear_infinite]"></div>
                <div className="absolute h-[60%] w-[60%] rounded-full border border-ds-green-light/10 animate-[spin_15s_linear_reverse_infinite]"></div>
                
                {/* Central Data Point */}
                 <div className="relative z-10 flex flex-col items-center justify-center text-center p-10 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                    <Activity size={40} className="text-ds-green-light mb-4 animate-pulse-subtle"/>
                    <div className="text-4xl font-black text-white">99.9%</div>
                    <div className="text-sm text-white/60 uppercase tracking-widest mt-1 font-semibold">Uptime Sistem</div>
                    
                    {/* FIX 2: Mengganti tanda > dengan &gt; agar tidak error JSX */}
                    <div className="mt-4 text-xs text-ds-gold font-mono text-left w-full space-y-1">
                        <div>&gt; Syncing Batch #9981... OK</div>
                        <div>&gt; Verifying RPC Auth... OK</div>
                        <div>&gt; Next.js Engine... READY</div>
                    </div>
                 </div>
            </div>
        </div>
      </div>

      {/* --- FOOTER: DATA TICKER --- */}
      <div className="relative z-20 w-full bg-black/40 border-t border-white/5 py-3 overflow-hidden flex items-center">
        <div className="flex animate-marquee whitespace-nowrap font-mono text-xs text-ds-green-light/70">
            <span className="mx-4"><Server size={12} className="inline mr-2"/> Aktivitas Terkini: Stok Masuk [Paracetamol] Batch-001 (+500 unit) via Admin_Salsa.</span>
            <span className="mx-4">|</span>
            <span className="mx-4"><Lock size={12} className="inline mr-2"/> Keamanan: RLS Policy Updated. 0 Percobaan Akses Ilegal Terdeteksi.</span>
            <span className="mx-4">|</span>
            {/* FIX 3: Menggunakan &lt; untuk tanda kurang dari */}
            <span className="mx-4"><Database size={12} className="inline mr-2"/> Database: Supabase Transaction Pool Stabil. Latency &lt; 50ms.</span>
             <span className="mx-4">|</span>
             <span className="mx-4">TOKO DIAN SEHAT PAGUJATEN - Enterprise Resource Planning v2.1</span>
        </div>
      </div>
    </main>
  )
}