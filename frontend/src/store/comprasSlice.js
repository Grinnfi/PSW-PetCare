// ══════════════════════════════════════════════
// comprasSlice.js — Estado de compras (Redux)
// ══════════════════════════════════════════════
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API = 'http://localhost:3001'

function atualizarStatusCompras(compras) {
  // Compras sempre ficam "entregue" após 3 dias - simulação simples
  return compras
}

export const fetchCompras = createAsyncThunk('compras/fetchAll', async () => {
  const res = await fetch(`${API}/compras`)
  const data = await res.json()
  return atualizarStatusCompras(data)
})

export const addCompra = createAsyncThunk('compras/add', async (compra) => {
  const res = await fetch(`${API}/compras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(compra),
  })
  return res.json()
})

const comprasSlice = createSlice({
  name: 'compras',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompras.pending, (state) => { state.status = 'loading' })
      .addCase(fetchCompras.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchCompras.rejected, (state) => { state.status = 'failed' })
      .addCase(addCompra.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default comprasSlice.reducer
