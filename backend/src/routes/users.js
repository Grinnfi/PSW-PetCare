// ══════════════════════════════════════════════
// routes/users.js
// GET  /users        → lista todos os usuários
// POST /users        → cadastra novo usuário
// ══════════════════════════════════════════════
import { Router } from 'express'
import { db, nextId } from '../data/db.js'

const router = Router()

// GET /users
router.get('/', (req, res) => {
  res.json(db.users)
})

// POST /users
router.post('/', (req, res) => {
  const { name, email, password, role = 'user' } = req.body

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email e password são obrigatórios.' })
  }

  const jaExiste = db.users.find(u => u.email === email)
  if (jaExiste) {
    return res.status(409).json({ error: 'E-mail já cadastrado.' })
  }

  const novoUsuario = { id: nextId(db.users), name, email, password, role }
  db.users.push(novoUsuario)
  res.status(201).json(novoUsuario)
})

export default router
