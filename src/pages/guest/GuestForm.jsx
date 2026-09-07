import { useState } from 'react'
import { isValidEmail, isValidZip, isValidPhone } from '../../lib/validators'

const VISIT_REASONS = ['Day/week pass workout', 'Interested in membership', 'Staff Guest', 'Event/Promotion']

const HOW_HEARD_OPTIONS = [
  { value: 'Search Engine', label: 'Search Engine', hasSpecify: false },
  { value: 'Social Media', label: 'Social Media', hasSpecify: false },
  { value: 'Word of Mouth / Referral', label: 'Word of Mouth / Referral (Please specify if current member)', hasSpecify: true },
  { value: 'Website / Blog', label: 'Website / Blog', hasSpecify: false },
  { value: 'Email Newsletter', label: 'Email Newsletter', hasSpecify: false },
  { value: 'Advertisement', label: 'Advertisement', hasSpecify: false },
  { value: 'Event / Trade Show', label: 'Event / Trade Show', hasSpecify: false },
  { value: 'Other', label: 'Other (Please specify)', hasSpecify: true },
]

const INTEREST_OPTIONS = ['Weight lifting', 'Cardio', 'Group Fitness', 'Personal Training', 'Tanning']

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  zip_code: '',
  phone: '',
  email: '',
  visit_reason: '',
  how_heard: '',
  how_heard_specify: '',
  interests: [],
  guardian_name: '',
  guardian_phone: '',
}

function validate(form, isMinor) {
  const errors = {}
  if (!form.first_name.trim()) errors.first_name = 'Required'
  if (!form.last_name.trim()) errors.last_name = 'Required'
  if (!isValidZip(form.zip_code)) errors.zip_code = 'Enter a 5-digit zip code'
  if (!isValidPhone(form.phone)) errors.phone = 'Enter a valid phone number'
  if (!isValidEmail(form.email)) errors.email = 'Enter a valid email address'
  if (!form.visit_reason) errors.visit_reason = 'Required'
  if (isMinor) {
    if (!form.guardian_name.trim()) errors.guardian_name = 'Required for minor guests'
    if (!isValidPhone(form.guardian_phone)) errors.guardian_phone = 'Enter a valid phone number'
  }
  return errors
}

function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-gray-700">{label}</label>
      {children}
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  )
}

const inputClass = 'min-h-[48px] w-full rounded-lg border border-gray-300 px-3 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20'

export default function GuestForm({ guestSession, navigate, onBack }) {
  const { isMinor, supervisionRequired } = guestSession
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function toggleInterest(interest) {
    setForm((f) => ({
      ...f,
      interests: f.interests.includes(interest) ? f.interests.filter((i) => i !== interest) : [...f.interests, interest],
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form, isMinor)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    navigate('guest_waiver', { formData: form })
  }

  const howHeardEntry = HOW_HEARD_OPTIONS.find((o) => o.value === form.how_heard)
  const showSpecify = howHeardEntry?.hasSpecify

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        {isMinor && (
          <div className={`mb-4 rounded-lg border px-4 py-2.5 text-sm font-semibold ${supervisionRequired ? 'border-amber-300 bg-amber-50 text-amber-900' : 'border-blue-300 bg-blue-50 text-blue-900'}`}>
            Minor guest{supervisionRequired ? ' — supervision required (guardian must be present)' : ' (16–17)'}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
            <legend className="px-1 text-sm font-bold text-primary">Your Information</legend>

            <Field label="First Name *" error={errors.first_name}>
              <input className={inputClass} type="text" autoComplete="off" value={form.first_name} onChange={(e) => set('first_name', e.target.value)} />
            </Field>
            <Field label="Last Name *" error={errors.last_name}>
              <input className={inputClass} type="text" autoComplete="off" value={form.last_name} onChange={(e) => set('last_name', e.target.value)} />
            </Field>
            <Field label="Zip Code *" error={errors.zip_code}>
              <input className={inputClass} type="text" inputMode="numeric" maxLength={5} autoComplete="off" value={form.zip_code} onChange={(e) => set('zip_code', e.target.value.replace(/\D/g, ''))} />
            </Field>
            <Field label="Phone *" error={errors.phone}>
              <input className={inputClass} type="tel" placeholder="(253) 555-0123 or +44 20 7946 0958" autoComplete="off" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label="Email *" error={errors.email}>
              <input className={inputClass} type="email" autoComplete="off" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Reason for Visit *" error={errors.visit_reason}>
              <select className={inputClass} value={form.visit_reason} onChange={(e) => set('visit_reason', e.target.value)}>
                <option value="">— Select —</option>
                {VISIT_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </Field>
          </fieldset>

          {isMinor && (
            <fieldset className="flex flex-col gap-4 rounded-lg border border-blue-300 bg-blue-50 p-4">
              <legend className="px-1 text-sm font-bold text-primary">Guardian Information</legend>
              <Field label="Guardian Full Name *" error={errors.guardian_name}>
                <input className={inputClass} type="text" autoComplete="off" value={form.guardian_name} onChange={(e) => set('guardian_name', e.target.value)} />
              </Field>
              <Field label="Guardian Phone *" error={errors.guardian_phone}>
                <input className={inputClass} type="tel" placeholder="(253) 555-0123 or +44 20 7946 0958" autoComplete="off" value={form.guardian_phone} onChange={(e) => set('guardian_phone', e.target.value)} />
              </Field>
            </fieldset>
          )}

          <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <legend className="px-1 text-sm font-bold text-primary">Optional — Help us serve you better</legend>

            <Field label="How did you hear about us?">
              <select
                className={inputClass}
                value={form.how_heard}
                onChange={(e) => {
                  set('how_heard', e.target.value)
                  set('how_heard_specify', '')
                }}
              >
                <option value="">— Select (optional) —</option>
                {HOW_HEARD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </Field>

            {showSpecify && (
              <Field label="Please specify">
                <input className={inputClass} type="text" autoComplete="off" value={form.how_heard_specify} onChange={(e) => set('how_heard_specify', e.target.value)} />
              </Field>
            )}

            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">What are you interested in?</label>
              <div className="flex flex-wrap gap-2">
                {INTEREST_OPTIONS.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <input type="checkbox" checked={form.interests.includes(interest)} onChange={() => toggleInterest(interest)} className="h-4 w-4 accent-accent" />
                    {interest}
                  </label>
                ))}
              </div>
            </div>
          </fieldset>

          <button type="submit" className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white">
            Continue to Waiver →
          </button>
        </form>
      </div>
    </div>
  )
}
