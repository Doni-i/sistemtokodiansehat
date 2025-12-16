// src/app/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Zap, ShieldCheck, Activity, MapPin, Heart } from 'lucide-react'
import GridBackground from '@/components/background/GridBackground'
import Navbar from '@/components/layout/Navbar'
import InventoryCard from '@/components/features/InventoryCard'

export default function Home() {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white text-secondary-900 transition-colors duration-500 font-sans selection:bg-primary-500 selection:text-white dark:bg-slate-950 dark:text-white">
      
      {/* 1. Background Terpisah */}
      <GridBackground />

      {/* 2. Navbar Terpisah */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {/* 3. Konten Utama (Hero) */}
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-20 lg:flex-row lg:justify-between">
        
        {/* TEXT CONTENT (KIRI) - Tetap di sini karena ini konten spesifik halaman ini */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-sm font-medium text-primary-700 mb-6 dark:border-primary-500/30 dark:bg-primary-500/10 dark:text-primary-300">
            <MapPin size={14} className="animate-bounce" />
            <span>Jl. Pagujaten No. 18, Jakarta Selatan</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-secondary-900 sm:text-6xl lg:text-7xl mb-6 leading-tight dark:text-white">
            Dedikasi Farmasi <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-400 dark:from-primary-400 dark:to-emerald-200">
              Untuk Keluarga.
            </span>
          </h1>

          <p className="text-lg text-secondary-500 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0 dark:text-secondary-400">
            Berawal dari usaha rumahan yang melayani warga Pejaten Timur, kini 
            <span className="font-semibold text-secondary-900 dark:text-white"> Toko Dian Sehat </span> 
            bertransformasi digital. Mengelola ribuan SKU obat dengan presisi.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
            <Link 
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-105 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              <span className="relative z-10 flex items-center gap-2">
                Akses Sistem Admin <ArrowRight className="h-5 w-5" />
              </span>
            </Link>
            
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary-200 bg-white px-8 py-4 text-base font-semibold text-secondary-700 shadow-sm transition-all hover:bg-secondary-50 dark:border-white/10 dark:bg-white/5 dark:text-white">
              <Heart size={18} className="text-red-500 fill-red-500" /> Tentang Kami
            </button>
          </div>

           <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 dark:opacity-40 dark:hover:opacity-100">
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><Zap size={20}/> Next.js 15</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><ShieldCheck size={20}/> Secure Data</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><Activity size={20}/> Realtime Stok</div>
          </div>
        </div>

        {/*4. Kartu 3D Terpisah*/}
        <InventoryCard />

      </div>
    </main>
  )
}