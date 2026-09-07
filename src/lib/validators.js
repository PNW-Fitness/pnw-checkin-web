export function computeAge(dob) {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function normalizePhone(phone) {
  return phone.replace(/\D/g, '')
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidZip(value) {
  return /^\d{5}$/.test(value.trim())
}

// Accepts US numbers as well as foreign numbers (with or without a leading
// "+" country code prefix). Follows the E.164 length range (min 7, max 15
// digits) rather than requiring exactly 10 US-style digits.
export function isValidPhone(value) {
  const digits = normalizePhone(value)
  return digits.length >= 7 && digits.length <= 15
}
