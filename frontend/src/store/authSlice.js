import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API = 'http://localhost:3001'

const usuarioSalvo = () => {
  try {
    const raw = localStorage.getItem('petcare_user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export const fetchUsers = createAsyncThunk('auth/fetchUsers', async () => {
  const { authHeader } = await import('../utils/api.js')
  const res = await fetch(`${API}/users`, { headers: { ...authHeader() } })
  return res.json()
})

export const registerUser = createAsyncThunk('auth/registerUser', async (novoUsuario, { rejectWithValue }) => {
  const res = await fetch(`${API}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(novoUsuario),
  })
  const data = await res.json()
  if (!res.ok) return rejectWithValue(data.error)
  return data
})

export const loginUser = createAsyncThunk('auth/loginUser', async (credenciais, { rejectWithValue }) => {
  const res = await fetch(`${API}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credenciais),
  })
  const data = await res.json()
  if (!res.ok) return rejectWithValue(data.error)
  return data  // já vem com o token dentro
})

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    currentUser: usuarioSalvo(),
    users: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.currentUser = null
      localStorage.removeItem('petcare_user')
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.currentUser = action.payload  // inclui o token
        state.error = null
        localStorage.setItem('petcare_user', JSON.stringify(action.payload))
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer