// ══════════════════════════════════════════════
// store/index.js — Configuração do Redux Store
// ══════════════════════════════════════════════
import { configureStore } from '@reduxjs/toolkit'
import authReducer         from './authSlice'
import petsReducer         from './petsSlice'
import agendamentosReducer from './agendamentosSlice'
import comprasReducer      from './comprasSlice'
import productsReducer     from './productsSlice'
import carrinhoReducer     from './carrinhoSlice'

const store = configureStore({
  reducer: {
    auth:         authReducer,
    pets:         petsReducer,
    agendamentos: agendamentosReducer,
    compras:      comprasReducer,
    products:     productsReducer,
    carrinho:     carrinhoReducer,
  },
})

export default store
