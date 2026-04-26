// ══════════════════════════════════════════════
// Carrinho.jsx — Drawer lateral do carrinho (Redux)
// ══════════════════════════════════════════════

import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeItem, updateQtd, limparCarrinho } from '../store/carrinhoSlice'

const CUPONS = {
  'PETCARE10': 0.10,
  'BEMVINDO':  0.15,
  'FRETE20':   0.20,
}

export default function Carrinho({ isOpen, onClose, showToast }) {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()
  const itens     = useSelector(s => s.carrinho.itens)

  const [cupomInput,    setCupomInput]    = useState('')
  const [cupomAplicado, setCupomAplicado] = useState(null)

  const alterarQtd = (id, delta) => {
    const item = itens.find(i => i.id === id)
    if (!item) return
    const novaQtd = item.qtd + delta
    if (novaQtd <= 0) dispatch(removeItem(id))
    else dispatch(updateQtd({ id, qtd: novaQtd }))
  }

  const removerItem = (id, nome) => {
    dispatch(removeItem(id))
    showToast(`"${nome}" removido do carrinho.`, 'error')
  }

  const aplicarCupom = () => {
    const codigo = cupomInput.trim().toUpperCase()
    if (!codigo) { showToast('Digite um cupom.', 'error'); return }
    if (cupomAplicado) { showToast('Já existe um cupom aplicado.', 'error'); return }
    const pct = CUPONS[codigo]
    if (!pct) { showToast(`Cupom "${codigo}" inválido.`, 'error'); return }
    setCupomAplicado({ codigo, pct })
    setCupomInput('')
    showToast(`Cupom "${codigo}" aplicado! ${pct * 100}% de desconto 🎉`, 'success')
  }

  const removerCupom = () => {
    setCupomAplicado(null)
    showToast('Cupom removido.', 'error')
  }

  const { subtotal, desconto, total } = useMemo(() => {
    const subtotal = itens.reduce((acc, item) => acc + (item.price || item.preco || 0) * item.qtd, 0)
    const pct      = cupomAplicado ? cupomAplicado.pct : 0
    const desconto = subtotal * pct
    return { subtotal, desconto, total: subtotal - desconto }
  }, [itens, cupomAplicado])

  const finalizarCompra = () => {
    if (itens.length === 0) { showToast('Seu carrinho está vazio!', 'error'); return }
    onClose()
    navigate('/checkout')
  }

  const fmt = (v) => 'R$ ' + v.toFixed(2).replace('.', ',')

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>

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
                  <div className="cart-item-img">{item.emoji || '📦'}</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name || item.nome}</div>
                    <div className="cart-item-price">{fmt(item.price || item.preco || 0)}</div>
                  </div>
                  <div className="cart-item-ctrl">
                    <button className="qty-btn" onClick={() => alterarQtd(item.id, -1)}>−</button>
                    <span className="cart-item-qtd">{item.qtd}</span>
                    <button className="qty-btn" onClick={() => alterarQtd(item.id, +1)}>+</button>
                  </div>
                  <button
                    className="cart-item-del"
                    onClick={() => removerItem(item.id, item.name || item.nome)}
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

        {itens.length > 0 && (
          <div className="cart-footer">
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
                <span>Subtotal</span><span>{fmt(subtotal)}</span>
              </div>
              <div className="cart-summary-row discount">
                <span>Desconto ({cupomAplicado ? `${cupomAplicado.pct * 100}%` : '0%'})</span>
                <span>− {fmt(desconto)}</span>
              </div>
              <div className="cart-summary-row total">
                <span>Total</span><span>{fmt(total)}</span>
              </div>
            </div>
            <button className="btn-checkout" onClick={finalizarCompra}>Finalizar Compra</button>
            <button className="btn-continue" onClick={onClose}>Continuar Comprando</button>
          </div>
        )}
      </div>
    </>
  )
}
