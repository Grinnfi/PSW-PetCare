// ══════════════════════════════════════════════
// Toast.jsx — Notificação flutuante
// Props: msg (texto), type (success|error|info), visible (boolean)
// ══════════════════════════════════════════════

export default function Toast({ msg, type, visible }) {
  return (
    <div className={`toast ${type} ${visible ? 'show' : ''}`}>
      {msg}
    </div>
  )
}
