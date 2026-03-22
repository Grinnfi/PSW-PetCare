// ══════════════════════════════════════════════
// ModalProduto.jsx — Modal de Adicionar / Editar produto
// Props: isOpen, onClose, onSubmit, produtoEditando
// ══════════════════════════════════════════════

import { useState, useEffect } from 'react'

const CATEGORIAS = ['Alimentação', 'Higiene', 'Saúde', 'Acessórios']

export default function ModalProduto({ isOpen, onClose, onSubmit, produtoEditando }) {
  // Estado dos campos do formulário
  const [nome,  setNome]  = useState('')
  const [cat,   setCat]   = useState('Alimentação')
  const [unit,  setUnit]  = useState('')
  const [desc,  setDesc]  = useState('')
  const [price, setPrice] = useState('0')
  const [stock, setStock] = useState('0')

  // Quando abrir em modo edição, preenche os campos com os dados do produto
  useEffect(() => {
    if (produtoEditando) {
      setNome(produtoEditando.name)
      setCat(produtoEditando.cat)
      setUnit(produtoEditando.unit)
      setDesc(produtoEditando.desc)
      setPrice(String(produtoEditando.price))
      setStock(String(produtoEditando.stock))
    } else {
      // Reseta o formulário quando for novo produto
      setNome(''); setCat('Alimentação'); setUnit('')
      setDesc(''); setPrice('0'); setStock('0')
    }
  }, [produtoEditando, isOpen])

  const handleSubmit = () => {
    onSubmit({ nome, cat, unit, desc, price: parseFloat(price) || 0, stock: parseInt(stock) || 0 })
  }

  // Fecha o modal ao clicar no overlay
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
          {/* Nome */}
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

          {/* Categoria */}
          <div className="fg">
            <label>Categoria <span style={{ color: 'var(--red)' }}>*</span></label>
            <select className="fc" value={cat} onChange={e => setCat(e.target.value)}>
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
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
