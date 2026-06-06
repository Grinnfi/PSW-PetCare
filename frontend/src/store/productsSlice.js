import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authHeader } from '../utils/api.js'

const API = 'http://localhost:3001'

export const fetchProducts = createAsyncThunk('products/fetchAll', async () => {
  const res = await fetch(`${API}/products`)  // público, sem token
  return res.json()
})

export const addProduct = createAsyncThunk('products/add', async (product) => {
  const res = await fetch(`${API}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(product),
  })
  return res.json()
})

export const updateProduct = createAsyncThunk('products/update', async (product) => {
  const res = await fetch(`${API}/products/${product._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify(product),
  })
  return res.json()
})

export const deleteProduct = createAsyncThunk('products/delete', async (id) => {
  await fetch(`${API}/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader() },
  })
  return id
})

const productsSlice = createSlice({
  name: 'products',
  initialState: { list: [], status: 'idle' },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.status = 'loading' })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchProducts.rejected, (state) => { state.status = 'failed' })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.list.findIndex(p => p._id === action.payload._id)
        if (idx !== -1) state.list[idx] = action.payload
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.list = state.list.filter(p => p._id !== action.payload)
      })
  },
})

export default productsSlice.reducer