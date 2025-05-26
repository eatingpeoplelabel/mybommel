import { useRouter } from 'next/router'
import ClientSharePic from '@/components/ClientSharePic'

export default function SharePicPage() {
  const { query } = useRouter()
  const id = Array.isArray(query.id) ? query.id[0] : query.id

  // Hier holst du dir den Bommel genauso wie in Congrats, dann:
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
      {bommel && <ClientSharePic bommel={bommelWithImageUrlAndZodiac} />}
    </div>
  )
}
