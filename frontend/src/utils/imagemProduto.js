const normalizar = (texto = '') =>
  texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')

const imagens = [
  { termos: ['racao premium', 'ração premium'], img: '/images/racao-premium.jpg' },
  { termos: ['shampoo pet', 'shampoo cachorro'], img: '/images/shampoo-pet.jpg' },
  { termos: ['brinquedo mordedor', 'mordedor'], img: '/images/brinquedo-mordedor.jpg' },
  { termos: ['cama pet', 'cama'], img: '/images/cama-pet.jpg' },
  { termos: ['antipulgas', 'anti pulgas', 'pulgas'], img: '/images/antipulgas.jpg' },
  { termos: ['tapete higienico', 'tapete higiênico'], img: '/images/tapete-higienico.jpg' },
  { termos: ['coleira passeio', 'coleira'], img: '/images/coleira-passeio.jpg' },
  { termos: ['osso mastigavel', 'osso mastigável'], img: '/images/osso-mastigavel.jpg' },
  { termos: ['caixa transporte', 'transporte'], img: '/images/caixa-transporte.jpg' },
  { termos: ['vitaminas pet', 'vitamina pet'], img: '/images/vitaminas-pet.jpg' },

  { termos: ['racao gato', 'ração gato'], img: '/images/racao-gato.jpg' },
  { termos: ['shampoo gato'], img: '/images/shampoo-gato.jpg' },
  { termos: ['brinquedo gato'], img: '/images/brinquedo-gato.jpg' },
  { termos: ['arranhador gato'], img: '/images/arranhador-gato.jpg' },
  { termos: ['arranhador sofa', 'arranhador sofá'], img: '/images/arranhador-sofa.jpg' },
  { termos: ['fontanario gato', 'fonte gato'], img: '/images/fontanario-gato.jpg' },
  { termos: ['areia higienica', 'areia higiênica'], img: '/images/areia-higienica.jpg' },
  { termos: ['snack gato'], img: '/images/snack-gato.jpg' },

  { termos: ['racao passaro', 'ração passaro', 'ração pássaro'], img: '/images/racao-passaro.jpg' },
  { termos: ['gaiola passaro', 'gaiola pássaro'], img: '/images/gaiola-passaro.jpg' },
  { termos: ['comedouro passaro', 'comedouro pássaro'], img: '/images/comedouro-passaro.jpg' },
  { termos: ['brinquedo passaro', 'brinquedo pássaro'], img: '/images/brinquedo-passaro.jpg' },
  { termos: ['sementes passaro', 'sementes pássaro'], img: '/images/sementes-passaro.jpg' },
  { termos: ['poleiro passaro', 'poleiro pássaro'], img: '/images/poleiro-passaro.jpg' },
  { termos: ['banho passaro', 'banho pássaro'], img: '/images/banho-passaro.jpg' },
  { termos: ['vitamina passaro', 'vitamina pássaro'], img: '/images/vitamina-passaro.jpg' },

  { termos: ['racao peixe', 'ração peixe'], img: '/images/racao-peixe.jpg' },
  { termos: ['aquario starter', 'aquário starter'], img: '/images/aquario-starter.jpg' },
  { termos: ['filtro aquario', 'filtro aquário'], img: '/images/filtro-aquario.jpg' },
  { termos: ['condicionador agua', 'condicionador água'], img: '/images/condicionador-agua.jpg' },
  { termos: ['termometro aquario', 'termômetro aquário'], img: '/images/termometro-aquario.jpg' },
  { termos: ['cascalho aquario', 'cascalho aquário'], img: '/images/cascalho-aquario.jpg' },
  { termos: ['planta aquario', 'planta aquário'], img: '/images/planta-aquario.jpg' },
  { termos: ['rede aquario', 'rede aquário'], img: '/images/rede-aquario.jpg' },

  { termos: ['racao coelho', 'ração coelho'], img: '/images/racao-coelho.jpg' },
  { termos: ['feno coelho'], img: '/images/feno-coelho.jpg' },
  { termos: ['gaiola hamster'], img: '/images/gaiola-hamster.jpg' },
  { termos: ['roda hamster'], img: '/images/roda-hamster.jpg' },
  { termos: ['bebedouro roedor'], img: '/images/bebedouro-roedor.jpg' },
  { termos: ['brinquedo roedor'], img: '/images/brinquedo-roedor.jpg' },
  { termos: ['serragem roedor'], img: '/images/serragem-roedor.jpg' },
  { termos: ['vitamina roedor'], img: '/images/vitamina-roedor.jpg' },

  { termos: ['cama jardim'], img: '/images/cama-jardim.jpg' },
  { termos: ['casinha jardim'], img: '/images/casinha-jardim.jpg' },
  { termos: ['comedouro jardim'], img: '/images/comedouro-jardim.jpg' },
  { termos: ['grama jardim'], img: '/images/grama-jardim.jpg' },
  { termos: ['limpador enzimatico', 'limpador enzimático'], img: '/images/limpador-enzimatico.jpg' },
  { termos: ['repelente jardim'], img: '/images/repelente-jardim.jpg' },
]

export function pegarImagem(produto) {
  if (!produto) return ''

  if (produto.image) return produto.image
  if (produto.imagem) return produto.imagem
  if (produto.foto) return produto.foto

  const texto = normalizar(`${produto.name || ''} ${produto.nome || ''} ${produto.cat || ''} ${produto.categoriaPet || ''}`)

  const encontrada = imagens.find((item) =>
    item.termos.some((termo) => texto.includes(normalizar(termo)))
  )

  return encontrada ? encontrada.img : ''
}
