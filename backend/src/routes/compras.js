import { Router } from 'express'
import { Compra, Product } from '../models/index.js'
import { autenticar } from '../middleware/auth.js'

const router = Router()

router.get('/', autenticar, async (req, res) => {
  try {
    const filtro = req.user.role === 'admin' ? {} : { donoId: req.user._id }
    const compras = await Compra.find(filtro).sort({ createdAt: -1 })
    res.json(compras)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/:id', autenticar, async (req, res) => {
  try {
    const compra = await Compra.findById(req.params.id)
    if (!compra) {
      return res.status(404).json({ error: 'Pedido não encontrado.' })
    }
    const ehDono = compra.donoId.toString() === req.user._id.toString()
    if (!ehDono && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sem permissão para ver este pedido.' })
    }
    res.json(compra)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.post('/', autenticar, async (req, res) => {
  try {
    const { donoId, donoNome, itens, total, data, status, endereco, pagamento } = req.body

    if (!donoId || !itens || !itens.length || !total) {
      return res.status(400).json({ error: 'donoId, itens e total são obrigatórios.' })
    }

    for (const item of itens) {
      if (!item.produtoId) {
        return res.status(400).json({ error: `Item "${item.nome}" sem referência de produto.` })
      }
      const produto = await Product.findById(item.produtoId)
      if (!produto) {
        return res.status(404).json({ error: `Produto "${item.nome}" não encontrado.` })
      }
      if (produto.stock < item.qtd) {
        return res.status(409).json({
          error: `Estoque insuficiente para "${produto.name}". Disponível: ${produto.stock}, solicitado: ${item.qtd}.`,
        })
      }
    }

    for (const item of itens) {
      await Product.findByIdAndUpdate(item.produtoId, { $inc: { stock: -item.qtd } })
    }

    const novaCompra = await Compra.create({ donoId, donoNome, itens, total, data, status, endereco, pagamento })
    res.status(201).json(novaCompra)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router