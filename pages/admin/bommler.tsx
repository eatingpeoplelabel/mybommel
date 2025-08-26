// pages/admin/bommler.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

type Bommler = {
  id: number
  name: string
  image_path: string
  fluff_level: string
  email: string
  created_at: string
  status: string
}

// ⚠️ Nur Übergangslösung – später serverseitig absichern!
const ADMIN_CODE = 'eatingbommel'

type BackfillResult = {
  totalQueried?: number
  invalidBefore?: number
  processed?: number
  updated?: number
  skipped?: number[] | null
  estimatedValidAfter?: number
  message?: string
  error?: string
}

export default function AdminBommlerPage() {
  const [bommler, setBommler] = useState<Bommler[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<number[]>([])
  const [codeInput, setCodeInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  // Backfill UI state
  const [bfRunning, setBfRunning] = useState(false)
  const [bfResult, setBfResult] = useState<BackfillResult | null>(null)
  const [bfError, setBfError] = useState<string | null>(null)
  const [bfLimit, setBfLimit] = useState<number>(200)
  const [bfCountry, setBfCountry] = useState<string>('Germany')

  const handleUnlock = () => {
    if (codeInput.trim() === ADMIN_CODE) {
      setUnlocked(true)
    } else {
      alert('🪹 Nope. That code is not fluffy enough.')
    }
  }

  useEffect(() => {
    if (!unlocked) return
    setLoading(true)
    supabase
      .from('bommler')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setBommler(data || [])
        setLoading(false)
      })
  }, [unlocked])

  const handleStatus = async (id: number, newStatus: 'approved' | 'cancelled') => {
    setUpdating((u) => [...u, id])
    const { error } = await supabase
      .from('bommler')
      .update({ status: newStatus })
      .eq('id', id)
    setUpdating((u) => u.filter((x) => x !== id))
    if (!error) {
      setBommler((prev) => prev.filter((b) => b.id !== id))
    } else {
      alert('Update failed: ' + error.message)
    }
  }

  const runBackfill = async () => {
    try {
      setBfRunning(true)
      setBfError(null)
      setBfResult(null)
      const res = await fetch(`/api/backfill-coords?limit=${bfLimit}&country=${encodeURIComponent(bfCountry)}`, {
        method: 'POST',
      })
      const json = (await res.json()) as BackfillResult
      if (!res.ok) {
        setBfError(json.error || 'Unknown error')
      } else {
        setBfResult(json)
      }
    } catch (e: any) {
      setBfError(e?.message || 'Unexpected error')
    } finally {
      setBfRunning(false)
    }
  }

  if (!unlocked) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <h1 className="text-2xl font-bold mb-4">🧁 Secret Admin Area</h1>
        <input
          type="password"
          placeholder="Enter admin code"
          value={codeInput}
          onChange={(e) => setCodeInput(e.target.value)}
          className="border px-4 py-2 rounded w-64 mb-2 text-center"
        />
        <button
          onClick={handleUnlock}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          Unlock
        </button>
        <p className="text-xs text-gray-500 mt-3">⚠️ For real security, add server-side auth later.</p>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold">Admin: Neue Bommler bestätigen</h1>

      {/* Backfill Controls */}
      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold mb-3">🔄 Koordinaten-Backfill</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Limit</label>
            <input
              type="number"
              min={1}
              value={bfLimit}
              onChange={(e) => setBfLimit(Number(e.target.value))}
              className="border rounded px-3 py-1 w-28"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Country (Fallback)</label>
            <input
              type="text"
              value={bfCountry}
              onChange={(e) => setBfCountry(e.target.value)}
              className="border rounded px-3 py-1 w-44"
            />
          </div>
          <button
            onClick={runBackfill}
            disabled={bfRunning}
            className={`px-4 py-2 rounded-full shadow text-white ${bfRunning ? 'bg-purple-400' : 'bg-purple-600 hover:bg-purple-700'}`}
          >
            {bfRunning ? 'Läuft…' : 'Backfill starten'}
          </button>
        </div>

        {/* Result/Errors */}
        {bfError && (
          <div className="mt-3 rounded border border-red-300 bg-red-50 p-3 text-sm text-red-700">
            ❌ {bfError}
          </div>
        )}
        {bfResult && (
          <div className="mt-3 rounded border border-green-300 bg-green-50 p-3 text-sm">
            <div className="flex flex-wrap gap-4">
              {'totalQueried' in bfResult && <span>totalQueried: <strong>{bfResult.totalQueried}</strong></span>}
              {'invalidBefore' in bfResult && <span>invalidBefore: <strong>{bfResult.invalidBefore}</strong></span>}
              {'processed' in bfResult && <span>processed: <strong>{bfResult.processed}</strong></span>}
              {'updated' in bfResult && <span>updated: <strong>{bfResult.updated}</strong></span>}
              {'estimatedValidAfter' in bfResult && <span>estimatedValidAfter: <strong>{bfResult.estimatedValidAfter}</strong></span>}
            </div>
            {bfResult.skipped && bfResult.skipped.length > 0 && (
              <details className="mt-2">
                <summary className="cursor-pointer">Skipped IDs anzeigen</summary>
                <div className="mt-1 text-xs text-gray-700">
                  {bfResult.skipped.join(', ')}
                </div>
              </details>
            )}
            {bfResult.message && <div className="mt-2">{bfResult.message}</div>}
          </div>
        )}
      </div>

      {/* Pending list */}
      <section>
        <h2 className="text-lg font-semibold mb-3">⏳ Pending Bommler</h2>
        {loading ? (
          <p>Loading Fluff…</p>
        ) : bommler.length === 0 ? (
          <p className="text-gray-500">Keine neuen Bommler im Review.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {bommler.map((b) => (
              <div key={b.id} className="border rounded-lg p-4 shadow bg-white">
                <img
                  src={supabase.storage.from('bommel-images').getPublicUrl(b.image_path).data.publicUrl}
                  alt={b.name}
                  className="w-full h-48 object-cover rounded"
                />
                <h3 className="mt-2 text-lg font-semibold">{b.name}</h3>
                <p className="text-sm text-gray-600">Fluff: {b.fluff_level}</p>
                <p className="text-xs text-gray-400 mb-2">
                  Hochgeladen: {new Date(b.created_at).toLocaleString('de-DE')}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={updating.includes(b.id)}
                    onClick={() => handleStatus(b.id, 'approved')}
                    className="flex-1 py-2 rounded bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    disabled={updating.includes(b.id)}
                    onClick={() => handleStatus(b.id, 'cancelled')}
                    className="flex-1 py-2 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
