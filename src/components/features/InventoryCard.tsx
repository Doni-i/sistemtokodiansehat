// src/components/features/InventoryCard.tsx
'use client'

import { Package, AlertTriangle, ArrowUpRight, CheckCircle2 } from 'lucide-react'
// 1. IMPORT KOMPONEN SPOTLIGHT
import SpotlightCard from '@/components/ui/SpotlightCard' 

export default function InventoryCard() {
  return (
    <div className="relative z-10 mt-12 flex w-full max-w-md flex-col items-center lg:mt-0 lg:max-w-lg">
      
      {/* Efek Blur di belakang kartu (Atmosphere) */}
      <div className="absolute -top-10 -right-10 h-64 w-64 rounded-full bg-primary-500/20 blur-3xl dark:bg-primary-500/10" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-emerald-500/20 blur-3xl dark:bg-emerald-500/10" />

      {/* 2. Mode Glow untuk Spotlight */}
      <SpotlightCard className="w-full overflow-hidden p-6" mode="glow">
        
        {/* Header Mockup */}
        <div className="mb-6 flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-emerald-500 text-white shadow-lg shadow-emerald-500/20">
              <Package size={20} />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-secondary-400">Status Gudang</div>
              <div className="font-bold text-secondary-900 dark:text-white">Live Monitoring</div>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-600 dark:bg-emerald-400"></div> Online
          </div>
        </div>

        {/* Stats Row */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-secondary-50 p-4 dark:bg-white/5">
            <div className="mb-1 text-xs text-secondary-500 dark:text-secondary-400">Total SKU</div>
            <div className="text-2xl font-extrabold text-secondary-900 dark:text-white">2,450</div>
            <div className="flex items-center text-[10px] text-emerald-600 dark:text-emerald-400">
              <ArrowUpRight size={10} className="mr-0.5" /> +120 item
            </div>
          </div>
          <div className="rounded-2xl bg-orange-50 p-4 dark:bg-orange-500/10">
            <div className="mb-1 text-xs text-orange-600 dark:text-orange-300">Low Stock</div>
            <div className="text-2xl font-extrabold text-orange-700 dark:text-orange-400">5</div>
            <div className="flex items-center text-[10px] text-orange-600/80 dark:text-orange-400/80">
              <AlertTriangle size={10} className="mr-0.5" /> Perlu Restock
            </div>
          </div>
        </div>

        {/* List Mockup */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-secondary-400">Transaksi Terakhir</div>
          
          {[
            { name: 'Amoxicillin 500mg', time: 'Baru saja', type: 'Masuk', qty: '+100' },
            { name: 'Paracetamol Strip', time: '2 menit lalu', type: 'Keluar', qty: '-5' },
            { name: 'Tempra Drops', time: '5 menit lalu', type: 'Keluar', qty: '-1' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between rounded-xl border border-secondary-100 bg-white/50 p-3 transition-colors hover:bg-white dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/10">
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full ${item.type === 'Masuk' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-400'}`}>
                   {item.type === 'Masuk' ? <ArrowUpRight size={14}/> : <ArrowUpRight size={14} className="rotate-180"/>}
                </div>
                <div>
                  <div className="text-sm font-bold text-secondary-900 dark:text-white">{item.name}</div>
                  <div className="text-[10px] text-secondary-500">{item.time}</div>
                </div>
              </div>
              <div className={`text-sm font-bold ${item.type === 'Masuk' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                {item.qty}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Alert */}
        <div className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-primary-600 py-3 text-xs font-bold text-white shadow-lg shadow-primary-500/20 dark:bg-primary-500">
          <CheckCircle2 size={14} /> Database Terhubung & Aman
        </div>

      </SpotlightCard>
    </div>
  )
}