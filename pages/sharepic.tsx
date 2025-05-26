// pages/sharepic.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'
import { getBommelZodiacEn } from '@/lib/zodiac-en'
import ClientSharePic from '@/components/ClientSharePic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SharePicPage() {
  const { query } = useRouter()
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  const [bommel, setBommel] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('bommler')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          console.error('Bommel not found', error)
          return
        }
        const zodiac = getBommelZodiacEn(new Date(data.birthday))
        const imageUrl = data.image_path
          ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${data.image_path}`
          : '/Bommel1Register.webp'
        setBommel({ ...data, zodiac: zodiac.name, imageUrl })
      })
  }, [id])

  if (!bommel) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Loading sharepic…</p>
      </div>
    )
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      <ClientSharePic bommel={bommel} />
      <Link
        href="/"
        className="mt-6 text-indigo-600 hover:underline"
      >
        ← Back to Home
      </Link>
    </main>
  )
}
