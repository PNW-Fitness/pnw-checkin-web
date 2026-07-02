import { supabase } from './supabaseClient'

// A token is valid only while its session is active and unexpired — the
// rotating/daily front-desk code is the actual access control (see the
// pnw-checkin-web spec), not anything client-side.
export async function validateCheckinToken(token) {
  if (!token) return false
  const { data, error } = await supabase
    .from('checkin_sessions')
    .select('token')
    .eq('token', token)
    .eq('active', true)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle()
  if (error) throw error
  return Boolean(data)
}

export async function submitGuestCheckin({ token, formData, waiverAgreedAt, signatureDataUrl }) {
  const { error } = await supabase.from('pending_checkins').insert({
    flow_type: 'guest',
    session_token: token,
    form_data: formData,
    waiver_agreed_at: waiverAgreedAt,
    signature_data: signatureDataUrl,
  })
  if (error) throw error
}

export async function submitClassPassCheckin({ token, formData, waiverAgreedAt, signatureDataUrl }) {
  const { error } = await supabase.from('pending_checkins').insert({
    flow_type: 'classpass',
    session_token: token,
    form_data: formData,
    waiver_agreed_at: waiverAgreedAt,
    signature_data: signatureDataUrl,
  })
  if (error) throw error
}

// Searches past ClassPass check-ins by guest name or contact.
// Returns unique guests (grouped by contact), most recent visit first.
export async function lookupClassPassGuest(term) {
  const like = `%${term.trim()}%`
  const { data, error } = await supabase
    .from('pending_checkins')
    .select('form_data, waiver_agreed_at')
    .eq('flow_type', 'classpass')
    .or(`form_data->>guest_name.ilike.${like},form_data->>contact.ilike.${like}`)
    .order('waiver_agreed_at', { ascending: false })
    .limit(100)
  if (error) throw error

  // Group by contact client-side to get unique guests + visit counts
  const map = new Map()
  for (const row of data ?? []) {
    const key = (row.form_data?.contact || '').toLowerCase()
    if (!map.has(key)) {
      map.set(key, {
        guestName: row.form_data?.guest_name || '',
        contact:   row.form_data?.contact   || '',
        zipCode:   row.form_data?.zip_code  || '',
        lastVisit: row.waiver_agreed_at,
        visitCount: 1,
      })
    } else {
      map.get(key).visitCount++
    }
  }
  return Array.from(map.values()).slice(0, 10)
}

export async function submitClassPassReturning({ token, formData }) {
  const { error } = await supabase.from('pending_checkins').insert({
    flow_type: 'classpass',
    session_token: token,
    form_data: { ...formData, is_returning: true },
    waiver_agreed_at: new Date().toISOString(),
    signature_data: null,
  })
  if (error) throw error
}

export async function submitTanningCheckin({ token, formData, waiverAgreedAt, signatureDataUrl }) {
  const { error } = await supabase.from('pending_checkins').insert({
    flow_type: 'tanning',
    session_token: token,
    form_data: formData,
    waiver_agreed_at: waiverAgreedAt,
    signature_data: signatureDataUrl,
  })
  if (error) throw error
}

export async function submitVendorCheckin({ token, name, company, reason }) {
  const { error } = await supabase.from('vendor_submissions').insert({
    session_token: token,
    name,
    company,
    reason,
  })
  if (error) throw error
}
