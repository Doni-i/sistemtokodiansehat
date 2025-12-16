'use client'

import Link from 'next/link'
import { ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Logic Interaktif: Menangkap posisi mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Menghitung posisi mouse relatif terhadap tengah layar (-1 sampai 1)
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-white selection:bg-orange-500 selection:text-white">
      
      {/* --- BLACK HOLE SYSTEM (LAYER PALING BELAKANG) --- */}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        style={{
          // Efek Parallax: Black hole bergerak berlawanan arah mouse
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)` 
        }}
      >
        {/* 1. Photon Ring (Lingkaran Cahaya Vertikal/Belakang) */}
        <div className="absolute h-[600px] w-[600px] rounded-full bg-gradient-to-t from-transparent via-orange-900/40 to-transparent blur-3xl transform scale-y-50 animate-pulse-slow"></div>

        {/* 2. Accretion Disk (Piringan Utama - Horizontal) */}
        <div className="absolute flex items-center justify-center">
            {/* Bagian Depan Disk */}
            <div className="relative h-[400px] w-[800px] rounded-[100%] bg-gradient-to-r from-orange-600 via-yellow-200 to-orange-600 blur-xl opacity-80 animate-spin-slow mix-blend-screen" 
                 style={{ transform: 'rotateX(70deg)' }}>
            </div>
             {/* Dust Lane (Debu Gelap di Disk) */}
             <div className="absolute h-[380px] w-[780px] rounded-[100%] border-[40px] border-black/80 blur-md z-10"
                 style={{ transform: 'rotateX(70deg)' }}>
            </div>
        </div>

        {/* 3. Event Horizon (Bola Hitam Paling Tengah) */}
        <div className="relative z-20 h-48 w-48 rounded-full bg-black shadow-[0_0_50px_rgba(255,165,0,0.6)] flex items-center justify-center overflow-hidden">
            {/* Efek Lensa Gravitasi di dalam Hitam */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-gray-900 to-black opacity-90"></div>
            <div className="h-40 w-40 rounded-full bg-black shadow-inner border border-gray-800/20"></div>
        </div>

        {/* 4. Gravitational Lensing (Cahaya yang membengkok di atas/bawah) */}
        <div className="absolute z-10 h-[500px] w-[600px] rounded-full border-t-2 border-orange-500/30 blur-md" style={{ transform: 'rotateX(60deg) translateY(-50px)' }}></div>
        
        {/* Stars Background (Bergerak sedikit) */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      </div>

      {/* --- KONTEN FRONTEND (LAYER DEPAN) --- */}
      <div className="container relative z-30 mx-auto px-4 text-center"
           style={{ transform: `translate(${mousePosition.x * 10}px, ${mousePosition.y * 10}px)` }}
      >
        
        {/* BADGE */}
        <div className="mb-8 inline-flex animate-fade-in-up items-center gap-2 rounded-full border border-orange-500/30 bg-black/40 px-4 py-1.5 text-sm font-medium text-orange-200 backdrop-blur-md transition-all hover:bg-orange-500/10 hover:border-orange-400/50">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-orange-500"></span>
          </span>
          Singularity System Active
        </div>

        {/* JUDUL */}
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-white sm:text-8xl drop-shadow-[0_0_30px_rgba(255,165,0,0.3)]">
          Sistem Inventori <br />
          <span className="bg-gradient-to-r from-yellow-200 via-orange-400 to-red-500 bg-clip-text text-transparent">Toko Dian Sehat</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-lg text-slate-300 sm:text-xl leading-relaxed drop-shadow-md">
          Melampaui batasan manajemen farmasi tradisional. <br/>
          Monitoring stok dengan kecepatan cahaya dan keamanan absolut.
        </p>

        {/* TOMBOL CTA */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link 
            href="/login"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-8 py-4 text-base font-bold text-black transition-all duration-300 hover:bg-orange-400 hover:text-white hover:scale-105 active:scale-95 shadow-[0_0_40px_-10px_rgba(255,255,255,0.7)]"
          >
            <span className="relative z-10 flex items-center gap-2">
              Masuk ke Event Horizon <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <a 
            href="#"
            className="inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-semibold text-slate-400 transition-colors hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10"
          >
            Pelajari Gravitasi
          </a>
        </div>

        {/* FITUR GRID */}
        <div className="mt-24 grid grid-cols-1 gap-6 sm:grid-cols-3 text-left">
          <div className="group rounded-2xl border border-white/5 bg-black/20 p-6 backdrop-blur-sm transition-all hover:border-orange-500/50 hover:bg-orange-900/10 hover:-translate-y-2">
            <div className="mb-4 inline-block rounded-lg bg-orange-500/10 p-3 text-orange-400">
              <Zap size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Quantum Speed</h3>
            <p className="text-sm text-slate-400">Next.js 15 Engine yang memproses data stok lebih cepat dari kedipan mata.</p>
          </div>

          <div className="group rounded-2xl border border-white/5 bg-black/20 p-6 backdrop-blur-sm transition-all hover:border-blue-500/50 hover:bg-blue-900/10 hover:-translate-y-2">
            <div className="mb-4 inline-block rounded-lg bg-blue-500/10 p-3 text-blue-400">
              <Database size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Atomic Transaction</h3>
            <p className="text-sm text-slate-400">Supabase RPC menjaga integritas data layaknya hukum fisika yang mutlak.</p>
          </div>

          <div className="group rounded-2xl border border-white/5 bg-black/20 p-6 backdrop-blur-sm transition-all hover:border-purple-500/50 hover:bg-purple-900/10 hover:-translate-y-2">
            <div className="mb-4 inline-block rounded-lg bg-purple-500/10 p-3 text-purple-400">
              <ShieldCheck size={24} />
            </div>
            <h3 className="mb-2 text-lg font-bold text-white">Void Security</h3>
            <p className="text-sm text-slate-400">Row Level Security memastikan data Anda aman dari ancaman eksternal.</p>
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <div className="absolute bottom-6 text-xs text-slate-500 z-30">
        Toko Dian Sehat &copy; 2025
      </div>
    </main>
  )
}