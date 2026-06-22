// ══════════════════════════════════════════════
// Loja.jsx — Catálogo de produtos (Redux + MongoDB + imagens locais)
// ══════════════════════════════════════════════
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const fmtPreco = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

const normalizar = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const imagensPorNome = {
  'Ração Premium Cão 15kg': 'racao-premium.jpg',
  'Shampoo Pet Neutro 500ml': 'shampoo-pet.jpg',
  'Brinquedo Mordedor': 'brinquedo-mordedor.jpg',
  'Cama Pet Grande': 'cama-pet.jpg',
  'Antipulgas Spray': 'antipulgas.jpg',
  'Osso Mastigável Natural': 'osso-mastigavel.jpg',
  'Vitaminas Pet': 'vitaminas-pet.jpg',
  'Coleira de Passeio M': 'coleira-passeio.jpg',

  'Areia Higiênica 4kg': 'areia-higienica.jpg',
  'Ração Premium Gato 3kg': 'racao-gato.jpg',
  'Arranhador para Gatos': 'arranhador-gato.jpg',
  'Brinquedo Varinha com Penas': 'brinquedo-gato.jpg',
  'Caixa de Transporte P': 'caixa-transporte.jpg',
  'Bebedouro Fontanário Gato': 'fontanario-gato.jpg',
  'Shampoo Especial para Gatos': 'shampoo-gato.jpg',
  'Snack Cremoso para Gatos 10un': 'snack-gato.jpg',

  'Sementes para Pássaros 500g': 'sementes-passaro.jpg',
  'Gaiola Decorativa M': 'gaiola-passaro.jpg',
  'Poleiro de Madeira Natural': 'poleiro-passaro.jpg',
  'Brinquedo Colorido para Aves': 'brinquedo-passaro.jpg',
  'Comedouro Duplo para Gaiola': 'comedouro-passaro.jpg',
  'Vitamina para Pássaros 30ml': 'vitamina-passaro.jpg',
  'Ração Extrusada para Periquito': 'racao-passaro.jpg',
  'Banheira para Pássaros': 'banho-passaro.jpg',

  'Ração para Peixes Tropicais': 'racao-peixe.jpg',
  'Kit Aquário Iniciante': 'aquario-starter.jpg',
  'Filtro para Aquário 50L': 'filtro-aquario.jpg',
  'Termômetro Digital Aquário': 'termometro-aquario.jpg',
  'Cascalho Natural 2kg': 'cascalho-aquario.jpg',
  'Planta Artificial para Aquário': 'planta-aquario.jpg',
  'Condicionador de Água 120ml': 'condicionador-agua.jpg',
  'Rede para Pegar Peixes': 'rede-aquario.jpg',

  'Feno para Roedores 500g': 'feno-coelho.jpg',
  'Gaiola para Hamster': 'gaiola-hamster.jpg',
  'Roda de Exercício para Hamster': 'roda-hamster.jpg',
  'Ração para Coelhos 1kg': 'racao-coelho.jpg',
  'Serragem para Roedores 500g': 'serragem-roedor.jpg',
  'Brinquedo Tubo para Hamster': 'brinquedo-roedor.jpg',
  'Bebedouro para Roedores 250ml': 'bebedouro-roedor.jpg',
  'Vitamina para Roedores 30ml': 'vitamina-roedor.jpg',

  'Kit Grama Sintética': 'grama-jardim.jpg',
  'Comedouro para Pássaros Jardim': 'comedouro-jardim.jpg',
  'Casinha de Madeira para Pets': 'casinha-jardim.jpg',
  'Repelente Natural para Jardim': 'repelente-jardim.jpg',
  'Tapete Higiênico 30un': 'tapete-higienico.jpg',
  'Limpador Enzimático 500ml': 'limpador-enzimatico.jpg',
  'Protetor de Sofá Arranhador': 'arranhador-sofa.jpg',
  'Cama Pet para Área Externa': 'cama-jardim.jpg',
}

const pegarImagem = (prod) => {
  if (prod.image) return prod.image
  if (prod.imagem) return prod.imagem

  const arquivo = imagensPorNome[prod.name]
  return arquivo ? `/images/${arquivo}` : null
}

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