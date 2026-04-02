// ══════════════════════════════════════════════
// Loja.jsx — Página da loja de produtos
// Props: addToCart
// ══════════════════════════════════════════════

const PRODUTOS = [
  { id: 'racao-premium',     emoji: '🦴', nome: 'Ração Premium Cão 15kg',    precoAntigo: 'R$ 94,90',  preco: 'R$ 85,90',  precoNum: 85.90 },
  { id: 'shampoo-pet',       emoji: '🐾', nome: 'Shampoo Pet Neutro 500ml',   precoAntigo: 'R$ 35,00',  preco: 'R$ 28,90',  precoNum: 28.90 },
  { id: 'brinquedo-mordedor',emoji: '🎾', nome: 'Brinquedo Mordedor',          precoAntigo: 'R$ 25,00',  preco: 'R$ 19,90',  precoNum: 19.90 },
  { id: 'cama-pet',          emoji: '🛏️', nome: 'Cama Pet Grande',             precoAntigo: 'R$ 150,00', preco: 'R$ 120,00', precoNum: 120.00 },
  { id: 'antipulgas',        emoji: '💊', nome: 'Antipulgas Spray',            precoAntigo: 'R$ 48,00',  preco: 'R$ 38,50',  precoNum: 38.50 },
  { id: 'osso-mastigavel',   emoji: '🍖', nome: 'Osso Mastigável Natural',     precoAntigo: 'R$ 18,00',  preco: 'R$ 12,00',  precoNum: 12.00 },
  { id: 'vitaminas-pet',     emoji: '🏥', nome: 'Vitaminas Pet',               precoAntigo: 'R$ 60,00',  preco: 'R$ 48,00',  precoNum: 48.00 },
  { id: 'areia-higienica',   emoji: '🐾', nome: 'Areia Higiênica 4kg',         precoAntigo: 'R$ 42,00',  preco: 'R$ 35,00',  precoNum: 35.00 },
]

export default function Loja({ addToCart }) {
  return (
    <div id="page-loja" className="page">

      <div className="page-htitle">
        <h1>Loja PetCare</h1>
        <p>Produtos selecionados para o seu pet.</p>
      </div>

      {/* Grid responsivo: 4 colunas → 3 tablet → 2 mobile (via CSS) */}
      <div className="products-grid">
        {PRODUTOS.map(prod => (
          <div key={prod.id} className="prod-card">
            <div className="prod-img">{prod.emoji}</div>
            <div className="prod-info">
              <div className="prod-name">{prod.nome}</div>
              <div className="prod-old">{prod.precoAntigo}</div>
              <div className="prod-price">{prod.preco}</div>
              <button className="btn-add-cart" onClick={() => addToCart(prod)}>
                + Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
