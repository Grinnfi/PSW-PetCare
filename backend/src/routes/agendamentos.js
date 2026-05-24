// ══════════════════════════════════════════════
// routes/agendamentos.js
// GET   /agendamentos      → lista todos
// POST  /agendamentos      → cria novo
// PATCH /agendamentos/:id  → atualiza status
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Agendamento } from '../models/index.js'

const router = Router()

// GET /agendamentos
router.get('/', async (req, res) => {
  try {
    const agendamentos = await Agendamento.find().sort({ data: 1, hora: 1 })
    res.json(agendamentos)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /agendamentos
router.post('/', async (req, res) => {
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

// PATCH /agendamentos/:id
router.patch('/:id', async (req, res) => {
  try {
    const agendamento = await Agendamento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }  // retorna o documento já atualizado
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
