// ══════════════════════════════════════════════
// App.jsx — Componente raiz
// Contém: estado global, React Router, rotas protegidas
// ══════════════════════════════════════════════

import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Header       from './components/Header'
import Toast        from './components/Toast'
import Carrinho     from './components/Carrinho'   // ← NOVO
import Home         from './pages/Home'
import Dashboard    from './pages/Dashboard'
import CadastrarPet from './pages/CadastrarPet'
import Agendar      from './pages/Agendar'
import Historico    from './pages/Historico'
import Loja         from './pages/Loja'
import Estoque      from './pages/Estoque'

import { INITIAL_USERS, INITIAL_PETS, INITIAL_PRODUCTS } from './data/initialData'

// ── Componente auxiliar: Rota Protegida ─────────────
function RotaProtegida({ currentUser, adminOnly = false, children }) {
  if (!currentUser) return <Navigate to="/" replace />
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// ── Conteúdo principal do App ────────────────────────
function AppContent() {
  const navigate = useNavigate()

  // ── Estado global ──
  const [users, setUsers]             = useState(INITIAL_USERS)
  const [currentUser, setCurrentUser] = useState(null)
  const [pets, setPets]               = useState(INITIAL_PETS)
  const [products, setProducts]       = useState(INITIAL_PRODUCTS)

  // ── Estado do carrinho ──                          // ← NOVO
  const [itensCarrinho, setItensCarrinho] = useState([])
  const [carrinhoAberto, setCarrinhoAberto] = useState(false)

  // ── Toast ──
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false })

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }, [])

  // ── Login / Logout / Cadastro ──
  const handleLogin = useCallback((user) => {
    setCurrentUser(user)
    showToast(`Bem-vindo, ${user.name}!`, 'success')
    navigate('/dashboard')
  }, [showToast, navigate])

  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    showToast('Sessão encerrada.', 'info')
    navigate('/')
  }, [showToast, navigate])

  const handleRegister = useCallback((novoUsuario) => {
    setUsers(prev => [...prev, novoUsuario])
  }, [])

  // ── Adicionar ao carrinho ──                       // ← ATUALIZADO
  // Recebe o objeto produto completo { id, nome, preco, emoji }
  const addToCart = useCallback((produto) => {
    setItensCarrinho(prev => {
      const existe = prev.find(i => i.id === produto.id)
      if (existe) {
        // Produto já está no carrinho: incrementa quantidade
        return prev.map(i => i.id === produto.id ? { ...i, qtd: i.qtd + 1 } : i)
      }
      // Produto novo: adiciona com qtd 1
      return [...prev, { ...produto, qtd: 1 }]
    })
    showToast(`"${produto.nome}" adicionado ao carrinho! 🛒`, 'success')
  }, [showToast])

  // Quantidade total de itens (para o badge do Header)
  const cartCount = itensCarrinho.reduce((a, i) => a + i.qtd, 0)

  return (
    <>
      {/* Cabeçalho */}
      <Header
        currentUser={currentUser}
        cartCount={cartCount}
        users={users}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
        showToast={showToast}
        onCartClick={() => setCarrinhoAberto(true)}   // ← NOVO
      />

      {/* Drawer do carrinho */}
      <Carrinho                                        // ← NOVO
        itens={itensCarrinho}
        setItens={setItensCarrinho}
        isOpen={carrinhoAberto}
        onClose={() => setCarrinhoAberto(false)}
        showToast={showToast}
      />

      {/* Rotas */}
      <Routes>
        <Route path="/" element={
          <Home addToCart={addToCart} currentUser={currentUser} showToast={showToast} />
        } />
        <Route path="/loja" element={
          <Loja addToCart={addToCart} />
        } />

        <Route path="/dashboard" element={
          <RotaProtegida currentUser={currentUser}>
            <Dashboard currentUser={currentUser} pets={pets} />
          </RotaProtegida>
        } />
        <Route path="/cadastrar" element={
          <RotaProtegida currentUser={currentUser}>
            <CadastrarPet pets={pets} setPets={setPets} showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="/agendar" element={
          <RotaProtegida currentUser={currentUser}>
            <Agendar pets={pets} showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="/historico" element={
          <RotaProtegida currentUser={currentUser}>
            <Historico />
          </RotaProtegida>
        } />
        <Route path="/estoque" element={
          <RotaProtegida currentUser={currentUser} adminOnly>
            <Estoque products={products} setProducts={setProducts} showToast={showToast} />
          </RotaProtegida>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast global */}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
