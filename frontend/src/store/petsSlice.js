// ══════════════════════════════════════════════
// petsSlice.js — Estado de pets (Redux)
// ══════════════════════════════════════════════
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API = 'http://localhost:3001'

export const fetchPets = createAsyncThunk('pets/fetchAll', async () => {
  const res = await fetch(`${API}/pets`)
  return res.json()
})

export const addPet = createAsyncThunk('pets/add', async (pet) => {
  const res = await fetch(`${API}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(pet),
  })
  return res.json()
})

export const removePet = createAsyncThunk('pets/remove', async (id) => {
  await fetch(`${API}/pets/${id}`, { method: 'DELETE' })
  return id
})

const petsSlice = createSlice({
  name: 'pets',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending, (state) => { state.status = 'loading' })
      .addCase(fetchPets.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchPets.rejected, (state) => { state.status = 'failed' })
      .addCase(addPet.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(removePet.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p.id !== action.payload)
      })
  },
})

export default petsSlice.reducer
