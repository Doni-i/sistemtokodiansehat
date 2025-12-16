import { Sun, Moon } from 'lucide-react'

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDark, toggleTheme }: NavbarProps) {
  return (
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
          <div className="hidden text-sm font-medium text-secondary-500 md:block dark:text-secondary-400">
            Pejaten Branch v2.0
          </div>
        </div>
      </div>
    </nav>
  )
}