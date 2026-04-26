// ══════════════════════════════════════════════
// App.jsx — Componente raiz com Redux
// ══════════════════════════════════════════════

import { useEffect, useState, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import Header       from './components/Header'
import Toast        from './components/Toast'
import Carrinho     from './components/Carrinho'
import Checkout     from './pages/Checkout'
import Home         from './pages/Home'
import Dashboard    from './pages/Dashboard'
import CadastrarPet from './pages/CadastrarPet'
import Agendar      from './pages/Agendar'
import Historico    from './pages/Historico'
import Loja         from './pages/Loja'
import Estoque      from './pages/Estoque'

import { fetchUsers, login, logout, registerUser } from './store/authSlice'
import { fetchPets }          from './store/petsSlice'
import { fetchAgendamentos }  from './store/agendamentosSlice'
import { fetchCompras }       from './store/comprasSlice'
import { fetchProducts }      from './store/productsSlice'
import { addItem, abrirCarrinho, fecharCarrinho } from './store/carrinhoSlice'

function RotaProtegida({ currentUser, adminOnly = false, children }) {
  if (!currentUser) return <Navigate to="/" replace />
  if (adminOnly && currentUser.role !== 'admin') return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  // Seletores Redux
  const currentUser = useSelector(s => s.auth.currentUser)
  const users       = useSelector(s => s.auth.users)
  const carrinhoAberto = useSelector(s => s.carrinho.aberto)

  // Toast local (não precisa ser global no Redux para este caso)
  const [toast, setToast] = useState({ msg: '', type: 'success', visible: false })

  const showToast = useCallback((msg, type = 'success') => {
    setToast({ msg, type, visible: true })
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 3000)
  }, [])

  // Carrega dados do backend ao iniciar
  useEffect(() => {
    dispatch(fetchUsers())
    dispatch(fetchPets())
    dispatch(fetchAgendamentos())
    dispatch(fetchCompras())
    dispatch(fetchProducts())
  }, [dispatch])

  // ── Login ──
  const handleLogin = useCallback((user) => {
    dispatch(login(user))
    showToast(`Bem-vindo, ${user.name}!`, 'success')
    navigate('/dashboard')
  }, [dispatch, showToast, navigate])

  // ── Logout ──
  const handleLogout = useCallback(() => {
    dispatch(logout())
    showToast('Sessão encerrada.', 'info')
    navigate('/')
  }, [dispatch, showToast, navigate])

  // ── Cadastro ──
  const handleRegister = useCallback(async (novoUsuario) => {
    const result = await dispatch(registerUser(novoUsuario))
    return result
  }, [dispatch])

  // ── Carrinho ──
  const addToCart = useCallback((produto) => {
    dispatch(addItem(produto))
    showToast(`"${produto.name || produto.nome}" adicionado ao carrinho! 🛒`, 'success')
  }, [dispatch, showToast])

  const cartCount = useSelector(s => s.carrinho.itens.reduce((a, i) => a + i.qtd, 0))

  return (
    <>
      <Header
        currentUser={currentUser}
        cartCount={cartCount}
        users={users}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onRegister={handleRegister}
        showToast={showToast}
        onCartClick={() => dispatch(abrirCarrinho())}
      />

      <Carrinho
        isOpen={carrinhoAberto}
        onClose={() => dispatch(fecharCarrinho())}
        showToast={showToast}
      />

      <Routes>
        <Route path="/" element={
          <Home addToCart={addToCart} currentUser={currentUser} showToast={showToast} />
        } />
        <Route path="/loja" element={
          <Loja addToCart={addToCart} />
        } />
        <Route path="/checkout" element={
          <Checkout showToast={showToast} />
        } />
        <Route path="/dashboard" element={
          <RotaProtegida currentUser={currentUser}>
            <Dashboard currentUser={currentUser} showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="/cadastrar" element={
          <RotaProtegida currentUser={currentUser}>
            <CadastrarPet showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="/agendar" element={
          <RotaProtegida currentUser={currentUser}>
            <Agendar showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="/historico" element={
          <RotaProtegida currentUser={currentUser}>
            <Historico />
          </RotaProtegida>
        } />
        <Route path="/estoque" element={
          <RotaProtegida currentUser={currentUser} adminOnly>
            <Estoque showToast={showToast} />
          </RotaProtegida>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

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
