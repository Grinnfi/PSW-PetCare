// ══════════════════════════════════════════════
// MobileMenu.jsx — Menu lateral deslizante (mobile)
// Props: isOpen, onClose, currentUser, goTo, onLogout, onLoginClick
// ══════════════════════════════════════════════

export default function MobileMenu({ isOpen, onClose, currentUser, goTo, onLogout, onLoginClick }) {
  const handleNav = (path) => {
    goTo(path)
    onClose()
  }

  const isAdmin = currentUser?.role === 'admin'

  return (
    <nav className={`mobile-menu ${isOpen ? 'open' : ''}`}>
      {/* Cabeçalho do menu */}
      <div className="mobile-menu-header">
        <div className="logo-wrap" onClick={() => handleNav('/')}>
          <div className="logo-paw">
            <svg viewBox="0 0 40 40" fill="#fff">
              <ellipse cx="14" cy="8" rx="4" ry="5.5" transform="rotate(-20 14 8)"/>
              <ellipse cx="26" cy="8" rx="4" ry="5.5" transform="rotate(20 26 8)"/>
              <ellipse cx="8" cy="19" rx="3.2" ry="4.5" transform="rotate(-15 8 19)"/>
              <ellipse cx="32" cy="19" rx="3.2" ry="4.5" transform="rotate(15 32 19)"/>
              <ellipse cx="20" cy="28" rx="9" ry="7"/>
            </svg>
          </div>
          <span className="logo-name">PetCare</span>
        </div>
        <button className="mobile-menu-close" onClick={onClose}>✕</button>
      </div>

      {/* Categorias */}
      <div className="mobile-nav-section">Categorias</div>
      {['🐶 Cachorros','🐱 Gatos','🐦 Pássaros','🐟 Peixes','🐰 Outros Pets','🌿 Casa e Jardim'].map(cat => (
        <button key={cat} className="mobile-nav-item" onClick={() => handleNav('/loja')}>{cat}</button>
      ))}
      <button className="mobile-nav-item promo" onClick={() => handleNav('/loja')}>🏷️ Promoções</button>

      {/* Minha Conta */}
      <div className="mobile-nav-section">Minha Conta</div>

      <button className="mobile-nav-item" onClick={() => handleNav('/loja')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
          <line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
        </svg>
        Loja
      </button>

      {currentUser && (
        <>
          <button className="mobile-nav-item" onClick={() => handleNav('/dashboard')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          <button className="mobile-nav-item" onClick={() => handleNav('/cadastrar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
            Meus Pets
          </button>
          <button className="mobile-nav-item" onClick={() => handleNav('/agendar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Agendar Serviço
          </button>
          <button className="mobile-nav-item" onClick={() => handleNav('/historico')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            Histórico
          </button>
        </>
      )}

      {/* Administração (apenas admin) */}
      {isAdmin && (
        <>
          <div className="mobile-nav-section">Administração</div>
          <button className="mobile-nav-item admin-item" onClick={() => handleNav('/estoque')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
            </svg>
            Gestão de Estoque
          </button>
        </>
      )}

      {/* Botão de login/logout no rodapé */}
      <div style={{ marginTop: 'auto', padding: '16px 20px', borderTop: '1px solid var(--border)' }}>
        {currentUser ? (
          <button
            onClick={() => { onLogout(); onClose() }}
            style={{
              width: '100%', padding: '12px', background: 'var(--red-bg)',
              color: 'var(--red)', border: 'none', borderRadius: 'var(--r-sm)',
              fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Sair da conta
          </button>
        ) : (
          <button
            onClick={() => { onClose(); onLoginClick() }}
            style={{
              width: '100%', padding: '14px', background: 'var(--p-light)',
              color: 'var(--p)', border: 'none', borderRadius: 'var(--r-sm)',
              fontWeight: 700, fontSize: '.875rem', cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            }}
          >
            <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Entrar
          </button>
        )}
      </div>
    </nav>
  )
}
