// ══════════════════════════════════════════════
// Estoque.jsx — Gestão de Estoque (Admin) com Redux
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addProduct, updateProduct, deleteProduct } from '../store/productsSlice'
import ModalProduto from '../components/ModalProduto'
import ModalExcluir from '../components/ModalExcluir'

const LOW_THRESHOLD = 10
const fmtPreco = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

const classeBadge = (cat) => ({
  Alimentação: 'alimentacao', Higiene: 'higiene',
  Saúde: 'saude', Acessórios: 'acessorios',
}[cat] || '')

const infoStatus = (stock) => {
  if (stock === 0)            return { cls: 'zero',   label: 'Esgotado' }
  if (stock <= LOW_THRESHOLD) return { cls: 'low',    label: 'Baixo' }
  return                             { cls: 'normal', label: 'Normal' }
}

export default function Estoque({ showToast }) {
  const dispatch  = useDispatch()
  const products  = useSelector(s => s.products.list)

  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [busca, setBusca]                     = useState('')
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [produtoEditando, setProdutoEditando]   = useState(null)
  const [produtoExcluindo, setProdutoExcluindo] = useState(null)

  const stats = useMemo(() => ({
    total:     products.length,
    emEstoque: products.reduce((s, p) => s + p.stock, 0),
    baixo:     products.filter(p => p.stock > 0 && p.stock <= LOW_THRESHOLD).length,
    esgotado:  products.filter(p => p.stock === 0).length,
  }), [products])

  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase()
    return products.filter(p => {
      const matchCat   = filtroCategoria === 'Todos' || p.cat === filtroCategoria
      const matchBusca = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
      return matchCat && matchBusca
    })
  }, [products, filtroCategoria, busca])

  const alterarEstoque = (prod, delta) => {
    const novoStock = Math.max(0, prod.stock + delta)
    dispatch(updateProduct({ ...prod, stock: novoStock }))
  }

  const salvarProduto = async ({ nome, cat, unit, desc, price, stock, emoji }) => {
    if (!nome || !unit || !desc) { showToast('Preencha todos os campos.', 'error'); return }
    if (produtoEditando) {
      await dispatch(updateProduct({ ...produtoEditando, name: nome, cat, unit, desc, price, stock, emoji }))
      showToast(`"${nome}" atualizado!`, 'success')
    } else {
      await dispatch(addProduct({ name: nome, cat, unit, desc, price, stock, emoji: emoji || '📦' }))
      showToast(`"${nome}" cadastrado!`, 'success')
    }
    setModalProdutoAberto(false)
  }

  const confirmarExclusao = async () => {
    const nome = produtoExcluindo.name
    await dispatch(deleteProduct(produtoExcluindo.id))
    setModalExcluirAberto(false)
    setProdutoExcluindo(null)
    showToast(`"${nome}" removido.`, 'error')
  }

  const CATEGORIAS_FILTRO = ['Todos', 'Alimentação', 'Higiene', 'Saúde', 'Acessórios']

  return (
    <div id="page-estoque" className="page">
      <div className="est-header">
        <div className="est-title">
          <div className="est-title-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <div>
            <h1>Gestão de Estoque</h1>
            <p>Manutenção e controle de produtos do petshop.</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => { setProdutoEditando(null); setModalProdutoAberto(true) }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Produto
        </button>
      </div>

      <div className="est-stats">
        {[
          { label:'Total de Produtos', val: stats.total,     cls:'blue',   icon:<path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/> },
          { label:'Total em Estoque',  val: stats.emEstoque, cls:'green',  icon:<polyline points="20 6 9 17 4 12"/> },
          { label:'Estoque Baixo',     val: stats.baixo,     cls:'yellow', icon:<><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></> },
          { label:'Esgotados',         val: stats.esgotado,  cls:'red',    icon:<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/> },
        ].map(s => (
          <div key={s.label} className="est-stat">
            <div className={`est-stat-icon ${s.cls}`}>
              <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{s.icon}</svg>
            </div>
            <div className="est-stat-info"><label>{s.label}</label><span>{s.val}</span></div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input className="search-input" type="text" placeholder="Buscar produto ou categoria..."
            value={busca} onChange={e => setBusca(e.target.value)} />
        </div>
        <div className="filter-btns">
          {CATEGORIAS_FILTRO.map(cat => (
            <button key={cat} className={`filter-btn ${filtroCategoria === cat ? 'active' : ''}`}
              onClick={() => setFiltroCategoria(cat)}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Tabela desktop */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th><th>Produto</th><th>Categoria</th>
              <th>Preço</th><th>Estoque</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign:'center', padding:'36px', color:'var(--muted)' }}>Nenhum produto encontrado.</td></tr>
            ) : (
              produtosFiltrados.map((prod, i) => {
                const si   = infoStatus(prod.stock)
                const qcls = prod.stock === 0 ? 'zero' : prod.stock <= LOW_THRESHOLD ? 'low' : ''
                return (
                  <tr key={prod.id}>
                    <td className="td-num">{String(i + 1).padStart(2, '0')}</td>
                    <td><div className="prod-name-cell"><div className="pn">{prod.name}</div><div className="pu">{prod.unit}</div></div></td>
                    <td><span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span></td>
                    <td className="price-cell">{fmtPreco(prod.price)}</td>
                    <td>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => alterarEstoque(prod, -1)}>−</button>
                        <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                        <button className="qty-btn" onClick={() => alterarEstoque(prod, 1)}>+</button>
                      </div>
                    </td>
                    <td><span className={`status-badge ${si.cls}`}><span className="sdot" />{si.label}</span></td>
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => { setProdutoEditando(prod); setModalProdutoAberto(true) }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="action-btn del" onClick={() => { setProdutoExcluindo(prod); setModalExcluirAberto(true) }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                            <path d="M10 11v6"/><path d="M14 11v6"/>
                            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Cards mobile */}
      <div className="est-mobile-cards">
        {produtosFiltrados.map((prod) => {
          const si   = infoStatus(prod.stock)
          const qcls = prod.stock === 0 ? 'zero' : prod.stock <= LOW_THRESHOLD ? 'low' : ''
          return (
            <div key={prod.id} className="est-prod-card">
              <div className="est-prod-card-header">
                <div>
                  <div className="est-prod-card-name">{prod.name}</div>
                  <div className="est-prod-card-unit">{prod.unit}</div>
                </div>
                <div className="action-btns">
                  <button className="action-btn edit" onClick={() => { setProdutoEditando(prod); setModalProdutoAberto(true) }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button className="action-btn del" onClick={() => { setProdutoExcluindo(prod); setModalExcluirAberto(true) }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>
              <div className="est-prod-card-body">
                <div className="est-prod-card-field"><label>Categoria</label><span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span></div>
                <div className="est-prod-card-field"><label>Preço</label><span className="price-cell">{fmtPreco(prod.price)}</span></div>
                <div className="est-prod-card-field">
                  <label>Estoque</label>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => alterarEstoque(prod, -1)}>−</button>
                    <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                    <button className="qty-btn" onClick={() => alterarEstoque(prod, 1)}>+</button>
                  </div>
                </div>
                <div className="est-prod-card-field"><label>Status</label><span className={`status-badge ${si.cls}`}><span className="sdot" />{si.label}</span></div>
              </div>
            </div>
          )
        })}
      </div>

      <ModalProduto isOpen={modalProdutoAberto} onClose={() => setModalProdutoAberto(false)} onSubmit={salvarProduto} produtoEditando={produtoEditando} />
      <ModalExcluir isOpen={modalExcluirAberto} onClose={() => setModalExcluirAberto(false)} onConfirm={confirmarExclusao} nomeProduto={produtoExcluindo?.name || ''} />
    </div>
  )
}
