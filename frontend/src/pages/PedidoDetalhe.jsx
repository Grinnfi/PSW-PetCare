import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { authHeader } from '../utils/api.js'

const API = 'http://localhost:3001'

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
const fmtData = (d) => {
  if (!d) return ''
  const [a, m, dia] = d.split('-')
  return `${dia}/${m}/${a}`
}

const STATUS_INFO = {
  entregue:  { label: 'Pedido entregue',   cls: 'done'   },
  pendente:  { label: 'Pedido pendente',   cls: 'pend'   },
  cancelado: { label: 'Pedido cancelado',  cls: 'cancel' },
}

export default function PedidoDetalhe() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const compraNaLista = useSelector(s => s.compras.list.find(c => c._id === id))
  const [compraApi, setCompraApi] = useState(null)
  const [carregando, setCarregando] = useState(false)
  const [erro, setErro] = useState(false)

  useEffect(() => {
    if (compraNaLista) return
    setCarregando(true)
    setErro(false)
    fetch(`${API}/compras/${id}`, { headers: { ...authHeader() } })
      .then(res => { if (!res.ok) throw new Error('not found'); return res.json() })
      .then(data => setCompraApi(data))
      .catch(() => setErro(true))
      .finally(() => setCarregando(false))
  }, [id, compraNaLista])

  const compra = compraNaLista || compraApi

  if (carregando) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--muted)' }}>
        Carregando pedido...
      </div>
    )
  }

  if (erro || !compra) {
    return (
      <div className="page" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🔍</div>
        <h2 style={{ marginBottom: 8 }}>Pedido não encontrado</h2>
        <button className="btn-primary" onClick={() => navigate('/historico')}>Voltar ao histórico</button>
      </div>
    )
  }

  const st = STATUS_INFO[compra.status] || { label: compra.status, cls: 'pend' }
  const temEndereco = compra.endereco && (compra.endereco.rua || compra.endereco.cep)
  const formaPagamentoLabel = {
    credito: 'Cartão de Crédito',
    debito:  'Cartão de Débito',
    pix:     'Pix',
    boleto:  'Boleto',
  }[compra.pagamento?.forma] || 'Não informado'

  return (
    <div id="page-pedido-detalhe" className="page">

      <div className="breadcrumb">
        <span onClick={() => navigate('/')}>Início</span>
        <span className="bc-sep">›</span>
        <span onClick={() => navigate('/historico')}>Histórico</span>
        <span className="bc-sep">›</span>
        <span className="bc-current">Pedido #{String(compra._id).slice(-6)}</span>
      </div>

      <div className={`pedido-status-banner ${st.cls}`}>
        {st.label}
      </div>

      <div className="pedido-grid">

        <div className="pedido-col-principal">
          <div className="form-card">
            <h3 className="checkout-section-title">🛒 Itens do Pedido</h3>
            <div className="compra-itens-list">
              {(compra.itens || []).map((item, i) => (
                <div key={i} className="compra-item-row">
                  <span className="compra-item-nome">
                    {item.produtoId ? (
                      <span className="link-produto" onClick={() => navigate(`/produto/${item.produtoId}`)}>
                        {item.nome}
                      </span>
                    ) : item.nome}
                  </span>
                  <span className="compra-item-qtd">{item.qtd}x {fmt(item.preco)}</span>
                  <span className="compra-item-subtotal">{fmt(item.qtd * item.preco)}</span>
                </div>
              ))}
            </div>
            <div className="compra-modal-total" style={{ marginTop: 16 }}>
              <span>Total do Pedido</span>
              <span>{fmt(compra.total)}</span>
            </div>
          </div>

          <div className="form-card" style={{ marginTop: 20 }}>
            <h3 className="checkout-section-title">📍 Endereço de Entrega</h3>
            {temEndereco ? (
              <div className="pedido-endereco">
                <p>{compra.endereco.rua}, {compra.endereco.numero}{compra.endereco.complemento && ` · ${compra.endereco.complemento}`}</p>
                <p className="muted">{compra.endereco.bairro && `${compra.endereco.bairro} · `}{compra.endereco.cidade} – {compra.endereco.estado} · CEP {compra.endereco.cep}</p>
              </div>
            ) : (
              <p className="muted">Endereço não registrado para este pedido.</p>
            )}
          </div>
        </div>

        <div className="pedido-col-lateral">
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Informações do Pedido</h3>
            </div>
            <div style={{ padding: '16px 22px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div className="pedido-info-row"><span>Número</span><strong>#{String(compra._id).slice(-6)}</strong></div>
              <div className="pedido-info-row"><span>Data</span><strong>{fmtData(compra.data)}</strong></div>
              <div className="pedido-info-row"><span>Comprador</span><strong>{compra.donoNome}</strong></div>
              <div className="pedido-info-row col"><span>Pagamento</span><strong>{formaPagamentoLabel}{compra.pagamento?.nomCartao && ` · ${compra.pagamento.nomCartao}`}</strong></div>
            </div>
          </div>

          <button className="btn-cancel-form" style={{ width: '100%', marginTop: 16 }} onClick={() => navigate('/historico')}>
            ← Voltar ao Histórico
          </button>
        </div>

      </div>
    </div>
  )
}