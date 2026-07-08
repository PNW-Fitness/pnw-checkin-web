import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { validateCheckinToken, submitGuestCheckin, submitClassPassCheckin, submitTanningCheckin, submitVendorCheckin } from '../lib/checkin'
import TokenInvalid from './TokenInvalid'
import FlowSelector from './FlowSelector'
import AgeCheck from './guest/AgeCheck'
import MinorBlocked from './guest/MinorBlocked'
import GuestForm from './guest/GuestForm'
import GuestConfirmation from './guest/GuestConfirmation'
import ClassPassNotice from './classpass/ClassPassNotice'
import ClassPassNewOrReturn from './classpass/ClassPassNewOrReturn'
import ClassPassForm from './classpass/ClassPassForm'
import ClassPassConfirmation from './classpass/ClassPassConfirmation'
import VendorForm from './vendor/VendorForm'
import VendorConfirmation from './vendor/VendorConfirmation'
import TanningAgeCheck from './tanning/TanningAgeCheck'
import TanningForm from './tanning/TanningForm'
import TanningConfirmation from './tanning/TanningConfirmation'
import WaiverStep from '../components/WaiverStep'
import { WAIVER_TEXT } from '../lib/waiverText'
import { CLASSPASS_WAIVER_TEXT } from '../lib/classpassWaiverText'
import { TANNING_WAIVER_TEXT } from '../lib/tanningWaiverText'

const EMPTY_GUEST_SESSION = {
  isMinor: false,
  supervisionRequired: false,
  dob: null,
  formData: {},
}

const EMPTY_CP_SESSION = { guestName: '', contact: '', zipCode: '' }

function LoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-primary text-white">
      <p>Loading…</p>
    </div>
  )
}

export default function CheckinPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [tokenStatus, setTokenStatus] = useState('validating') // 'validating' | 'valid' | 'invalid'
  const [step, setStep] = useState('selector')

  const [guestSession, setGuestSession] = useState(EMPTY_GUEST_SESSION)
  const [guestSubmitting, setGuestSubmitting] = useState(false)
  const [guestSubmitError, setGuestSubmitError] = useState('')

  const [cpSession, setCpSession] = useState(EMPTY_CP_SESSION)
  const [cpSubmitting, setCpSubmitting] = useState(false)
  const [cpSubmitError, setCpSubmitError] = useState('')

  const [tanningSession, setTanningSession] = useState({ fullName: '', contact: '', zipCode: '' })
  const [tanningSubmitting, setTanningSubmitting] = useState(false)
  const [tanningSubmitError, setTanningSubmitError] = useState('')

  const [vendorSubmitting, setVendorSubmitting] = useState(false)
  const [vendorSubmitError, setVendorSubmitError] = useState('')

  useEffect(() => {
    let cancelled = false
    validateCheckinToken(token)
      .then((valid) => {
        if (!cancelled) setTokenStatus(valid ? 'valid' : 'invalid')
      })
      .catch(() => {
        if (!cancelled) setTokenStatus('invalid')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  function navigateGuest(nextStep, updates = {}) {
    setGuestSession((prev) => ({ ...prev, ...updates }))
    setGuestSubmitError('')
    setStep(nextStep)
  }

  async function handleGuestWaiverSubmit({ signatureDataUrl, waiverAgreedAt }) {
    setGuestSubmitError('')
    setGuestSubmitting(true)
    try {
      await submitGuestCheckin({
        token,
        formData: {
          ...guestSession.formData,
          is_minor: guestSession.isMinor,
          supervision_required: guestSession.supervisionRequired,
        },
        waiverAgreedAt,
        signatureDataUrl,
      })
      setStep('guest_confirm')
    } catch (err) {
      console.error('Guest check-in failed:', err)
      setGuestSubmitError('Something went wrong submitting your check-in. Please try again or see front desk staff.')
    } finally {
      setGuestSubmitting(false)
    }
  }

  function navigateCp(nextStep, updates = {}) {
    setCpSession((prev) => ({ ...prev, ...updates }))
    setCpSubmitError('')
    setStep(nextStep)
  }

  async function handleCpWaiverSubmit({ signatureDataUrl, waiverAgreedAt }) {
    setCpSubmitError('')
    setCpSubmitting(true)
    try {
      await submitClassPassCheckin({
        token,
        formData: {
          guest_name: cpSession.guestName,
          contact: cpSession.contact,
          zip_code: cpSession.zipCode,
        },
        waiverAgreedAt,
        signatureDataUrl,
      })
      setStep('classpass_confirm')
    } catch (err) {
      console.error('ClassPass check-in failed:', err)
      setCpSubmitError('Something went wrong submitting your check-in. Please try again or see front desk staff.')
    } finally {
      setCpSubmitting(false)
    }
  }

  async function handleVendorSubmit(vendorForm) {
    setVendorSubmitError('')
    setVendorSubmitting(true)
    try {
      await submitVendorCheckin(vendorForm)
      setStep('vendor_confirm')
    } catch (err) {
      console.error('Vendor sign-in failed:', err)
      setVendorSubmitError('Something went wrong signing you in. Please try again or see front desk staff.')
    } finally {
      setVendorSubmitting(false)
    }
  }

  async function handleTanningWaiverSubmit({ signatureDataUrl, waiverAgreedAt }) {
    setTanningSubmitError('')
    setTanningSubmitting(true)
    try {
      await submitTanningCheckin({
        token,
        formData: {
          full_name: tanningSession.fullName,
          contact: tanningSession.contact,
          zip_code: tanningSession.zipCode,
        },
        waiverAgreedAt,
        signatureDataUrl,
      })
      setStep('tanning_confirm')
    } catch (err) {
      console.error('Tanning check-in failed:', err)
      setTanningSubmitError('Something went wrong submitting your form. Please try again or see front desk staff.')
    } finally {
      setTanningSubmitting(false)
    }
  }

  function resetToSelector() {
    setGuestSession(EMPTY_GUEST_SESSION)
    setCpSession(EMPTY_CP_SESSION)
    setTanningSession({ fullName: '', contact: '', zipCode: '' })
    setStep('selector')
  }

  if (tokenStatus === 'validating') return <LoadingScreen />
  if (tokenStatus === 'invalid') return <TokenInvalid />

  switch (step) {
    case 'selector':
      return (
        <FlowSelector
          onGuest={() => setStep('guest_age_check')}
          onClassPass={() => setStep('classpass_notice')}
          onTanning={() => setStep('tanning_age_check')}
          onVendor={() => setStep('vendor_form')}
        />
      )

    // ── Guest flow ────────────────────────────────────────────────────────
    case 'guest_age_check':
      return <AgeCheck navigate={navigateGuest} onBack={resetToSelector} />

    case 'guest_minor_blocked':
      return <MinorBlocked onBack={resetToSelector} />

    case 'guest_form':
      return (
        <GuestForm
          guestSession={guestSession}
          navigate={navigateGuest}
          onBack={() => setStep('guest_age_check')}
        />
      )

    case 'guest_waiver':
      return (
        <WaiverStep
          heading={guestSession.isMinor ? 'Guardian Acknowledgment' : 'Liability Waiver'}
          intro={
            guestSession.isMinor
              ? 'Please read this waiver carefully. As the guardian of the minor guest, you are agreeing to these terms on their behalf.'
              : 'Please read this waiver carefully before signing.'
          }
          waiverText={WAIVER_TEXT}
          signerLabel={`${guestSession.isMinor ? 'Guardian' : 'Guest'} signature — ${
            guestSession.isMinor
              ? guestSession.formData.guardian_name || 'Guardian'
              : `${guestSession.formData.first_name || ''} ${guestSession.formData.last_name || ''}`.trim()
          }`}
          submitLabel="Complete Check-In"
          onBack={() => setStep('guest_form')}
          onSubmit={handleGuestWaiverSubmit}
          submitError={guestSubmitError}
          submitting={guestSubmitting}
        />
      )

    case 'guest_confirm':
      return <GuestConfirmation guestSession={guestSession} onDone={resetToSelector} />

    // ── ClassPass flow ────────────────────────────────────────────────────
    case 'classpass_notice':
      return <ClassPassNotice onContinue={() => setStep('classpass_new_or_return')} onBack={resetToSelector} />

    case 'classpass_new_or_return':
      return (
        <ClassPassNewOrReturn
          onNew={() => setStep('classpass_form')}
          onBack={() => setStep('classpass_notice')}
        />
      )

    case 'classpass_form':
      return (
        <ClassPassForm
          onSubmit={(data) => navigateCp('classpass_waiver', data)}
          onBack={() => setStep('classpass_notice')}
        />
      )

    case 'classpass_waiver':
      return (
        <WaiverStep
          heading="Liability Waiver"
          intro="Please read this waiver carefully before signing."
          waiverText={CLASSPASS_WAIVER_TEXT}
          signerLabel={`Guest signature — ${cpSession.guestName}`}
          submitLabel="Complete Check-In"
          onBack={() => setStep('classpass_form')}
          onSubmit={handleCpWaiverSubmit}
          submitError={cpSubmitError}
          submitting={cpSubmitting}
        />
      )

    case 'classpass_confirm':
      return <ClassPassConfirmation cpSession={cpSession} onDone={resetToSelector} />

    // ── Tanning flow ──────────────────────────────────────────────────────
    case 'tanning_age_check':
      return <TanningAgeCheck onConfirm={() => setStep('tanning_form')} onBack={resetToSelector} />

    case 'tanning_form':
      return (
        <TanningForm
          onSubmit={(data) => { setTanningSession(data); setStep('tanning_waiver') }}
          onBack={() => setStep('tanning_age_check')}
        />
      )

    case 'tanning_waiver':
      return (
        <WaiverStep
          heading="Tanning Release and Consent Form"
          intro="Please read this form carefully before signing."
          waiverText={TANNING_WAIVER_TEXT}
          signerLabel={`Signature — ${tanningSession.fullName}`}
          submitLabel="Submit Consent Form"
          onBack={() => setStep('tanning_form')}
          onSubmit={handleTanningWaiverSubmit}
          submitError={tanningSubmitError}
          submitting={tanningSubmitting}
        />
      )

    case 'tanning_confirm':
      return <TanningConfirmation tanningSession={tanningSession} onDone={resetToSelector} />

    // ── Vendor flow ───────────────────────────────────────────────────────
    case 'vendor_form':
      return (
        <VendorForm
          onSubmit={handleVendorSubmit}
          onBack={resetToSelector}
          submitting={vendorSubmitting}
          submitError={vendorSubmitError}
        />
      )

    case 'vendor_confirm':
      return <VendorConfirmation onDone={resetToSelector} />

    default:
      return (
        <FlowSelector
          onGuest={() => setStep('guest_age_check')}
          onClassPass={() => setStep('classpass_notice')}
          onTanning={() => setStep('tanning_age_check')}
          onVendor={() => setStep('vendor_form')}
        />
      )
  }
}
