// src/components/features/InventoryCard.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Activity, Zap, ShieldCheck, Package, TrendingUp, CheckCircle2 } from 'lucide-react'

export default function InventoryCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Menghitung rotasi 3D berdasarkan posisi mouse
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
      
      // Menghitung posisi spotlight
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        containerRef.current.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
        containerRef.current.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative mt-16 lg:mt-0 lg:h-[600px] lg:w-[600px] flex items-center justify-center perspective-1000">
       
       {/* 1. AMBIENT GLOW */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[80px] rounded-full animate-pulse dark:bg-emerald-500/5 pointer-events-none" />

       {/* 2. CONTAINER KARTU UTAMA (3D TILT) */}
       <div 
        ref={containerRef}
        className="group/card relative w-[350px] sm:w-[450px] rounded-[2rem] border border-white/60 bg-white/40 p-8 shadow-2xl backdrop-blur-xl transition-transform duration-100 ease-out will-change-transform dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)]"
        style={{
          transform: `rotateY(${mousePosition.x * 12}deg) rotateX(${mousePosition.y * -12}deg) translateZ(10px)`,
          transformStyle: 'preserve-3d' // efek 3D melayang
        }}
      >
        {/* 3. SPOTLIGHT HIJAU */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover/card:opacity-100"
          style={{ 
            background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.15), transparent 40%)` 
          }}
        />

        {/* --- KONTEN KARTU --- */}

        {/* Header: Browser Dots & Domain */}
        <div className="mb-8 flex items-center justify-between relative z-10" style={{ transform: 'translateZ(20px)' }}>
           <div className="flex gap-2.5">
             <div className="h-3.5 w-3.5 rounded-full bg-red-400 shadow-sm"></div>
             <div className="h-3.5 w-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
             <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-sm"></div>
           </div>
           <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 text-[11px] font-bold text-secondary-600 shadow-sm dark:bg-white/10 dark:text-secondary-300 backdrop-blur-md border border-white/20">
             <ShieldCheck size={12} className="text-emerald-500"/> admin.diansehat.id
           </div>
        </div>
        
        <div className="space-y-5 relative z-10">
            {/* Baris Statistik Utama */}
            <div className="flex gap-4" style={{ transform: 'translateZ(30px)' }}>
                {/* Total Aset (Gradient Hijau) */}
                <div className="relative overflow-hidden h-36 w-3/5 rounded-3xl bg-gradient-to-br from-primary-600 to-emerald-500 p-5 text-white shadow-lg shadow-emerald-500/20 dark:from-primary-700 dark:to-emerald-600">
                   <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl"></div>
                   <div className="h-10 w-10 rounded-2xl bg-white/20 mb-3 flex items-center justify-center backdrop-blur-sm border border-white/10">
                     <Package size={20}/>
                   </div>
                   <div className="text-3xl font-extrabold tracking-tight">15</div>
                   <div className="text-xs text-primary-50 font-medium mt-1">Total Item Obat</div>
                </div>
                
                {/* Stok Kritis (Putih) */}
                <div className="h-36 w-2/5 rounded-3xl bg-white/80 p-5 shadow-sm border border-white/60 dark:bg-white/5 dark:border-white/5 backdrop-blur-sm flex flex-col justify-between">
                   <div className="h-10 w-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center dark:bg-orange-500/20 dark:text-orange-400">
                     <Activity size={20}/>
                   </div>
                   <div>
                     <div className="text-3xl font-extrabold text-secondary-900 dark:text-white">2</div>
                     <div className="text-xs text-secondary-500 dark:text-secondary-400 font-medium">Stok Menipis</div>
                   </div>
                </div>
            </div>

            {/* List Transaksi (Glassmorphism) */}
            <div 
              className="rounded-3xl bg-white/60 p-5 shadow-sm border border-white/50 space-y-4 dark:bg-white/5 dark:border-white/5 backdrop-blur-md"
              style={{ transform: 'translateZ(40px)' }}
            >
                 <div className="flex items-center justify-between border-b border-secondary-200/50 pb-3 dark:border-white/10">
                   <div className="text-xs font-bold text-secondary-500 tracking-widest uppercase">Aktivitas Terkini</div>
                   <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full dark:bg-emerald-500/20 dark:text-emerald-400">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> Live
                   </div>
                 </div>
                 
                 {/* Item 1 */}
                 <div className="flex items-center gap-4 group/item cursor-default">
                   <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors group-hover/item:bg-emerald-500 group-hover/item:text-white dark:bg-emerald-500/20 dark:text-emerald-400">
                     <TrendingUp size={18}/>
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-900 dark:text-white">Paracetamol 500mg</div>
                     <div className="text-xs text-secondary-500 dark:text-secondary-400">Stok Masuk: <span className="text-emerald-600 font-bold dark:text-emerald-400">+50 Box</span></div>
                   </div>
                   <div className="text-[10px] font-medium text-secondary-400">Baru Saja</div>
                 </div>

                 {/* Item 2 */}
                 <div className="flex items-center gap-4 group/item cursor-default">
                   <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 transition-colors group-hover/item:bg-blue-500 group-hover/item:text-white dark:bg-blue-500/20 dark:text-blue-400">
                     <Box size={18}/>
                   </div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-900 dark:text-white">Amoxicillin</div>
                     <div className="text-xs text-secondary-500 dark:text-secondary-400">Kode Batch <span className="font-mono bg-secondary-100 px-1 rounded dark:bg-white/10">AMO-2610</span></div>
                   </div>
                   <div className="text-[10px] font-medium text-secondary-400">5m lalu</div>
                 </div>
            </div>
        </div>

        {/* 4. FLOATING BADGE (Melayang Keluar dari Kartu) */}
        <div 
          className="absolute -right-12 top-24 rounded-2xl bg-white p-4 shadow-2xl border border-white/50 animate-[float_4s_ease-in-out_infinite] dark:bg-slate-800 dark:border-white/10"
          style={{ transform: 'translateZ(80px)' }} // Efek sangat timbul
        >
           <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50 dark:bg-emerald-500/20 dark:text-emerald-400 dark:ring-emerald-900/30">
                <ShieldCheck size={24}/>
              </div>
              <div>
                <div className="text-sm font-extrabold text-secondary-900 dark:text-white">Terverifikasi</div>
                <div className="text-[10px] font-medium text-secondary-500 dark:text-secondary-400">Keamanan Data Tingkat Lanjut</div>
              </div>
           </div>
        </div>

        {/* 5. BADGE BAWAH */}
        <div 
          className="absolute -left-8 bottom-12 rounded-2xl bg-white p-3 shadow-xl border border-white/50 animate-[float_5s_ease-in-out_infinite_reverse] dark:bg-slate-800 dark:border-white/10"
          style={{ transform: 'translateZ(60px)' }}
        >
           <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-primary-600 dark:text-primary-400"/>
              <span className="text-xs font-bold text-secondary-700 dark:text-white">Server Stabil 99.9%</span>
           </div>
        </div>

      </div>
    </div>
  )
}