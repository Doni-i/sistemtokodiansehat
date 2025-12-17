// src/components/features/InventoryCard.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { Box, Activity, Zap, ShieldCheck, Package } from 'lucide-react'

export default function InventoryCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Menghitung posisi mouse relatif terhadap window untuk rotasi
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
      
      // Menghitung posisi mouse relatif terhadap kartu untuk efek spotlight
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
       
       {/* Ambient Glow di belakang kartu*/}
       <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-emerald-500/20 blur-[100px] rounded-full dark:bg-emerald-500/10 pointer-events-none" />

       <div 
        ref={containerRef}
        className="group/card relative w-[350px] sm:w-[450px] rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md transition-transform duration-100 ease-out will-change-transform dark:border-white/5 dark:bg-slate-900/50 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        style={{
          transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg) translateZ(20px)`,
        }}
      >
        {/* SPOTLIGHT EFFECT (Updated to GREEN/EMERALD) */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100"
          style={{ 
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(16, 185, 129, 0.2), transparent 40%)` 
          }}
        />

        {/* Browser Dots */}
        <div className="mb-6 flex items-center justify-between relative z-10">
           <div className="flex gap-2">
             <div className="h-3 w-3 rounded-full bg-red-400"></div>
             <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
             <div className="h-3 w-3 rounded-full bg-green-400"></div>
           </div>
           <div className="text-[10px] font-mono text-secondary-500 bg-white/50 px-2 py-1 rounded-md dark:bg-white/10 dark:text-secondary-400">
             admin.diansehat.id
           </div>
        </div>
        
        {/* Card Content */}
        <div className="space-y-4 relative z-10">
            <div className="flex gap-4">
                {/* Main Stats - Gradient Hijau */}
                <div className="h-32 w-1/2 rounded-2xl bg-gradient-to-br from-primary-600 to-emerald-500 p-4 text-white shadow-lg dark:from-primary-700 dark:to-emerald-600">
                   <div className="h-8 w-8 rounded-full bg-white/20 mb-4 flex items-center justify-center"><Package size={16}/></div>
                   <div className="text-2xl font-bold">2,450</div>
                   <div className="text-xs opacity-90 font-medium">Total SKU Terdaftar</div>
                </div>
                
                {/* Alert Stats */}
                <div className="h-32 w-1/2 rounded-2xl bg-white p-4 shadow-sm border border-secondary-100 dark:bg-white/5 dark:border-white/5">
                   <div className="h-8 w-8 rounded-full bg-orange-100 text-orange-600 mb-4 flex items-center justify-center dark:bg-orange-900/30 dark:text-orange-400"><Activity size={16}/></div>
                   <div className="text-2xl font-bold text-secondary-800 dark:text-white">5</div>
                   <div className="text-xs text-secondary-400 dark:text-secondary-400">Low Stock Alert</div>
                </div>
            </div>

            {/* Recent Activity List */}
            <div className="rounded-2xl bg-white/80 p-4 shadow-sm border border-secondary-100 space-y-3 dark:bg-white/5 dark:border-white/5 backdrop-blur-sm">
                 <div className="flex items-center justify-between mb-2">
                   <div className="text-xs font-bold text-secondary-400 tracking-wider">LIVE TRANSACTIONS</div>
                 </div>
                 
                 {/* Item 1 */}
                 <div className="flex items-center gap-3 border-b border-secondary-100/50 pb-2 dark:border-white/5">
                   <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"><Zap size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Paracetamol 500mg</div>
                     <div className="text-xs text-secondary-400">Stok Masuk: <span className="text-emerald-600 font-bold">+50 Box</span></div>
                   </div>
                 </div>

                 {/* Item 2 */}
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"><Box size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Amoxicillin</div>
                     <div className="text-xs text-secondary-400">Batch <span className="font-mono">AMO-2610</span> Verified</div>
                   </div>
                 </div>
            </div>
        </div>

        {/* Floating Badge (3D Effect) */}
        <div 
          className="absolute -right-8 top-16 rounded-2xl bg-white p-4 shadow-xl border border-secondary-100 animate-float dark:bg-slate-800 dark:border-white/10"
          style={{ transform: 'translateZ(50px)' }}
        >
           <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                <ShieldCheck size={20}/>
              </div>
              <div>
                <div className="text-sm font-bold text-secondary-800 dark:text-white">Database Aman</div>
                <div className="text-[10px] text-secondary-400 dark:text-secondary-400">Encrypted AES-256</div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}