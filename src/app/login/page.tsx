'use client'

import { createClient } from '../../lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

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
      router.push('/inventory') // Redirect ke halaman stok
      router.refresh()
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        
        {/* --- BANNER TOKO --- */}
        <div className="h-32 w-full bg-green-50 relative">
           <img 
             src="/banner.png" 
             alt="Toko Dian Sehat" 
             className="h-full w-full object-cover"
           />
           {/* Overlay Gradient biar teks kebaca (opsional, tapi estetik) */}
           <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
           <div className="absolute bottom-4 left-6 text-white">
             <h2 className="text-xl font-bold">Admin Portal</h2>
             <p className="text-xs text-gray-200">Silakan login untuk mengelola stok</p>
           </div>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-green-500 focus:ring-green-500"
                placeholder="admin@diansehat.com"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-green-500 focus:ring-green-500"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 px-5 py-3 text-center text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:opacity-50"
            >
              {loading ? 'Memproses...' : 'Masuk ke Sistem'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-xs text-gray-400">
            &copy; 2025 Toko Dian Sehat Management System
          </div>
        </div>
      </div>
    </div>
  )
}