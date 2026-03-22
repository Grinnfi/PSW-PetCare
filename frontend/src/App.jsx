// ══════════════════════════════════════════════
// App.jsx — Componente raiz
// Contém: estado global, React Router, rotas protegidas
// ══════════════════════════════════════════════

import { useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'

import Header    from './components/Header'
import Toast     from './components/Toast'
import Home        from './pages/Home'
import Dashboard   from './pages/Dashboard'
import CadastrarPet from './pages/CadastrarPet'
import Agendar     from './pages/Agendar'
import Historico   from './pages/Historico'
import Loja        from './pages/Loja'
import Estoque     from './pages/Estoque'

import { INITIAL_USERS, INITIAL_PETS, INITIAL_PRODUCTS } from './data/initialData'

// ── Componente auxiliar: Rota Protegida ─────────────
// Se não estiver logado → redireciona para Home
// Se adminOnly=true e não for admin → redireciona para Home
function RotaProtegida({ currentUser, adminOnly = false, children }) {
  if (!currentUser) return <Navigate to="/" replace />
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/" replace />
  return children
}

// ── Conteúdo principal do App ────────────────────────
// Separado de App() pois precisa do hook useNavigate,
// que só funciona dentro do BrowserRouter
function AppContent() {
  const navigate = useNavigate()

  // ── Estado global (variáveis locais) ──
  const [users, setUsers]         = useState(INITIAL_USERS)
  const [currentUser, setCurrentUser] = useState(null)
  const [cartCount, setCartCount] = useState(0)
  const [pets, setPets]           = useState(INITIAL_PETS)
  const [products, setProducts]   = useState(INITIAL_PRODUCTS)

  // Estado do Toast (notificação flutuante)
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false })

  // Exibe um toast por 3 segundos
  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }, [])

  // Faz login: salva usuário atual e navega para o dashboard
  const handleLogin = useCallback((user) => {
    setCurrentUser(user)
    showToast(`Bem-vindo, ${user.name}!`, 'success')
    navigate('/dashboard')
  }, [showToast, navigate])

  // Faz logout: limpa usuário e volta para Home
  const handleLogout = useCallback(() => {
    setCurrentUser(null)
    showToast('Sessão encerrada.', 'info')
    navigate('/')
  }, [showToast, navigate])

  // Cadastra novo usuário na lista local
  const handleRegister = useCallback((novoUsuario) => {
    setUsers(prev => [...prev, novoUsuario])
  }, [])

  // Adiciona produto ao carrinho
  const addToCart = useCallback(() => {
    setCartCount(c => c + 1)
    showToast('Produto adicionado ao carrinho!', 'success')
  }, [showToast])

  return (
    <>
      {/* Cabeçalho presente em todas as páginas */}
      <Header
        currentUser={currentUser}
        cartCount={cartCount}
        users={users}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
        showToast={showToast}
      />

      {/* Sistema de rotas (React Router v6) */}
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={
          <Home addToCart={addToCart} currentUser={currentUser} showToast={showToast} />
        } />
        <Route path="/loja" element={
          <Loja addToCart={addToCart} />
        } />

        {/* Rotas protegidas (exigem login) */}
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

        {/* Rota protegida para admin */}
        <Route path="/estoque" element={
          <RotaProtegida currentUser={currentUser} adminOnly>
            <Estoque products={products} setProducts={setProducts} showToast={showToast} />
          </RotaProtegida>
        } />

        {/* Qualquer rota desconhecida → Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Toast global */}
      <Toast msg={toast.msg} type={toast.type} visible={toast.visible} />
    </>
  )
}

// ── Componente raiz exportado ────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
