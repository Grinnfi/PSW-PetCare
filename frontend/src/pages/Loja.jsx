import { useSearchParams } from 'react-router-dom'

const normalizar = (str) =>
  str?.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()

const PRODUTOS = [
  { id: 'racao-premium',       emoji: '🦴', nome: 'Ração Premium Cão 15kg',          precoAntigo: 'R$ 94,90',  preco: 'R$ 85,90',  precoNum: 85.90,  categoria: 'Cachorros'    },
  { id: 'shampoo-pet',         emoji: '🐾', nome: 'Shampoo Pet Neutro 500ml',         precoAntigo: 'R$ 35,00',  preco: 'R$ 28,90',  precoNum: 28.90,  categoria: 'Cachorros'    },
  { id: 'brinquedo-mordedor',  emoji: '🎾', nome: 'Brinquedo Mordedor',               precoAntigo: 'R$ 25,00',  preco: 'R$ 19,90',  precoNum: 19.90,  categoria: 'Cachorros'    },
  { id: 'cama-pet',            emoji: '🛏️', nome: 'Cama Pet Grande',                  precoAntigo: 'R$ 150,00', preco: 'R$ 120,00', precoNum: 120.00, categoria: 'Cachorros'    },
  { id: 'antipulgas',          emoji: '💊', nome: 'Antipulgas Spray',                 precoAntigo: 'R$ 48,00',  preco: 'R$ 38,50',  precoNum: 38.50,  categoria: 'Cachorros'    },
  { id: 'osso-mastigavel',     emoji: '🍖', nome: 'Osso Mastigável Natural',          precoAntigo: 'R$ 18,00',  preco: 'R$ 12,00',  precoNum: 12.00,  categoria: 'Cachorros'    },
  { id: 'vitaminas-pet',       emoji: '🏥', nome: 'Vitaminas Pet',                    precoAntigo: 'R$ 60,00',  preco: 'R$ 48,00',  precoNum: 48.00,  categoria: 'Cachorros'    },
  { id: 'coleira-passeio',     emoji: '🦮', nome: 'Coleira de Passeio M',             precoAntigo: 'R$ 45,00',  preco: 'R$ 35,90',  precoNum: 35.90,  categoria: 'Cachorros'    },
  { id: 'areia-higienica',     emoji: '🪨', nome: 'Areia Higiênica 4kg',              precoAntigo: 'R$ 42,00',  preco: 'R$ 35,00',  precoNum: 35.00,  categoria: 'Gatos'        },
  { id: 'racao-gato',          emoji: '🐱', nome: 'Ração Premium Gato 3kg',           precoAntigo: 'R$ 75,00',  preco: 'R$ 65,00',  precoNum: 65.00,  categoria: 'Gatos'        },
  { id: 'arranhador-gato',     emoji: '🐾', nome: 'Arranhador para Gatos',            precoAntigo: 'R$ 90,00',  preco: 'R$ 75,00',  precoNum: 75.00,  categoria: 'Gatos'        },
  { id: 'brinquedo-gato',      emoji: '🧶', nome: 'Brinquedo Varinha com Penas',      precoAntigo: 'R$ 22,00',  preco: 'R$ 16,90',  precoNum: 16.90,  categoria: 'Gatos'        },
  { id: 'caixa-transporte',    emoji: '🧳', nome: 'Caixa de Transporte P',            precoAntigo: 'R$ 130,00', preco: 'R$ 109,90', precoNum: 109.90, categoria: 'Gatos'        },
  { id: 'fontanario-gato',     emoji: '💧', nome: 'Bebedouro Fontanário Gato',        precoAntigo: 'R$ 85,00',  preco: 'R$ 69,90',  precoNum: 69.90,  categoria: 'Gatos'        },
  { id: 'shampoo-gato',        emoji: '🛁', nome: 'Shampoo Especial para Gatos',      precoAntigo: 'R$ 38,00',  preco: 'R$ 29,90',  precoNum: 29.90,  categoria: 'Gatos'        },
  { id: 'snack-gato',          emoji: '🍗', nome: 'Snack Cremoso para Gatos 10un',    precoAntigo: 'R$ 32,00',  preco: 'R$ 24,90',  precoNum: 24.90,  categoria: 'Gatos'        },
  { id: 'sementes-passaro',    emoji: '🌾', nome: 'Sementes para Pássaros 500g',      precoAntigo: 'R$ 20,00',  preco: 'R$ 15,90',  precoNum: 15.90,  categoria: 'Pássaros'     },
  { id: 'gaiola-passaro',      emoji: '🏠', nome: 'Gaiola Decorativa M',              precoAntigo: 'R$ 180,00', preco: 'R$ 149,90', precoNum: 149.90, categoria: 'Pássaros'     },
  { id: 'poleiro-passaro',     emoji: '🌿', nome: 'Poleiro de Madeira Natural',       precoAntigo: 'R$ 35,00',  preco: 'R$ 27,90',  precoNum: 27.90,  categoria: 'Pássaros'     },
  { id: 'brinquedo-passaro',   emoji: '🪀', nome: 'Brinquedo Colorido para Aves',     precoAntigo: 'R$ 28,00',  preco: 'R$ 21,90',  precoNum: 21.90,  categoria: 'Pássaros'     },
  { id: 'comedouro-passaro',   emoji: '🥣', nome: 'Comedouro Duplo para Gaiola',      precoAntigo: 'R$ 18,00',  preco: 'R$ 13,90',  precoNum: 13.90,  categoria: 'Pássaros'     },
  { id: 'vitamina-passaro',    emoji: '💊', nome: 'Vitamina para Pássaros 30ml',      precoAntigo: 'R$ 25,00',  preco: 'R$ 19,90',  precoNum: 19.90,  categoria: 'Pássaros'     },
  { id: 'racao-passaro',       emoji: '🌰', nome: 'Ração Extrusada para Periquito',   precoAntigo: 'R$ 30,00',  preco: 'R$ 23,90',  precoNum: 23.90,  categoria: 'Pássaros'     },
  { id: 'banho-passaro',       emoji: '🚿', nome: 'Banheira para Pássaros',           precoAntigo: 'R$ 22,00',  preco: 'R$ 16,90',  precoNum: 16.90,  categoria: 'Pássaros'     },
  { id: 'racao-peixe',         emoji: '🐠', nome: 'Ração para Peixes Tropicais',      precoAntigo: 'R$ 28,00',  preco: 'R$ 22,90',  precoNum: 22.90,  categoria: 'Peixes'       },
  { id: 'aquario-starter',     emoji: '🐟', nome: 'Kit Aquário Iniciante',            precoAntigo: 'R$ 250,00', preco: 'R$ 199,90', precoNum: 199.90, categoria: 'Peixes'       },
  { id: 'filtro-aquario',      emoji: '🔄', nome: 'Filtro para Aquário 50L',          precoAntigo: 'R$ 95,00',  preco: 'R$ 79,90',  precoNum: 79.90,  categoria: 'Peixes'       },
  { id: 'termometro-aquario',  emoji: '🌡️', nome: 'Termômetro Digital Aquário',       precoAntigo: 'R$ 35,00',  preco: 'R$ 27,90',  precoNum: 27.90,  categoria: 'Peixes'       },
  { id: 'cascalho-aquario',    emoji: '🪨', nome: 'Cascalho Natural 2kg',             precoAntigo: 'R$ 22,00',  preco: 'R$ 16,90',  precoNum: 16.90,  categoria: 'Peixes'       },
  { id: 'planta-aquario',      emoji: '🌱', nome: 'Planta Artificial para Aquário',   precoAntigo: 'R$ 18,00',  preco: 'R$ 13,90',  precoNum: 13.90,  categoria: 'Peixes'       },
  { id: 'condicionador-agua',  emoji: '💧', nome: 'Condicionador de Água 120ml',      precoAntigo: 'R$ 25,00',  preco: 'R$ 19,90',  precoNum: 19.90,  categoria: 'Peixes'       },
  { id: 'rede-aquario',        emoji: '🕸️', nome: 'Rede para Pegar Peixes',           precoAntigo: 'R$ 15,00',  preco: 'R$ 10,90',  precoNum: 10.90,  categoria: 'Peixes'       },
  { id: 'feno-coelho',         emoji: '🌿', nome: 'Feno para Roedores 500g',          precoAntigo: 'R$ 18,00',  preco: 'R$ 13,90',  precoNum: 13.90,  categoria: 'Outros Pets'  },
  { id: 'gaiola-hamster',      emoji: '🏠', nome: 'Gaiola para Hamster',              precoAntigo: 'R$ 120,00', preco: 'R$ 99,90',  precoNum: 99.90,  categoria: 'Outros Pets'  },
  { id: 'roda-hamster',        emoji: '⚙️', nome: 'Roda de Exercício para Hamster',   precoAntigo: 'R$ 35,00',  preco: 'R$ 27,90',  precoNum: 27.90,  categoria: 'Outros Pets'  },
  { id: 'racao-coelho',        emoji: '🥕', nome: 'Ração para Coelhos 1kg',           precoAntigo: 'R$ 32,00',  preco: 'R$ 25,90',  precoNum: 25.90,  categoria: 'Outros Pets'  },
  { id: 'serragem-roedor',     emoji: '🪵', nome: 'Serragem para Roedores 500g',      precoAntigo: 'R$ 20,00',  preco: 'R$ 14,90',  precoNum: 14.90,  categoria: 'Outros Pets'  },
  { id: 'brinquedo-roedor',    emoji: '🧸', nome: 'Brinquedo Tubo para Hamster',      precoAntigo: 'R$ 28,00',  preco: 'R$ 21,90',  precoNum: 21.90,  categoria: 'Outros Pets'  },
  { id: 'bebedouro-roedor',    emoji: '💧', nome: 'Bebedouro para Roedores 250ml',    precoAntigo: 'R$ 22,00',  preco: 'R$ 16,90',  precoNum: 16.90,  categoria: 'Outros Pets'  },
  { id: 'vitamina-roedor',     emoji: '💊', nome: 'Vitamina para Roedores 30ml',      precoAntigo: 'R$ 25,00',  preco: 'R$ 19,90',  precoNum: 19.90,  categoria: 'Outros Pets'  },
  { id: 'grama-jardim',        emoji: '🌱', nome: 'Kit Grama Sintética',              precoAntigo: 'R$ 120,00', preco: 'R$ 99,90',  precoNum: 99.90,  categoria: 'Casa e Jardim'},
  { id: 'comedouro-jardim',    emoji: '🌻', nome: 'Comedouro para Pássaros Jardim',   precoAntigo: 'R$ 55,00',  preco: 'R$ 44,90',  precoNum: 44.90,  categoria: 'Casa e Jardim'},
  { id: 'casinha-jardim',      emoji: '🏡', nome: 'Casinha de Madeira para Pets',     precoAntigo: 'R$ 280,00', preco: 'R$ 239,90', precoNum: 239.90, categoria: 'Casa e Jardim'},
  { id: 'repelente-jardim',    emoji: '🌿', nome: 'Repelente Natural para Jardim',    precoAntigo: 'R$ 38,00',  preco: 'R$ 29,90',  precoNum: 29.90,  categoria: 'Casa e Jardim'},
  { id: 'tapete-higienico',    emoji: '🧻', nome: 'Tapete Higiênico 30un',            precoAntigo: 'R$ 45,00',  preco: 'R$ 36,90',  precoNum: 36.90,  categoria: 'Casa e Jardim'},
  { id: 'limpador-enzimatico', emoji: '🧴', nome: 'Limpador Enzimático 500ml',        precoAntigo: 'R$ 32,00',  preco: 'R$ 25,90',  precoNum: 25.90,  categoria: 'Casa e Jardim'},
  { id: 'arranhador-sofa',     emoji: '🛋️', nome: 'Protetor de Sofá Arranhador',      precoAntigo: 'R$ 65,00',  preco: 'R$ 52,90',  precoNum: 52.90,  categoria: 'Casa e Jardim'},
  { id: 'cama-jardim',         emoji: '🌞', nome: 'Cama Pet para Área Externa',       precoAntigo: 'R$ 175,00', preco: 'R$ 149,90', precoNum: 149.90, categoria: 'Casa e Jardim'},
]

export default function Loja({ addToCart }) {
  const [searchParams] = useSearchParams()
  const categoriaFiltro = searchParams.get('categoria')

  const produtosFiltrados = categoriaFiltro
    ? PRODUTOS.filter(p => normalizar(p.categoria) === normalizar(categoriaFiltro))
    : PRODUTOS

  return (
    <div id="page-loja" className="page">
      <div className="page-htitle" style={{ marginBottom: '24px' }}>
        <h1>{categoriaFiltro ? `Loja PetCare — ${categoriaFiltro}` : 'Loja PetCare'}</h1>
        <p>Produtos selecionados para o seu pet.</p>
      </div>
      <div className="products-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
        {produtosFiltrados.map(prod => (
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