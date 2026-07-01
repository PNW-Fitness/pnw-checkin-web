import { supabase } from './supabaseClient'

// Front-desk display page: rotates a fresh token every 45s so the code is
// only ever valid for a moment while someone is physically at the desk
// watching the screen. expires_at is a fallback slightly longer than the
// rotation interval, in case the deactivate call for the previous token fails.
export const ROTATION_INTERVAL_MS = 45 * 1000
const TOKEN_LIFETIME_MS = 90 * 1000

export async function createRotatingSession() {
  const token = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + TOKEN_LIFETIME_MS).toISOString()
  const { error } = await supabase.from('checkin_sessions').insert({ token, expires_at: expiresAt })
  if (error) throw error
  return token
}

// Best-effort — the token's expires_at is the fallback if this fails.
export async function deactivateSession(token) {
  if (!token) return
  const { error } = await supabase.from('checkin_sessions').update({ active: false }).eq('token', token)
  if (error) console.error('Failed to deactivate check-in token:', error)
}
