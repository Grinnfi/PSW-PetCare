// ══════════════════════════════════════════════
// authSlice.js — Estado de autenticação (Redux)
// ══════════════════════════════════════════════
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API = 'http://localhost:3001'

// ── Thunks assíncronos ──────────────────────
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

// ── Slice ───────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: null,
    users: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  },
  reducers: {
    login(state, action) {
      state.currentUser = action.payload
    },
    logout(state) {
      state.currentUser = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => { state.status = 'loading' })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = action.payload
      })
      .addCase(fetchUsers.rejected, (state) => { state.status = 'failed' })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.users.push(action.payload)
      })
  },
})

export const { login, logout } = authSlice.actions
export default authSlice.reducer
