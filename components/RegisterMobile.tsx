// components/RegisterMobile.tsx
'use client'

import { useForm } from 'react-hook-form'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import imageCompression from 'browser-image-compression'
import { supabase } from '@/lib/supabaseClient'
import MobileCameraCapture from '@/components/MobileCameraCapture'

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

const fluffLevels = [ "🌟", "🌟🌟", "🌟🌟🌟", "🌟🌟🌟🌟", "🌟🌟🌟🌟🌟" ]

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

export default function RegisterMobile() {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { isSubmitting }
  } = useForm<FormData>()

  const [previewData, setPreviewData] = useState<FormData | null>(null)
  const [photoName, setPhotoName] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const onReview = (data: FormData) => {
    setPreviewData(data)
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

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
          ...previewData,
          fluff_level: previewData.fluffLevel,
          postal_code: previewData.postalCode,
          image_path: filePath,
        }),
      })

      if (!res.ok) throw new Error('Upload failed')
      const { id } = await res.json()
      router.push(`/congrats?id=${id}`)
    } catch (err: any) {
      setUploadError(err.message || 'Something went wrong.')
      setPreviewData(null)
      setIsUploading(false)
    }
  }

  return (
    <main className="min-h-screen bg-register bg-cover bg-center px-4 py-6">
      {showCamera && (
        <MobileCameraCapture
          onCapture={async (file) => {
            const fileList: FileList = {
              0: file,
              length: 1,
              item: () => file,
            } as unknown as FileList

            setValue('image', fileList)
            await trigger('image')

            setPreviewData({
              ...watch(),
              image: fileList,
            })

            setPhotoName(file.name)
            setShowCamera(false)
          }}
        />
      )}

      <h1 className="text-3xl font-bold text-center mb-6">📱 Register your Bommel</h1>
      <form onSubmit={handleSubmit(onReview)} className="space-y-4">
        <input type="text" {...register('bot_detector_3000')} className="hidden" />
        <input placeholder="Your Nickname" {...register('nickname', { required: true })} className="w-full" />
        <input placeholder="Your Bommel's Name" {...register('name', { required: true })} className="w-full" />

        <div className="flex flex-col">
          <label className="font-semibold">Upload a Bommel photo</label>
          <div className="flex gap-2 mt-2">
            <input type="file" accept="image/*" {...register('image', { required: true })} className="w-full" />
            <button
              type="button"
              onClick={() => setShowCamera(true)}
              className="bg-purple-500 text-white px-3 py-2 rounded-full shadow"
            >📷</button>
          </div>
          {photoName && <p className="text-green-600 text-sm mt-1">✅ {photoName}</p>}
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
        <div ref={previewRef} className="mt-8 bg-white/70 backdrop-blur-md p-4 rounded-xl shadow">
          <h2 className="text-lg font-bold mb-2">Preview</h2>
          <ul className="text-sm space-y-1">
            <li><strong>Nickname:</strong> {previewData.nickname}</li>
            <li><strong>Name:</strong> {previewData.name}</li>
            <li><strong>Fluff Level:</strong> {previewData.fluffLevel}</li>
            <li><strong>Type:</strong> {previewData.type}</li>
          </ul>
          {previewData.image && (
            <img
              src={URL.createObjectURL(previewData.image[0])}
              alt="Preview"
              className="w-full max-w-xs mt-4 rounded-lg border"
            />
          )}
          <div className="mt-4 flex gap-4">
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
