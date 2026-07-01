import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { createRotatingSession, deactivateSession, ROTATION_INTERVAL_MS } from '../lib/rotatingSession'

// Meant to be left open, full-screen, on a spare monitor at the front desk —
// not part of the guest-facing check-in flow. See /checkin for that.
export default function DisplayPage() {
  const [qrDataUrl, setQrDataUrl] = useState(null)
  const [error, setError] = useState('')
  const currentTokenRef = useRef(null)

  useEffect(() => {
    let cancelled = false

    async function rotate() {
      const previousToken = currentTokenRef.current
      try {
        if (previousToken) await deactivateSession(previousToken)
        const token = await createRotatingSession()
        const url = `${window.location.origin}/checkin?token=${token}`
        const dataUrl = await QRCode.toDataURL(url, { width: 640, margin: 1 })
        if (cancelled) return
        currentTokenRef.current = token
        setQrDataUrl(dataUrl)
        setError('')
      } catch (err) {
        console.error('Failed to rotate check-in token:', err)
        if (!cancelled) setError('Could not refresh the check-in code. Retrying…')
      }
    }

    rotate()
    const interval = setInterval(rotate, ROTATION_INTERVAL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
      if (currentTokenRef.current) deactivateSession(currentTokenRef.current)
    }
  }, [])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-10 bg-primary px-6 text-white">
      <p className="text-3xl font-bold">Scan to check in from your phone</p>
      {qrDataUrl ? (
        <img src={qrDataUrl} alt="Scan to check in" className="h-[480px] w-[480px] rounded-2xl bg-white p-6 shadow-2xl" />
      ) : (
        <div className="flex h-[480px] w-[480px] items-center justify-center rounded-2xl bg-white text-gray-400">
          Loading…
        </div>
      )}
      {error && <p className="text-red-300">{error}</p>}
    </div>
  )
}
