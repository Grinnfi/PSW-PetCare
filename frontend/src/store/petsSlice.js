import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authHeader } from '../utils/api.js'

const API = 'http://localhost:3001'

export const fetchPets = createAsyncThunk('pets/fetchAll', async () => {
  const res = await fetch(`${API}/pets`, { headers: { ...authHeader() } })
  if (!res.ok) return []
  return res.json()
})

export const addPet = createAsyncThunk('pets/add', async (pet) => {
  const res = await fetch(`${API}/pets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(pet),
  })
  return res.json()
})

export const removePet = createAsyncThunk('pets/remove', async (id) => {
  await fetch(`${API}/pets/${id}`, { method: 'DELETE', headers: { ...authHeader() } })
  return id
})

const petsSlice = createSlice({
  name: 'pets',
  initialState: { list: [], status: 'idle' },
  reducers: {
    limpar(state) { state.list = []; state.status = 'idle' },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPets.pending,    (state) => { state.status = 'loading' })
      .addCase(fetchPets.fulfilled,  (state, action) => { state.status = 'succeeded'; state.list = action.payload })
      .addCase(fetchPets.rejected,   (state) => { state.status = 'failed' })
      .addCase(addPet.fulfilled,     (state, action) => { state.list.push(action.payload) })
      .addCase(removePet.fulfilled,  (state, action) => { state.list = state.list.filter(p => p._id !== action.payload) })
  },
})

export const { limpar: limparPets } = petsSlice.actions
export default petsSlice.reducer