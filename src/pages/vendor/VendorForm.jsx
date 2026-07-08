import { useState } from 'react'

const EMPTY = { name: '', company: '', phone: '', reason: '' }

function validate(form) {
  const errors = {}
  if (!form.name.trim()) errors.name = 'Required'
  if (!form.company.trim()) errors.company = 'Required'
  if (!form.phone.trim()) errors.phone = 'Required'
  if (!form.reason.trim()) errors.reason = 'Required'
  return errors
}

export default function VendorForm({ onSubmit, onBack, submitting, submitError }) {
  const [form, setForm] = useState(EMPTY)
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
    onSubmit(form)
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm" onClick={onBack} disabled={submitting}>
          ← Back
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <h2 className="mb-4 text-xl font-bold text-primary">Vendor Check-In</h2>
        <form onSubmit={handleSubmit} noValidate autoComplete="off" className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Name *</label>
            <input className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3" type="text" autoComplete="off" value={form.name} onChange={(e) => set('name', e.target.value)} />
            {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Company *</label>
            <input className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3" type="text" autoComplete="off" value={form.company} onChange={(e) => set('company', e.target.value)} />
            {errors.company && <p className="text-sm text-red-600">{errors.company}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Phone *</label>
            <input className="min-h-[48px] w-full rounded-lg border border-gray-300 px-3" type="tel" autoComplete="off" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-gray-700">Reason for Visit *</label>
            <textarea className="w-full rounded-lg border border-gray-300 px-3 py-2" rows={3} autoComplete="off" value={form.reason} onChange={(e) => set('reason', e.target.value)} />
            {errors.reason && <p className="text-sm text-red-600">{errors.reason}</p>}
          </div>

          {submitError && <p className="text-sm text-red-600">{submitError}</p>}

          <button type="submit" className="min-h-[52px] w-full rounded-lg bg-accent text-lg font-semibold text-white disabled:bg-gray-300" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
