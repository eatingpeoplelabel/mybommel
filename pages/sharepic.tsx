import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { getBommelZodiacEn } from '@/lib/zodiac-en'
import ClientSharePic from '@/components/ClientSharePic'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function SharePicPage() {
  const router = useRouter()
  const { id } = router.query
  const [bommel, setBommel] = useState<any | null>(null)
  const [zodiac, setZodiac] = useState<any | null>(null)

  useEffect(() => {
    if (!id) return
    supabase
      .from('bommler')
      .select('*')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setBommel(data)
          setZodiac(getBommelZodiacEn(new Date(data.birthday)))
        }
      })
  }, [id])

  const imageUrl = bommel?.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
    : '/Bommel1Register.webp'

  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      {bommel && zodiac && (
        <ClientSharePic
          bommel={{
            ...bommel,
            imageUrl,
            zodiac: zodiac?.name || 'Unknown',
          }}
        />
      )}
    </main>
  )
}
