// ══════════════════════════════════════════════
// routes/compras.js
// GET  /compras  → autenticado (user: só suas; admin: todas)
// POST /compras  → autenticado
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Compra } from '../models/index.js'
import { autenticar } from '../middleware/auth.js'

const router = Router()

// GET /compras
router.get('/', autenticar, async (req, res) => {
  try {
    const filtro = req.user.role === 'admin' ? {} : { donoId: req.user._id }
    const compras = await Compra.find(filtro).sort({ createdAt: -1 })
    res.json(compras)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /compras
router.post('/', autenticar, async (req, res) => {
  try {
    const { donoId, donoNome, itens, total, data, status } = req.body

    if (!donoId || !itens || !total) {
      return res.status(400).json({ error: 'donoId, itens e total são obrigatórios.' })
    }

    const novaCompra = await Compra.create({ donoId, donoNome, itens, total, data, status })
    res.status(201).json(novaCompra)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router