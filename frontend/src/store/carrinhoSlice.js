// ══════════════════════════════════════════════
// carrinhoSlice.js — Estado do carrinho (Redux)
// ══════════════════════════════════════════════
import { createSlice } from '@reduxjs/toolkit'

// Recupera estado salvo do localStorage
const getEstadoSalvo = () => {
  try {
    const raw = localStorage.getItem('petcare_cart')
    return raw ? JSON.parse(raw) : { itens: [], cupom: null }
  } catch {
    return { itens: [], cupom: null }
  }
}

const salvarEstado = (state) => {
  localStorage.setItem('petcare_cart', JSON.stringify({
    itens: state.itens,
    cupom: state.cupom,
  }))
}

const estadoInicial = getEstadoSalvo()

const carrinhoSlice = createSlice({
  name: 'carrinho',
  initialState: {
    itens: estadoInicial.itens,
    aberto: false,
    cupom: estadoInicial.cupom,
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
      salvarEstado(state)
    },
    removeItem(state, action) {
      state.itens = state.itens.filter(i => i.id !== action.payload)
      salvarEstado(state)
    },
    updateQtd(state, action) {
      const { id, qtd } = action.payload
      const item = state.itens.find(i => i.id === id)
      if (item) item.qtd = qtd
      salvarEstado(state)
    },
    limparCarrinho(state) {
      state.itens = []
      state.cupom = null
      salvarEstado(state)
    },
    setCupom(state, action) {
      state.cupom = action.payload
      salvarEstado(state)
    },
    removerCupom(state) {
      state.cupom = null
      salvarEstado(state)
    },
    abrirCarrinho(state) {
      state.aberto = true
    },
    fecharCarrinho(state) {
      state.aberto = false
    },
  },
})

export const { 
  addItem, removeItem, updateQtd, limparCarrinho, 
  abrirCarrinho, fecharCarrinho, setCupom, removerCupom 
} = carrinhoSlice.actions
export default carrinhoSlice.reducer
