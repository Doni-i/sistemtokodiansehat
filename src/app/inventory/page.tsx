'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScanBarcode, LogOut, Plus, X, Save, Trash2, AlertTriangle, Package, Search, Calendar, History } from 'lucide-react'
import GridBackground from '@/components/background/GridBackground' // Import Background

export default function InventoryPage() {
  const [stokList, setStokList] = useState<any[]>([])
  const [obatList, setObatList] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Form State
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

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    // Ambil Data Stok
    const { data: stok, error } = await supabase
      .from('stok_obat')
      .select(`
        id, jumlah_stok,
        batch_obat!inner (
          id, no_batch, tanggal_kedaluwarsa, barcode_batch,
          obat (id, nama_obat, satuan)
        )
      `)
      .order('id', { ascending: false })
    
    if (stok) setStokList(stok)

    // Ambil Data Master Obat 
    const { data: obat } = await supabase.from('obat').select('id, nama_obat').order('nama_obat')
    if (obat) setObatList(obat)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  // --- HANDLE SUBMIT (RPC) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("User tidak terautentikasi")

      const { error } = await supabase.rpc('tambah_stok_lengkap', {
        p_id_obat: parseInt(formData.id_obat),
        p_no_batch: formData.no_batch,
        p_barcode_batch: formData.barcode_batch,
        p_expired: formData.tanggal_kedaluwarsa,
        p_qty: parseInt(formData.jumlah_stok),
        p_id_user: user.id
      })

      if (error) throw error

      alert('✅ Berhasil! Data tersimpan aman.')
      setIsModalOpen(false)
      setFormData({ id_obat: '', no_batch: '', barcode_batch: '', tanggal_kedaluwarsa: '', jumlah_stok: '' })
      fetchData()
    } catch (err: any) {
      alert('❌ Gagal: ' + err.message)
    } finally {
      setSubmitting(false)
    }
  }

  // --- HANDLE DELETE ---
  const handleDelete = async (idStok: number) => {
    if (!confirm('Hapus stok ini?')) return;
    const { error } = await supabase.from('stok_obat').delete().eq('id', idStok)
    if (!error) setStokList(prev => prev.filter(item => item.id !== idStok))
  }

  // --- FILTER & STATS ---
  const filteredData = stokList.filter((item) => {
    const term = search.toLowerCase()
    const namaObat = item.batch_obat?.obat?.nama_obat?.toLowerCase() || ''
    const barcode = item.batch_obat?.barcode_batch || ''
    return namaObat.includes(term) || barcode.includes(term)
  })

  // Hitung Statistik Sederhana
  const totalItem = stokList.reduce((acc, curr) => acc + curr.jumlah_stok, 0)
  const lowStock = stokList.filter(item => item.jumlah_stok < 10).length
  const expiredCount = stokList.filter(item => new Date(item.batch_obat?.tanggal_kedaluwarsa) < new Date()).length

  return (
    <div className="relative min-h-screen w-full bg-white font-sans text-secondary-900 selection:bg-primary-500 selection:text-white dark:bg-slate-950 dark:text-white transition-colors duration-500">
      
      <GridBackground />

      <div className="relative z-10 mx-auto max-w-7xl p-4 md:p-8">
        
        {/* --- HEADER DASHBOARD --- */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center rounded-3xl border border-white/40 bg-white/40 p-6 shadow-xl backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-secondary-900 dark:text-white">Dashboard Inventori</h1>
            <div className="flex items-center gap-2 text-sm text-secondary-500 dark:text-secondary-400">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live System v2.0 • Dian Sehat Pagujaten
            </div>
          </div>
          <div className="flex gap-3">
             {/* Stats Ringkas di Header */}
             <div className="hidden md:flex gap-4 mr-4 border-r border-secondary-200 pr-4 dark:border-white/10">
                <div className="text-right">
                    <div className="text-xs font-bold text-secondary-400 uppercase">Total Aset</div>
                    <div className="font-mono font-bold text-primary-600 dark:text-primary-400">{totalItem} Unit</div>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-secondary-400 uppercase">Perlu Restock</div>
                    <div className="font-mono font-bold text-red-500">{lowStock} Item</div>
                </div>
             </div>

            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="flex items-center gap-2 rounded-xl border border-secondary-200 bg-white/50 px-4 py-2 text-secondary-700 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-red-900/20 dark:hover:text-red-400"
            >
              <LogOut size={18} /> <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>

        {/* --- STATS CARDS (Agar terlihat seperti ERP) --- */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
            <div className="rounded-2xl border border-white/40 bg-gradient-to-br from-emerald-500 to-primary-600 p-6 text-white shadow-lg dark:border-white/5 dark:from-emerald-600 dark:to-primary-800">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-white/20 backdrop-blur-sm"><Package size={24}/></div>
                    <div>
                        <div className="text-sm font-medium opacity-80">Total SKU Obat</div>
                        <div className="text-3xl font-bold tracking-tight">{stokList.length}</div>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400"><AlertTriangle size={24}/></div>
                    <div>
                        <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Stok Menipis</div>
                        <div className="text-3xl font-bold text-secondary-900 dark:text-white">{lowStock}</div>
                    </div>
                </div>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/40 p-6 shadow-lg backdrop-blur-md dark:border-white/5 dark:bg-slate-900/50">
                <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400"><Calendar size={24}/></div>
                    <div>
                        <div className="text-sm font-medium text-secondary-500 dark:text-secondary-400">Kadaluarsa</div>
                        <div className="text-3xl font-bold text-secondary-900 dark:text-white">{expiredCount}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* --- TOOLBAR & SEARCH --- */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
             <div className="relative w-full sm:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary-400 group-focus-within:text-primary-500 transition-colors" />
                <input
                  ref={searchInputRef}
                  type="text"
                  className="block w-full rounded-2xl border border-secondary-200 bg-white/50 p-3 pl-12 text-secondary-900 shadow-sm outline-none focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all dark:border-white/10 dark:bg-slate-900/50 dark:text-white dark:focus:border-primary-500"
                  placeholder="Cari nama obat, barcode, atau batch..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             
             <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-primary-600 px-6 py-3 text-white font-bold shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600"
              >
                <Plus size={20} /> Input Stok Baru
              </button>
        </div>

        {/* --- TABEL GLASS --- */}
        <div className="overflow-hidden rounded-3xl border border-secondary-200 bg-white/40 shadow-xl backdrop-blur-md dark:border-white/5 dark:bg-slate-900/40">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200 dark:divide-white/5">
              <thead className="bg-secondary-50/50 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Obat</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Batch Info</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Status</th>
                  <th className="px-6 py-5 text-left text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Jumlah</th>
                  <th className="px-6 py-5 text-right text-xs font-bold uppercase tracking-wider text-secondary-500 dark:text-secondary-400">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-secondary-200 dark:divide-white/5 bg-transparent">
                {loading ? (
                   <tr><td colSpan={5} className="p-8 text-center text-secondary-500 animate-pulse">Menghubungkan ke satelit database...</td></tr>
                ) : filteredData.length > 0 ? (
                  filteredData.map((item) => {
                    const isExpired = new Date(item.batch_obat?.tanggal_kedaluwarsa) < new Date();
                    
                    return (
                    <tr key={item.id} className="group hover:bg-white/40 dark:hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-secondary-900 text-base dark:text-white">{item.batch_obat?.obat?.nama_obat}</div>
                        <div className="text-xs font-medium text-secondary-500 bg-secondary-100 dark:bg-white/10 dark:text-secondary-300 inline-block px-2 py-0.5 rounded mt-1">{item.batch_obat?.obat?.satuan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-xs text-secondary-600 dark:text-secondary-400">
                           <span className="opacity-50">CODE:</span> {item.batch_obat?.barcode_batch || '-'}
                        </div>
                        <div className="font-mono text-xs text-secondary-600 dark:text-secondary-400 mt-1">
                           <span className="opacity-50">BATCH:</span> {item.batch_obat?.no_batch}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                         <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold border ${
                          isExpired 
                            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        }`}>
                          {isExpired && <AlertTriangle size={12}/>}
                          {item.batch_obat?.tanggal_kedaluwarsa}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${item.jumlah_stok < 10 ? 'text-red-600 dark:text-red-400' : 'text-secondary-900 dark:text-white'}`}>
                          {item.jumlah_stok}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleDelete(item.id)} className="text-secondary-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all dark:hover:bg-red-900/20 dark:hover:text-red-400">
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )})
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary-500">
                      Data tidak ditemukan. Silakan input stok baru.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL (POPUP) GLASS --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-all">
            <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200 dark:bg-slate-900 border border-white/10">
              <div className="mb-6 flex items-center justify-between border-b border-secondary-100 pb-4 dark:border-white/10">
                <h2 className="text-xl font-bold text-secondary-900 dark:text-white">Input Barang Masuk</h2>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full p-2 text-secondary-400 hover:bg-secondary-100 hover:text-secondary-900 dark:hover:bg-white/10 dark:hover:text-white"><X size={20} /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Input Fields dengan Style Baru */}
                <div>
                   <label className="mb-1 block text-xs font-bold uppercase text-secondary-500 dark:text-secondary-400">Scan Barcode</label>
                   <input
                      type="text"
                      required
                      autoFocus
                      className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 text-secondary-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500"
                      placeholder="Scan..."
                      value={formData.barcode_batch}
                      onChange={e => setFormData({...formData, barcode_batch: e.target.value})}
                    />
                </div>

                <div>
                   <label className="mb-1 block text-xs font-bold uppercase text-secondary-500 dark:text-secondary-400">Nama Obat</label>
                   <select 
                    required
                    className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 text-secondary-900 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-primary-500"
                    value={formData.id_obat}
                    onChange={e => setFormData({...formData, id_obat: e.target.value})}
                  >
                    <option value="">-- Pilih Obat --</option>
                    {obatList.map(obat => (
                      <option key={obat.id} value={obat.id} className="dark:bg-slate-900">{obat.nama_obat}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-secondary-500 dark:text-secondary-400">No. Batch</label>
                    <input type="text" required className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white" 
                      value={formData.no_batch} onChange={e => setFormData({...formData, no_batch: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-bold uppercase text-secondary-500 dark:text-secondary-400">Expired</label>
                    <input type="date" required className="block w-full rounded-xl border border-secondary-200 bg-secondary-50 p-3 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-white/10 dark:bg-white/5 dark:text-white" 
                      value={formData.tanggal_kedaluwarsa} onChange={e => setFormData({...formData, tanggal_kedaluwarsa: e.target.value})} />
                  </div>
                </div>

                <div>
                   <label className="mb-1 block text-xs font-bold uppercase text-secondary-500 dark:text-secondary-400">Jumlah Stok</label>
                   <input type="number" required min="1" className="block w-full rounded-xl border-primary-200 bg-primary-50 p-3 text-lg font-bold text-primary-700 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 dark:border-primary-900/50 dark:bg-primary-900/20 dark:text-primary-400" 
                     value={formData.jumlah_stok} onChange={e => setFormData({...formData, jumlah_stok: e.target.value})} />
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border border-secondary-200 px-5 py-2.5 font-medium text-secondary-600 hover:bg-secondary-50 dark:border-white/10 dark:text-secondary-300 dark:hover:bg-white/5">Batal</button>
                  <button type="submit" disabled={submitting} className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-2.5 font-bold text-white shadow-lg shadow-primary-500/30 hover:bg-primary-700 hover:scale-105 transition-all dark:bg-primary-500">
                    {submitting ? 'Menyimpan...' : <><Save size={18} /> Simpan Data</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}