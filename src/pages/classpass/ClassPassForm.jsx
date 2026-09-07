import { useState } from 'react'
import { isValidEmail, isValidZip, isValidPhone } from '../../lib/validators'

const EMPTY_FORM = { guestName: '', contact: '', zipCode: '' }

function validate(form) {
  const errors = {}
  if (!form.guestName.trim()) errors.guestName = 'Required'
  if (!form.contact.trim()) {
    errors.contact = 'Required'
  } else if (form.contact.includes('@')) {
    if (!isValidEmail(form.contact)) errors.contact = 'Enter a valid email address'
  } else if (!isValidPhone(form.contact)) {
    errors.contact = 'Enter a valid phone number or email address'
  }
  if (!isValidZip(form.zipCode)) errors.zipCode = 'Enter a 5-digit zip code'
  return errors
}

export default function ClassPassForm({ onSubmit, onBack }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }
    onSubmit({
      guestName: form.guestName.trim(),
      contact: form.contact.trim(),
      zipCode: form.zipCode.trim(),
    })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm" onClick={onBack}>
          ← Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="flex flex-col gap-5">
          <fieldset className="flex flex-col gap-4 rounded-lg border border-gray-300 p-4">
            <legend className="px-1 text-sm font-bold text-primary">ClassPass Guest Information</legend>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Guest Name *</label>
              <input
                className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3"
                type="text"
                autoComplete="off"
                placeholder="Full name"
                value={form.guestName}
                onChange={(e) => set('guestName', e.target.value)}
              />
              {errors.guestName && <p className="text-sm text-red-600">{errors.guestName}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Phone Number or Email *</label>
              <input
                className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3"
                type="text"
                autoComplete="off"
                placeholder="(253) 555-0123 or name@example.com"
                value={form.contact}
                onChange={(e) => set('contact', e.target.value)}
              />
              {errors.contact && <p className="text-sm text-red-600">{errors.contact}</p>}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-semibold text-gray-700">Zip Code *</label>
              <input
                className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3"
                type="text"
                inputMode="numeric"
                maxLength={5}
                autoComplete="off"
                placeholder="98402"
                value={form.zipCode}
                onChange={(e) => set('zipCode', e.target.value.replace(/\D/g, ''))}
              />
              {errors.zipCode && <p className="text-sm text-red-600">{errors.zipCode}</p>}
            </div>
          </fieldset>

          <button type="submit" className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white">
            Continue →
          </button>
        </form>
      </div>
    </div>
  )
}
