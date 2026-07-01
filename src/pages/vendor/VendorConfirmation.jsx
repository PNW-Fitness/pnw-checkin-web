export default function VendorConfirmation({ onDone }) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-gray-100 px-6">
      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">✅</div>
        <h2 className="text-xl font-bold text-primary">You're signed in — thanks!</h2>
        <button className="mt-2 min-h-[48px] w-full rounded-lg bg-accent px-6 font-semibold text-white" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}
