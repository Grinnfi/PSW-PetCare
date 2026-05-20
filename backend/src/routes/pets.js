// ══════════════════════════════════════════════
// routes/pets.js
// GET    /pets      → lista todos os pets
// POST   /pets      → cadastra novo pet
// DELETE /pets/:id  → remove um pet
// ══════════════════════════════════════════════
import { Router } from 'express'
import { db, nextId } from '../data/db.js'

const router = Router()

// GET /pets
router.get('/', (req, res) => {
  res.json(db.pets)
})

// POST /pets
router.post('/', (req, res) => {
  const { name, especie, raca, sexo, idade, donoId, donoNome, obs = '' } = req.body

  if (!name || !especie || !donoId) {
    return res.status(400).json({ error: 'name, especie e donoId são obrigatórios.' })
  }

  const novoPet = { id: nextId(db.pets), name, especie, raca, sexo, idade, donoId, donoNome, obs }
  db.pets.push(novoPet)
  res.status(201).json(novoPet)
})

// DELETE /pets/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = db.pets.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Pet não encontrado.' })
  }

  db.pets.splice(index, 1)
  res.status(200).json({ message: 'Pet removido com sucesso.' })
})

export default router
