export function computeAge(dob) {
  const today = new Date()
  const birth = new Date(dob)
  let age = today.getFullYear() - birth.getFullYear()
  const m = today.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--
  return age
}

export function normalizePhone(phone) {
  return phone.replace(/\D/g, '').slice(-10)
}

export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function isValidZip(value) {
  return /^\d{5}$/.test(value.trim())
}

export function isValidPhone(value) {
  return normalizePhone(value).length === 10
}
