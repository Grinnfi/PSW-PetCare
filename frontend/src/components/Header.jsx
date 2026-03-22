// ══════════════════════════════════════════════
// Header.jsx — Cabeçalho principal
// Composto por: nav-top, nav-bottom, LoginDropdown,
//               UserMenu e MobileMenu
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LoginDropdown from './LoginDropdown'
import UserMenu      from './UserMenu'
import MobileMenu    from './MobileMenu'

export default function Header({ currentUser, cartCount, users, onLogin, onLogout, onRegister, showToast }) {
  const navigate = useNavigate()

  // Estado de visibilidade dos menus
  const [loginOpen, setLoginOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Fecha todos os menus
  const closeAll = () => {
    setLoginOpen(false)
    setUserMenuOpen(false)
  }

  // Alterna login dropdown ou user menu dependendo do estado de login
  const handleLoginBtn = () => {
    if (currentUser) {
      setUserMenuOpen(o => !o)
      setLoginOpen(false)
    } else {
      setLoginOpen(o => !o)
      setUserMenuOpen(false)
    }
  }

  // Navega e fecha menus abertos
  const goTo = (path) => {
    navigate(path)
    closeAll()
    setMobileOpen(false)
  }

  // Exige login antes de usar funcionalidade
  const requireLogin = () => {
    if (!currentUser) {
      showToast('Faça login para continuar.', 'info')
      setLoginOpen(true)
    } else {
      showToast('Pedido repetido!', 'success')
    }
  }

  const isAdmin = currentUser?.role === 'admin'

  const CATEGORIAS = ['Cachorros','Gatos','Pássaros','Peixes','Outros Pets','Casa e Jardim']

  return (
    <>
      {/* Overlay invisível para fechar dropdowns ao clicar fora */}
      {(loginOpen || userMenuOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 400 }}
          onClick={closeAll}
        />
      )}

      <header>
        {/* ── Linha superior do nav ── */}
        <div className="nav-top">

          {/* Logo */}
          <div className="logo-wrap" onClick={() => goTo('/')}>
            <div className="logo-paw">
              <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="14" cy="8"  rx="4"   ry="5.5" transform="rotate(-20 14 8)"/>
                <ellipse cx="26" cy="8"  rx="4"   ry="5.5" transform="rotate(20 26 8)"/>
                <ellipse cx="8"  cy="19" rx="3.2" ry="4.5" transform="rotate(-15 8 19)"/>
                <ellipse cx="32" cy="19" rx="3.2" ry="4.5" transform="rotate(15 32 19)"/>
                <ellipse cx="20" cy="28" rx="9"   ry="7"/>
              </svg>
            </div>
            <span className="logo-name">PetCare</span>
          </div>

          {/* Hamburguer (visível só no mobile via CSS) */}
          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span /><span /><span />
          </button>

          {/* Barra de busca (desktop) */}
          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="O que está buscando hoje?" />
          </div>

          {/* Ações do nav */}
          <div className="nav-actions">
            {/* Botão repetir pedido */}
            <button className="nav-btn" onClick={requireLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.37"/>
              </svg>
              <span>Repetir pedido</span>
            </button>

            {/* Botão Entrar / Nome do usuário */}
            <div style={{ position: 'relative' }}>
              <button
                className={`nav-btn ${currentUser ? 'active' : ''}`}
                onClick={handleLoginBtn}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <span>{currentUser ? `${currentUser.name} ▾` : 'Entrar'}</span>
              </button>

              {/* Dropdown de login (só quando não logado) */}
              {!currentUser && (
                <LoginDropdown
                  isOpen={loginOpen}
                  onClose={() => setLoginOpen(false)}
                  users={users}
                  onLogin={onLogin}
                  onRegister={onRegister}
                />
              )}

              {/* Menu do usuário logado */}
              {currentUser && (
                <UserMenu
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={() => { onLogout(); setUserMenuOpen(false) }}
                  goTo={goTo}
                />
              )}
            </div>

            {/* Carrinho */}
            <button className="cart-btn" onClick={() => showToast('Carrinho em breve!', 'info')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>

        {/* ── Linha inferior do nav: categorias + links admin ── */}
        <div className="nav-bottom">
          <div className="nav-cats">
            {CATEGORIAS.map(cat => (
              <button key={cat} className="nav-cat" onClick={() => goTo('/loja')}>{cat}</button>
            ))}
            <button className="nav-cat promo" onClick={() => goTo('/loja')}>🏷️ Promoções</button>
          </div>

          {/* Links de admin (só para role='admin') */}
          {isAdmin && (
            <div className="nav-admin-links">
              <button className="nav-admin-btn" onClick={() => goTo('/dashboard')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                </svg>
                Dashboard
              </button>
              <button className="nav-admin-btn" onClick={() => goTo('/estoque')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
                </svg>
                Estoque
              </button>
              <button className="nav-admin-btn green-btn" onClick={() => goTo('/agendar')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Agendamentos
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Barra de busca mobile (visível só no mobile via CSS) */}
      <div className="mobile-search" style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="O que está buscando hoje?" />
      </div>

      {/* Menu lateral mobile */}
      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        currentUser={currentUser}
        goTo={goTo}
        onLogout={onLogout}
        onLoginClick={() => setLoginOpen(true)}
      />
    </>
  )
}
