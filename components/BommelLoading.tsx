// components/BommelLoading.tsx
export default function BommelLoading() {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xl sm:text-2xl font-semibold animate-pulse max-w-md">
          Please hold on… your Bommel is being gently fluffed and ceremonially knighted. 🧶👑
        </p>
      </div>
    )
  }
  