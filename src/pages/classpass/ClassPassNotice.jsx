export default function ClassPassNotice({ onContinue, onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">📱</div>
        <h2 className="text-xl font-bold text-primary">ClassPass Check-In</h2>
        <p className="text-sm text-gray-600">
          Please let front desk staff know you have a ClassPass booking — they'll verify it when you arrive.
        </p>
        <button className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white" onClick={onContinue}>
          Continue →
        </button>
        <button className="text-sm text-gray-400 underline" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
