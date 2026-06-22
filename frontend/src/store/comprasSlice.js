import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authHeader } from '../utils/api.js'

const API = 'http://localhost:3001'

export const fetchCompras = createAsyncThunk('compras/fetchAll', async () => {
  const res = await fetch(`${API}/compras`, { headers: { ...authHeader() } })
  if (!res.ok) return []
  return res.json()
})

export const addCompra = createAsyncThunk('compras/add', async (compra, { rejectWithValue }) => {
  const res = await fetch(`${API}/compras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(compra),
  })

  let data
  try {
    data = await res.json()
  } catch {
    return rejectWithValue('Sessão expirada. Faça login novamente.')
  }

  if (!res.ok) return rejectWithValue(data.error || 'Não foi possível concluir a compra.')
  return data
})

const comprasSlice = createSlice({
  name: 'compras',
  initialState: { list: [], status: 'idle' },
  reducers: {
    limpar(state) { state.list = []; state.status = 'idle' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompras.pending,   (state) => { state.status = 'loading' })
      .addCase(fetchCompras.fulfilled, (state, action) => { state.status = 'succeeded'; state.list = action.payload })
      .addCase(fetchCompras.rejected,  (state) => { state.status = 'failed' })
      .addCase(addCompra.fulfilled,    (state, action) => { state.list.push(action.payload) })
  },
})

export const { limpar: limparCompras } = comprasSlice.actions
export default comprasSlice.reducer