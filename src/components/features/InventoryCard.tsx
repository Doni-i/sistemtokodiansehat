// src/components/features/InventoryCard.tsx
'use client'
import { useState, useRef, useEffect } from 'react'
import { Box, Activity, Zap, ShieldCheck } from 'lucide-react'

export default function InventoryCard() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Logic posisi mouse hanya berjalan jika komponen ini ada di layar
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
    <div className="relative mt-16 lg:mt-0 lg:h-[600px] lg:w-[600px] flex items-center justify-center perspective-1000">
       <div 
        ref={containerRef}
        className="group/card relative w-[350px] sm:w-[450px] rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md transition-transform duration-100 ease-out will-change-transform dark:border-white/5 dark:bg-slate-900/50 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        style={{
          transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg) translateZ(20px)`,
        }}
      >
        {/* Spotlight Effect */}
        <div 
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100 dark:block hidden"
          style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)` }}
        />

        {/* ISI KONTEN KARTU (Header, Chart, List) --- Copas bagian dalam div kartu tadi kesini --- */}
        {/* ... (Kode bagian dalam kartu sama persis seperti sebelumnya) ... */}
        
        {/* Contoh singkat isi biar tidak kepanjangan di chat: */}
        <div className="mb-6 flex items-center justify-between">
           <div className="flex gap-2">
             <div className="h-3 w-3 rounded-full bg-red-400"></div>
             <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
             <div className="h-3 w-3 rounded-full bg-green-400"></div>
           </div>
           <div className="text-[10px] text-secondary-500">diansehat.id</div>
        </div>
        
        <div className="h-32 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-300 p-4 text-white shadow-lg mb-4">
            <div className="text-2xl font-bold">2,850</div>
            <div className="text-xs opacity-80">Total Item Terdaftar</div>
        </div>
        {/* ... Sisa konten kartu ... */}

      </div>
    </div>
  )
}