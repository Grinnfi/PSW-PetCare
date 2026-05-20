// ══════════════════════════════════════════════
// routes/products.js
// GET    /products      → lista todos os produtos
// POST   /products      → cadastra novo produto
// PUT    /products/:id  → atualiza produto completo
// DELETE /products/:id  → remove produto
// ══════════════════════════════════════════════
import { Router } from 'express'
import { db, nextId } from '../data/db.js'

const router = Router()

// GET /products
router.get('/', (req, res) => {
  res.json(db.products)
})

// POST /products
router.post('/', (req, res) => {
  const { name, unit, cat, price, stock, desc, emoji = '' } = req.body

  if (!name || !cat || price === undefined) {
    return res.status(400).json({ error: 'name, cat e price são obrigatórios.' })
  }

  const novoProduto = { id: nextId(db.products), name, unit, cat, price, stock, desc, emoji }
  db.products.push(novoProduto)
  res.status(201).json(novoProduto)
})

// PUT /products/:id
router.put('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = db.products.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado.' })
  }

  db.products[index] = { ...db.products[index], ...req.body, id }
  res.json(db.products[index])
})

// DELETE /products/:id
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = db.products.findIndex(p => p.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Produto não encontrado.' })
  }

  db.products.splice(index, 1)
  res.status(200).json({ message: 'Produto removido com sucesso.' })
})

export default router
