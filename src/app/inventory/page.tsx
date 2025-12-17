'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ScanBarcode, LogOut, Plus, X, Save, Trash2, 
  AlertTriangle, Package, Search, Calendar, Activity, 
  ArrowUpRight, Filter, ChevronDown 
} from 'lucide-react'
import GridBackground from '@/components/background/GridBackground'
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'
import SpotlightCard from '@/components/ui/SpotlightCard'

export default function InventoryPage() {
  // --- STATE ---
  const [stokList, setStokList] = useState<any[]>([])
  const [obatList, setObatList] = useState<any[]>([])
  const [chartData, setChartData] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // State khusus untuk waktu server (Jakarta Timezone)
  const [serverTime, setServerTime] = useState("")

  // Effect untuk menjalankan jam Realtime & Lock Jakarta Timezone
  useEffect(() => {
    const updateTime = () => {
      const timeString = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta', // <--- Lock ke Jakarta Timezone
        hour12: false
      });
      setServerTime(timeString);
    }

    updateTime(); // Jalankan sekali di awal
    const interval = setInterval(updateTime, 1000); // Update setiap 1 detik

    return () => clearInterval(interval); // Bersihkan memori saat pindah halaman
  }, []);

  // --- FORM STATE ---
  const [formData, setFormData] = useState({
    id_obat: '',
    no_batch: '',
    barcode_batch: '',
    tanggal_kedaluwarsa: '',
    jumlah_stok: ''
  })

  const supabase = createClient()
  const router = useRouter()
  const searchInputRef = useRef<HTMLInputElement>(null)

  // --- 1. DATA PROCESSING FOR CHART ---
  const processChartData = (transactions: any[]) => {
    const monthlyStats: Record<string, { masuk: number; keluar: number; order: number }> = {}
    transactions.forEach(trx => {
        const date = new Date(trx.tanggal_waktu)
        const monthName = date.toLocaleDateString('id-ID', { month: 'short' })
        const monthIndex = date.getMonth()
        if (!monthlyStats[monthName]) {
            monthlyStats[monthName] = { masuk: 0, keluar: 0, order: monthIndex }
        }
        if (trx.tipe_transaksi === 'Masuk') {
            monthlyStats[monthName].masuk += trx.kuantitas
        } else {
            monthlyStats[monthName].keluar += trx.kuantitas
        }
    })
    return Object.keys(monthlyStats)
        .map(key => ({
            name: key,
            masuk: monthlyStats[key].masuk,
            keluar: monthlyStats[key].keluar,
            order: monthlyStats[key].order
        }))
        .sort((a, b) => a.order - b.order)
  }

  // --- 2. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { data: stok } = await supabase
      .from('stok_obat')
      .select(`
        id, jumlah_stok, dihapus_pada,
        batch_obat!inner (
          id, no_batch, tanggal_kedaluwarsa, barcode_batch,
          obat (id, nama_obat, satuan, harga_jual)
        )
      `)
      .is('dihapus_pada', null) 
      .order('id', { ascending: false })
    
    if (stok) setStokList(stok)

    const { data: obat } = await supabase.from('obat').select('id, nama_obat').order('nama_obat')
    if (obat) setObatList(obat)

    const { data: transaksi } = await supabase
        .from('transaksi_inventori')
        .select('tipe_transaksi, kuantitas, tanggal_waktu')
        .order('tanggal_waktu', { ascending: true })

    if (transaksi) {
        setChartData(processChartData(transaksi))
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- 3. ACTIONS ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Sesi habis.")

      const smartBarcode = formData.barcode_batch || `899${Math.floor(Math.random() * 10000000)}`

      const { error } = await supabase.rpc('tambah_stok_lengkap', {
        p_id_obat: parseInt(formData.id_obat),
        p_no_batch: formData.no_batch,
        p_barcode_batch: smartBarcode,
        p_expired: formData.tanggal_kedaluwarsa,
        p_qty: parseInt(formData.jumlah_stok),
        p_id_user: user.id
      })

      if (error) throw error
      alert('✅ Stok Berhasil Ditambahkan!')
      setIsModalOpen(false)
      setFormData({ id_obat: '', no_batch: '', barcode_batch: '', tanggal_kedaluwarsa: '', jumlah_stok: '' })
      fetchData()
    } catch (err: any) {
      alert('❌ Gagal: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (idStok: number) => {
    if (!confirm('Arsipkan stok ini?')) return;
    const { error } = await supabase.from('stok_obat').update({ dihapus_pada: new Date().toISOString() }).eq('id', idStok)
    if (!error) setStokList(prev => prev.filter(item => item.id !== idStok))
  }

  // --- 4. CALCULATIONS ---
  const filteredData = stokList.filter((item) => {
    const term = search.toLowerCase()
    return (
        item.batch_obat?.obat?.nama_obat?.toLowerCase().includes(term) ||
        item.batch_obat?.barcode_batch?.includes(term) ||
        item.batch_obat?.no_batch?.toLowerCase().includes(term)
    )
  })

  const totalItem = stokList.reduce((acc, curr) => acc + curr.jumlah_stok, 0)
  const lowStock = stokList.filter(item => item.jumlah_stok < 10).length
  const expiredCount = stokList.filter(item => new Date(item.batch_obat?.tanggal_kedaluwarsa) < new Date()).length

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-white font-sans text-secondary-900 selection:bg-primary-500 selection:text-white dark:bg-slate-950 dark:text-white transition-colors duration-500">
      
      <GridBackground />

      {/* MODAL DIPINDAHKAN KE SINI (DI LUAR div konten utama agar z-index aman) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-secondary-900/40 p-4 backdrop-blur-md transition-all">
          <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-300 dark:bg-slate-900 border border-white/20 ring-1 ring-black/5">
            <div className="mb-6 flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-white/10">
              <h2 className="text-xl font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                <Package className="text-primary-600"/> Input Barang Masuk
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-900 dark:hover:bg-white/10 dark:hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                 <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Scan Barcode</label>
                 <div className="relative">
                    <ScanBarcode className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                    <input
                        type="text"
                        className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 pl-10 text-secondary-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-800"
                        placeholder="Kosongkan untuk auto-generate..."
                        value={formData.barcode_batch}
                        onChange={e => setFormData({...formData, barcode_batch: e.target.value})}
                      />
                 </div>
              </div>
              <div>
                 <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Pilih Obat</label>
                 <div className="relative">
                   <select required className="block w-full appearance-none rounded-xl border border-secondary-200 bg-secondary-50 p-3 text-secondary-900 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500 dark:focus:bg-slate-800"
                    value={formData.id_obat} onChange={e => setFormData({...formData, id_obat: e.target.value})}>
                    <option value="">-- Cari Nama Obat --</option>
                    {obatList.map(obat => (
                      <option key={obat.id} value={obat.id} className="dark:bg-slate-900">{obat.nama_obat}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-secondary-500"><ChevronDown size={16}/></div>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">No. Batch</label>
                  <input type="text" required className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-800" 
                    placeholder="e.g. B-001" value={formData.no_batch} onChange={e => setFormData({...formData, no_batch: e.target.value})} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Tgl. Kedaluwarsa</label>
                  <input type="date" required className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 outline-none focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:bg-slate-800" 
                    value={formData.tanggal_kedaluwarsa} onChange={e => setFormData({...formData, tanggal_kedaluwarsa: e.target.value})} />
                </div>
              </div>
              <div>
                 <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Jumlah Stok</label>
                 <div className="relative">
                    <input type="number" required min="1" className="block w-full rounded-xl border-primary-200 bg-primary-50/50 p-4 text-2xl font-bold text-primary-700 outline-none transition-all focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/10 dark:border-primary-900/50 dark:bg-primary-900/10 dark:text-primary-400 dark:focus:bg-slate-800" 
                      value={formData.jumlah_stok} onChange={e => setFormData({...formData, jumlah_stok: e.target.value})} />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-primary-400">UNIT</div>
                 </div>
              </div>
              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-secondary-100 dark:border-white/10">
                <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-secondary-200 px-6 py-3 font-medium text-secondary-600 hover:bg-secondary-50 transition-colors dark:border-white/10 dark:text-secondary-300 dark:hover:bg-white/5">Batalkan</button>
                <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all active:scale-95 disabled:opacity-70 dark:bg-primary-500">
                  {submitting ? 'Menyimpan...' : <><Save size={18} /> Simpan Data</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KONTEN UTAMA */}
      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8 space-y-8">
        
        {/* --- HEADER (GLASS) --- */}
        <SpotlightCard className="flex flex-col justify-between gap-4 md:flex-row md:items-center p-6" mode="glow">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-secondary-900 dark:text-white">
              Dashboard <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-400">Inventori</span>
            </h1>
            <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400 mt-1">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Versi 1.0.0
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <div className="hidden md:block text-right mr-4 border-r border-secondary-200 pr-6 dark:border-white/10">
                <div className="text-[10px] font-bold tracking-widest text-secondary-400 uppercase">Server Time</div>
                <div className="font-mono font-medium text-secondary-600 dark:text-secondary-300 min-w-[60px]">
                  {/* Gunakan state serverTime, atau tampilkan loading strip jika belum siap */}
                  {serverTime || "--:--"} WIB
                </div>
             </div>
            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="group flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/50 px-5 py-2.5 text-red-600 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all dark:border-red-900/30 dark:bg-red-900/10 dark:text-red-400 dark:hover:bg-red-600 dark:hover:text-white"
            >
              <LogOut size={18} className="transition-transform group-hover:-translate-x-1" /> 
              <span className="font-medium">Keluar</span>
            </button>
          </div>
        </SpotlightCard>

        {/* --- STATS CARDS (SPOTLIGHT EFFECT!) --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Card 1: Total Aset */}
            <SpotlightCard className="p-6 bg-gradient-to-br from-primary-600/90 to-emerald-600/90 text-white dark:from-primary-900/80 dark:to-emerald-900/80 border-none" mode="default">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-white/20 blur-2xl"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-md shadow-inner"><Package size={28}/></div>
                    <div>
                        <div className="text-sm font-medium text-primary-100">Total Stok</div>
                        <div className="text-4xl font-extrabold tracking-tight mt-1">{totalItem}</div>
                    </div>
                </div>
            </SpotlightCard>

            {/* Card 2: Restock */}
            <SpotlightCard className="p-6" mode="glow">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"><AlertTriangle size={28}/></div>
                    <div>
                        <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Perlu Restock</div>
                        <div className="text-4xl font-bold text-secondary-900 dark:text-white">{lowStock}</div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-secondary-400">Obat dengan stok &lt; 10 unit</div>
            </SpotlightCard>

            {/* Card 3: Expired */}
            <SpotlightCard className="p-6" mode="glow">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"><Calendar size={28}/></div>
                    <div>
                        <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">OBAT KADALUARSA</div>
                        <div className="text-4xl font-bold text-secondary-900 dark:text-white">{expiredCount}</div>
                    </div>
                </div>
                <div className="mt-4 text-xs text-secondary-400">SEGERA BUANG DARI ETALASE TOKO!!</div>
            </SpotlightCard>
        </div>

        {/* --- GRAFIK RGB (SPOTLIGHT WRAPPER) --- */}
        <SpotlightCard className="p-6" mode="glow">
          <div className="flex items-center justify-between mb-6">
             <div>
                <h3 className="text-lg font-bold text-secondary-900 dark:text-white flex items-center gap-2">
                  <Activity size={20} className="text-primary-500"/> Tren Pergerakan Stok
                </h3>
                <p className="text-xs text-secondary-500 dark:text-secondary-400">Analisis barang masuk vs keluar per bulan</p>
             </div>
             <div className="flex gap-2">
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold dark:bg-emerald-900/20 dark:text-emerald-400">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Masuk
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-50 text-red-600 text-xs font-bold dark:bg-red-900/20 dark:text-red-400">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> Keluar
                </div>
             </div>
          </div>
          
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorMasuk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorKeluar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', backdropFilter: 'blur(10px)' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="masuk" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorMasuk)" />
                <Area type="monotone" dataKey="keluar" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorKeluar)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </SpotlightCard>

        {/* --- TOOLBAR --- */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full rounded-2xl border border-secondary-200 bg-white/50 p-3 pl-12 text-secondary-900 shadow-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:focus:border-primary-500"
                  placeholder="Cari obat..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             
             {/* SHIMMERING BUTTON (KILAUAN) */}
             <button 
                onClick={() => setIsModalOpen(true)}
                className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-2xl bg-primary-600 px-6 py-3 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0" />
                <span className="relative z-10 flex items-center gap-2">
                    <Plus size={20} /> Input Stok Baru
                </span>
              </button>
        </div>

        {/* --- TABEL (SPOTLIGHT WRAPPER JUGA) --- */}
        <SpotlightCard className="overflow-hidden p-0 border border-secondary-200 dark:border-white/10" mode="glow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-white/5">
              <thead className="bg-secondary-50/80 dark:bg-white/5 backdrop-blur-sm">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Detail Obat</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Batch & Exp</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Stok</th>
                  <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Opsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/5 bg-transparent">
                {loading ? (
                   <tr><td colSpan={5} className="p-12 text-center text-secondary-500 animate-pulse">Sedang memuat data dari satelit...</td></tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const isExpired = new Date(item.batch_obat?.tanggal_kedaluwarsa) < new Date();
                    return (
                    <tr key={item.id} className="group hover:bg-primary-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-secondary-900 text-base dark:text-white">{item.batch_obat?.obat?.nama_obat}</div>
                        <div className="flex gap-2 mt-1">
                           <span className="text-[10px] font-bold text-secondary-500 bg-secondary-100 dark:bg-white/10 dark:text-secondary-300 px-2 py-0.5 rounded">{item.batch_obat?.obat?.satuan}</span>
                           <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded">
                             Rp {item.batch_obat?.obat?.harga_jual?.toLocaleString('id-ID')}
                           </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-secondary-500 dark:text-secondary-400 mb-1 flex items-center gap-2">
                           <span className="font-mono bg-secondary-100 dark:bg-white/10 px-1.5 rounded text-secondary-700 dark:text-secondary-300">{item.batch_obat?.no_batch}</span>
                        </div>
                        <div className="text-xs text-secondary-400 font-mono opacity-70">
                           {item.batch_obat?.barcode_batch || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                          isExpired 
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        }`}>
                          {isExpired ? <AlertTriangle size={12}/> : <Calendar size={12}/>}
                          {new Date(item.batch_obat?.tanggal_kedaluwarsa).toLocaleDateString('id-ID', {day: 'numeric', month: 'short', year: 'numeric'})}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xl font-extrabold ${item.jumlah_stok < 10 ? 'text-red-600 dark:text-red-400' : 'text-secondary-900 dark:text-white'}`}>
                          {item.jumlah_stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="group/btn relative inline-flex items-center justify-center p-2 rounded-xl text-secondary-400 hover:text-red-600 hover:bg-red-50 transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400"
                          title="Arsipkan"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )})
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-16 text-center text-secondary-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Search size={32} className="text-secondary-300 opacity-50"/>
                        <p>Data tidak ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SpotlightCard>

      </div>
    </div>
  )
}