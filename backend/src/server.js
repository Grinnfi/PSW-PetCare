import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import passport from 'passport'

import { conectarDB } from './data/db.js'
import { initPassport } from './middleware/auth.js'

import usersRouter       from './routes/users.js'
import petsRouter        from './routes/pets.js'
import agendamentosRouter from './routes/agendamentos.js'
import comprasRouter     from './routes/compras.js'
import productsRouter    from './routes/products.js'

const app  = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

initPassport()
app.use(passport.initialize())

app.use('/users',        usersRouter)
app.use('/pets',         petsRouter)
app.use('/agendamentos', agendamentosRouter)
app.use('/compras',      comprasRouter)
app.use('/products',     productsRouter)

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'PetCare backend rodando!' })
})

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Servidor rodando em http://localhost:${PORT}`)
  })
})