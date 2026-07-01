export default function MinorBlocked({ onBack }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">⛔</div>
        <h2 className="text-xl font-bold text-primary">Not Permitted</h2>
        <p className="text-sm text-gray-500">Guests under 14 cannot use the facility.</p>
        <button className="min-h-[48px] w-full rounded-lg bg-accent px-6 font-semibold text-white" onClick={onBack}>
          Return to Start
        </button>
      </div>
    </div>
  )
}
