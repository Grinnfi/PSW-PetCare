// ══════════════════════════════════════════════
// routes/agendamentos.js
// GET   /agendamentos        → lista todos
// POST  /agendamentos        → cria novo
// PATCH /agendamentos/:id    → atualiza status
// ══════════════════════════════════════════════
import { Router } from 'express'
import { db, nextId } from '../data/db.js'

const router = Router()

// GET /agendamentos
router.get('/', (req, res) => {
  res.json(db.agendamentos)
})

// POST /agendamentos
router.post('/', (req, res) => {
  const { petId, petNome, petEspecie, donoId, donoNome, servico, data, hora, status = 'pendente' } = req.body

  if (!petId || !donoId || !servico || !data || !hora) {
    return res.status(400).json({ error: 'petId, donoId, servico, data e hora são obrigatórios.' })
  }

  const novo = { id: nextId(db.agendamentos), petId, petNome, petEspecie, donoId, donoNome, servico, data, hora, status }
  db.agendamentos.push(novo)
  res.status(201).json(novo)
})

// PATCH /agendamentos/:id  (ex: cancelar)
router.patch('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = db.agendamentos.findIndex(a => a.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Agendamento não encontrado.' })
  }

  db.agendamentos[index] = { ...db.agendamentos[index], ...req.body }
  res.json(db.agendamentos[index])
})

export default router
