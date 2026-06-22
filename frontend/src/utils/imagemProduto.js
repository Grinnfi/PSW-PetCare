// ══════════════════════════════════════════════
// utils/imagemProduto.js — Resolução de imagem do produto
// Prioridade: campo image/imagem do banco
// ══════════════════════════════════════════════

const imagensPorNome = {
  'Ração Premium Cão 15kg':           'racao-premium.jpg',
  'Shampoo Pet Neutro 500ml':         'shampoo-pet.jpg',
  'Brinquedo Mordedor':               'brinquedo-mordedor.jpg',
  'Cama Pet Grande':                  'cama-pet.jpg',
  'Antipulgas Spray':                 'antipulgas.jpg',
  'Osso Mastigável Natural':          'osso-mastigavel.jpg',
  'Vitaminas Pet':                    'vitaminas-pet.jpg',
  'Coleira de Passeio M':             'coleira-passeio.jpg',

  'Areia Higiênica 4kg':              'areia-higienica.jpg',
  'Ração Premium Gato 3kg':           'racao-gato.jpg',
  'Arranhador para Gatos':            'arranhador-gato.jpg',
  'Brinquedo Varinha com Penas':      'brinquedo-gato.jpg',
  'Caixa de Transporte P':            'caixa-transporte.jpg',
  'Bebedouro Fontanário Gato':        'fontanario-gato.jpg',
  'Shampoo Especial para Gatos':      'shampoo-gato.jpg',
  'Snack Cremoso para Gatos 10un':    'snack-gato.jpg',

  'Sementes para Pássaros 500g':      'sementes-passaro.jpg',
  'Gaiola Decorativa M':              'gaiola-passaro.jpg',
  'Poleiro de Madeira Natural':       'poleiro-passaro.jpg',
  'Brinquedo Colorido para Aves':     'brinquedo-passaro.jpg',
  'Comedouro Duplo para Gaiola':      'comedouro-passaro.jpg',
  'Vitamina para Pássaros 30ml':      'vitamina-passaro.jpg',
  'Ração Extrusada para Periquito':   'racao-passaro.jpg',
  'Banheira para Pássaros':           'banho-passaro.jpg',

  'Ração para Peixes Tropicais':      'racao-peixe.jpg',
  'Kit Aquário Iniciante':            'aquario-starter.jpg',
  'Filtro para Aquário 50L':          'filtro-aquario.jpg',
  'Termômetro Digital Aquário':       'termometro-aquario.jpg',
  'Cascalho Natural 2kg':             'cascalho-aquario.jpg',
  'Planta Artificial para Aquário':   'planta-aquario.jpg',
  'Condicionador de Água 120ml':      'condicionador-agua.jpg',
  'Rede para Pegar Peixes':           'rede-aquario.jpg',

  'Feno para Roedores 500g':          'feno-coelho.jpg',
  'Gaiola para Hamster':              'gaiola-hamster.jpg',
  'Roda de Exercício para Hamster':   'roda-hamster.jpg',
  'Ração para Coelhos 1kg':           'racao-coelho.jpg',
  'Serragem para Roedores 500g':      'serragem-roedor.jpg',
  'Brinquedo Tubo para Hamster':      'brinquedo-roedor.jpg',
  'Bebedouro para Roedores 250ml':    'bebedouro-roedor.jpg',
  'Vitamina para Roedores 30ml':      'vitamina-roedor.jpg',

  'Kit Grama Sintética':              'grama-jardim.jpg',
  'Comedouro para Pássaros Jardim':   'comedouro-jardim.jpg',
  'Casinha de Madeira para Pets':     'casinha-jardim.jpg',
  'Repelente Natural para Jardim':    'repelente-jardim.jpg',
  'Tapete Higiênico 30un':            'tapete-higienico.jpg',
  'Limpador Enzimático 500ml':        'limpador-enzimatico.jpg',
  'Protetor de Sofá Arranhador':      'arranhador-sofa.jpg',
  'Cama Pet para Área Externa':       'cama-jardim.jpg',
}

export function pegarImagem(prod) {
  if (!prod) return null
  if (prod.image)  return prod.image
  if (prod.imagem) return prod.imagem
  const arquivo = imagensPorNome[prod.name]
  return arquivo ? `/images/${arquivo}` : null
}