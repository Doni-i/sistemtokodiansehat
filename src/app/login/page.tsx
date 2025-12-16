'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lock, Mail, Loader2, ArrowRight } from 'lucide-react'
// Import background agar konsisten
import GridBackground from '@/components/background/GridBackground'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert('Login Gagal: ' + error.message)
      setLoading(false)
    } else {
      router.push('/inventory') 
      router.refresh()
    }
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white font-sans selection:bg-primary-500 selection:text-white dark:bg-slate-950">
      
      {/* 1. Background Konsisten */}
      <GridBackground />

      {/* 2. Login Card */}
      <div className="relative z-10 w-full max-w-md p-6 animate-float">
        
        <Link href="/" className="group mb-8 inline-flex items-center gap-2 text-sm font-medium text-secondary-500 transition-colors hover:text-primary-600 dark:text-secondary-400 dark:hover:text-primary-400">
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Kembali ke Beranda
        </Link>

        <div className="overflow-hidden rounded-3xl border border-white/40 bg-white/40 shadow-2xl backdrop-blur-md dark:border-white/5 dark:bg-slate-900/60 dark:shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
          
          {/* Header Card dengan Gradient Brand */}
          <div className="relative h-32 w-full overflow-hidden bg-gradient-to-br from-primary-600 to-emerald-500 p-6 dark:from-primary-900 dark:to-emerald-800">
             <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
             <div className="relative z-10 flex h-full flex-col justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm shadow-inner">
                   <Lock size={20} />
                </div>
                <div>
                   <h2 className="text-xl font-bold text-white">Akses Admin</h2>
                   <p className="text-xs text-primary-100">Silakan masuk untuk mengelola stok.</p>
                </div>
             </div>
          </div>

          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-5">
              
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Email Address</label>
                <div className="relative group/input">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 transition-colors group-focus-within/input:text-primary-500">
                      <Mail size={18} />
                   </div>
                   <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-xl border border-secondary-200 bg-white/50 p-3 pl-10 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900"
                    placeholder="nama@diansehat.id"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Password</label>
                <div className="relative group/input">
                   <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 transition-colors group-focus-within/input:text-primary-500">
                      <Lock size={18} />
                   </div>
                   <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-xl border border-secondary-200 bg-white/50 p-3 pl-10 text-sm text-secondary-900 placeholder-secondary-400 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-900"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-primary-500/30 transition-all hover:bg-primary-700 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                {/* Shimmer Effect */}
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" /> Memproses...
                  </>
                ) : (
                  <>
                    Masuk ke Dashboard <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-secondary-400">
              &copy; 2025 Toko Dian Sehat Management System
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}