// src/components/features/InventoryCard.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Activity, ShieldCheck, Package, TrendingUp, FileCheck } from 'lucide-react'

export default function InventoryCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
      
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
    // Wrapper Utama
    <div className="relative z-50 mt-20 mb-10 lg:mt-0 lg:mb-0 lg:h-[600px] lg:w-full lg:max-w-2xl flex items-center justify-center perspective-1000">
       
       {/* GLOBAL AMBIENT GLOW (Background Utama) */}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/10 blur-[80px] rounded-full animate-pulse dark:bg-emerald-500/5 pointer-events-none" />

       {/* KARTU CONTAINER (Logic 3D) */}
       <div 
        ref={containerRef}
        className="group/card relative w-[320px] sm:w-[420px] transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `rotateY(${mousePosition.x * 8}deg) rotateX(${mousePosition.y * -8}deg)`,
          transformStyle: 'preserve-3d'
        }}
      >
        
        {/* --- LAYER 1: BACKGROUND KARTU UTAMA --- */}
        <div 
          className="absolute inset-0 rounded-[2rem] border border-white/60 bg-white/40 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/60 dark:shadow-[0_0_60px_-15px_rgba(16,185,129,0.3)]"
          style={{ transform: 'translateZ(0px)' }}
        >
          {/* Spotlight Effect Kartu Utama */}
          <div 
            className="pointer-events-none absolute -inset-px rounded-[2rem] opacity-0 transition duration-500 group-hover/card:opacity-100"
            style={{ 
              background: `radial-gradient(800px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.15), transparent 40%)` 
            }}
          />
        </div>

        {/* --- LAYER 2: KONTEN KARTU UTAMA --- */}
        <div className="relative p-8">
            {/* Header Icons */}
            <div className="mb-8 flex items-center justify-between" style={{ transform: 'translateZ(20px)' }}>
              <div className="flex gap-2.5">
                <div className="h-3.5 w-3.5 rounded-full bg-red-400 shadow-sm"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-yellow-400 shadow-sm"></div>
                <div className="h-3.5 w-3.5 rounded-full bg-emerald-400 shadow-sm"></div>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1.5 text-[11px] font-bold text-secondary-600 shadow-sm dark:bg-white/10 dark:text-secondary-300 backdrop-blur-md border border-white/20">
                <ShieldCheck size={12} className="text-emerald-500"/> tokodiansehat.cc
              </div>
            </div>
            
            <div className="space-y-5">
                {/* Stats Row */}
                <div className="flex gap-4" style={{ transform: 'translateZ(30px)' }}>
                    <div className="relative overflow-hidden h-36 w-3/5 rounded-3xl bg-gradient-to-br from-primary-600 to-emerald-500 p-5 text-white shadow-lg shadow-emerald-500/20 dark:from-primary-700 dark:to-emerald-600">
                      <div className="absolute top-0 right-0 -mt-4 -mr-4 h-20 w-20 rounded-full bg-white/20 blur-xl"></div>
                      <div className="h-10 w-10 rounded-2xl bg-white/20 mb-3 flex items-center justify-center backdrop-blur-sm border border-white/10">
                        <Package size={20}/>
                      </div>
                      <div className="text-3xl font-extrabold tracking-tight">15</div>
                      <div className="text-xs text-primary-50 font-medium mt-1">Total Stok Obat</div>
                    </div>
                    
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

                {/* List Transaksi */}
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
                    
                    <div className="flex items-center gap-4 group/item cursor-default">
                      <div className="h-10 w-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 transition-colors group-hover/item:bg-emerald-500 group-hover/item:text-white dark:bg-emerald-500/20 dark:text-emerald-400">
                        <TrendingUp size={18}/>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-secondary-900 dark:text-white">Paracetamol 500mg</div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">Stok Masuk: <span className="text-emerald-600 font-bold dark:text-emerald-400">+50 Box</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 group/item cursor-default">
                      <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 transition-colors group-hover/item:bg-blue-500 group-hover/item:text-white dark:bg-blue-500/20 dark:text-blue-400">
                        <Box size={18}/>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-secondary-900 dark:text-white">Amoxicillin</div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">Kode Batch <span className="font-mono bg-secondary-100 px-1 rounded dark:bg-white/10">AMO-2610</span></div>
                      </div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- LAYER 3: FLOATING BADGE (NIB) --- */}
        <div 
          className="hidden md:block absolute -right-20 top-24 rounded-2xl bg-white/90 p-4 border border-white/50 animate-[float_4s_ease-in-out_infinite] backdrop-blur-md dark:bg-slate-800/90 dark:border-white/10"
          // Spotlight Hijau Emerald pada Badge NIB
          style={{ 
            transform: 'translateZ(80px)',
            boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)' 
          }} 
        >
           {/* Ambient Glow */}
           <div className="absolute inset-0 bg-emerald-500/5 blur-xl rounded-2xl -z-10" />

           <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-4 ring-blue-50/50 dark:bg-blue-500/20 dark:text-blue-400 dark:ring-blue-900/30">
                <FileCheck size={24}/>
              </div>
              <div>
                <div className="text-sm font-extrabold text-secondary-900 dark:text-white">Izin Berusaha</div>
                <div className="text-[10px] font-medium text-secondary-500 dark:text-secondary-400 font-mono mt-0.5 bg-secondary-100 px-1.5 py-0.5 rounded w-fit dark:bg-white/10">
                  NIB: 0220006731982
                </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}