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

export default function Header({ currentUser, cartCount, users, onLogin, onLogout, onRegister, showToast, onCartClick }) {
  const navigate = useNavigate()

  const [loginOpen, setLoginOpen]       = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)

  const closeAll = () => {
    setLoginOpen(false)
    setUserMenuOpen(false)
  }

  const handleLoginBtn = () => {
    if (currentUser) {
      setUserMenuOpen(o => !o)
      setLoginOpen(false)
    } else {
      setLoginOpen(o => !o)
      setUserMenuOpen(false)
    }
  }

  const goTo = (path) => {
    navigate(path)
    closeAll()
    setMobileOpen(false)
  }

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
      {(loginOpen || userMenuOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 400 }}
          onClick={closeAll}
        />
      )}

      <header>
        <div className="nav-top">

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

          <button
            className={`hamburger ${mobileOpen ? 'open' : ''}`}
            onClick={() => setMobileOpen(o => !o)}
          >
            <span /><span /><span />
          </button>

          <div className="search-bar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="O que está buscando hoje?" autoComplete="off" />
          </div>

          <div className="nav-actions">
            <button className="nav-btn" onClick={requireLogin}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.37"/>
              </svg>
              <span>Repetir pedido</span>
            </button>

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

              {!currentUser && (
                <LoginDropdown
                  isOpen={loginOpen}
                  onClose={() => setLoginOpen(false)}
                  users={users}
                  onLogin={onLogin}
                  onRegister={onRegister}
                />
              )}

              {currentUser && (
                <UserMenu
                  isOpen={userMenuOpen}
                  onClose={() => setUserMenuOpen(false)}
                  onLogout={() => { onLogout(); setUserMenuOpen(false) }}
                  goTo={goTo}
                />
              )}
            </div>

            <button className="cart-btn" onClick={onCartClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </button>
          </div>
        </div>

        <div className="nav-bottom">
          <div className="nav-cats">
            {CATEGORIAS.map(cat => (
              <button key={cat} className="nav-cat" onClick={() => goTo(`/loja?categoria=${encodeURIComponent(cat)}`)}>{cat}</button>
            ))}
            <button className="nav-cat promo" onClick={() => goTo('/loja')}>🏷️ Promoções</button>
          </div>

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

      <div className="mobile-search" style={{ position: 'relative' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input type="text" placeholder="O que está buscando hoje?" autoComplete="off" />
      </div>

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

