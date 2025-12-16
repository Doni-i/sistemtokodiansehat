'use client'
import { useState, useRef, useEffect } from 'react'
import { Box, Activity, Zap, ShieldCheck } from 'lucide-react'

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
    <div className="relative mt-16 lg:mt-0 lg:h-[600px] lg:w-[600px] flex items-center justify-center perspective-1000">
       <div 
        ref={containerRef}
        className="group/card relative w-[350px] sm:w-[450px] rounded-3xl border border-white/40 bg-white/40 p-6 shadow-2xl backdrop-blur-md transition-transform duration-100 ease-out will-change-transform dark:border-white/5 dark:bg-slate-900/50 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]"
        style={{
          transform: `rotateY(${mousePosition.x * 15}deg) rotateX(${mousePosition.y * -15}deg) translateZ(20px)`,
        }}
      >
        <div 
          className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover/card:opacity-100 dark:block hidden"
          style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)` }}
        />

        <div className="mb-6 flex items-center justify-between">
           <div className="flex gap-2">
             <div className="h-3 w-3 rounded-full bg-red-400"></div>
             <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
             <div className="h-3 w-3 rounded-full bg-green-400"></div>
           </div>
           <div className="text-[10px] text-secondary-500">diansehat.id</div>
        </div>
        
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

            <div className="rounded-2xl bg-white p-4 shadow-sm border border-secondary-100 space-y-3 dark:bg-white/5 dark:border-white/5">
                 <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-bold text-secondary-400">RECENT ACTIVITY</div>
                 </div>
                 <div className="flex items-center gap-3 border-b border-secondary-50 pb-2 dark:border-white/5">
                   <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center text-green-600 dark:bg-green-900/30"><Zap size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Paracetamol 500mg</div>
                     <div className="text-xs text-secondary-400">Stok Masuk: +50 Box</div>
                   </div>
                 </div>
                 <div className="flex items-center gap-3">
                   <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 dark:bg-blue-900/30"><Box size={14}/></div>
                   <div className="flex-1">
                     <div className="text-sm font-bold text-secondary-800 dark:text-gray-200">Amoxicillin</div>
                     <div className="text-xs text-secondary-400">Batch #8821 Verified</div>
                   </div>
                 </div>
            </div>
        </div>

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
  )
}