// ══════════════════════════════════════════════
// server.js — Servidor principal do PetCare
// ══════════════════════════════════════════════
import express from 'express'
import cors    from 'cors'

import usersRouter        from './routes/users.js'
import petsRouter         from './routes/pets.js'
import agendamentosRouter from './routes/agendamentos.js'
import comprasRouter      from './routes/compras.js'
import productsRouter     from './routes/products.js'

const app  = express()
const PORT = 3001

// ── Middlewares globais ──
app.use(cors())
app.use(express.json())

// ── Rotas ──
app.use('/users',        usersRouter)
app.use('/pets',         petsRouter)
app.use('/agendamentos', agendamentosRouter)
app.use('/compras',      comprasRouter)
app.use('/products',     productsRouter)

// ── Rota de saúde (útil para testar se o server está no ar) ──
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PetCare backend rodando!' })
})

// ── Inicia o servidor ──
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
})
