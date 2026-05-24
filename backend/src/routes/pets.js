// ══════════════════════════════════════════════
// routes/pets.js
// GET    /pets      → lista todos os pets
// POST   /pets      → cadastra novo pet
// DELETE /pets/:id  → remove um pet
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Pet } from '../models/index.js'

const router = Router()

// GET /pets
router.get('/', async (req, res) => {
  try {
    const pets = await Pet.find()
    res.json(pets)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /pets
router.post('/', async (req, res) => {
  try {
    const { name, especie, raca, sexo, idade, donoId, donoNome, obs } = req.body

    if (!name || !especie || !donoId) {
      return res.status(400).json({ error: 'name, especie e donoId são obrigatórios.' })
    }

    const novoPet = await Pet.create({ name, especie, raca, sexo, idade, donoId, donoNome, obs })
    res.status(201).json(novoPet)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /pets/:id
router.delete('/:id', async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id)

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' })
    }

    res.json({ message: 'Pet removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router
