export default function ClassPassNewOrReturn({ onNew, onReturning, onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">👤</div>
        <h2 className="text-xl font-bold text-primary">First visit or returning?</h2>
        <p className="text-sm text-gray-600">
          Returning guests already have a waiver on file and can skip straight to check-in.
        </p>
        <button
          className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white"
          onClick={onNew}
        >
          First visit
        </button>
        <button
          className="min-h-[52px] w-full rounded-lg border-2 border-green-400 bg-green-50 text-lg font-semibold text-green-700"
          onClick={onReturning}
        >
          Returning guest
        </button>
        <button className="text-sm text-gray-400 underline" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
