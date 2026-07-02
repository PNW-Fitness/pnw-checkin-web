export default function TanningAgeCheck({ onConfirm, onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">☀️</div>
        <h2 className="text-xl font-bold text-primary">Tanning Consent</h2>
        <p className="text-sm text-gray-600">
          By law, tanning devices may only be used by guests who are <strong>18 years of age or older</strong>.
        </p>
        <p className="text-sm font-semibold text-gray-700">
          Do you confirm that you are at least 18 years old?
        </p>
        <button
          className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white"
          onClick={onConfirm}
        >
          Yes, I am 18 or older
        </button>
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <strong>Under 18?</strong> Tanning device use is not permitted. Please see front desk staff.
        </div>
        <button className="text-sm text-gray-400 underline" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
