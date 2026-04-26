// ══════════════════════════════════════════════
// agendamentosSlice.js — Estado de agendamentos (Redux)
// ══════════════════════════════════════════════
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API = 'http://localhost:3001'

// Atualiza status de agendamentos passados para "concluido"
function atualizarStatusAutomatico(agendamentos) {
  const agora = new Date()
  return agendamentos.map(ag => {
    if (ag.status === 'pendente') {
      const [ano, mes, dia] = ag.data.split('-').map(Number)
      const [hora, min] = ag.hora.split(':').map(Number)
      const dataAg = new Date(ano, mes - 1, dia, hora, min)
      if (dataAg < agora) return { ...ag, status: 'concluido' }
    }
    return ag
  })
}

export const fetchAgendamentos = createAsyncThunk('agendamentos/fetchAll', async () => {
  const res = await fetch(`${API}/agendamentos`)
  const data = await res.json()
  return atualizarStatusAutomatico(data)
})

export const addAgendamento = createAsyncThunk('agendamentos/add', async (ag) => {
  const res = await fetch(`${API}/agendamentos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ag),
  })
  return res.json()
})

export const cancelarAgendamento = createAsyncThunk('agendamentos/cancelar', async (id) => {
  const res = await fetch(`${API}/agendamentos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelado' }),
  })
  return res.json()
})

const agendamentosSlice = createSlice({
  name: 'agendamentos',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAgendamentos.pending, (state) => { state.status = 'loading' })
      .addCase(fetchAgendamentos.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchAgendamentos.rejected, (state) => { state.status = 'failed' })
      .addCase(addAgendamento.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(cancelarAgendamento.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a.id === action.payload.id)
        if (idx !== -1) state.list[idx] = action.payload
      })
  },
})

export default agendamentosSlice.reducer
