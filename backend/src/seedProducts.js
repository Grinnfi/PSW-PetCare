import 'dotenv/config'
import mongoose from 'mongoose'
import { Product } from './models/index.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare'

const products = [
  { name: 'Ração Premium Cão 15kg',          unit: 'saco',    cat: 'Alimentação', price: 85.90,  stock: 40, desc: 'Ração premium para cães adultos, com proteínas de alta qualidade.', emoji: '🦴', categoriaPet: 'Cachorros' },
  { name: 'Shampoo Pet Neutro 500ml',        unit: 'frasco',  cat: 'Higiene',     price: 28.90,  stock: 55, desc: 'Shampoo neutro para banho, hidrata e perfuma o pelo.',              emoji: '🐾', categoriaPet: 'Cachorros' },
  { name: 'Brinquedo Mordedor',              unit: 'unidade', cat: 'Acessórios',  price: 19.90,  stock: 70, desc: 'Brinquedo de borracha resistente para mordedura.',                  emoji: '🎾', categoriaPet: 'Cachorros' },
  { name: 'Cama Pet Grande',                 unit: 'unidade', cat: 'Acessórios',  price: 120.00, stock: 15, desc: 'Cama acolchoada confortável para cães de grande porte.',            emoji: '🛏️', categoriaPet: 'Cachorros' },
  { name: 'Antipulgas Spray',                unit: 'frasco',  cat: 'Saúde',       price: 38.50,  stock: 25, desc: 'Spray antipulgas e carrapatos de ação rápida.',                     emoji: '💊', categoriaPet: 'Cachorros' },
  { name: 'Osso Mastigável Natural',         unit: 'unidade', cat: 'Alimentação', price: 12.00,  stock: 90, desc: 'Osso natural para mastigação, ajuda na saúde bucal.',               emoji: '🍖', categoriaPet: 'Cachorros' },
  { name: 'Vitaminas Pet',                   unit: 'pote',    cat: 'Saúde',       price: 48.00,  stock: 30, desc: 'Suplemento vitamínico para fortalecer a imunidade.',                emoji: '🏥', categoriaPet: 'Cachorros' },
  { name: 'Coleira de Passeio M',            unit: 'unidade', cat: 'Acessórios',  price: 35.90,  stock: 40, desc: 'Coleira ajustável tamanho M, confortável para passeios.',           emoji: '🦮', categoriaPet: 'Cachorros' },

  { name: 'Areia Higiênica 4kg',             unit: 'pacote',  cat: 'Higiene',     price: 35.00,  stock: 50, desc: 'Areia granulada de alta absorção, controla odores.',                emoji: '🪨', categoriaPet: 'Gatos' },
  { name: 'Ração Premium Gato 3kg',          unit: 'saco',    cat: 'Alimentação', price: 65.00,  stock: 35, desc: 'Ração completa para gatos adultos.',                                 emoji: '🐱', categoriaPet: 'Gatos' },
  { name: 'Arranhador para Gatos',           unit: 'unidade', cat: 'Acessórios',  price: 75.00,  stock: 18, desc: 'Arranhador em sisal, protege seus móveis.',                          emoji: '🐾', categoriaPet: 'Gatos' },
  { name: 'Brinquedo Varinha com Penas',     unit: 'unidade', cat: 'Acessórios',  price: 16.90,  stock: 60, desc: 'Varinha interativa com penas para estimular o brincar.',            emoji: '🧶', categoriaPet: 'Gatos' },
  { name: 'Caixa de Transporte P',           unit: 'unidade', cat: 'Acessórios',  price: 109.90, stock: 12, desc: 'Caixa de transporte resistente, tamanho pequeno.',                  emoji: '🧳', categoriaPet: 'Gatos' },
  { name: 'Bebedouro Fontanário Gato',       unit: 'unidade', cat: 'Acessórios',  price: 69.90,  stock: 20, desc: 'Fonte de água em movimento, estimula a hidratação.',                emoji: '💧', categoriaPet: 'Gatos' },
  { name: 'Shampoo Especial para Gatos',     unit: 'frasco',  cat: 'Higiene',     price: 29.90,  stock: 40, desc: 'Shampoo suave especialmente formulado para felinos.',               emoji: '🛁', categoriaPet: 'Gatos' },
  { name: 'Snack Cremoso para Gatos 10un',   unit: 'caixa',   cat: 'Alimentação', price: 24.90,  stock: 65, desc: 'Petisco cremoso, sabor irresistível para gatos.',                   emoji: '🍗', categoriaPet: 'Gatos' },

  { name: 'Sementes para Pássaros 500g',     unit: 'pacote',  cat: 'Alimentação', price: 15.90,  stock: 50, desc: 'Mix de sementes nutritivas para aves.',                              emoji: '🌾', categoriaPet: 'Pássaros' },
  { name: 'Gaiola Decorativa M',             unit: 'unidade', cat: 'Acessórios',  price: 149.90, stock: 8,  desc: 'Gaiola decorativa tamanho médio, espaçosa e segura.',               emoji: '🏠', categoriaPet: 'Pássaros' },
  { name: 'Poleiro de Madeira Natural',      unit: 'unidade', cat: 'Acessórios',  price: 27.90,  stock: 30, desc: 'Poleiro em madeira natural, confortável para as patinhas.',         emoji: '🌿', categoriaPet: 'Pássaros' },
  { name: 'Brinquedo Colorido para Aves',    unit: 'unidade', cat: 'Acessórios',  price: 21.90,  stock: 35, desc: 'Brinquedo colorido para estimular as aves.',                        emoji: '🪀', categoriaPet: 'Pássaros' },
  { name: 'Comedouro Duplo para Gaiola',     unit: 'unidade', cat: 'Acessórios',  price: 13.90,  stock: 45, desc: 'Comedouro duplo para água e ração.',                                emoji: '🥣', categoriaPet: 'Pássaros' },
  { name: 'Vitamina para Pássaros 30ml',     unit: 'frasco',  cat: 'Saúde',       price: 19.90,  stock: 28, desc: 'Suplemento vitamínico líquido para aves.',                          emoji: '💊', categoriaPet: 'Pássaros' },
  { name: 'Ração Extrusada para Periquito',  unit: 'pacote',  cat: 'Alimentação', price: 23.90,  stock: 38, desc: 'Ração extrusada balanceada para periquitos.',                       emoji: '🌰', categoriaPet: 'Pássaros' },
  { name: 'Banheira para Pássaros',          unit: 'unidade', cat: 'Acessórios',  price: 16.90,  stock: 22, desc: 'Banheira para higiene das aves.',                                   emoji: '🚿', categoriaPet: 'Pássaros' },

  { name: 'Ração para Peixes Tropicais',     unit: 'pote',    cat: 'Alimentação', price: 22.90,  stock: 45, desc: 'Ração em flocos para peixes tropicais.',                            emoji: '🐠', categoriaPet: 'Peixes' },
  { name: 'Kit Aquário Iniciante',           unit: 'kit',     cat: 'Acessórios',  price: 199.90, stock: 6,  desc: 'Kit completo para começar seu aquário.',                            emoji: '🐟', categoriaPet: 'Peixes' },
  { name: 'Filtro para Aquário 50L',         unit: 'unidade', cat: 'Acessórios',  price: 79.90,  stock: 14, desc: 'Filtro eficiente para aquários de até 50 litros.',                  emoji: '🔄', categoriaPet: 'Peixes' },
  { name: 'Termômetro Digital Aquário',      unit: 'unidade', cat: 'Acessórios',  price: 27.90,  stock: 25, desc: 'Termômetro digital de precisão para aquários.',                     emoji: '🌡️', categoriaPet: 'Peixes' },
  { name: 'Cascalho Natural 2kg',            unit: 'pacote',  cat: 'Acessórios',  price: 16.90,  stock: 30, desc: 'Cascalho natural decorativo para o fundo do aquário.',              emoji: '🪨', categoriaPet: 'Peixes' },
  { name: 'Planta Artificial para Aquário',  unit: 'unidade', cat: 'Acessórios',  price: 13.90,  stock: 40, desc: 'Planta artificial decorativa, fácil manutenção.',                   emoji: '🌱', categoriaPet: 'Peixes' },
  { name: 'Condicionador de Água 120ml',     unit: 'frasco',  cat: 'Saúde',       price: 19.90,  stock: 33, desc: 'Condicionador que neutraliza cloro e metais pesados.',              emoji: '💧', categoriaPet: 'Peixes' },
  { name: 'Rede para Pegar Peixes',          unit: 'unidade', cat: 'Acessórios',  price: 10.90,  stock: 50, desc: 'Rede de malha fina, prática e resistente.',                         emoji: '🕸️', categoriaPet: 'Peixes' },

  { name: 'Feno para Roedores 500g',         unit: 'pacote',  cat: 'Alimentação', price: 13.90,  stock: 40, desc: 'Feno fresco, essencial para a dieta de roedores.',                  emoji: '🌿', categoriaPet: 'Outros Pets' },
  { name: 'Gaiola para Hamster',             unit: 'unidade', cat: 'Acessórios',  price: 99.90,  stock: 10, desc: 'Gaiola espaçosa com acessórios para hamster.',                      emoji: '🏠', categoriaPet: 'Outros Pets' },
  { name: 'Roda de Exercício para Hamster',  unit: 'unidade', cat: 'Acessórios',  price: 27.90,  stock: 25, desc: 'Roda silenciosa para exercícios do hamster.',                       emoji: '⚙️', categoriaPet: 'Outros Pets' },
  { name: 'Ração para Coelhos 1kg',          unit: 'pacote',  cat: 'Alimentação', price: 25.90,  stock: 30, desc: 'Ração balanceada para coelhos.',                                     emoji: '🥕', categoriaPet: 'Outros Pets' },
  { name: 'Serragem para Roedores 500g',     unit: 'pacote',  cat: 'Higiene',     price: 14.90,  stock: 45, desc: 'Serragem absorvente para forração da gaiola.',                      emoji: '🪵', categoriaPet: 'Outros Pets' },
  { name: 'Brinquedo Tubo para Hamster',     unit: 'unidade', cat: 'Acessórios',  price: 21.90,  stock: 28, desc: 'Tubo de conexão para circuito de brincadeiras.',                    emoji: '🧸', categoriaPet: 'Outros Pets' },
  { name: 'Bebedouro para Roedores 250ml',   unit: 'unidade', cat: 'Acessórios',  price: 16.90,  stock: 35, desc: 'Bebedouro tipo bico, evita derramamento.',                          emoji: '💧', categoriaPet: 'Outros Pets' },
  { name: 'Vitamina para Roedores 30ml',     unit: 'frasco',  cat: 'Saúde',       price: 19.90,  stock: 22, desc: 'Suplemento vitamínico para roedores.',                              emoji: '💊', categoriaPet: 'Outros Pets' },

  { name: 'Kit Grama Sintética',             unit: 'kit',     cat: 'Acessórios',  price: 99.90,  stock: 12, desc: 'Grama sintética para área de necessidades do pet.',                 emoji: '🌱', categoriaPet: 'Casa e Jardim' },
  { name: 'Comedouro para Pássaros Jardim',  unit: 'unidade', cat: 'Acessórios',  price: 44.90,  stock: 18, desc: 'Comedouro externo para atrair pássaros ao jardim.',                 emoji: '🌻', categoriaPet: 'Casa e Jardim' },
  { name: 'Casinha de Madeira para Pets',    unit: 'unidade', cat: 'Acessórios',  price: 239.90, stock: 5,  desc: 'Casinha de madeira resistente para área externa.',                  emoji: '🏡', categoriaPet: 'Casa e Jardim' },
  { name: 'Repelente Natural para Jardim',   unit: 'frasco',  cat: 'Higiene',     price: 29.90,  stock: 30, desc: 'Repelente natural, seguro para pets e plantas.',                    emoji: '🌿', categoriaPet: 'Casa e Jardim' },
  { name: 'Tapete Higiênico 30un',           unit: 'pacote',  cat: 'Higiene',     price: 36.90,  stock: 50, desc: 'Tapete higiênico super absorvente, pacote com 30 unidades.',        emoji: '🧻', categoriaPet: 'Casa e Jardim' },
  { name: 'Limpador Enzimático 500ml',       unit: 'frasco',  cat: 'Higiene',     price: 25.90,  stock: 38, desc: 'Limpador enzimático elimina odores e manchas.',                     emoji: '🧴', categoriaPet: 'Casa e Jardim' },
  { name: 'Protetor de Sofá Arranhador',     unit: 'unidade', cat: 'Acessórios',  price: 52.90,  stock: 16, desc: 'Protetor que evita arranhões nos móveis.',                          emoji: '🛋️', categoriaPet: 'Casa e Jardim' },
  { name: 'Cama Pet para Área Externa',      unit: 'unidade', cat: 'Acessórios',  price: 149.90, stock: 9,  desc: 'Cama resistente à água para uso externo.',                          emoji: '🌞', categoriaPet: 'Casa e Jardim' },
]

async function seedProducts() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ MongoDB conectado!')

  await Product.deleteMany({})
  console.log('🗑️  Produtos antigos removidos.')

  await Product.insertMany(products)
  console.log(`📦 ${products.length} produtos inseridos.`)

  console.log('\n🎉 Catálogo atualizado! Usuários, pets, agendamentos e compras não foram alterados.')
  await mongoose.disconnect()
  process.exit(0)
}

seedProducts().catch(err => {
  console.error('❌ Erro no seed de produtos:', err.message)
  process.exit(1)
})