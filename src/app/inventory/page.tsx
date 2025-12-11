'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ScanBarcode, Search, LogOut, Plus, X, Save } from 'lucide-react'

export default function InventoryPage() {
  const [stokList, setStokList] = useState<any[]>([])
  const [obatList, setObatList] = useState<any[]>([]) // List nama oba
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false) // Modal state
  
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
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  // 1. Fetch Data Awal
  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    // Ambil Data Stok
    const { data: stok } = await supabase
      .from('stok_obat')
      .select(`
        id, jumlah_stok,
        batch_obat (
          no_batch, tanggal_kedaluwarsa, barcode_batch,
          obat (id, nama_obat, satuan)
        )
      `)
    if (stok) setStokList(stok)

    // Ambil Data Master Obat 
    const { data: obat } = await supabase.from('obat').select('id, nama_obat')
    if (obat) setObatList(obat)

    setLoading(false)
  }

  useEffect(() => {
    fetchData()
    if(searchInputRef.current) searchInputRef.current.focus()
  }, [])

  // 2. Handle Submit Form (Tambah Stok)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // A. Insert ke Batch
      const { data: batchData, error: batchError } = await supabase
        .from('batch_obat')
        .insert({
          id_obat: parseInt(formData.id_obat),
          no_batch: formData.no_batch,
          barcode_batch: formData.barcode_batch,
          tanggal_kedaluwarsa: formData.tanggal_kedaluwarsa
        })
        .select()
        .single()

      if (batchError) throw batchError

      // B. Insert ke Stok
      const { error: stokError } = await supabase
        .from('stok_obat')
        .insert({
          id_batch_obat: batchData.id,
          jumlah_stok: parseInt(formData.jumlah_stok)
        })

      if (stokError) throw stokError

      // C. Catat Histori Transaksi (Audit Trail)
      // ID admin (auth user)
      const { data: { user } } = await supabase.auth.getUser()
      // Cari profil admin berdasarkan auth_id
      const { data: adminProfile } = await supabase.from('profil_admin').select('id').eq('auth_id', user?.id).single()
      
      if (adminProfile) {
         await supabase.from('transaksi_inventori').insert({
            tipe_transaksi: 'Masuk',
            id_batch_obat: batchData.id,
            kuantitas: parseInt(formData.jumlah_stok),
            id_admin: adminProfile.id,
            keterangan: 'Input Stok Baru via Web'
         })
      }

      alert('Berhasil menambah stok!')
      setIsModalOpen(false)
      setFormData({ id_obat: '', no_batch: '', barcode_batch: '', tanggal_kedaluwarsa: '', jumlah_stok: '' })
      fetchData() // Refresh tabel

    } catch (err: any) {
      alert('Gagal: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  // 3. Logic Filter Search
  const filteredData = stokList.filter((item) => {
    const term = search.toLowerCase()
    const namaObat = item.batch_obat?.obat?.nama_obat?.toLowerCase() || ''
    const barcode = item.batch_obat?.barcode_batch || ''
    return namaObat.includes(term) || barcode.includes(term)
  })

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* --- HEADER --- */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gudang Obat</h1>
            <p className="text-gray-500">Sistem Inventori Toko Dian Sehat</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 shadow-sm"
            >
              <Plus size={18} /> Tambah Stok
            </button>
            <button 
              onClick={async () => { await supabase.auth.signOut(); router.push('/login') }}
              className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>

        {/* --- SEARCH BAR --- */}
        <div className="mb-6 rounded-xl bg-white p-2 shadow-sm border border-gray-200">
          <div className="relative flex items-center">
            <ScanBarcode className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              ref={searchInputRef}
              type="text"
              className="block w-full rounded-lg border-none bg-transparent p-3 pl-10 text-gray-900 focus:ring-0"
              placeholder="Scan Barcode / Cari Nama Obat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* --- TABEL DATA --- */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Obat</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Barcode</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Expired</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{item.batch_obat?.obat?.nama_obat}</div>
                        <div className="text-xs text-gray-500">{item.batch_obat?.obat?.satuan}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{item.batch_obat?.barcode_batch || '-'}</span>
                        <div className="text-xs text-gray-400 mt-1">Batch: {item.batch_obat?.no_batch}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                          new Date(item.batch_obat?.tanggal_kedaluwarsa) < new Date('2025-01-01') 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.batch_obat?.tanggal_kedaluwarsa}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-lg font-bold ${item.jumlah_stok < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                          {item.jumlah_stok}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      {loading ? 'Memuat data...' : 'Data kosong. Silakan tambah stok baru.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODAL TAMBAH STOK (POPUP) --- */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Input Barang Masuk</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Scan Barcode Field */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Scan Barcode (Wajib)</label>
                  <div className="flex rounded-md shadow-sm">
                    <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500">
                      <ScanBarcode size={16} />
                    </span>
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="Tembak barcode di sini..."
                      className="block w-full flex-1 rounded-none rounded-r-md border border-gray-300 p-2 focus:border-green-500 focus:ring-green-500"
                      value={formData.barcode_batch}
                      onChange={e => setFormData({...formData, barcode_batch: e.target.value})}
                    />
                  </div>
                </div>

                {/* Pilih Obat */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Nama Obat</label>
                  <select 
                    required
                    className="block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-green-500 focus:ring-green-500"
                    value={formData.id_obat}
                    onChange={e => setFormData({...formData, id_obat: e.target.value})}
                  >
                    <option value="">-- Pilih Obat --</option>
                    {obatList.map(obat => (
                      <option key={obat.id} value={obat.id}>{obat.nama_obat}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-xs text-gray-500">Obat belum ada? Input di database dulu.</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">No. Batch</label>
                    <input type="text" required className="block w-full rounded-md border border-gray-300 p-2" 
                      value={formData.no_batch} onChange={e => setFormData({...formData, no_batch: e.target.value})} />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Kadaluarsa</label>
                    <input type="date" required className="block w-full rounded-md border border-gray-300 p-2" 
                      value={formData.tanggal_kedaluwarsa} onChange={e => setFormData({...formData, tanggal_kedaluwarsa: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">Jumlah Stok Masuk</label>
                  <input type="number" required min="1" className="block w-full rounded-md border border-gray-300 p-2" 
                    value={formData.jumlah_stok} onChange={e => setFormData({...formData, jumlah_stok: e.target.value})} />
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50">Batal</button>
                  <button type="submit" disabled={loading} className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50">
                    <Save size={18} /> {loading ? 'Menyimpan...' : 'Simpan Stok'}
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