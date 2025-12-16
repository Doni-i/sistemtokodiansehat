'use client'

import Link from 'next/link'
import { ArrowRight, Activity, Box, ShieldCheck, Zap, Moon, Sun, MapPin, Heart } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'

export default function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isDark, setIsDark] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Logic 3D Tilt + Efek Spotlight 
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
      
      // CSS Variables untuk Efek Spotlight
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const spotX = e.clientX - rect.left;
        const spotY = e.clientY - rect.top;
        containerRef.current.style.setProperty('--mouse-x', `${spotX}px`);
        containerRef.current.style.setProperty('--mouse-y', `${spotY}px`);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

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
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,white,transparent)] dark:opacity-0 transition-opacity duration-500"></div>
      <div className="absolute inset-0 bg-grid-pattern-dark bg-[size:40px_40px] [mask-image:linear-gradient(to_bottom,rgba(0,0,0,1),transparent)] opacity-0 dark:opacity-20 transition-opacity duration-500"></div>
      
      {/* Animated Blobs */}
      <div className="absolute -top-[20%] -left-[10%] h-[500px] w-[500px] rounded-full bg-primary-400/20 blur-[100px] mix-blend-multiply animate-float dark:bg-primary-500/10 dark:mix-blend-screen"></div>
      <div className="absolute top-[20%] -right-[10%] h-[500px] w-[500px] rounded-full bg-blue-400/20 blur-[100px] mix-blend-multiply animate-float dark:bg-blue-500/10 dark:mix-blend-screen" style={{animationDelay: '2s'}}></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 z-50 w-full border-b border-secondary-200 bg-white/70 backdrop-blur-xl transition-colors duration-500 dark:border-white/10 dark:bg-slate-900/70">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary-600 to-primary-400 text-white font-bold shadow-lg shadow-primary-500/30">
              DS
            </div>
            <span className="text-lg font-bold tracking-tight text-secondary-900 dark:text-white">
              Toko<span className="text-primary-600 dark:text-primary-400">DianSehat</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="rounded-full p-2 text-secondary-500 hover:bg-secondary-100 dark:text-secondary-400 dark:hover:bg-white/10 transition-all"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="hidden text-sm font-medium text-secondary-500 md:block dark:text-secondary-400">
              Pejaten Branch v2.0
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-6 pt-20 lg:flex-row lg:justify-between">
        
        {/* TEXT CONTENT (KIRI) */}
        <div className="relative z-10 max-w-2xl text-center lg:text-left">
          {/* Badge Lokasi */}
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
            bertransformasi digital. Mengelola ribuan SKU obat dengan presisi, 
            memastikan ketersediaan stok untuk kesehatan masyarakat sekitar.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row justify-center lg:justify-start">
            
            {/* --- MAGIC BUTTON ALA LINEAR --- */}
            <Link 
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-105 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
              
              <span className="relative z-10 flex items-center gap-2">
                Akses Sistem Admin
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
            
            <button className="inline-flex items-center justify-center gap-2 rounded-xl border border-secondary-200 bg-white px-8 py-4 text-base font-semibold text-secondary-700 shadow-sm transition-all hover:bg-secondary-50 hover:border-secondary-300 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10">
              <Heart size={18} className="text-red-500 fill-red-500" /> Tentang Kami
            </button>
          </div>
          
          <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500 dark:opacity-40 dark:hover:opacity-100">
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><Zap size={20}/> Next.js 15</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><ShieldCheck size={20}/> Secure Data</div>
            <div className="flex items-center gap-2 font-bold text-secondary-400 dark:text-secondary-300"><Activity size={20}/> Realtime Stok</div>
          </div>
        </div>

        {/* 3D VISUAL - KARTU (KANAN) */}
        <div className="relative mt-16 lg:mt-0 lg:h-[600px] lg:w-[600px] flex items-center justify-center perspective-1000">
          
          {/* Main Card Container */}
          <div 
            ref={containerRef}
            className="group/card relative w-[350px] sm:w-[450px] rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md transition-transform duration-100 ease-out will-change-transform dark:border-white/5 dark:bg-slate-900/50 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
            style={{
              transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg) translateZ(20px)`,
            }}
          >
            {/* SPOTLIGHT EFFECT (Hanya muncul di Dark Mode agar dramatis) */}
            <div 
              className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100 dark:block hidden"
              style={{
                background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
              }}
            />

            {/* Header Mockup */}
            <div className="mb-6 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="h-3 w-3 rounded-full bg-red-400"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                <div className="h-3 w-3 rounded-full bg-green-400"></div>
              </div>
              <div className="h-2 w-24 rounded-full bg-secondary-200 dark:bg-white/10 text-[10px] flex items-center px-2 text-secondary-500">diansehat.id</div>
            </div>

            {/* Content Mockup */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-300 p-4 text-white shadow-lg dark:from-primary-600 dark:to-primary-800">
                   <div className="h-8 w-8 rounded-full bg-white/20 mb-4 flex items-center justify-center"><Box size={16}/></div>
                   <div className="text-2xl font-bold">2,850</div>
                   <div className="text-xs opacity-80">Total Item Terdaftar</div>
                </div>
                <div className="h-32 w-1/2 rounded-2xl bg-white p-4 shadow-sm border border-secondary-100 dark:bg-white/5 dark:border-white/5">
                   <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 mb-4 flex items-center justify-center dark:bg-orange-900/30 dark:text-orange-400"><Activity size={16}/></div>
                   <div className="text-2xl font-bold text-secondary-800 dark:text-white">18</div>
                   <div className="text-xs text-secondary-400 dark:text-secondary-400">Low Stock Alert</div>
                </div>
              </div>

              {/* List Mockup */}
              <div className="rounded-2xl bg-white p-4 shadow-sm border border-secondary-100 space-y-3 dark:bg-white/5 dark:border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-secondary-400">RECENT ACTIVITY</div>
                 </div>
                 {/* Item 1 */}
                 <div className="flex items-center gap-3 border-b border-secondary-50 pb-2 dark:border-white/5">
                   <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30"><Zap size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Paracetamol 500mg</div>
                     <div className="text-xs text-secondary-400">Stok Masuk: +50 Box</div>
                   </div>
                 </div>
                 {/* Item 2 */}
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30"><Box size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Amoxicillin</div>
                     <div className="text-xs text-secondary-400">Batch #8821 Verified</div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Floating Elements (Secure Badge) */}
            <div 
              className="absolute -right-12 top-20 rounded-2xl bg-white p-4 shadow-xl border border-secondary-100 animate-float dark:bg-slate-800 dark:border-white/10"
              style={{ transform: 'translateZ(50px)' }}
            >
               <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                    <ShieldCheck size={20}/>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-secondary-800 dark:text-white">Izin Usaha Valid</div>
                    <div className="text-xs text-secondary-400 dark:text-secondary-400">NIB: 2903240022881</div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  )
}