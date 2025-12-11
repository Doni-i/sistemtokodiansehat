import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function InventoryPage() {
  const supabase = await createClient()

  // 1. Cek Login
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  // 2. Ambil Data Stok (Join ke Batch dan Obat)
  const { data: stokList, error } = await supabase
    .from('stok_obat')
    .select(`
      id,
      jumlah_stok,
      batch_obat (
        no_batch,
        tanggal_kedaluwarsa,
        obat (
          nama_obat,
          satuan
        )
      )
    `)

  if (error) {
    console.error(error)
    return <div>Error loading data...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Stok Gudang</h1>
            <p className="text-gray-500">Toko Dian Sehat Inventory System</p>
          </div>
          <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-800">
            Admin Mode
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Nama Obat</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">No. Batch</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Expired Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Satuan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {stokList?.map((item: any) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
                    {item.batch_obat?.obat?.nama_obat || 'Unknown'}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {item.batch_obat?.no_batch}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {item.batch_obat?.tanggal_kedaluwarsa}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                      item.jumlah_stok < 10 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {item.jumlah_stok}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-gray-500">
                    {item.batch_obat?.obat?.satuan}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}