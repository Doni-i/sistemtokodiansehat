'use client'

import Link from 'next/link'
import { ArrowRight, Activity, Box, ShieldCheck, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Logic untuk efek 3D Tilt mengikuti mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalisasi posisi mouse dari tengah layar (-1 sampai 1)
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white text-secondary-900 font-sans selection:bg-primary-500 selection:text-white">
      
      {/* --- BACKGROUND (Clean Grid ala Lab Medis) --- */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
      
      {/* Gradient Blob Halus (Aura Warna Brand) */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[100px] mix-blend-multiply animate-float"></div>
      <div className="absolute top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] mix-blend-multiply animate-float" style={{animationDelay: '2s'}}></div>

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 z-50 w-full border-b border-secondary-200 bg-white/70 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 text-white font-bold shadow-lg shadow-primary-500/30">
              DS
            </div>
            <span className="text-lg font-bold tracking-tight text-secondary-900">
              Toko<span className="text-primary-600">DianSehat</span>
            </span>
          </div>
          <div className="hidden text-sm font-medium text-secondary-500 md:block">
            Enterprise Pharmacy System v2.0
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-20 lg:flex-row lg:justify-between">
        
        {/* TEXT CONTENT (Left) */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary-500"></span>
            </span>
            Sistem Operasional Live
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-secondary-900 sm:text-6xl lg:text-7xl mb-6 leading-tight">
            Manajemen Stok <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-400">
              Tanpa Kompromi.
            </span>
          </h1>

          <p className="text-lg text-secondary-500 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
            Platform inventori modern untuk Toko Dian Sehat. Menggabungkan kecepatan 
            <span className="font-semibold text-secondary-900"> Next.js 15</span>, keamanan 
            <span className="font-semibold text-secondary-900"> Supabase RPC</span>, dan antarmuka kelas dunia.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
            <Link 
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-105 active:scale-95"
            >
              Akses Dashboard
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary-200 bg-white px-8 py-4 text-base font-semibold text-secondary-700 shadow-sm transition-all hover:bg-secondary-50 hover:border-secondary-300">
              Dokumentasi API
            </button>
          </div>
          
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            {/* Fake Logos for "Trusted By" effect */}
            <div className="flex items-center gap-2 font-bold text-secondary-400"><Zap size={20}/> TurboPack</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400"><ShieldCheck size={20}/> RLS Security</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400"><Activity size={20}/> Realtime</div>
          </div>
        </div>

        {/* 3D VISUAL (Right) - MOCKUP APP YANG MIRING */}
        <div className="relative mt-16 lg:mt-0 lg:h-[600px] lg:w-[600px] flex items-center justify-center perspective-1000">
          
          {/* Main Card (Glass Effect) */}
          <div 
            className="relative w-[350px] sm:w-[450px] rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md transition-transform duration-100 ease-out will-change-transform"
            style={{
              transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg) translateZ(20px)`,
              boxShadow: `${mousePosition.x * -20}px ${mousePosition.y * 20}px 50px rgba(0,0,0,0.1)`
            }}
          >
            {/* Header Mockup */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="h-2 w-20 rounded-full bg-secondary-200"></div>
            </div>

            {/* Chart Mockup */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-300 p-4 text-white shadow-lg">
                   <div className="h-8 w-8 rounded-full bg-white/20 mb-4 flex items-center justify-center"><Box size={16}/></div>
                   <div className="text-2xl font-bold">1,240</div>
                   <div className="text-xs opacity-80">Total Stok Obat</div>
                </div>
                <div className="h-32 w-1/2 rounded-2xl bg-white p-4 shadow-sm border border-secondary-100">
                   <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 mb-4 flex items-center justify-center"><Activity size={16}/></div>
                   <div className="text-2xl font-bold text-secondary-800">24</div>
                   <div className="text-xs text-secondary-400">Transaksi Hari Ini</div>
                </div>
              </div>

              {/* List Mockup */}
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-secondary-100 space-y-3">
                 <div className="flex items-center justify-between">
                    <div className="h-2 w-24 rounded bg-secondary-200"></div>
                    <div className="h-2 w-10 rounded bg-secondary-100"></div>
                 </div>
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center gap-3">
                     <div className="h-8 w-8 rounded-lg bg-secondary-50"></div>
                     <div className="flex-1 space-y-1">
                       <div className="h-2 w-full rounded bg-secondary-100"></div>
                       <div className="h-2 w-2/3 rounded bg-secondary-50"></div>
                     </div>
                   </div>
                 ))}
              </div>
            </div>

            {/* Floating Elements (Parallax) */}
            <div 
              className="absolute -right-12 top-20 rounded-2xl bg-white p-4 shadow-xl border border-secondary-100 animate-float"
              style={{ transform: 'translateZ(50px)' }}
            >
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <ShieldCheck size={20}/>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary-800">Data Secured</div>
                    <div className="text-xs text-secondary-400">Encrypted AES-256</div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}