/**
 * util/masks.js
 * Conjunto de máscaras para inputs do sistema
 */

export const maskPhone = (v) => {
  if (!v) return ''
  v = v.replace(/\D/g, '').substring(0, 11)
  if (v.length > 10) return `(${v.substring(0, 2)}) ${v.substring(2, 7)}-${v.substring(7)}`
  if (v.length > 6)  return `(${v.substring(0, 2)}) ${v.substring(2, 6)}-${v.substring(6)}`
  if (v.length > 2)  return `(${v.substring(0, 2)}) ${v.substring(2)}`
  return v
}

export const maskCEP = (v) => {
  if (!v) return ''
  v = v.replace(/\D/g, '').substring(0, 8)
  if (v.length > 5) return `${v.substring(0, 5)}-${v.substring(5)}`
  return v
}

export const maskCardNumber = (v) => {
  if (!v) return ''
  v = v.replace(/\D/g, '').substring(0, 16)
  const groups = v.match(/.{1,4}/g)
  return groups ? groups.join(' ') : v
}

export const maskCardExpiry = (v) => {
  if (!v) return ''
  v = v.replace(/\D/g, '').substring(0, 4)
  if (v.length > 2) return `${v.substring(0, 2)}/${v.substring(2)}`
  return v
}

export const maskCVV = (v) => {
  if (!v) return ''
  return v.replace(/\D/g, '').substring(0, 3)
}

export const maskOnlyLetters = (v) => {
  if (!v) return ''
  return v.replace(/[^a-zA-ZÀ-ÿ\s]/g, '')
}

export const maskOnlyNumbers = (v) => {
  if (!v) return ''
  return v.replace(/\D/g, '')
}
