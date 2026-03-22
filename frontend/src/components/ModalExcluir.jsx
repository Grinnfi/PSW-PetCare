// ══════════════════════════════════════════════
// ModalExcluir.jsx — Modal de confirmação de exclusão
// Props: isOpen, onClose, onConfirm, nomeProduto
// ══════════════════════════════════════════════

export default function ModalExcluir({ isOpen, onClose, onConfirm, nomeProduto }) {
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="delete-modal">

        <div className="del-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </div>

        <div className="del-title">Remover Produto?</div>
        <div className="del-desc">
          Tem certeza que deseja remover{' '}
          <strong>"{nomeProduto}"</strong>?{' '}
          Esta ação não pode ser desfeita.
        </div>

        <div className="del-actions">
          <button className="btn-cancel-modal" onClick={onClose}>Cancelar</button>
          <button className="btn-danger" onClick={onConfirm}>Remover</button>
        </div>

      </div>
    </div>
  )
}
