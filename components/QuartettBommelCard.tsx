import React from 'react'

export default function QuartettBommelCard({ bommel, zodiac }) {
  const imageUrl = bommel.image_path
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/bommel-images/${bommel.image_path}`
    : '/Bommel1Register.png'

  return (
    <div className="relative w-[1080px] h-[1920px] mx-auto bg-cover bg-center" style={{ backgroundImage: "url('/quartett-deco-bg.png')" }}>
      {/* Bommel image top center */}
      <div className="absolute top-[200px] left-1/2 transform -translate-x-1/2 w-[400px] h-[400px] rounded-full overflow-hidden border-8 border-white shadow-lg">
        <img src={imageUrl} alt="Your Bommel" className="w-full h-full object-cover" />
      </div>

      {/* Attributes grid */}
      <div className="absolute top-[650px] left-[100px] w-[880px] grid grid-cols-2 gap-y-6 gap-x-8 text-gray-800">
        <div className="flex items-center">
          <span className="font-semibold mr-2">Type:</span>
          <span className="font-medium">{bommel.type}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Color:</span>
          <span className="font-medium">{bommel.color}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Fluff Level:</span>
          <span className="font-medium">{bommel.fluff_level}</span>
        </div>
        <div className="flex items-center">
          <span className="font-semibold mr-2">Birthday:</span>
          <span className="font-medium">{bommel.birthday}</span>
        </div>
      </div>

      {/* Horoscope section */}
      <div className="absolute top-[1050px] left-[100px] w-[880px] bg-white/90 p-6 rounded-xl shadow-inner text-center">
        <h3 className="text-3xl font-bold text-purple-700 mb-2">{zodiac.name.toUpperCase()}</h3>
        <p className="text-lg font-medium text-gray-600 mb-1">Element: {zodiac.element}</p>
        <p className="text-base text-gray-500 italic">"{zodiac.description}"</p>
      </div>

      {/* Footer CTA */}
      <div className="absolute bottom-[100px] left-1/2 transform -translate-x-1/2 text-sm italic text-gray-600">
        Visit mybommel.com to register your own
      </div>
    </div>
  )
}
