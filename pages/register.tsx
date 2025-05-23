// pages/register.tsx
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'

// Full list of countries + fantasy countries
const countries = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bommelhausen", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Côte d’Ivoire", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Dorado", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fantasia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Middle-earth", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Narnia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Planet Bommel", "Poland", "Portugal", "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Westeros", "Yemen", "Zambia", "Zimbabwe"
]

type FormData = {
  nickname: string
  name: string
  image: FileList
  fluffLevel: string
  type: string
  birthday: string
  email?: string
  about?: string
  country: string
  postalCode: string
  bot_detector_3000?: string
}

const bommelTypes = [
  "Fluffinator", "Disco Bommel", "Snuggle Puff", "Turbo Bommel", "Cuddle Cloud",
  "Hyper Fluff", "Mega Bommel", "Quantum Puff", "Rainbow Snuggler", "Galactic Bommel", "Zen Puff"
]

// Play ping sound + ripple effect
const playPing = (e: React.MouseEvent<HTMLDivElement>, url: string) => {
  const audio = new Audio(url)
  audio.play()
  const container = e.currentTarget as HTMLDivElement
  const ripple = document.createElement('span')
  ripple.className = 'absolute w-24 h-24 bg-gradient-to-r from-pink-400 to-purple-400 opacity-50 rounded-full pointer-events-none animate-ping'
  ripple.style.top = '50%'
  ripple.style.left = '50%'
  ripple.style.transform = 'translate(-50%, -50%)'
  container.appendChild(ripple)
  setTimeout(() => ripple.remove(), 500)
}

export default function Register() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<FormData>()
  const [previewData, setPreviewData] = useState<FormData | null>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const router = useRouter()

  const onReview = (data: FormData) => setPreviewData(data)
  const onCancel = () => setPreviewData(null)

  const onConfirm = async () => {
    if (!previewData) return
    try {
      const file = previewData.image[0]
      const toBase64 = (file: File) => new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve((reader.result as string).split(',')[1])
        reader.onerror = err => reject(err)
      })
      const image_base64 = await toBase64(file)
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bot_detector_3000: previewData.bot_detector_3000,
          nickname: previewData.nickname,
          name: previewData.name,
          fluff_level: previewData.fluffLevel,
          type: previewData.type,
          birthday: previewData.birthday,
          email: previewData.email,
          about: previewData.about,
          country: previewData.country,
          postal_code: previewData.postalCode,
          image_base64,
          image_name: `${previewData.name}-${Date.now()}.png`
        })
      })
      if (!res.ok) throw new Error('Upload failed')
      const { id } = await res.json()
      router.push(`/congrats?id=${id}`)
    } catch (err: any) {
      setUploadError(err.message)
      setPreviewData(null)
    }
  }

  return (
    <main className="relative min-h-screen bg-register bg-cover bg-center flex items-start justify-center pt-8 px-6 overflow-hidden">
      {/* Back Button */}
      <Link href="/" className="fixed top-4 left-4 z-30">
        <img src="/back-to-home.png" alt="Back to Home" className="w-24 h-auto cursor-pointer" />
      </Link>

      {/* Decorative Bommels behind form */}
      <div onClick={e => playPing(e, '/bommel-a.mp3')} className="absolute top-16 left-8 w-80 h-80 animate-bounce-real-a cursor-pointer z-0">
        <img src="/Bommel1Register.png" alt="Bommel Left" className="w-full h-full object-contain" />
      </div>
      <div onClick={e => playPing(e, '/bommel-b.mp3')} className="absolute top-16 right-8 w-80 h-80 animate-bounce-real-b cursor-pointer z-0">
        <img src="/Bommel2Register.png" alt="Bommel Right" className="w-full h-full object-contain" />
      </div>

      {/* Registration Form */}
      <div className="relative z-10 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg max-w-xl w-full p-8 space-y-6 border border-white/40 mt-16">
        <h1 className="text-4xl font-extrabold text-center">🚀 I'm a Bommler!</h1>
        <form onSubmit={handleSubmit(onReview)} className="space-y-4">
          <input type="text" {...register('bot_detector_3000')} className="hidden" />
          <div className="text-center text-purple-700 font-medium bg-white/50 rounded-xl p-4 shadow-sm">
            Register your Bommel for free ✨<br />Become an official Bommler with your unique number and a majestic certificate 📜<br /><span className="font-bold">Join the Bommelution</span> today!
          </div>
          <input className="w-full" placeholder="Your Nickname" {...register('nickname', { required: true })} />
          <input className="w-full" placeholder="Your Bommel's Name" {...register('name', { required: true })} />
          <div className="flex flex-col">
            <label className="font-semibold">Upload a picture of your Bommel</label>
            <input type="file" accept="image/*" className="w-full" {...register('image' as const, { required: true })} />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Fluff Factor</label>
            <span className="text-sm text-gray-600 mb-1">1 (mild) – 5 (ultra-fluff)</span>
            <select className="w-full" {...register('fluffLevel')}>
              {[...Array(5)].map((_, i) => <option key={i} value={`${i+1}`}>{'🌟'.repeat(i+1)}</option>)}
            </select>
          </div>
          <select className="w-full" {...register('type')}>
            <option value="">Select a Bommel type</option>
            {bommelTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <div className="flex flex-col">
            <label className="font-semibold">Birthday of your Bommler</label>
            <input type="date" className="w-full" {...register('birthday', { required: true })} />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Email (optional)</label>
            <span className="text-sm text-gray-600 mb-1">Newsletter & giveaways</span>
            <input type="email" className="w-full" placeholder="Enter your email" {...register('email')} />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">About Your Bommler</label>
            <textarea className="w-full" placeholder="Share your Bommel story..." {...register('about')} />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold">Where does your Bommler live?</label>
            <select className="w-full" {...register('country', { required: true })}>
              <option value="">Select country</option>
              {countries.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input className="w-full" placeholder="Postal Code" {...register('postalCode', { required: true })} />
          <button type="submit" disabled={isSubmitting} className="w-full bg-pink-400 hover:bg-pink-300 text-white font-bold py-3 rounded-full transition">
            Register your Bommel
          </button>
        </form>
      </div>

      {/* Fluffy Summary Overlay */}
      {previewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-pink-100 via-white to-purple-100 border-4 border-purple-300 rounded-3xl shadow-2xl max-w-md w-full p-6 space-y-5 text-purple-800">
            <h2 className="text-2xl font-extrabold text-center mb-4">💖 Your Bommel Summary 💖</h2>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white shadow-md bg-white">
                <img
                  src={URL.createObjectURL(previewData.image[0])}
                  alt="Bommel Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xl font-bold">{previewData.name}</p>
              <p className="text-sm italic">aka {previewData.nickname}</p>
            </div>
            <div className="bg-white bg-opacity-80 rounded-xl p-4 shadow-inner space-y-2 text-sm">
              <p><strong>Fluff Level:</strong> {previewData.fluffLevel} / 5</p>
              <p><strong>Type:</strong> {previewData.type}</p>
              <p><strong>Birthday:</strong> {previewData.birthday}</p>
              {previewData.email && <p><strong>Email:</strong> {previewData.email}</p>}
              <p><strong>Country:</strong> {previewData.country}</p>
              <p><strong>Postal Code:</strong> {previewData.postalCode}</p>
              {previewData.about && <p><strong>Story:</strong> {previewData.about}</p>}
            </div>
            {uploadError && <p className="text-red-500 text-center">{uploadError}</p>}
            <div className="flex justify-between pt-4">
              <button onClick={onCancel} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold">← Back</button>
              <button onClick={onConfirm} className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 rounded-full font-bold">✅ Confirm & Register your Bommel</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
