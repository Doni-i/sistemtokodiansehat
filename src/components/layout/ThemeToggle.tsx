'use client'
import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  // Cek tema awal saat load
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true)
    }
  }, [])

  const toggle = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <button
      onClick={toggle}
      className="fixed bottom-6 right-6 z-[9999] flex h-12 w-12 items-center justify-center rounded-full bg-white text-secondary-900 shadow-xl ring-1 ring-black/5 transition-all hover:scale-110 active:scale-95 dark:bg-slate-800 dark:text-white dark:ring-white/10"
      title="Ganti Tema"
    >
      {isDark ? <Sun size={24} /> : <Moon size={24} />}
    </button>
  )
}