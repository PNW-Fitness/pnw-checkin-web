import { useRef, useState } from 'react'
import SignaturePad from './SignaturePad'

// TODO: confirm data-sharing practice with ownership before adding any privacy statement copy near this component.
export default function WaiverStep({
  heading,
  intro,
  waiverText,
  signerLabel,
  submitLabel,
  onBack,
  onSubmit,
  submitError,
  submitting,
}) {
  const [hasScrolled, setHasScrolled] = useState(false)
  const [hasAgreed, setHasAgreed] = useState(false)
  const [agreedAt, setAgreedAt] = useState(null)
  const [signatureDataUrl, setSignatureDataUrl] = useState(null)
  const scrollRef = useRef(null)

  function handleScroll() {
    if (hasScrolled) return
    const el = scrollRef.current
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 20) {
      setHasScrolled(true)
    }
  }

  function handleAgreeChange(e) {
    const checked = e.target.checked
    setHasAgreed(checked)
    if (checked) setAgreedAt(new Date().toISOString())
    else setSignatureDataUrl(null)
  }

  const canSubmit = hasAgreed && signatureDataUrl && !submitting

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <h2 className="text-xl font-bold text-primary">{heading}</h2>
        <p className="text-sm text-gray-600">{intro}</p>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          tabIndex={0}
          aria-label="Waiver text — scroll to bottom to enable agreement"
          className="h-72 overflow-y-scroll rounded-lg border border-gray-300 bg-white p-4"
        >
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">{waiverText}</pre>
        </div>

        {!hasScrolled && (
          <p className="text-center text-sm text-gray-500">↓ Scroll to the bottom to enable the agreement checkbox</p>
        )}

        <label className={`flex items-center gap-3 text-base font-semibold ${!hasScrolled ? 'opacity-40' : ''}`}>
          <input
            type="checkbox"
            checked={hasAgreed}
            disabled={!hasScrolled}
            onChange={handleAgreeChange}
            className="h-6 w-6 accent-accent"
          />
          I have read and agree to the terms above
        </label>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-gray-500">{signerLabel}</p>
          <SignaturePad
            enabled={hasAgreed}
            onChange={setSignatureDataUrl}
            onClear={() => setSignatureDataUrl(null)}
          />
        </div>

        {submitError && <p className="text-center text-sm text-red-600">{submitError}</p>}

        <button
          className="mt-2 min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white disabled:bg-gray-300"
          disabled={!canSubmit}
          onClick={() => onSubmit({ signatureDataUrl, waiverAgreedAt: agreedAt })}
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </div>
  )
}
