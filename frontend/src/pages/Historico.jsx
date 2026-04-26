// ══════════════════════════════════════════════
// Historico.jsx — Histórico de serviços e compras (Redux)
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { cancelarAgendamento } from '../store/agendamentosSlice'

const STATUS_MAP = {
  pendente:  { cls: 'pend',   label: 'Pendente' },
  concluido: { cls: 'done',   label: 'Concluído' },
  cancelado: { cls: 'cancel', label: 'Cancelado' },
  entregue:  { cls: 'done',   label: 'Entregue' },
}

const fmt = (v) => 'R$ ' + Number(v).toFixed(2).replace('.', ',')
const fmtData = (d) => {
  if (!d) return ''
  const [a, m, dia] = d.split('-')
  return `${dia}/${m}/${a}`
}

export default function Historico() {
  const dispatch    = useDispatch()
  const currentUser = useSelector(s => s.auth.currentUser)
  const isAdmin     = currentUser?.role === 'admin'

  const allAgs     = useSelector(s => s.agendamentos.list)
  const allCompras = useSelector(s => s.compras.list)

  const agendamentos = isAdmin
    ? allAgs
    : allAgs.filter(a => a.donoId === currentUser?.id)

  const compras = isAdmin
    ? allCompras
    : allCompras.filter(c => c.donoId === currentUser?.id)

  const handleCancelar = async (ag) => {
    if (ag.status !== 'pendente') return
    await dispatch(cancelarAgendamento(ag.id))
  }

  const itensUnificados = [
    ...agendamentos.map(a => ({
      tipo: 'agendamento',
      icon: { 'Banho & Tosa':'🛁', 'Consulta Veterinária':'🩺', 'Vacinação':'💉', 'Hotel Pet':'🏠' }[a.servico] || '📅',
      titulo: `${a.servico} – ${a.petNome}`,
      sub: `${a.petEspecie}${isAdmin ? ' · ' + a.donoNome : ''}`,
      data: a.data, hora: a.hora,
      status: a.status, id: a.id, raw: a,
    })),
    ...compras.map(c => ({
      tipo: 'compra',
      icon: '🛒',
      titulo: `Pedido #${c.id} – ${c.itens?.length || 0} produto(s)`,
      sub: c.itens?.map(i => i.nome).join(', ') || '',
      data: c.data, hora: null,
      status: c.status || 'entregue',
      valor: c.total, id: c.id, raw: c,
    })),
  ].sort((a, b) => (b.data || '').localeCompare(a.data || ''))

  const [filtro, setFiltro] = useState('todos')

  const itensFiltrados = filtro === 'todos'
    ? itensUnificados
    : filtro === 'agendamentos'
    ? itensUnificados.filter(i => i.tipo === 'agendamento')
    : itensUnificados.filter(i => i.tipo === 'compra')

  return (
    <div id="page-historico" className="page">
      <div className="page-htitle" style={{ marginBottom:'16px' }}>
        <h1>Histórico</h1>
        <p>{isAdmin ? 'Todos os agendamentos e compras do sistema.' : 'Seus serviços e compras realizados.'}</p>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:20, flexWrap:'wrap' }}>
        {[
          { val:'todos',        label:'Tudo' },
          { val:'agendamentos', label:'📅 Agendamentos' },
          { val:'compras',      label:'🛒 Compras' },
        ].map(f => (
          <button
            key={f.val}
            onClick={() => setFiltro(f.val)}
            style={{
              padding:'7px 16px', borderRadius:20, border:'1.5px solid',
              borderColor: filtro === f.val ? 'var(--p)' : 'var(--border)',
              background:  filtro === f.val ? 'var(--p-light)' : '#fff',
              color:       filtro === f.val ? 'var(--p)' : 'var(--text)',
              fontSize:'.82rem', fontWeight:700, cursor:'pointer',
            }}
          >{f.label}</button>
        ))}
      </div>

      <div className="hist-list">
        {itensFiltrados.length === 0 ? (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--muted)' }}>
            <div style={{ fontSize:'3rem', marginBottom:12 }}>📭</div>
            <p>Nenhum registro encontrado.</p>
          </div>
        ) : (
          itensFiltrados.map((item, i) => {
            const st = STATUS_MAP[item.status] || { cls:'pend', label: item.status }
            const podeCancelar = item.tipo === 'agendamento' && item.status === 'pendente'
            return (
              <div key={i} className="hist-item">
                <div className="hist-icon">{item.icon}</div>
                <div className="hist-info">
                  <div className="hist-title">{item.titulo}</div>
                  <div className="hist-sub">{item.sub}</div>
                </div>
                <div>
                  <div className="hist-date">{fmtData(item.data)}{item.hora ? ` · ${item.hora}` : ''}</div>
                  {item.valor !== undefined && (
                    <div className="hist-date" style={{ marginTop:'4px', fontWeight:800, color:'var(--p)' }}>
                      {fmt(item.valor)}
                    </div>
                  )}
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:6 }}>
                  <span className={`hist-status ${st.cls}`}>{st.label}</span>
                  {podeCancelar && (
                    <button
                      onClick={() => handleCancelar(item.raw)}
                      style={{
                        padding:'4px 10px', borderRadius:6, border:'1.5px solid var(--red)',
                        background:'var(--red-bg)', color:'var(--red)',
                        fontSize:'.72rem', fontWeight:700, cursor:'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
