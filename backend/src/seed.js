import 'dotenv/config'
import mongoose from 'mongoose'
import { User, Pet, Agendamento, Compra, Product } from './models/index.js'

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/petcare'

const users = [
  { name: 'Administrador', email: 'admin@petcare.com', password: 'admin123', role: 'admin' },
  { name: 'Carlos',        email: 'carlos@email.com',  password: '123456',   role: 'user'  },
  { name: 'Ana Lima',      email: 'ana@email.com',     password: '123456',   role: 'user'  },
]

const products = [
  { name: 'Ração Premium Cão Adulto 15kg', unit: 'saco',    cat: 'Alimentação', price: 89.9, stock: 45, desc: 'Ração premium para cães adultos.',  emoji: '🦴' },
  { name: 'Ração Premium Gato 3kg',        unit: 'saco',    cat: 'Alimentação', price: 65,   stock: 30, desc: 'Ração completa para gatos.',          emoji: '🐱' },
  { name: 'Shampoo Pet Neutro 500ml',      unit: 'frasco',  cat: 'Higiene',     price: 28.9, stock: 60, desc: 'Shampoo neutro.',                     emoji: '🛁' },
  { name: 'Coleira Antipulgas',            unit: 'unidade', cat: 'Saúde',       price: 45,   stock: 25, desc: 'Coleira antiparasitária.',             emoji: '🏷️' },
  { name: 'Brinquedo Mordedor',            unit: 'unidade', cat: 'Acessórios',  price: 19.9, stock: 80, desc: 'Brinquedo de borracha.',               emoji: '🎾' },
  { name: 'Cama Pet Grande',               unit: 'unidade', cat: 'Acessórios',  price: 120,  stock: 12, desc: 'Cama acolchoada.',                    emoji: '🛏️' },
  { name: 'Areia Higiênica Gato 4kg',      unit: 'pacote',  cat: 'Higiene',     price: 35,   stock: 40, desc: 'Areia granulada.',                    emoji: '🪣' },
  { name: 'Vacina Antirrábica',            unit: 'dose',    cat: 'Saúde',       price: 55,   stock: 20, desc: 'Vacina antirrábica.',                 emoji: '💉' },
  { name: 'Comedouro Inox M',              unit: 'unidade', cat: 'Acessórios',  price: 32,   stock: 35, desc: 'Comedouro de aço inox.',              emoji: '🥣' },
  { name: 'Antipulgas Spray 200ml',        unit: 'frasco',  cat: 'Higiene',     price: 38.5, stock: 5,  desc: 'Spray antipulgas.',                   emoji: '🧴' },
  { name: 'Osso Mastigável Natural',       unit: 'unidade', cat: 'Alimentação', price: 12,   stock: 90, desc: 'Osso natural.',                       emoji: '🦴' },
  { name: 'Vitaminas Pet Comprimido',      unit: 'pote',    cat: 'Saúde',       price: 48,   stock: 0,  desc: 'Suplemento vitamínico.',              emoji: '💊' },
]

async function seed() {
  await mongoose.connect(MONGO_URI)
  console.log('✅ MongoDB conectado!')

  // Limpa tudo antes de inserir
  await Promise.all([
    User.deleteMany({}),
    Pet.deleteMany({}),
    Agendamento.deleteMany({}),
    Compra.deleteMany({}),
    Product.deleteMany({}),
  ])
  console.log('🗑️  Coleções limpas.')

  // Insere usuários e guarda os IDs gerados
  const [admin, carlos, ana] = await User.insertMany(users)
  console.log('👤 Usuários inseridos.')

  // Insere pets usando os _id reais dos usuários
  const [mel, thor, luna] = await Pet.insertMany([
    { name: 'Mel',  especie: 'Cachorro', raca: 'Poodle',           sexo: 'Fêmea', idade: '3 anos', donoId: carlos._id, donoNome: carlos.name, obs: '' },
    { name: 'Thor', especie: 'Cachorro', raca: 'Golden Retriever',  sexo: 'Macho', idade: '5 anos', donoId: carlos._id, donoNome: carlos.name, obs: 'Alergia a frango' },
    { name: 'Luna', especie: 'Gato',     raca: 'Siamês',            sexo: 'Fêmea', idade: '2 anos', donoId: ana._id,    donoNome: ana.name,    obs: '' },
  ])
  console.log('🐾 Pets inseridos.')

  // Insere agendamentos
  await Agendamento.insertMany([
    { petId: mel._id,  petNome: mel.name,  petEspecie: mel.especie,  donoId: carlos._id, donoNome: carlos.name, servico: 'Banho & Tosa',           data: '2026-03-17', hora: '10:00', status: 'concluido' },
    { petId: thor._id, petNome: thor.name, petEspecie: thor.especie, donoId: carlos._id, donoNome: carlos.name, servico: 'Consulta Veterinária',    data: '2026-03-19', hora: '14:30', status: 'concluido' },
    { petId: luna._id, petNome: luna.name, petEspecie: luna.especie, donoId: ana._id,    donoNome: ana.name,    servico: 'Vacinação',               data: '2026-05-10', hora: '09:00', status: 'pendente'  },
    { petId: mel._id,  petNome: mel.name,  petEspecie: mel.especie,  donoId: carlos._id, donoNome: carlos.name, servico: 'Hotel Pet',               data: '2026-05-20', hora: '08:00', status: 'pendente'  },
  ])
  console.log('📅 Agendamentos inseridos.')

  // Insere compras
  await Compra.insertMany([
    {
      donoId: carlos._id, donoNome: carlos.name,
      itens: [
        { nome: 'Ração Premium Cão Adulto 15kg', qtd: 1, preco: 89.9 },
        { nome: 'Shampoo Pet Neutro 500ml',      qtd: 1, preco: 28.9 },
        { nome: 'Coleira Antipulgas',            qtd: 1, preco: 45   },
      ],
      total: 163.8, data: '2026-02-28', status: 'entregue',
    },
    {
      donoId: ana._id, donoNome: ana.name,
      itens: [{ nome: 'Areia Higiênica Gato 4kg', qtd: 2, preco: 35 }],
      total: 70, data: '2026-03-05', status: 'entregue',
    },
    {
      donoId: admin._id, donoNome: admin.name,
      itens: [{ nome: 'Ração Premium Cão 15kg', qtd: 2, preco: 85.9 }],
      total: 171.8, data: '2026-04-26', status: 'entregue',
    },
  ])
  console.log('🛒 Compras inseridas.')

  // Insere produtos
  await Product.insertMany(products)
  console.log('📦 Produtos inseridos.')

  console.log('\n🎉 Seed concluído! Banco populado com sucesso.')
  await mongoose.disconnect()
  process.exit(0)
}

seed().catch(err => {
  console.error('❌ Erro no seed:', err.message)
  process.exit(1)
})