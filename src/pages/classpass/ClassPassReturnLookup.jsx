import { useState, useRef } from 'react'
import { lookupClassPassGuest } from '../../lib/checkin'

export default function ClassPassReturnLookup({ onFound, onBack }) {
  const [term,     setTerm]     = useState('')
  const [results,  setResults]  = useState([])
  const [searched, setSearched] = useState(false)
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const debounceRef = useRef(null)

  async function handleChange(value) {
    setTerm(value)
    setError('')
    clearTimeout(debounceRef.current)
    if (!value.trim()) { setResults([]); setSearched(false); return }
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const rows = await lookupClassPassGuest(value)
        setResults(rows)
        setSearched(true)
      } catch (err) {
        setError('Search failed — please try again.')
      } finally {
        setLoading(false)
      }
    }, 400)
  }

  function formatDate(ts) {
    if (!ts) return ''
    return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="flex min-h-dvh flex-col bg-gray-100">
      <div className="flex items-center gap-3 bg-primary px-4 py-3 text-white">
        <button
          className="rounded-md border border-white/30 bg-white/10 px-3 py-1.5 text-sm"
          onClick={onBack}
        >
          ← Back
        </button>
        <span className="text-sm font-medium">Returning Guest</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-4 text-sm text-gray-600">
          Search by your name, phone number, or email to find your record.
        </p>

        <input
          type="text"
          autoFocus
          placeholder="e.g. Jane Smith or 2535550123"
          value={term}
          onChange={(e) => handleChange(e.target.value)}
          className="mb-4 min-h-[52px] w-full rounded-lg border border-gray-300 px-4 text-base"
        />

        {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

        {loading && <p className="text-center text-sm text-gray-400">Searching…</p>}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-sm text-gray-400">
            No previous check-ins found. Please use "First visit" instead.
          </p>
        )}

        {results.length > 0 && (
          <div className="flex flex-col gap-3">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={() => onFound({ guestName: r.guestName, contact: r.contact, zipCode: r.zipCode })}
                className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-4 text-left shadow-sm"
              >
                <div>
                  <p className="font-bold text-gray-800">{r.guestName}</p>
                  <p className="text-sm text-gray-500">{r.contact}</p>
                </div>
                <div className="text-right text-xs">
                  <p className="text-gray-400">Last visit: {formatDate(r.lastVisit)}</p>
                  <p className="font-semibold text-green-600">
                    {r.visitCount} {r.visitCount === 1 ? 'visit' : 'visits'}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
