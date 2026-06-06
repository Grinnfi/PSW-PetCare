// ══════════════════════════════════════════════
// routes/agendamentos.js
// GET   /agendamentos      → autenticado (user: só seus; admin: todos)
// POST  /agendamentos      → autenticado
// PATCH /agendamentos/:id  → apenas admin
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Agendamento } from '../models/index.js'
import { autenticar, apenasAdmin } from '../middleware/auth.js'

const router = Router()

// GET /agendamentos
router.get('/', autenticar, async (req, res) => {
  try {
    const filtro = req.user.role === 'admin' ? {} : { donoId: req.user._id }
    const agendamentos = await Agendamento.find(filtro).sort({ data: 1, hora: 1 })
    res.json(agendamentos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /agendamentos
router.post('/', autenticar, async (req, res) => {
  try {
    const { petId, petNome, petEspecie, donoId, donoNome, servico, data, hora, status } = req.body

    if (!petId || !donoId || !servico || !data || !hora) {
      return res.status(400).json({ error: 'petId, donoId, servico, data e hora são obrigatórios.' })
    }

    const novo = await Agendamento.create({ petId, petNome, petEspecie, donoId, donoNome, servico, data, hora, status })
    res.status(201).json(novo)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /agendamentos/:id — apenas admin
router.patch('/:id', autenticar, apenasAdmin, async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    if (!agendamento) {
      return res.status(404).json({ error: 'Agendamento não encontrado.' })
    }

    res.json(agendamento)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router