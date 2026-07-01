export default function GuestConfirmation({ guestSession, onDone }) {
  const { formData, supervisionRequired } = guestSession

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-gray-100 px-6">
      {supervisionRequired && (
        <div className="w-full max-w-sm rounded-lg border-2 border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
          <strong>Reminder:</strong> a guardian must supervise this guest at all times while using equipment.
        </div>
      )}

      <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-white px-8 py-10 text-center shadow-xl">
        <div className="text-4xl">✅</div>
        <h2 className="text-xl font-bold text-primary">You're all set!</h2>
        <p className="text-base text-gray-700">
          Please step up to the front desk so we can verify your ID.
        </p>
        <p className="text-sm text-gray-400">{`${formData.first_name || ''} ${formData.last_name || ''}`.trim()}</p>
        <button className="mt-2 min-h-[48px] w-full rounded-lg bg-accent px-6 font-semibold text-white" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  )
}
