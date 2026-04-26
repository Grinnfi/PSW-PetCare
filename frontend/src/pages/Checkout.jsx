// ══════════════════════════════════════════════
// Checkout.jsx — Finalização de compra (Redux)
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { limparCarrinho } from '../store/carrinhoSlice'
import { addCompra } from '../store/comprasSlice'

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')

export default function Checkout({ showToast }) {
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const itens       = useSelector(s => s.carrinho.itens)
  const currentUser = useSelector(s => s.auth.currentUser)

  const [nome, setNome]     = useState(currentUser?.name || '')
  const [email, setEmail]   = useState(currentUser?.email || '')
  const [end, setEnd]       = useState('')
  const [pagamento, setPag] = useState('cartao')
  const [pedidoOk, setPedidoOk] = useState(false)

  const total = itens.reduce((s, i) => s + (i.price || i.preco || 0) * i.qtd, 0)

  const finalizar = async () => {
    if (!nome.trim() || !email.trim() || !end.trim()) {
      showToast('Preencha todos os campos.', 'error')
      return
    }
    if (itens.length === 0) {
      showToast('Carrinho vazio!', 'error')
      return
    }

    // Registra compra no backend
    if (currentUser) {
      const compra = {
        donoId:   currentUser.id,
        donoNome: currentUser.name,
        itens: itens.map(i => ({ nome: i.name || i.nome, qtd: i.qtd, preco: i.price || i.preco || 0 })),
        total,
        data:   new Date().toISOString().split('T')[0],
        status: 'entregue',
      }
      await dispatch(addCompra(compra))
    }

    dispatch(limparCarrinho())
    setPedidoOk(true)
    showToast('Pedido realizado com sucesso! 🎉', 'success')
  }

  if (pedidoOk) return (
    <div className="page" style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:'4rem', marginBottom:'16px' }}>✅</div>
        <h2 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:8 }}>Pedido Confirmado!</h2>
        <p style={{ color:'var(--muted)', marginBottom:'24px' }}>Obrigado pela sua compra, {nome}!</p>
        <button className="btn-primary" onClick={() => navigate('/')}>Voltar à Loja</button>
      </div>
    </div>
  )

  return (
    <div id="page-checkout" className="page" style={{ padding:'36px 40px' }}>
      <div className="page-htitle" style={{ marginBottom:'28px' }}>
        <h1>Finalizar Compra</h1>
        <p>Confirme seus dados e conclua o pedido.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:'24px', alignItems:'start' }}>
        <div className="form-card">
          <h3 style={{ fontWeight:800, marginBottom:'20px' }}>Dados de Entrega</h3>

          <div className="fg">
            <label>Nome completo</label>
            <input className="fc" value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" />
          </div>
          <div className="fg">
            <label>E-mail</label>
            <input className="fc" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" />
          </div>
          <div className="fg">
            <label>Endereço de entrega</label>
            <input className="fc" value={end} onChange={e => setEnd(e.target.value)} placeholder="Rua, número, bairro, cidade" />
          </div>

          <h3 style={{ fontWeight:800, margin:'20px 0 14px' }}>Forma de Pagamento</h3>
          {[
            { val:'cartao', label:'💳 Cartão de Crédito/Débito' },
            { val:'pix',    label:'⚡ PIX' },
            { val:'boleto', label:'📄 Boleto Bancário' },
          ].map(op => (
            <label key={op.val} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, cursor:'pointer', fontSize:'.9rem', fontWeight:600 }}>
              <input type="radio" name="pagamento" value={op.val} checked={pagamento === op.val} onChange={() => setPag(op.val)} />
              {op.label}
            </label>
          ))}

          <button className="btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={finalizar}>
            Confirmar Pedido
          </button>
        </div>

        <div className="dash-card" style={{ padding:'22px' }}>
          <h3 style={{ fontWeight:800, marginBottom:'16px' }}>Resumo do Pedido</h3>
          {itens.length === 0 ? (
            <p style={{ color:'var(--muted)', fontSize:'.875rem' }}>Carrinho vazio</p>
          ) : (
            <>
              {itens.map(i => (
                <div key={i.id} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, fontSize:'.875rem' }}>
                  <span>{i.name || i.nome} × {i.qtd}</span>
                  <span style={{ fontWeight:700 }}>{fmt((i.price || i.preco || 0) * i.qtd)}</span>
                </div>
              ))}
              <div style={{ borderTop:'1px solid var(--border)', paddingTop:12, marginTop:8, display:'flex', justifyContent:'space-between', fontWeight:800, fontSize:'1.05rem' }}>
                <span>Total</span>
                <span style={{ color:'var(--p)' }}>{fmt(total)}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
