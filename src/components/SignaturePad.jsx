import { useEffect, useRef, useState } from 'react'
import SignaturePadLib from 'signature_pad'

export default function SignaturePad({ enabled, onChange, onClear }) {
  const canvasRef = useRef(null)
  const padRef = useRef(null)
  const [hasStrokes, setHasStrokes] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const pad = new SignaturePadLib(canvas, {
      minWidth: 1,
      maxWidth: 2.5,
      penColor: '#1a1a2e',
      backgroundColor: '#ffffff',
    })
    padRef.current = pad

    function resize() {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      const data = pad.toData()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.getContext('2d').scale(dpr, dpr)
      pad.clear()
      if (data.length) pad.fromData(data)
    }
    resize()
    window.addEventListener('resize', resize)

    function handleEnd() {
      setHasStrokes(!pad.isEmpty())
      onChange?.(pad.isEmpty() ? null : pad.toDataURL('image/png'))
    }
    pad.addEventListener('endStroke', handleEnd)

    return () => {
      window.removeEventListener('resize', resize)
      pad.removeEventListener('endStroke', handleEnd)
      pad.off()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const pad = padRef.current
    if (!pad) return
    if (enabled) pad.on()
    else pad.off()
  }, [enabled])

  function handleClear() {
    padRef.current?.clear()
    setHasStrokes(false)
    onClear?.()
  }

  return (
    <div className="flex flex-col gap-1.5">
      <canvas
        ref={canvasRef}
        className={`block w-full h-36 rounded-lg touch-none ${
          enabled
            ? 'border-2 border-solid border-primary bg-white cursor-crosshair'
            : 'border-2 border-dashed border-gray-300 bg-gray-50 opacity-60'
        }`}
      />
      <div className="min-h-[24px] flex items-center">
        {!enabled && (
          <p className="text-sm italic text-gray-500">Please read and agree to the waiver to enable signing</p>
        )}
        {enabled && !hasStrokes && (
          <p className="text-sm italic text-gray-500">Draw your signature above with your finger</p>
        )}
        {enabled && hasStrokes && (
          <button type="button" className="text-sm text-red-600 underline" onClick={handleClear}>
            Clear signature
          </button>
        )}
      </div>
    </div>
  )
}
