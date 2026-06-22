import { createSlice } from '@reduxjs/toolkit'

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
      const { qtd: qtdToAdd, ...produto } = action.payload
      const add       = qtdToAdd || 1
      const idNorm    = produto.id ?? produto._id
      const priceNorm = produto.price ?? produto.precoNum ?? 0
      const maxStock  = typeof produto.stock === 'number' ? produto.stock : null

      const existe   = state.itens.find(i => i.id === idNorm)
      const qtdAtual = existe ? existe.qtd : 0
      let novaQtd    = qtdAtual + add
      if (maxStock !== null) {
        novaQtd = Math.min(novaQtd, maxStock)
      }
      if (existe) {
        existe.qtd = novaQtd
      } else if (novaQtd > 0) {
        state.itens.push({ ...produto, id: idNorm, price: priceNorm, qtd: novaQtd })
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
