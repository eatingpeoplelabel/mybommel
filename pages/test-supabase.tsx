// pages/test-supabase.tsx
import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function TestSupabase() {
  const [now, setNow] = useState<string>('lade…')

  useEffect(() => {
    supabase
      .rpc('get_current_time')
      .then(({ data, error }) => {
        if (error) {
          setNow('Fehler: ' + error.message)
        } else {
          // data kommt hier als reiner String
          setNow(data as string)
        }
      })
  }, [])

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Supabase Verbindungstest</h1>
      <p>Supabase-Serverzeit: <strong>{now}</strong></p>
    </div>
  )
}
