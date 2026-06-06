// ══════════════════════════════════════════════
// utils/api.js — Helper para requisições autenticadas
// ══════════════════════════════════════════════

export function getToken() {
  try {
    const raw = localStorage.getItem('petcare_user')
    return raw ? JSON.parse(raw).token : null
  } catch {
    return null
  }
}

export function authHeader() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function checar401(res) {
  if (res.status === 401) {
    localStorage.removeItem('petcare_user')
    window.location.href = '/'  
  }
  return res
}