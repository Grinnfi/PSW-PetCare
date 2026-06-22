import { useNavigate } from 'react-router-dom'

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
const fmtData = (d) => {
  if (!d) return ''
  const [a, m, dia] = d.split('-')
  return `${dia}/${m}/${a}`
}

const STATUS_LABEL = {
  pendente:  'Pendente',
  entregue:  'Entregue',
  cancelado: 'Cancelado',
}

export default function ModalDetalheCompra({ isOpen, onClose, compra }) {
  const navigate = useNavigate()

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose()
  }

  if (!compra) return null

  const irParaDetalheCompleto = () => {
    onClose()
    navigate(`/pedido/${compra._id}`)
  }

  return (
    <div className={`overlay ${isOpen ? 'open' : ''}`} onClick={handleOverlayClick}>
      <div className="modal compra-modal">

        <div className="modal-head">
          <h3>Pedido #{String(compra._id).slice(-6)}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="compra-modal-meta">
          <div><span>Data</span><strong>{fmtData(compra.data)}</strong></div>
          <div><span>Status</span><strong>{STATUS_LABEL[compra.status] || compra.status}</strong></div>
          <div><span>Itens</span><strong>{compra.itens?.length || 0}</strong></div>
        </div>

        <div className="compra-itens-list">
          {(compra.itens || []).map((item, i) => (
            <div key={i} className="compra-item-row">
              <span className="compra-item-nome">{item.nome}</span>
              <span className="compra-item-qtd">{item.qtd}x {fmt(item.preco)}</span>
              <span className="compra-item-subtotal">{fmt(item.qtd * item.preco)}</span>
            </div>
          ))}
        </div>

        <div className="compra-modal-total">
          <span>Total</span>
          <span>{fmt(compra.total)}</span>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel-modal" onClick={onClose}>Fechar</button>
          <button className="btn-submit-modal" onClick={irParaDetalheCompleto}>Ver detalhes completos →</button>
        </div>

      </div>
    </div>
  )
}