// ══════════════════════════════════════════════
// routes/compras.js
// GET  /compras   → lista todas as compras
// POST /compras   → registra nova compra
// ══════════════════════════════════════════════
import { Router } from 'express'
import { db, nextId } from '../data/db.js'

const router = Router()

// GET /compras
router.get('/', (req, res) => {
  res.json(db.compras)
})

// POST /compras
router.post('/', (req, res) => {
  const { donoId, donoNome, itens, total, data, status = 'pendente' } = req.body

  if (!donoId || !itens || !total) {
    return res.status(400).json({ error: 'donoId, itens e total são obrigatórios.' })
  }

  const novaCompra = { id: nextId(db.compras), donoId, donoNome, itens, total, data, status }
  db.compras.push(novaCompra)
  res.status(201).json(novaCompra)
})

export default router
