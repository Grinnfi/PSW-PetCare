// ══════════════════════════════════════════════
// UserMenu.jsx — Menu dropdown do usuário logado
// Props: isOpen, onClose, onLogout, goTo
// ══════════════════════════════════════════════

export default function UserMenu({ isOpen, onClose, onLogout, goTo }) {
  const handleNav = (path) => {
    goTo(path)
    onClose()
  }

  return (
    <div className={`user-menu ${isOpen ? 'open' : ''}`}>
      <button className="user-menu-item" onClick={() => handleNav('/dashboard')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        Dashboard
      </button>
      <button className="user-menu-item" onClick={() => handleNav('/cadastrar')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        Meus Pets
      </button>
      <button className="user-menu-item" onClick={() => handleNav('/agendar')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
        Agendamentos
      </button>
      <div className="user-menu-sep" />
      <button className="user-menu-item danger" onClick={onLogout}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sair da conta
      </button>
    </div>
  )
}
