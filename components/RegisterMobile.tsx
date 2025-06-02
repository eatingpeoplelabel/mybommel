'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '@/lib/supabaseClient'
import { cropAndResizeImageToAspect } from '@/lib/cropAndResizeImageToAspect'
import Link from 'next/link'

const countries = [
    "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia",
    "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
    "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria",
    "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad",
    "Chile", "China", "Colombia", "Comoros", "Costa Rica", "Côte d’Ivoire", "Croatia", "Cuba", "Cyprus",
    "Czech Republic", "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
    "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia",
    "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
    "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India",
    "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan",
    "Kenya", "Kiribati", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia",
    "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali",
    "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco",
    "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands",
    "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman",
    "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
    "Qatar", "Republic of the Congo", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia",
    "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia",
    "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands",
    "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname",
    "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo",
    "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine",
    "United Arab Emirates", "United Kingdom", "United States of America", "Uruguay", "Uzbekistan", "Vanuatu",
    "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe", "Bommelhausen"
  ]
  
  const bommelTypes = [
    "Fluffinator", "Disco Bommel", "Snuggle Puff", "Turbo Bommel", "Cuddle Cloud",
    "Hyper Fluff", "Mega Bommel", "Quantum Puff", "Rainbow Snuggler", "Galactic Bommel", "Zen Puff"
  ]
  
const fluffLevels = ["🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟"]

export default function RegisterMobile() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { isSubmitting }
  } = useForm()

  const [previewData, setPreviewData] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const router = useRouter()

  const onReview = (data) => setPreviewData(data)

  const onConfirm = async () => {
    if (!previewData) return
    try {
      setIsUploading(true)
      setUploadError(null)

      const file = previewData.image[0]
      const resizedFile = await cropAndResizeImageToAspect(file, 4 / 5, 1000)

      const fileExt = resizedFile.name.split('.').pop()
      const fileName = `${previewData.name}-${Date.now()}.${fileExt}`
      const filePath = `bommel-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('bommel-images')
        .upload(filePath, resizedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...previewData,
          fluff_level: previewData.fluffLevel,
          postal_code: previewData.postalCode,
          image_path: filePath,
        }),
      })

      if (!res.ok) throw new Error('Upload failed')
      const { id } = await res.json()
      router.push(`/congrats?id=${id}`)
    } catch (err) {
      setUploadError(err.message || 'Something went wrong.')
      setPreviewData(null)
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-register bg-cover bg-center px-4 py-6 relative">
      {/* Hamburger Menü */}
      <button
        onClick={() => setShowMenu(prev => !prev)}
        className="absolute top-2 left-2 p-2 z-50 bg-purple-700 rounded-full shadow"
        aria-label="Toggle menu"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {showMenu && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-3/4 max-w-xs h-full bg-indigo-900 shadow-2xl p-4 overflow-y-auto border-r-4 border-purple-400 text-white">
            <button onClick={() => setShowMenu(false)} aria-label="Close menu" className="mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <nav className="flex flex-col space-y-3 text-lg">
              <Link href="/" className="font-medium hover:text-purple-300">Home</Link>
              <Link href="/register" className="font-medium hover:text-purple-300">Register Your Bommel</Link>
              <Link href="/gallery" className="font-medium hover:text-purple-300">Bommel-Gallery</Link>
              <Link href="/workshop" className="font-medium hover:text-purple-300">Bommel Workshop</Link>
              <Link href="/how-to-bommel" className="font-medium hover:text-purple-300">How-To-Bommel</Link>
              <Link href="/zodiac" className="font-medium hover:text-purple-300">Bommel-Horoscope</Link>
              <Link href="/faq" className="font-medium hover:text-purple-300">FABQ</Link>
              <a href="https://bebetta.de/shop/" target="_blank" rel="noopener" className="font-medium hover:text-purple-300">Shop</a>
              <Link href="/contact" className="font-medium hover:text-purple-300">Contact</Link>
            </nav>
          </div>
          <div className="flex-1 bg-black bg-opacity-60" onClick={() => setShowMenu(false)} />
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6">📱 Register your Bommel</h1>

      <form onSubmit={handleSubmit(onReview)} className="space-y-4">
        <input type="text" {...register('bot_detector_3000')} className="hidden" />
        <input placeholder="Your Nickname" {...register('nickname', { required: true })} className="w-full" />
        <input placeholder="Your Bommel's Name" {...register('name', { required: true })} className="w-full" />

        <div className="flex flex-col">
          <label className="font-semibold">Upload a Bommel photo</label>
          <input type="file" accept="image/*" {...register('image', { required: true })} className="w-full" />
        </div>

        <label className="font-semibold">Fluff Level</label>
        <select {...register('fluffLevel')} className="w-full">
          {fluffLevels.map((f, i) => <option key={i} value={`${i + 1}`}>{f}</option>)}
        </select>

        <label className="font-semibold">Bommel Type</label>
        <select {...register('type', { required: true })} className="w-full">
          <option value="">Choose a type</option>
          {bommelTypes.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>

        <label className="font-semibold">Bommel Birthday</label>
        <input type="date" {...register('birthday', { required: true })} className="w-full" />

        <label className="font-semibold">Email (optional)</label>
        <input type="email" {...register('email')} placeholder="For giveaways & updates" className="w-full" />

        <label className="font-semibold">About your Bommel</label>
        <textarea {...register('about')} placeholder="Fluffy, magical, loves to dance..." className="w-full" />

        <label className="font-semibold">Country</label>
        <select {...register('country', { required: true })} className="w-full">
          <option value="">Choose country</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        <input placeholder="Postal Code" {...register('postalCode', { required: true })} className="w-full" />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-pink-500 text-white py-3 rounded-full font-bold"
        >Submit</button>
      </form>

      {previewData && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm text-sm">
            <h2 className="text-lg font-bold mb-2 text-center">Almost done! 🎉 Confirm your Bommel:</h2>
            <ul className="space-y-1">
              <li><strong>Nickname:</strong> {previewData.nickname}</li>
              <li><strong>Name:</strong> {previewData.name}</li>
              <li><strong>Fluff Level:</strong> {previewData.fluffLevel}</li>
              <li><strong>Type:</strong> {previewData.type}</li>
            </ul>
            {previewData.image && (
              <div className="mt-4 rounded-lg border overflow-hidden w-full aspect-[4/5] bg-gray-100">
                <img
                  src={URL.createObjectURL(previewData.image[0])}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="mt-4 flex gap-4 justify-center">
              <button
                onClick={() => setPreviewData(null)}
                className="px-4 py-2 bg-gray-300 rounded-full"
              >← Back</button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-pink-500 text-white font-bold rounded-full"
              >✅ Confirm</button>
            </div>
            {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
          </div>
        </div>
      )}

      {isUploading && (
        <div className="fixed inset-0 bg-white/90 z-50 flex items-center justify-center">
          <p className="text-lg font-semibold animate-pulse text-center px-4">
            Uploading your Bommel... fluffifying in progress! 🧶✨
          </p>
        </div>
      )}
    </main>
  )
}
