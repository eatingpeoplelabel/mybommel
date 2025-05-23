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

const ADMIN_CODE = 'eatingbommel' // 🔑 Dein geheimer Admin-Code

export default function AdminBommlerPage() {
  const [bommler, setBommler] = useState<Bommler[]>([])
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState<number[]>([])
  const [codeInput, setCodeInput] = useState('')
  const [unlocked, setUnlocked] = useState(false)

  // Zugriff freischalten
  const handleUnlock = () => {
    if (codeInput.trim() === ADMIN_CODE) {
      setUnlocked(true)
    } else {
      alert('🪹 Nope. That code is not fluffy enough.')
    }
  }

  // Daten laden
  useEffect(() => {
    if (!unlocked) return
    setLoading(true)
    supabase
      .from('bommler')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: true })
      .then(({ data }) => {
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
      </div>
    )
  }

  if (loading) return <p className="p-6">Loading Fluff...</p>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin: Neue Bommler bestätigen</h1>

      <button
        onClick={async () => {
          const res = await fetch('/api/backfill-coords', { method: 'POST' })
          const json = await res.json()
          alert(`✅ ${json.message || json.error}`)
        }}
        className="mb-6 px-4 py-2 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
      >
        🔄 Koordinaten für alte Bommels nachtragen
      </button>

      {bommler.length === 0 ? (
        <p className="text-gray-500">Keine neuen Bommler im Review.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bommler.map((b) => (
            <div key={b.id} className="border rounded-lg p-4 shadow">
              <img
                src={
                  supabase.storage
                    .from('bommel-images')
                    .getPublicUrl(b.image_path).data.publicUrl
                }
                alt={b.name}
                className="w-full h-48 object-cover rounded"
              />
              <h2 className="mt-2 text-lg font-semibold">{b.name}</h2>
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
    </div>
  )
}