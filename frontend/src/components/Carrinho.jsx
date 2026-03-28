// ══════════════════════════════════════════════
// Carrinho.jsx — Drawer lateral do carrinho
// Props: itens, setItens, isOpen, onClose, showToast
// Demonstra: useMemo para totais, manipulação de array
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'

// ── Helper: extrai número de uma string de preço ──
const extrairPreco = (str) => parseFloat(str.replace('R$', '').replace(',', '.').trim())

// ── Cupons válidos: código → percentual de desconto ──
const CUPONS = {
  'PETCARE10': 0.10,   // 10% off
  'BEMVINDO':  0.15,   // 15% off
  'FRETE20':   0.20,   // 20% off
}

export default function Carrinho({ itens, setItens, isOpen, onClose, showToast }) {
  const navigate = useNavigate()

  // ── Estado do cupom ──
  const [cupomInput,  setCupomInput]  = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(null)  // { codigo, pct } ou null

  // ── Alterar quantidade de um item ──
  const alterarQtd = (id, delta) => {
    setItens(prev =>
      prev
        .map(item => item.id === id ? { ...item, qtd: item.qtd + delta } : item)
        .filter(item => item.qtd > 0)   // remove se chegar a 0
    )
  }

  // ── Remover item diretamente ──
  const removerItem = (id, nome) => {
    setItens(prev => prev.filter(item => item.id !== id))
    showToast(`"${nome}" removido do carrinho.`, 'error')
  }

  // ── Aplicar cupom ──
  const aplicarCupom = () => {
    const codigo = cupomInput.trim().toUpperCase()
    if (!codigo) {
      showToast('Digite um cupom.', 'error')
      return
    }
    if (cupomAplicado) {
      showToast('Já existe um cupom aplicado.', 'error')
      return
    }
    const pct = CUPONS[codigo]
    if (!pct) {
      showToast(`Cupom "${codigo}" inválido.`, 'error')
      return
    }
    setCupomAplicado({ codigo, pct })
    setCupomInput('')
    showToast(`Cupom "${codigo}" aplicado! ${pct * 100}% de desconto 🎉`, 'success')
  }

  // ── Remover cupom ──
  const removerCupom = () => {
    setCupomAplicado(null)
    showToast('Cupom removido.', 'error')
  }

  // ── Calcular subtotal e total (useMemo evita recalcular desnecessariamente) ──
  const { subtotal, desconto, total } = useMemo(() => {
    const subtotal = itens.reduce((acc, item) => {
      return acc + extrairPreco(item.preco) * item.qtd
    }, 0)
    // Desconto: cupom aplicado ou 0
    const pct     = cupomAplicado ? cupomAplicado.pct : 0
    const desconto = subtotal * pct
    return {
      subtotal,
      desconto,
      total: subtotal - desconto,
    }
  }, [itens, cupomAplicado])

  // ── Finalizar compra ──
  const finalizarCompra = () => {
    if (itens.length === 0) {
      showToast('Seu carrinho está vazio!', 'error')
      return
    }
    onClose()
    navigate('/checkout')
  }

  // ── Formata valor para exibição ──
  const fmt = (v) => 'R$ ' + v.toFixed(2).replace('.', ',')

  return (
    <>
      {/* Overlay escuro ao fundo */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
      />

      {/* Drawer lateral */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>

        {/* ── Cabeçalho ── */}
        <div className="cart-header">
          <div className="cart-header-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.83L23 6H6"/>
            </svg>
            <h2>Carrinho</h2>
            {itens.length > 0 && (
              <span className="cart-count">{itens.reduce((a, i) => a + i.qtd, 0)}</span>
            )}
          </div>
          <button className="cart-close" onClick={onClose}>✕</button>
        </div>

        {/* ── Corpo: lista de itens ── */}
        <div className="cart-body">
          {itens.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>Seu carrinho está vazio.</p>
              <span>Adicione produtos da loja!</span>
            </div>
          ) : (
            <div className="cart-items">
              {itens.map(item => (
                <div key={item.id} className="cart-item">

                  {/* Emoji do produto */}
                  <div className="cart-item-img">{item.emoji}</div>

                  {/* Info */}
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.nome}</div>
                    <div className="cart-item-price">{item.preco}</div>
                  </div>

                  {/* Controle de quantidade */}
                  <div className="cart-item-ctrl">
                    <button className="qty-btn" onClick={() => alterarQtd(item.id, -1)}>−</button>
                    <span className="cart-item-qtd">{item.qtd}</span>
                    <button className="qty-btn" onClick={() => alterarQtd(item.id, +1)}>+</button>
                  </div>

                  {/* Remover */}
                  <button
                    className="cart-item-del"
                    onClick={() => removerItem(item.id, item.nome)}
                    title="Remover"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      <path d="M10 11v6"/><path d="M14 11v6"/>
                      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                  </button>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Rodapé: resumo + botão ── */}
        {itens.length > 0 && (
          <div className="cart-footer">

            {/* ── Campo de cupom ── */}
            {cupomAplicado ? (
              <div className="coupon-applied">
                <span>🎟️ <strong>{cupomAplicado.codigo}</strong> — {cupomAplicado.pct * 100}% off</span>
                <button className="coupon-remove" onClick={removerCupom}>✕</button>
              </div>
            ) : (
              <div className="coupon-wrap">
                <input
                  className="fc coupon-input"
                  type="text"
                  placeholder="Código do cupom"
                  value={cupomInput}
                  onChange={e => setCupomInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && aplicarCupom()}
                />
                <button className="coupon-btn" onClick={aplicarCupom}>Aplicar</button>
              </div>
            )}
            <div className="cart-summary">
              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>{fmt(subtotal)}</span>
              </div>
              <div className="cart-summary-row discount">
                <span>Desconto ({cupomAplicado ? `${cupomAplicado.pct * 100}%` : '0%'})</span>
                <span>− {fmt(desconto)}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span>
                <span>{fmt(total)}</span>
              </div>
            </div>
            <button className="btn-checkout" onClick={finalizarCompra}>
              Finalizar Compra
            </button>
            <button className="btn-continue" onClick={onClose}>
              Continuar Comprando
            </button>
          </div>
        )}

      </div>
    </>
  )
}
