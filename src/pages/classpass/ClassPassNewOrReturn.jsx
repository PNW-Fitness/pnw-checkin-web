export default function ClassPassNewOrReturn({ onNew, onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-5 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">👤</div>
        <h2 className="text-xl font-bold text-primary">Have you signed our waiver?</h2>
        <p className="text-sm text-gray-600">
          First-time guests need to sign a quick waiver before checking in.
          Returning guests — please see front desk to be checked in.
        </p>
        <button
          className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white"
          onClick={onNew}
        >
          No — sign waiver now
        </button>
        <button className="text-sm text-gray-400 underline" onClick={onBack}>
          ← Back
        </button>
      </div>
    </div>
  )
}
