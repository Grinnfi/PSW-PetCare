// ══════════════════════════════════════════════
// carrinhoSlice.js — Estado do carrinho (Redux)
// ══════════════════════════════════════════════
import { createSlice } from '@reduxjs/toolkit'

const carrinhoSlice = createSlice({
  name: 'carrinho',
  initialState: {
    itens: [],
    aberto: false,
  },
  reducers: {
    addItem(state, action) {
      const produto = action.payload
      // Normaliza o campo de preço para sempre usar `price`
      const priceNorm = produto.price ?? produto.precoNum ?? 0
      const existe = state.itens.find(i => i.id === produto.id)
      if (existe) {
        existe.qtd += 1
      } else {
        state.itens.push({ ...produto, price: priceNorm, qtd: 1 })
      }
    },
    removeItem(state, action) {
      state.itens = state.itens.filter(i => i.id !== action.payload)
    },
    updateQtd(state, action) {
      const { id, qtd } = action.payload
      const item = state.itens.find(i => i.id === id)
      if (item) item.qtd = qtd
    },
    limparCarrinho(state) {
      state.itens = []
    },
    abrirCarrinho(state) {
      state.aberto = true
    },
    fecharCarrinho(state) {
      state.aberto = false
    },
  },
})

export const { addItem, removeItem, updateQtd, limparCarrinho, abrirCarrinho, fecharCarrinho } = carrinhoSlice.actions
export default carrinhoSlice.reducer
