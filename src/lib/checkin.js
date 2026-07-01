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

export async function submitVendorCheckin({ token, name, company, reason }) {
  const { error } = await supabase.from('vendor_submissions').insert({
    session_token: token,
    name,
    company,
    reason,
  })
  if (error) throw error
}
