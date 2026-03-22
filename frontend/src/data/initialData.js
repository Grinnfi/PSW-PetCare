// ══════════════════════════════════════════════
// Dados iniciais da aplicação (variáveis locais)
// Futuramente virão de uma API/banco de dados
// ══════════════════════════════════════════════

export const INITIAL_USERS = [
  { email: 'admin@petcare.com', password: 'admin123', name: 'Administrador', role: 'admin' },
  { email: 'carlos@email.com',  password: '123456',   name: 'Carlos',        role: 'user'  },
]

export const INITIAL_PETS = [
  { id: 1, name: 'Mel',  especie: 'Cachorro', raca: 'Poodle',          sexo: 'Fêmea', idade: '3 anos', dono: 'Carlos', obs: '' },
  { id: 2, name: 'Thor', especie: 'Cachorro', raca: 'Golden Retriever', sexo: 'Macho', idade: '5 anos', dono: 'Carlos', obs: 'Alergia a frango' },
]

export const INITIAL_PRODUCTS = [
  { id: 1,  name: 'Ração Premium Cão Adulto 15kg', unit: 'saco',    cat: 'Alimentação', price: 89.90, stock: 45, desc: 'Ração premium para cães adultos.' },
  { id: 2,  name: 'Ração Premium Gato 3kg',         unit: 'saco',    cat: 'Alimentação', price: 65.00, stock: 30, desc: 'Ração completa para gatos.' },
  { id: 3,  name: 'Shampoo Pet Neutro 500ml',        unit: 'frasco',  cat: 'Higiene',     price: 28.90, stock: 60, desc: 'Shampoo neutro.' },
  { id: 4,  name: 'Coleira Antipulgas',              unit: 'unidade', cat: 'Saúde',       price: 45.00, stock: 25, desc: 'Coleira antiparasitária.' },
  { id: 5,  name: 'Brinquedo Mordedor',              unit: 'unidade', cat: 'Acessórios',  price: 19.90, stock: 80, desc: 'Brinquedo de borracha.' },
  { id: 6,  name: 'Cama Pet Grande',                 unit: 'unidade', cat: 'Acessórios',  price: 120.00, stock: 12, desc: 'Cama acolchoada.' },
  { id: 7,  name: 'Areia Higiênica Gato 4kg',        unit: 'pacote',  cat: 'Higiene',     price: 35.00, stock: 40, desc: 'Areia granulada.' },
  { id: 8,  name: 'Vacina Antirrábica',              unit: 'dose',    cat: 'Saúde',       price: 55.00, stock: 20, desc: 'Vacina antirrábica.' },
  { id: 9,  name: 'Comedouro Inox M',                unit: 'unidade', cat: 'Acessórios',  price: 32.00, stock: 35, desc: 'Comedouro de aço inox.' },
  { id: 10, name: 'Antipulgas Spray 200ml',          unit: 'frasco',  cat: 'Higiene',     price: 38.50, stock: 5,  desc: 'Spray antipulgas.' },
  { id: 11, name: 'Osso Mastigável Natural',         unit: 'unidade', cat: 'Alimentação', price: 12.00, stock: 90, desc: 'Osso natural.' },
  { id: 12, name: 'Vitaminas Pet Comprimido',        unit: 'pote',    cat: 'Saúde',       price: 48.00, stock: 0,  desc: 'Suplemento vitamínico.' },
]

// Limite para considerar estoque "baixo"
export const LOW_THRESHOLD = 10
