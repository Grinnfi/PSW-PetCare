// ══════════════════════════════════════════════
// routes/compras.js
// GET  /compras  → lista todas as compras
// POST /compras  → registra nova compra
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Compra } from '../models/index.js'

const router = Router()

// GET /compras
router.get('/', async (req, res) => {
  try {
    const compras = await Compra.find().sort({ createdAt: -1 })
    res.json(compras)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /compras
router.post('/', async (req, res) => {
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
