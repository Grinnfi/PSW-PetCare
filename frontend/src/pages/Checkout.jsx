// ══════════════════════════════════════════════
// Checkout.jsx — Página de finalização de compra
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { limparCarrinho } from '../store/carrinhoSlice'
import { addCompra } from '../store/comprasSlice'
import { fetchProducts } from '../store/productsSlice'
import * as masks from '../utils/masks'

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
const ETAPAS = [
  { id: 1, label: 'Dados Pessoais', icon: '👤' },
  { id: 2, label: 'Endereço', icon: '📍' },
  { id: 3, label: 'Pagamento', icon: '💳' },
  { id: 4, label: 'Resumo', icon: '📋' },
]

const FORMAS_PAGAMENTO = [
  { id: 'credito', label: 'Cartão de Crédito', icon: '💳' },
  { id: 'debito', label: 'Cartão de Débito', icon: '🏧' },
  { id: 'pix', label: 'Pix', icon: '⚡' },
  { id: 'boleto', label: 'Boleto', icon: '📄' },
]

export default function Checkout({ showToast }) {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const itens = useSelector(s => s.carrinho.itens)
  const cupom = useSelector(s => s.carrinho.cupom)
  const currentUser = useSelector(s => s.auth.currentUser)

  const [etapa, setEtapa] = useState(1)
  const [maxEtapa, setMaxEtapa] = useState(1)
  const [pulse, setPulse] = useState(false)

  const [nome, setNome] = useState(currentUser?.name || '')
  const [email, setEmail] = useState(currentUser?.email || '')
  const [tel, setTel] = useState('')

  const [cep, setCep] = useState('')
  const [rua, setRua] = useState('')
  const [numero, setNumero] = useState('')
  const [complemento, setComplemento] = useState('')
  const [bairro, setBairro] = useState('')
  const [cidade, setCidade] = useState('')
  const [estado, setEstado] = useState('')

  const [formaPag, setFormaPag] = useState('credito')
  const [nomCartao, setNomCartao] = useState('')
  const [numCartao, setNumCartao] = useState('')
  const [validade, setValidade] = useState('')
  const [cvv, setCvv] = useState('')
  const [loadingCep, setLoadingCep] = useState(false)

  const handleNome = (v) => setNome(masks.maskOnlyLetters(v))
  const handleTel = (v) => setTel(masks.maskPhone(v))
  const handleCep = (v) => setCep(masks.maskCEP(v))
  const handleNumero = (v) => setNumero(masks.maskOnlyNumbers(v).substring(0, 10))

  const handleNomCartao = (v) => setNomCartao(masks.maskOnlyLetters(v).toUpperCase())
  const handleNumCartao = (v) => setNumCartao(masks.maskCardNumber(v))
  const handleValidade = (v) => setValidade(masks.maskCardExpiry(v))
  const handleCvv = (v) => setCvv(masks.maskCVV(v))

  const buscarCep = async () => {
    const cleanCep = cep.replace(/\D/g, '')
    if (cleanCep.length !== 8) {
      showToast('CEP inválido. Deve ter 8 dígitos.', 'error')
      return
    }

    setLoadingCep(true)
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
      const data = await res.json()

      if (data.erro) {
        showToast('CEP não encontrado.', 'error')
      } else {
        setRua(data.logradouro)
        setBairro(data.bairro)
        setCidade(data.localidade)
        setEstado(data.uf)
        showToast('Endereço preenchido com sucesso!', 'success')
      }
    } catch (err) {
      showToast('Erro ao buscar o CEP. Tente novamente.', 'error')
    } finally {
      setLoadingCep(false)
    }
  }

  // ── Totais ──
  const { subtotal, desconto, total } = useMemo(() => {
    const sub = itens.reduce((acc, item) => acc + (item.price || item.preco || 0) * item.qtd, 0)
    const desc = cupom ? sub * cupom.pct : 0
    return { subtotal: sub, desconto: desc, total: sub - desc }
  }, [itens, cupom])

  // ── Validação por etapa ──
  const validarEtapa = () => {
    if (etapa === 1) {
      if (!nome.trim()) { showToast('Informe seu nome.', 'error'); return false }
      if (!email.trim()) { showToast('Informe seu e-mail.', 'error'); return false }
      if (!tel.trim()) { showToast('Informe seu telefone.', 'error'); return false }
    }
    if (etapa === 2) {
      if (!cep.trim()) { showToast('Informe o CEP.', 'error'); return false }
      if (!rua.trim()) { showToast('Informe a rua.', 'error'); return false }
      if (!numero.trim()) { showToast('Informe o número.', 'error'); return false }
      if (!cidade.trim()) { showToast('Informe a cidade.', 'error'); return false }
      if (!estado.trim()) { showToast('Informe o estado.', 'error'); return false }
    }
    if (etapa === 3) {
      if (formaPag === 'credito' || formaPag === 'debito') {
        if (!nomCartao.trim()) { showToast('Informe o nome no cartão.', 'error'); return false }
        if (!numCartao.trim() || numCartao.replace(/\D/g, '').length < 16) {
          showToast('Informe um número de cartão válido.', 'error'); return false
        }
        if (!validade.trim() || validade.length < 5) {
          showToast('Informe a validade (MM/AA).', 'error'); return false
        }
        if (!cvv.trim() || cvv.length < 3) {
          showToast('Informe o CVV.', 'error'); return false
        }
      }
    }
    return true
  }

  const avancar = () => {
    if (!validarEtapa()) return
    const prox = etapa + 1
    setEtapa(prox)
    if (prox > maxEtapa) setMaxEtapa(prox)
  }

  const pularParaEtapa = (id) => {
    if (id <= maxEtapa) {
      setEtapa(id)
    } else {
      setPulse(true)
      setTimeout(() => setPulse(false), 400)
    }
  }

  const voltar = () => setEtapa(e => e - 1)
    const finalizarPedido = async () => {
      if (!currentUser) {
        dispatch(limparCarrinho())
        showToast('Pedido realizado com sucesso! 🎉', 'success')
        setTimeout(() => navigate('/'), 1500)
        return
      }

      const result = await dispatch(addCompra({
        donoId: currentUser._id,
        donoNome: currentUser.name,
        itens: itens.map(i => ({
          produtoId: i._id || i.id,
          nome: i.name || i.nome,
          qtd: i.qtd,
          preco: i.price || i.preco || 0,
        })),
        endereco: { cep, rua, numero, complemento, bairro, cidade, estado },
        pagamento: {
          forma: formaPag,
          nomCartao: (formaPag === 'credito' || formaPag === 'debito') ? nomCartao : '',
        },
        total,
        data: new Date().toISOString().split('T')[0],
        status: 'entregue',
      }))

      if (result.meta.requestStatus === 'rejected') {
        const mensagem = result.payload || result.error?.message || 'Não foi possível concluir a compra. Verifique o estoque.'
        showToast(mensagem, 'error')
        console.error('Erro ao finalizar compra:', result)
        return
      }
      dispatch(fetchProducts())
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
            <div
              className={`checkout-step 
                ${e.id === maxEtapa ? 'active' : ''} 
                ${e.id < maxEtapa ? 'done' : ''} 
                ${e.id === etapa ? 'current' : ''} 
                ${e.id === maxEtapa && pulse ? 'pulse' : ''}
                ${e.id <= maxEtapa ? 'clickable' : 'locked'}`}
              onClick={() => pularParaEtapa(e.id)}
            >
              <div className="step-circle">
                {e.icon}
              </div>
              <span className="step-label">{e.label}</span>
            </div>
            {i < ETAPAS.length - 1 && (
              <div className={`step-line ${e.id === maxEtapa - 1 ? 'current' :
                  e.id < maxEtapa ? 'done' : ''}`} />
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
                  value={nome} onChange={e => handleNome(e.target.value)} />
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
                    value={tel} onChange={e => handleTel(e.target.value)} />
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
                  <div className="cep-wrap">
                    <input className="fc" type="text" placeholder="00000-000"
                      value={cep} onChange={e => handleCep(e.target.value)} />
                    <button
                      className="cep-btn"
                      type="button"
                      onClick={buscarCep}
                      disabled={loadingCep || cep.replace(/\D/g, '').length !== 8}
                    >
                      {loadingCep ? 'Buscando...' : 'Buscar CEP'}
                    </button>
                  </div>
                </div>
                <div>
                  <label>Número <span>*</span></label>
                  <input className="fc" type="text" placeholder="123"
                    value={numero} onChange={e => handleNumero(e.target.value)} />
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
                    {['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
                      'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => (
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
                    <input className="fc" type="text" placeholder="COMO ESTÁ NO CARTÃO"
                      value={nomCartao} onChange={e => handleNomCartao(e.target.value)} />
                  </div>
                  <div className="fg">
                    <label>Número do cartão <span>*</span></label>
                    <input className="fc" type="text" placeholder="0000 0000 0000 0000"
                      value={numCartao} onChange={e => handleNumCartao(e.target.value)} />
                  </div>
                  <div className="fg fg-row2">
                    <div>
                      <label>Validade <span>*</span></label>
                      <input className="fc" type="text" placeholder="MM/AA"
                        value={validade} onChange={e => handleValidade(e.target.value)} />
                    </div>
                    <div>
                      <label>CVV <span>*</span></label>
                      <input className="fc" type="text" placeholder="000"
                        value={cvv} onChange={e => handleCvv(e.target.value)} />
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
              <div className="cart-summary" style={{ marginBottom: '24px' }}>
                <div className="cart-summary-row">
                  <span>Subtotal</span>
                  <span>{fmt(subtotal)}</span>
                </div>
                {cupom && (
                  <div className="cart-summary-row discount">
                    <span>Desconto ({cupom.pct * 100}%)</span>
                    <span>− {fmt(desconto)}</span>
                  </div>
                )}
                <div className="cart-summary-row total">
                  <span>Total</span>
                  <span>{fmt(total)}</span>
                </div>
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
          <div className="dash-card">
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
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              {cupom && (
                <div className="cart-summary-row discount">
                  <span>Desconto ({cupom.pct * 100}%)</span>
                  <span>− {fmt(desconto)}</span>
                </div>
              )}
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