// ══════════════════════════════════════════════
// Checkout.jsx — Página de finalização de compra (Redux)
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { limparCarrinho } from '../store/carrinhoSlice'
import { addCompra } from '../store/comprasSlice'

// ── Helpers ──
const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

// ── Etapas do checkout ──
const ETAPAS = [
  { id: 1, label: 'Dados Pessoais', icon: '👤' },
  { id: 2, label: 'Endereço',       icon: '📍' },
  { id: 3, label: 'Pagamento',      icon: '💳' },
  { id: 4, label: 'Resumo',         icon: '📋' },
]

const FORMAS_PAGAMENTO = [
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'debito',  label: 'Cartão de Débito',  icon: '🏧' },
  { id: 'pix',     label: 'Pix',               icon: '⚡' },
  { id: 'boleto',  label: 'Boleto',            icon: '📄' },
]

export default function Checkout({ showToast }) {
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const itens       = useSelector(s => s.carrinho.itens)
  const currentUser = useSelector(s => s.auth.currentUser)

  // ── Etapa atual ──
  const [etapa, setEtapa] = useState(1)

  // ── Dados pessoais ──
  const [nome,  setNome]  = useState(currentUser?.name  || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [tel,   setTel]   = useState('')

  // ── Endereço ──
  const [cep,         setCep]         = useState('')
  const [rua,         setRua]         = useState('')
  const [numero,      setNumero]      = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro,      setBairro]      = useState('')
  const [cidade,      setCidade]      = useState('')
  const [estado,      setEstado]      = useState('')

  // ── Pagamento ──
  const [formaPag,  setFormaPag]  = useState('credito')
  const [nomCartao, setNomCartao] = useState('')
  const [numCartao, setNumCartao] = useState('')
  const [validade,  setValidade]  = useState('')
  const [cvv,       setCvv]       = useState('')

  // ── Totais ──
  const total = useMemo(() =>
    itens.reduce((acc, item) => acc + (item.price || item.preco || 0) * item.qtd, 0),
    [itens]
  )

  // ── Validação por etapa ──
  const validarEtapa = () => {
    if (etapa === 1) {
      if (!nome.trim())  { showToast('Informe seu nome.', 'error');     return false }
      if (!email.trim()) { showToast('Informe seu e-mail.', 'error');   return false }
      if (!tel.trim())   { showToast('Informe seu telefone.', 'error'); return false }
    }
    if (etapa === 2) {
      if (!cep.trim())    { showToast('Informe o CEP.', 'error');    return false }
      if (!rua.trim())    { showToast('Informe a rua.', 'error');    return false }
      if (!numero.trim()) { showToast('Informe o número.', 'error'); return false }
      if (!cidade.trim()) { showToast('Informe a cidade.', 'error'); return false }
      if (!estado.trim()) { showToast('Informe o estado.', 'error'); return false }
    }
    if (etapa === 3) {
      if ((formaPag === 'credito' || formaPag === 'debito') && !nomCartao.trim()) {
        showToast('Informe o nome no cartão.', 'error'); return false
      }
    }
    return true
  }

  const avancar = () => {
    if (!validarEtapa()) return
    setEtapa(e => e + 1)
  }

  const voltar = () => setEtapa(e => e - 1)

  // ── Finalizar pedido ──
  const finalizarPedido = async () => {
    if (currentUser) {
      await dispatch(addCompra({
        donoId:   currentUser.id,
        donoNome: currentUser.name,
        itens: itens.map(i => ({
          nome:  i.name || i.nome,
          qtd:   i.qtd,
          preco: i.price || i.preco || 0,
        })),
        total,
        data:   new Date().toISOString().split('T')[0],
        status: 'entregue',
      }))
    }
    dispatch(limparCarrinho())
    showToast('Pedido realizado com sucesso! 🎉', 'success')
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div id="page-checkout" className="page">

      <div className="page-header-row">
        <div className="page-htitle">
          <h1>Finalizar Compra</h1>
          <p>Complete as informações para confirmar seu pedido.</p>
        </div>
      </div>

      {/* ── Indicador de etapas ── */}
      <div className="checkout-steps">
        {ETAPAS.map((e, i) => (
          <div key={e.id} className="checkout-step-wrap">
            <div className={`checkout-step ${etapa === e.id ? 'active' : ''} ${etapa > e.id ? 'done' : ''}`}>
              <div className="step-circle">
                {etapa > e.id ? '✓' : e.icon}
              </div>
              <span className="step-label">{e.label}</span>
            </div>
            {i < ETAPAS.length - 1 && (
              <div className={`step-line ${etapa > e.id ? 'done' : ''}`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Conteúdo ── */}
      <div className="checkout-body">

        {/* ── Coluna principal: formulário ── */}
        <div className="checkout-form-col">

          {/* ETAPA 1: Dados Pessoais */}
          {etapa === 1 && (
            <div className="form-card">
              <h3 className="checkout-section-title">👤 Dados Pessoais</h3>
              <div className="fg">
                <label>Nome completo <span>*</span></label>
                <input className="fc" type="text" placeholder="Seu nome"
                  value={nome} onChange={e => setNome(e.target.value)} />
              </div>
              <div className="fg fg-row2">
                <div>
                  <label>E-mail <span>*</span></label>
                  <input className="fc" type="email" placeholder="seu@email.com"
                    value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div>
                  <label>Telefone <span>*</span></label>
                  <input className="fc" type="tel" placeholder="(21) 99999-9999"
                    value={tel} onChange={e => setTel(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 2: Endereço */}
          {etapa === 2 && (
            <div className="form-card">
              <h3 className="checkout-section-title">📍 Endereço de Entrega</h3>
              <div className="fg fg-row2">
                <div>
                  <label>CEP <span>*</span></label>
                  <input className="fc" type="text" placeholder="00000-000"
                    value={cep} onChange={e => setCep(e.target.value)} />
                </div>
                <div>
                  <label>Número <span>*</span></label>
                  <input className="fc" type="text" placeholder="123"
                    value={numero} onChange={e => setNumero(e.target.value)} />
                </div>
              </div>
              <div className="fg">
                <label>Rua <span>*</span></label>
                <input className="fc" type="text" placeholder="Nome da rua"
                  value={rua} onChange={e => setRua(e.target.value)} />
              </div>
              <div className="fg fg-row2">
                <div>
                  <label>Complemento</label>
                  <input className="fc" type="text" placeholder="Apto, bloco..."
                    value={complemento} onChange={e => setComplemento(e.target.value)} />
                </div>
                <div>
                  <label>Bairro</label>
                  <input className="fc" type="text" placeholder="Bairro"
                    value={bairro} onChange={e => setBairro(e.target.value)} />
                </div>
              </div>
              <div className="fg fg-row2">
                <div>
                  <label>Cidade <span>*</span></label>
                  <input className="fc" type="text" placeholder="Cidade"
                    value={cidade} onChange={e => setCidade(e.target.value)} />
                </div>
                <div>
                  <label>Estado <span>*</span></label>
                  <select className="fc" value={estado} onChange={e => setEstado(e.target.value)}>
                    <option value="">Selecione</option>
                    {['AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG',
                      'PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'].map(uf => (
                      <option key={uf}>{uf}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ETAPA 3: Pagamento */}
          {etapa === 3 && (
            <div className="form-card">
              <h3 className="checkout-section-title">💳 Forma de Pagamento</h3>
              <div className="payment-options">
                {FORMAS_PAGAMENTO.map(fp => (
                  <div
                    key={fp.id}
                    className={`payment-option ${formaPag === fp.id ? 'selected' : ''}`}
                    onClick={() => setFormaPag(fp.id)}
                  >
                    <span className="payment-icon">{fp.icon}</span>
                    <span className="payment-label">{fp.label}</span>
                  </div>
                ))}
              </div>

              {(formaPag === 'credito' || formaPag === 'debito') && (
                <>
                  <div className="fg" style={{ marginTop: '20px' }}>
                    <label>Nome no cartão <span>*</span></label>
                    <input className="fc" type="text" placeholder="Como está no cartão"
                      value={nomCartao} onChange={e => setNomCartao(e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Número do cartão</label>
                    <input className="fc" type="text" placeholder="0000 0000 0000 0000"
                      maxLength={19} value={numCartao} onChange={e => setNumCartao(e.target.value)} />
                  </div>
                  <div className="fg fg-row2">
                    <div>
                      <label>Validade</label>
                      <input className="fc" type="text" placeholder="MM/AA"
                        maxLength={5} value={validade} onChange={e => setValidade(e.target.value)} />
                    </div>
                    <div>
                      <label>CVV</label>
                      <input className="fc" type="text" placeholder="000"
                        maxLength={3} value={cvv} onChange={e => setCvv(e.target.value)} />
                    </div>
                  </div>
                </>
              )}

              {formaPag === 'pix' && (
                <div className="pix-info">
                  <div className="pix-qr">⚡</div>
                  <p>Após confirmar, você receberá a chave Pix para pagamento.</p>
                  <div className="pix-chave">Chave: <strong>petcare@petcare.com.br</strong></div>
                </div>
              )}

              {formaPag === 'boleto' && (
                <div className="pix-info">
                  <div className="pix-qr">📄</div>
                  <p>O boleto será gerado após a confirmação do pedido.</p>
                  <div className="pix-chave">Vencimento em <strong>3 dias úteis</strong></div>
                </div>
              )}
            </div>
          )}

          {/* ETAPA 4: Resumo */}
          {etapa === 4 && (
            <div className="form-card">
              <h3 className="checkout-section-title">📋 Resumo do Pedido</h3>
              <div className="checkout-items">
                {itens.map(item => (
                  <div key={item.id} className="checkout-item">
                    <span className="checkout-item-emoji">{item.emoji || '📦'}</span>
                    <span className="checkout-item-nome">{item.name || item.nome}</span>
                    <span className="checkout-item-qtd">x{item.qtd}</span>
                    <span className="checkout-item-preco">
                      {fmt((item.price || item.preco || 0) * item.qtd)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="checkout-divider" />

              <div className="checkout-confirm-grid">
                <div className="confirm-block">
                  <div className="confirm-label">👤 DADOS</div>
                  <div className="confirm-value">{nome}</div>
                  <div className="confirm-value muted">{email} · {tel}</div>
                </div>
                <div className="confirm-block">
                  <div className="confirm-label">📍 ENTREGA</div>
                  <div className="confirm-value">{rua}, {numero}{complemento && ` · ${complemento}`}</div>
                  <div className="confirm-value muted">{bairro && `${bairro} · `}{cidade} – {estado} · {cep}</div>
                </div>
                <div className="confirm-block">
                  <div className="confirm-label">💳 PAGAMENTO</div>
                  <div className="confirm-value">
                    {FORMAS_PAGAMENTO.find(f => f.id === formaPag)?.label}
                    {nomCartao && ` · ${nomCartao}`}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Botões de navegação ── */}
          <div className="btn-form-row" style={{ marginTop: '16px' }}>
            {etapa > 1 ? (
              <button className="btn-cancel-form" onClick={voltar}>← Voltar</button>
            ) : (
              <button className="btn-cancel-form" onClick={() => navigate('/')}>Cancelar</button>
            )}
            {etapa < 4 ? (
              <button className="btn-save" onClick={avancar}>Continuar →</button>
            ) : (
              <button className="btn-save" onClick={finalizarPedido}>✅ Confirmar Pedido</button>
            )}
          </div>

        </div>

        {/* ── Coluna lateral: resumo do carrinho ── */}
        <div className="checkout-summary-col">
          <div className="dash-card" style={{ position: 'sticky', top: '120px' }}>
            <div className="dash-card-header">
              <h3>Seu Carrinho</h3>
              <span className="muted" style={{ fontSize: '.8rem' }}>
                {itens.reduce((a, i) => a + i.qtd, 0)} itens
              </span>
            </div>
            <div className="checkout-side-items">
              {itens.map(item => (
                <div key={item.id} className="checkout-side-item">
                  <span>{item.emoji || '📦'}</span>
                  <span className="checkout-side-nome">{item.name || item.nome}</span>
                  <span className="checkout-side-qtd">x{item.qtd}</span>
                  <span className="checkout-side-preco">
                    {fmt((item.price || item.preco || 0) * item.qtd)}
                  </span>
                </div>
              ))}
            </div>
            <div className="checkout-divider" />
            <div className="cart-summary">
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
} 