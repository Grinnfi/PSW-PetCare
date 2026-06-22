// ══════════════════════════════════════════════
// Loja.jsx — Catálogo de produtos (Redux + MongoDB + imagens locais)
// ══════════════════════════════════════════════
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { pegarImagem } from '../utils/imagemProduto.js'

const fmtPreco = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

const normalizar = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

export default function Loja({ addToCart }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const categoriaFiltro = searchParams.get('categoria')

  const produtos = useSelector(s => s.products.list)
  const statusProdutos = useSelector(s => s.products.status)

  const filtroValido = Boolean(categoriaFiltro)

  const produtosFiltrados = filtroValido
    ? produtos.filter(p => normalizar(p.categoriaPet || p.categoria) === normalizar(categoriaFiltro))
    : produtos

  const irParaDetalhe = (id) => navigate(`/produto/${id}`)

  return (
    <div id="page-loja" className="page">
      <div className="page-htitle">
        <h1>{filtroValido ? `Loja PetCare — ${categoriaFiltro}` : 'Loja PetCare'}</h1>
        <p>Produtos selecionados para o seu pet.</p>
      </div>

      {statusProdutos === 'loading' && produtos.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Carregando produtos...</p>
      ) : produtosFiltrados.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>Nenhum produto encontrado.</p>
      ) : (
        <div className="products-grid">
          {produtosFiltrados.map(prod => {
            const imagem = pegarImagem(prod)

            return (
              <div key={prod._id} className="prod-card" onClick={() => irParaDetalhe(prod._id)}>
                <div className="prod-img">
                  {imagem ? (
                    <img src={imagem} alt={prod.name} className="prod-media" />
                  ) : (
                    <span className="prod-media">{prod.emoji || '📦'}</span>
                  )}
                </div>

                <div className="prod-info">
                  <div className="prod-name">{prod.name}</div>
                  <div className="prod-price">{fmtPreco(prod.price)}</div>

                  <button
                    className="btn-add-cart"
                    disabled={prod.stock === 0}
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(prod)
                    }}
                  >
                    {prod.stock === 0 ? 'Esgotado' : '+ Adicionar'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}