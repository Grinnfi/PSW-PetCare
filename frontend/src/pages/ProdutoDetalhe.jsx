import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { pegarImagem } from '../utils/imagemProduto.js'

const API = 'http://localhost:3001'
const LOW_THRESHOLD = 10

const fmtPreco = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

const classeBadge = (cat) => ({
  Alimentação: 'alimentacao', Higiene: 'higiene',
  Saúde: 'saude', Acessórios: 'acessorios',
}[cat] || '')

const infoStatus = (stock) => {
  if (stock === 0)            return { cls: 'zero',   label: 'Esgotado' }
  if (stock <= LOW_THRESHOLD) return { cls: 'low',    label: 'Últimas unidades' }
  return                             { cls: 'normal', label: 'Em estoque' }
}

export default function ProdutoDetalhe({ addToCart }) {
  const { id }   = useParams()
  const navigate = useNavigate()

  const produtos        = useSelector(s => s.products.list)
  const produtoNaLista   = produtos.find(p => p._id === id)

  const [produtoApi, setProdutoApi]   = useState(null)
  const [carregando, setCarregando]   = useState(false)
  const [erro, setErro]               = useState(false)

  useEffect(() => {
    if (produtoNaLista) return
    setCarregando(true)
    setErro(false)
    fetch(`${API}/products/${id}`)
      .then(res => { if (!res.ok) throw new Error('not found'); return res.json() })
      .then(data => setProdutoApi(data))
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }, [id, produtoNaLista])

  const produto = produtoNaLista || produtoApi

  const [qtd, setQtd] = useState(1)
  const [aba, setAba] = useState('descricao')

  useEffect(() => { setQtd(1) }, [id])

  const relacionados = useMemo(() => {
    if (!produto) return []
    return produtos.filter(p => p.categoriaPet === produto.categoriaPet && p._id !== produto._id).slice(0, 4)
  }, [produtos, produto])

  if (carregando) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
        Carregando produto...
      </div>
    )
  }

  if (erro || !produto) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
        <h2 style={{ marginBottom: 8 }}>Produto não encontrado</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 20 }}>Esse produto pode ter sido removido do catálogo.</p>
        <button className="btn-primary" onClick={() => navigate('/loja')}>Voltar para a loja</button>
      </div>
    )
  }

  const si        = infoStatus(produto.stock)
  const esgotado   = produto.stock === 0
  const maxQtd     = Math.max(produto.stock, 0)

  const alterarQtd = (delta) => {
    setQtd(q => {
      const novo = q + delta
      if (novo < 1) return 1
      if (maxQtd > 0 && novo > maxQtd) return maxQtd
      return novo
    })
  }

  const handleAdicionar = () => {
    if (esgotado) return
    addToCart({ ...produto, qtd })
  }

  return (
    <div id="page-produto-detalhe" className="page">

      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Início</span>
        <span className="bc-sep">›</span>
        <span onClick={() => navigate('/loja')}>Loja</span>
        <span className="bc-sep">›</span>
        <span onClick={() => navigate(`/loja?categoria=${encodeURIComponent(produto.categoriaPet)}`)}>{produto.categoriaPet}</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">{produto.name}</span>
      </div>

      <div className="detalhe-layout">
        <div className="detalhe-img">
          {(() => {
            const imagem = pegarImagem(produto)
            return imagem
              ? <img src={imagem} alt={produto.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: 'var(--r)' }} />
              : <span>{produto.emoji || '📦'}</span>
          })()}
        </div>

        <div className="detalhe-info">
          <span className={`badge ${classeBadge(produto.cat)}`}>{produto.cat}</span>
          <h1 className="detalhe-nome">{produto.name}</h1>
          <p className="detalhe-unidade">Unidade: {produto.unit || 'unidade'}</p>

          <div className="detalhe-preco">{fmtPreco(produto.price)}</div>

          <div className={`status-badge ${si.cls}`} style={{ marginBottom: 20, alignSelf: 'flex-start' }}>
            <span className="sdot" />{si.label}{!esgotado && ` (${produto.stock} disponíveis)`}
          </div>

          <div className="detalhe-qtd-row">
            <span className="detalhe-qtd-label">Quantidade</span>
            <div className="qty-ctrl">
              <button className="qty-btn" onClick={() => alterarQtd(-1)} disabled={esgotado}>−</button>
              <span className="qty-val">{esgotado ? 0 : qtd}</span>
              <button className="qty-btn" onClick={() => alterarQtd(1)} disabled={esgotado || qtd >= maxQtd}>+</button>
            </div>
          </div>

          <button className="btn-add-cart-detalhe" disabled={esgotado} onClick={handleAdicionar}>
            {esgotado ? 'Produto Esgotado' : `Adicionar ao Carrinho — ${fmtPreco(produto.price * qtd)}`}
          </button>
        </div>
      </div>

      <div className="detalhe-tabs-card">
        <div className="detalhe-tabs">
          <button className={`detalhe-tab ${aba === 'descricao' ? 'active' : ''}`} onClick={() => setAba('descricao')}>Descrição</button>
          <button className={`detalhe-tab ${aba === 'specs' ? 'active' : ''}`} onClick={() => setAba('specs')}>Especificações</button>
        </div>
        <div className="detalhe-tab-content">
          {aba === 'descricao' ? (
            <p>{produto.desc || 'Sem descrição cadastrada para este produto.'}</p>
          ) : (
            <ul className="detalhe-specs-list">
              <li><span>Categoria</span><strong>{produto.cat}</strong></li>
              <li><span>Para</span><strong>{produto.categoriaPet}</strong></li>
              <li><span>Unidade</span><strong>{produto.unit || 'unidade'}</strong></li>
              <li><span>Estoque disponível</span><strong>{produto.stock} {produto.unit || 'un.'}</strong></li>
            </ul>
          )}
        </div>
      </div>

      {relacionados.length > 0 && (
        <div className="home-section" style={{ padding: '32px 0 0' }}>
          <div className="section-title">Você também pode <span>gostar</span></div>
          <div className="products-grid">
            {relacionados.map(prod => (
              <div key={prod._id} className="prod-card" onClick={() => navigate(`/produto/${prod._id}`)}>
                <div className="prod-img">
                {(() => {
                  const img = pegarImagem(prod)
                  return img
                    ? <img src={img} alt={prod.name} className="prod-media" />
                    : <span className="prod-media">{prod.emoji || '📦'}</span>
                })()}
              </div>
                <div className="prod-info">
                  <div className="prod-name">{prod.name}</div>
                  <div className="prod-price">{fmtPreco(prod.price)}</div>
                  <button
                    className="btn-add-cart"
                    disabled={prod.stock === 0}
                    onClick={(e) => { e.stopPropagation(); addToCart(prod) }}
                  >
                    {prod.stock === 0 ? 'Esgotado' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}