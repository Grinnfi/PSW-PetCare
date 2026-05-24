// ══════════════════════════════════════════════
// routes/users.js
// GET  /users        → lista todos os usuários
// POST /users        → cadastra novo usuário
// POST /users/login  → autentica usuário
// ══════════════════════════════════════════════
import { Router } from 'express'
import { User } from '../models/index.js'

const router = Router()

// GET /users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password')  // não retorna a senha
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /users — cadastro
router.post('/', async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'name, email e password são obrigatórios.' })
    }

    const jaExiste = await User.findOne({ email })
    if (jaExiste) {
      return res.status(409).json({ error: 'E-mail já cadastrado.' })
    }

    const novoUsuario = await User.create({ name, email, password, role })
    const { password: _, ...semSenha } = novoUsuario.toObject()
    res.status(201).json(semSenha)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /users/login — autenticação
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'email e password são obrigatórios.' })
    }

    const user = await User.findOne({ email, password })
    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' })
    }

    const { password: _, ...semSenha } = user.toObject()
    res.json(semSenha)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
