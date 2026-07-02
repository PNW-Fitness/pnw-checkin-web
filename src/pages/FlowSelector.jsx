export default function FlowSelector({ onGuest, onClassPass, onTanning, onVendor }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-primary px-6 py-10 text-center text-white">
      <div>
        <h1 className="text-3xl font-bold">Pacific Northwest Fitness</h1>
        <p className="mt-2 text-white/70">Welcome — please select your visit type</p>
      </div>

      <div className="flex w-full max-w-sm flex-col gap-4">
        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-accent py-6 text-xl font-bold text-white shadow-lg"
          onClick={onGuest}
        >
          🏋️ Guest
        </button>
        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-teal-600 py-6 text-xl font-bold text-white shadow-lg"
          onClick={onClassPass}
        >
          📱 ClassPass
        </button>
        <button
          className="flex items-center justify-center gap-3 rounded-2xl bg-amber-500 py-6 text-xl font-bold text-white shadow-lg"
          onClick={onTanning}
        >
          ☀️ Tanning
        </button>
        <button
          className="flex items-center justify-center gap-3 rounded-2xl border-2 border-white/30 bg-white/15 py-6 text-xl font-bold text-white shadow-lg"
          onClick={onVendor}
        >
          🏢 Vendor
        </button>
      </div>
    </div>
  )
}
