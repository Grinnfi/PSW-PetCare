// ══════════════════════════════════════════════
// routes/products.js
// GET    /products      → público (loja)
// POST   /products      → apenas admin
// PUT    /products/:id  → apenas admin
// DELETE /products/:id  → apenas admin
// ══════════════════════════════════════════════
import { Router } from 'express'
import { Product } from '../models/index.js'
import { autenticar, apenasAdmin } from '../middleware/auth.js'

const router = Router()

// GET /products — público
router.get('/', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /products — apenas admin
router.post('/', autenticar, apenasAdmin, async (req, res) => {
  try {
    const { name, unit, cat, price, stock, desc, emoji } = req.body

    if (!name || !cat || price === undefined) {
      return res.status(400).json({ error: 'name, cat e price são obrigatórios.' })
    }

    const novoProduto = await Product.create({ name, unit, cat, price, stock, desc, emoji })
    res.status(201).json(novoProduto)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PUT /products/:id — apenas admin
router.put('/:id', autenticar, apenasAdmin, async (req, res) => {
  try {
    const produto = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true })

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' })
    }

    res.json(produto)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /products/:id — apenas admin
router.delete('/:id', autenticar, apenasAdmin, async (req, res) => {
  try {
    const produto = await Product.findByIdAndDelete(req.params.id)

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado.' })
    }

    res.json({ message: 'Produto removido com sucesso.' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router