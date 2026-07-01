export default function TokenInvalid() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-primary px-6 text-center text-white">
      <div className="flex w-full max-w-sm flex-col items-center gap-4 rounded-2xl bg-white px-8 py-10 text-gray-800 shadow-xl">
        <div className="text-4xl">⏱️</div>
        <h1 className="text-xl font-bold text-primary">This QR code has expired</h1>
        <p className="text-sm text-gray-500">
          Please scan the current code displayed at the front desk.
        </p>
      </div>
    </div>
  )
}
