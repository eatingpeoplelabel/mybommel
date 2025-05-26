// pages/register.tsx
'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import Link from 'next/link'
import imageCompression from 'browser-image-compression'
import { supabase } from '@/lib/supabaseClient'
import MobileCameraCapture from '@/components/MobileCameraCapture'

// Full list of countries
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
  "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

const bommelTypes = [
  "Fluffinator", "Disco Bommel", "Snuggle Puff", "Turbo Bommel", "Cuddle Cloud",
  "Hyper Fluff", "Mega Bommel", "Quantum Puff", "Rainbow Snuggler", "Galactic Bommel", "Zen Puff"
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

export default function Register() {
  const { register, handleSubmit, formState: { isSubmitting }, setValue, watch } = useForm()
  const [previewData, setPreviewData] = useState(null)
  const [uploadError, setUploadError] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const router = useRouter()

  const onReview = (data) => setPreviewData(data)
  const onCancel = () => setPreviewData(null)

  const onConfirm = async () => {
    if (!previewData) return
    try {
      setIsUploading(true)
      setUploadError(null)

      const file = previewData.image[0]
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1000,
        useWebWorker: true,
      })

      const fileExt = compressedFile.name.split('.').pop()
      const fileName = `${previewData.name}-${Date.now()}.${fileExt}`
      const filePath = `bommel-images/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('bommel-images')
        .upload(filePath, compressedFile, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

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
          image_path: filePath
        })
      })

      if (!res.ok) throw new Error('Upload failed')
      const { id } = await res.json()
      router.push(`/congrats?id=${id}`)
    } catch (err) {
      console.error(err)
      setUploadError(err.message || 'Something went wrong.')
      setPreviewData(null)
      setIsUploading(false)
    }
  }

  return (
    <main className="relative min-h-screen bg-register bg-cover bg-center flex items-start justify-center pt-8 px-6 overflow-hidden">
      <Link href="/" className="fixed top-4 left-4 z-30">
        <img src="/back-to-home.webp" alt="Back to Home" className="w-24 h-auto cursor-pointer" />
      </Link>

      {showCamera && (
        <MobileCameraCapture
          onCapture={(file) => {
            const fileList = {
              0: file,
              length: 1,
              item: () => file,
            }
            setValue('image', fileList)
            setShowCamera(false)
          }}
        />
      )}

      <div className="relative z-10 bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg max-w-xl w-full p-8 space-y-6 border border-white/40 mt-16">
        <h1 className="text-4xl font-extrabold text-center">🚀 I'm a Bommler!</h1>
        <form onSubmit={handleSubmit(onReview)} className="space-y-4">
          <input type="text" {...register('bot_detector_3000')} className="hidden" />
          <input className="w-full" placeholder="Your Nickname" {...register('nickname', { required: true })} />
          <input className="w-full" placeholder="Your Bommel's Name" {...register('name', { required: true })} />

          <div className="flex flex-col">
            <label className="font-semibold">Upload a picture of your Bommel</label>
            <div className="flex gap-2 mt-2">
              <input
                type="file"
                accept="image/*"
                className="w-full"
                {...register('image', { required: true })}
              />
              <button
                type="button"
                onClick={() => setShowCamera(true)}
                className="bg-purple-500 text-white px-4 py-2 rounded-full shadow hover:bg-purple-400"
              >
                📷 Use Camera
              </button>
            </div>
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

        {previewData && (
          <div className="mt-6 bg-white p-4 rounded-xl shadow text-sm">
            <p className="font-bold mb-2">Preview:</p>
            <ul className="space-y-1">
              <li><strong>Name:</strong> {previewData.name}</li>
              <li><strong>Nickname:</strong> {previewData.nickname}</li>
              <li><strong>Fluff:</strong> {previewData.fluffLevel}</li>
              <li><strong>Type:</strong> {previewData.type}</li>
            </ul>
            <div className="mt-4 flex gap-4">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full font-semibold"
              >← Back</button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 bg-pink-500 text-white hover:bg-pink-600 rounded-full font-bold"
              >✅ Confirm & Register your Bommel</button>
            </div>
            {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
          </div>
        )}

        {isUploading && (
          <div className="fixed inset-0 bg-white z-50 flex items-center justify-center text-center p-8">
            <p className="text-xl font-medium animate-pulse max-w-md">
              Please hold on… your Bommel is being gently fluffed and ceremonially knighted. 🧶👑
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
