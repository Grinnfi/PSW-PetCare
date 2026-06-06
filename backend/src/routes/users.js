// ══════════════════════════════════════════════
// routes/users.js
// POST /users/login  → retorna token JWT
// POST /users        → cadastro (público)
// GET  /users        → apenas admin
// ══════════════════════════════════════════════
import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { User } from '../models/index.js'
import { autenticar, apenasAdmin } from '../middleware/auth.js'

const router = Router()
const SECRET = process.env.JWT_SECRET || 'petcare_secret_2024'

// GET /users — apenas admin
router.get('/', autenticar, apenasAdmin, async (req, res) => {
  try {
    const users = await User.find({}, '-password')
    res.json(users)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /users — cadastro (público)
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

// POST /users/login — retorna token JWT
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

    // Gera o token JWT com id e role dentro do payload
    const token = jwt.sign(
      { id: user._id, role: user.role },
      SECRET,
      { expiresIn: '8h' }
    )

    const { password: _, ...semSenha } = user.toObject()
    res.json({ ...semSenha, token })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router