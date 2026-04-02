// ══════════════════════════════════════════════
// Estoque.jsx — Gestão de Estoque (Admin)
// Props: products, setProducts, showToast
// Demonstra: filtros, busca, CRUD local, modais
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import ModalProduto from '../components/ModalProduto'
import ModalExcluir from '../components/ModalExcluir'
import { LOW_THRESHOLD } from '../data/initialData'

// ── Helpers ──────────────────────────────────
const fmtPreco = (v) => 'R$ ' + v.toFixed(2).replace('.', ',')

const classeBadge = (cat) => ({
  Alimentação: 'alimentacao',
  Higiene: 'higiene',
  Saúde: 'saude',
  Acessórios: 'acessorios',
}[cat] || '')

const infoStatus = (stock) => {
  if (stock === 0)          return { cls: 'zero',   label: 'Esgotado' }
  if (stock <= LOW_THRESHOLD) return { cls: 'low',    label: 'Baixo' }
  return                           { cls: 'normal', label: 'Normal' }
}

// ── Componente ────────────────────────────────
export default function Estoque({ products, setProducts, showToast }) {
  // ── Estado de filtros ──
  const [filtroCategoria, setFiltroCategoria] = useState('Todos')
  const [busca, setBusca] = useState('')

  // ── Estado dos modais ──
  const [modalProdutoAberto, setModalProdutoAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [produtoEditando, setProdutoEditando]     = useState(null)  // null = novo produto
  const [produtoExcluindo, setProdutoExcluindo]   = useState(null)  // produto a ser excluído

  // ── Estatísticas calculadas (useMemo evita recalcular sem necessidade) ──
  const stats = useMemo(() => ({
    total: products.length,
    emEstoque: products.reduce((s, p) => s + p.stock, 0),
    baixo: products.filter(p => p.stock > 0 && p.stock <= LOW_THRESHOLD).length,
    esgotado: products.filter(p => p.stock === 0).length,
  }), [products])

  // ── Lista filtrada ──
  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase()
    return products.filter(p => {
      const matchCat = filtroCategoria === 'Todos' || p.cat === filtroCategoria
      const matchBusca = !q || p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
      return matchCat && matchBusca
    })
  }, [products, filtroCategoria, busca])

  // ── Ações de estoque ──
  const alterarEstoque = (id, delta) => {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)
    )
  }

  // ── Ações do modal de produto ──
  const abrirModalNovo = () => {
    setProdutoEditando(null)
    setModalProdutoAberto(true)
  }

  const abrirModalEditar = (produto) => {
    setProdutoEditando(produto)
    setModalProdutoAberto(true)
  }

  const salvarProduto = ({ nome, cat, unit, desc, price, stock }) => {
    if (!nome || !unit || !desc) {
      showToast('Preencha todos os campos.', 'error')
      return
    }
    if (produtoEditando) {
      // Edita produto existente
      setProducts(prev =>
        prev.map(p => p.id === produtoEditando.id
          ? { ...p, name: nome, cat, unit, desc, price, stock }
          : p
        )
      )
      showToast(`"${nome}" atualizado!`, 'success')
    } else {
      // Adiciona novo produto
      setProducts(prev => [...prev, { id: Date.now(), name: nome, cat, unit, desc, price, stock }])
      showToast(`"${nome}" cadastrado!`, 'success')
    }
    setModalProdutoAberto(false)
  }

  // ── Ações do modal de exclusão ──
  const abrirModalExcluir = (produto) => {
    setProdutoExcluindo(produto)
    setModalExcluirAberto(true)
  }

  const confirmarExclusao = () => {
    const nome = produtoExcluindo.name
    setProducts(prev => prev.filter(p => p.id !== produtoExcluindo.id))
    setModalExcluirAberto(false)
    setProdutoExcluindo(null)
    showToast(`"${nome}" removido.`, 'error')
  }

  const CATEGORIAS_FILTRO = ['Todos', 'Alimentação', 'Higiene', 'Saúde', 'Acessórios']

  return (
    <div id="page-estoque" className="page">

      {/* Cabeçalho */}
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
        <button className="btn-primary" onClick={abrirModalNovo}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Novo Produto
        </button>
      </div>

      {/* Cards de estatísticas */}
      <div className="est-stats">
        <div className="est-stat">
          <div className="est-stat-icon blue">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
          </div>
          <div className="est-stat-info">
            <label>Total de Produtos</label>
            <span>{stats.total}</span>
          </div>
        </div>
        <div className="est-stat">
          <div className="est-stat-icon green">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div className="est-stat-info">
            <label>Total em Estoque</label>
            <span>{stats.emEstoque}</span>
          </div>
        </div>
        <div className="est-stat">
          <div className="est-stat-icon yellow">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
              <polyline points="17 6 23 6 23 12"/>
            </svg>
          </div>
          <div className="est-stat-info">
            <label>Estoque Baixo</label>
            <span>{stats.baixo}</span>
          </div>
        </div>
        <div className="est-stat">
          <div className="est-stat-icon red">
            <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <div className="est-stat-info">
            <label>Esgotados</label>
            <span>{stats.esgotado}</span>
          </div>
        </div>
      </div>

      {/* Toolbar: busca + filtros */}
      <div className="toolbar">
        <div className="search-wrap">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className="search-input"
            type="text"
            placeholder="Buscar produto ou categoria..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="filter-btns">
          {CATEGORIAS_FILTRO.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filtroCategoria === cat ? 'active' : ''}`}
              onClick={() => setFiltroCategoria(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de produtos */}
      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Produto</th>
              <th>Categoria</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '36px', color: 'var(--muted)' }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              produtosFiltrados.map((prod, i) => {
                const si = infoStatus(prod.stock)
                const qcls = prod.stock === 0 ? 'zero' : prod.stock <= LOW_THRESHOLD ? 'low' : ''

                return (
                  <tr key={prod.id}>
                    {/* Número */}
                    <td className="td-num">{String(i + 1).padStart(2, '0')}</td>

                    {/* Nome + unidade */}
                    <td>
                      <div className="prod-name-cell">
                        <div className="pn">{prod.name}</div>
                        <div className="pu">{prod.unit}</div>
                      </div>
                    </td>

                    {/* Categoria */}
                    <td>
                      <span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span>
                    </td>

                    {/* Preço */}
                    <td className="price-cell">{fmtPreco(prod.price)}</td>

                    {/* Controle de estoque (+/-) */}
                    <td>
                      <div className="qty-ctrl">
                        <button className="qty-btn" onClick={() => alterarEstoque(prod.id, -1)}>−</button>
                        <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                        <button className="qty-btn" onClick={() => alterarEstoque(prod.id, 1)}>+</button>
                      </div>
                    </td>

                    {/* Badge de status */}
                    <td>
                      <span className={`status-badge ${si.cls}`}>
                        <span className="sdot" />
                        {si.label}
                      </span>
                    </td>

                    {/* Botões de ação */}
                    <td>
                      <div className="action-btns">
                        <button className="action-btn edit" onClick={() => abrirModalEditar(prod)}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button className="action-btn del" onClick={() => abrirModalExcluir(prod)}>
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


      {/* Cards de produto para mobile (tabela fica oculta em telas pequenas) */}
      <div className="est-mobile-cards">
        {produtosFiltrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((prod) => {
            const si = infoStatus(prod.stock)
            const qcls = prod.stock === 0 ? 'zero' : prod.stock <= LOW_THRESHOLD ? 'low' : ''
            return (
              <div key={prod.id} className="est-prod-card">
                <div className="est-prod-card-header">
                  <div>
                    <div className="est-prod-card-name">{prod.name}</div>
                    <div className="est-prod-card-unit">{prod.unit}</div>
                  </div>
                  <span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span>
                </div>
                <div className="est-prod-card-body">
                  <div className="est-prod-card-field">
                    <label>Preço</label>
                    <span style={{ color:'var(--p)', fontWeight:800 }}>{fmtPreco(prod.price)}</span>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Status</label>
                    <span className={`status-badge ${si.cls}`}>
                      <span className="sdot" />{si.label}
                    </span>
                  </div>
                </div>
                <div className="est-prod-card-footer">
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={() => alterarEstoque(prod.id, -1)}>−</button>
                    <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                    <button className="qty-btn" onClick={() => alterarEstoque(prod.id, 1)}>+</button>
                  </div>
                  <div className="action-btns">
                    <button className="action-btn edit" onClick={() => abrirModalEditar(prod)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="action-btn del" onClick={() => abrirModalExcluir(prod)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                        <path d="M10 11v6"/><path d="M14 11v6"/>
                        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>


      {/* Cards de estoque — visíveis apenas no mobile (tabela fica escondida via CSS) */}
      <div className="est-mobile-cards">
        {produtosFiltrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'32px', color:'var(--muted)', background:'#fff', borderRadius:'var(--r)', border:'1px solid var(--border)' }}>
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((prod, i) => {
            const si = infoStatus(prod.stock)
            const qcls = prod.stock === 0 ? 'zero' : prod.stock <= LOW_THRESHOLD ? 'low' : ''
            return (
              <div key={prod.id} className="est-prod-card">
                <div className="est-prod-card-header">
                  <div>
                    <div className="est-prod-card-name">{prod.name}</div>
                    <div className="est-prod-card-unit">{prod.unit}</div>
                  </div>
                  <div className="action-btns">
                    <button className="action-btn edit" onClick={() => abrirModalEditar(prod)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="action-btn del" onClick={() => abrirModalExcluir(prod)}>
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
                  <div className="est-prod-card-field">
                    <label>Categoria</label>
                    <span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Preço</label>
                    <span className="price-cell">{fmtPreco(prod.price)}</span>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Estoque</label>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => alterarEstoque(prod.id, -1)}>−</button>
                      <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                      <button className="qty-btn" onClick={() => alterarEstoque(prod.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Status</label>
                    <span className={`status-badge ${si.cls}`}>
                      <span className="sdot" />
                      {si.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* ── Cards de estoque (visíveis apenas no mobile via CSS) ── */}
      <div className="est-mobile-cards">
        {produtosFiltrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            Nenhum produto encontrado.
          </div>
        ) : (
          produtosFiltrados.map((prod) => {
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
                    <button className="action-btn edit" onClick={() => abrirModalEditar(prod)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button className="action-btn del" onClick={() => abrirModalExcluir(prod)}>
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
                  <div className="est-prod-card-field">
                    <label>Categoria</label>
                    <span className={`badge ${classeBadge(prod.cat)}`}>{prod.cat}</span>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Preço</label>
                    <span className="price-cell">{fmtPreco(prod.price)}</span>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Estoque</label>
                    <div className="qty-ctrl">
                      <button className="qty-btn" onClick={() => alterarEstoque(prod.id, -1)}>−</button>
                      <span className={`qty-val ${qcls}`}>{prod.stock}</span>
                      <button className="qty-btn" onClick={() => alterarEstoque(prod.id, 1)}>+</button>
                    </div>
                  </div>
                  <div className="est-prod-card-field">
                    <label>Status</label>
                    <span className={`status-badge ${si.cls}`}>
                      <span className="sdot" />{si.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modais */}
      <ModalProduto
        isOpen={modalProdutoAberto}
        onClose={() => setModalProdutoAberto(false)}
        onSubmit={salvarProduto}
        produtoEditando={produtoEditando}
      />

      <ModalExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={confirmarExclusao}
        nomeProduto={produtoExcluindo?.name || ''}
      />

    </div>
  )
}
