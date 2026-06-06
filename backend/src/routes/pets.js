// ══════════════════════════════════════════════
// routes/pets.js
// GET    /pets      → autenticado (user: só seus; admin: todos)
// POST   /pets      → autenticado
// DELETE /pets/:id  → autenticado (dono ou admin)
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Pet } from '../models/index.js'
import { autenticar } from '../middleware/auth.js'

const router = Router()
router.get('/', autenticar, async (req, res) => {
  try {
    const filtro = req.user.role === 'admin' ? {} : { donoId: req.user._id }
    const pets = await Pet.find(filtro)
    res.json(pets)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', autenticar, async (req, res) => {
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

router.delete('/:id', autenticar, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)

    if (!pet) {
      return res.status(404).json({ error: 'Pet não encontrado.' })
    }

    const ehDono = pet.donoId.toString() === req.user._id.toString()
    if (!ehDono && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para remover este pet.' })
    }

    await pet.deleteOne()
    res.json({ message: 'Pet removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router