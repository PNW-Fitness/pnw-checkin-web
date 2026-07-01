import { useState } from 'react'
import { computeAge } from '../../lib/validators'

export default function AgeCheck({ navigate, onBack }) {
  const [step, setStep] = useState('ask') // 'ask' | 'dob'
  const [dob, setDob] = useState('')
  const [error, setError] = useState('')

  const today = new Date().toISOString().split('T')[0]

  function handleYes() {
    navigate('guest_form', { isMinor: false, supervisionRequired: false, dob: null })
  }

  function handleNo() {
    setStep('dob')
  }

  function handleDobSubmit(e) {
    e.preventDefault()
    if (!dob) {
      setError('Please enter a date of birth.')
      return
    }
    const age = computeAge(dob)
    if (age < 0) {
      setError('Invalid date of birth.')
      return
    }
    if (age < 14) {
      navigate('guest_minor_blocked', { dob })
    } else if (age <= 15) {
      navigate('guest_form', { isMinor: true, supervisionRequired: true, dob })
    } else if (age <= 17) {
      navigate('guest_form', { isMinor: true, supervisionRequired: false, dob })
    } else {
      navigate('guest_form', { isMinor: false, supervisionRequired: false, dob })
    }
  }

  if (step === 'ask') {
    return (
      <div className="flex min-h-dvh flex-col bg-gray-100">
        <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
          <button className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm" onClick={onBack}>
            ← Back
          </button>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-8 px-6">
          <h2 className="text-center text-2xl font-bold text-primary">Are you 18 or older?</h2>
          <div className="flex gap-6">
            <button className="h-24 w-36 rounded-2xl bg-green-600 text-xl font-bold text-white shadow-md" onClick={handleYes}>
              Yes
            </button>
            <button className="h-24 w-36 rounded-2xl bg-red-600 text-xl font-bold text-white shadow-md" onClick={handleNo}>
              No
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button
          className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
          onClick={() => {
            setStep('ask')
            setError('')
          }}
        >
          ← Back
        </button>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6">
        <h2 className="text-center text-2xl font-bold text-primary">Enter your date of birth</h2>
        <form onSubmit={handleDobSubmit} className="flex w-full max-w-xs flex-col gap-3">
          <label htmlFor="dob" className="text-sm font-semibold">Date of Birth</label>
          <input
            id="dob"
            type="date"
            className="min-h-[48px] rounded-lg border border-gray-300 px-3"
            value={dob}
            max={today}
            onChange={(e) => {
              setDob(e.target.value)
              setError('')
            }}
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="min-h-[52px] rounded-lg bg-accent text-lg font-semibold text-white">
            Continue
          </button>
        </form>
      </div>
    </div>
  )
}
