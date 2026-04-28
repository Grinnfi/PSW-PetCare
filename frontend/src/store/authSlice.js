// ══════════════════════════════════════════════
// authSlice.js — com persistência no localStorage
// ══════════════════════════════════════════════
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
 
const API = 'http://localhost:3001'
 
// Recupera usuário salvo no localStorage (persiste entre F5)
const usuarioSalvo = () => {
  try {
    const raw = localStorage.getItem('petcare_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}
 
export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const res = await fetch(`${API}/users`)
  return res.json()
})
 
export const registerUser = createAsyncThunk('auth/registerUser', async (novoUsuario) => {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoUsuario),
  })
  return res.json()
})
 
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: usuarioSalvo(), // ← restaura do localStorage
    users: [],
    status: 'idle',
  },
  reducers: {
    login(state, action) {
      state.currentUser = action.payload
      localStorage.setItem('petcare_user', JSON.stringify(action.payload))
    },
    logout(state) {
      state.currentUser = null
      localStorage.removeItem('petcare_user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users  = action.payload
      })
      .addCase(fetchUsers.rejected,  (state) => { state.status = 'failed' })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
  },
})
 
export const { login, logout } = authSlice.actions
export default authSlice.reducer
 
