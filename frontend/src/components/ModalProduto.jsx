// ══════════════════════════════════════════════
// ModalProduto.jsx — Modal de Adicionar / Editar produto
// Props: isOpen, onClose, onSubmit, produtoEditando
// ══════════════════════════════════════════════

import { useState, useEffect } from 'react'

const CATEGORIAS = ['Alimentação', 'Higiene', 'Saúde', 'Acessórios']
const CATEGORIAS_PET = ['Cachorros', 'Gatos', 'Pássaros', 'Peixes', 'Outros Pets', 'Casa e Jardim']

export default function ModalProduto({ isOpen, onClose, onSubmit, produtoEditando }) {
  const [nome,  setNome]  = useState('')
  const [cat,   setCat]   = useState('Alimentação')
  const [categoriaPet, setCategoriaPet] = useState('Cachorros')
  const [unit,  setUnit]  = useState('')
  const [desc,  setDesc]  = useState('')
  const [price, setPrice] = useState('0')
  const [stock, setStock] = useState('0')

  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.name)
      setCat(produtoEditando.cat)
      setCategoriaPet(produtoEditando.categoriaPet || 'Cachorros')
      setUnit(produtoEditando.unit)
      setDesc(produtoEditando.desc)
      setPrice(String(produtoEditando.price))
      setStock(String(produtoEditando.stock))
    } else {
      setNome(''); setCat('Alimentação'); setCategoriaPet('Cachorros'); setUnit('')
      setDesc(''); setPrice('0'); setStock('0')
    }
  }, [produtoEditando, isOpen])

  const handleSubmit = () => {
    onSubmit({ nome, cat, categoriaPet, unit, desc, price: parseFloat(price) || 0, stock: parseInt(stock) || 0 })
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  const modoEdicao = Boolean(produtoEditando)

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal">

        <div className="modal-head">
          <h3>{modoEdicao ? 'Editar Produto' : 'Novo Produto'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-grid">
          <div className="fg modal-full">
            <label>Nome do Produto <span style={{ color: 'var(--red)' }}>*</span></label>
            <input
              className="fc"
              type="text"
              placeholder="Ex: Ração Premium Cão Adulto"
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          {/* Categoria (tipo de produto) */}
          <div className="fg">
            <label>Categoria <span style={{ color: 'var(--red)' }}>*</span></label>
            <select className="fc" value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Categoria do pet  (filtrar na Loja) */}
          <div className="fg">
            <label>Para qual pet <span style={{ color: 'var(--red)' }}>*</span></label>
            <select className="fc" value={categoriaPet} onChange={e => setCategoriaPet(e.target.value)}>
              {CATEGORIAS_PET.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          {/* Unidade */}
          <div className="fg">
            <label>Unidade <span style={{ color: 'var(--red)' }}>*</span></label>
            <input
              className="fc"
              type="text"
              placeholder="unidade, saco, frasco..."
              value={unit}
              onChange={e => setUnit(e.target.value)}
            />
          </div>

          {/* Descrição */}
          <div className="fg modal-full">
            <label>Descrição <span style={{ color: 'var(--red)' }}>*</span></label>
            <textarea
              className="fc"
              placeholder="Descreva o produto..."
              value={desc}
              onChange={e => setDesc(e.target.value)}
            />
          </div>

          {/* Preço */}
          <div className="fg">
            <label>Preço (R$) <span style={{ color: 'var(--red)' }}>*</span></label>
            <input
              className="fc"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>

          {/* Estoque */}
          <div className="fg">
            <label>Estoque <span style={{ color: 'var(--red)' }}>*</span></label>
            <input
              className="fc"
              type="number"
              min="0"
              value={stock}
              onChange={e => setStock(e.target.value)}
            />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={onClose}>Cancelar</button>
          <button className="btn-submit-modal" onClick={handleSubmit}>
            {modoEdicao ? 'Salvar Alterações' : 'Cadastrar Produto'}
          </button>
        </div>

      </div>
    </div>
  )
}
