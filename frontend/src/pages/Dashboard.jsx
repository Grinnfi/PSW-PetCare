// ══════════════════════════════════════════════
// Dashboard.jsx — Painel de controle (Redux)
// Admin: vê tudo. Cliente: vê apenas os seus dados.
// ══════════════════════════════════════════════

import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const fmtData = (d) => {
  if (!d) return ''
  const [a, m, dia] = d.split('-')
  return `${dia}/${m}`
}

export default function Dashboard({ currentUser, showToast }) {
  const navigate  = useNavigate()
  const isAdmin   = currentUser?.role === 'admin'

  const allPets         = useSelector(s => s.pets.list)
  const allAgendamentos = useSelector(s => s.agendamentos.list)
  const allCompras      = useSelector(s => s.compras.list)

  const meusPets         = isAdmin ? allPets : allPets.filter(p => p.donoId === currentUser?.id)
  const meusAgendamentos = isAdmin ? allAgendamentos : allAgendamentos.filter(a => a.donoId === currentUser?.id)
  const minhasCompras    = isAdmin ? allCompras : allCompras.filter(c => c.donoId === currentUser?.id)

  const pendentes   = meusAgendamentos.filter(a => a.status === 'pendente')
  const concluidos  = meusAgendamentos.filter(a => a.status === 'concluido')

  return (
    <div id="page-dashboard" className="page">
      <div className="dash-header">
        <div className="dash-title">
          <h1>Bem-vindo ao PetCare Web 👋 {currentUser?.name}</h1>
          <p>{isAdmin ? 'Painel administrativo — visão geral do sistema.' : 'Gestão inteligente para o seu pet.'}</p>
        </div>
        <div className="dash-actions">
          {!isAdmin && (
            <button className="btn-primary" onClick={() => navigate('/cadastrar')}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Novo Pet
            </button>
          )}
          <button className="btn-secondary" onClick={() => navigate('/agendar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            {isAdmin ? 'Novo Agendamento' : 'Agendar'}
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-ico purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="stat-info">
            <label>{isAdmin ? 'Total de Pets' : 'Meus Pets'}</label>
            <span>{meusPets.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-ico teal">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div className="stat-info">
            <label>Agendamentos Pendentes</label>
            <span>{pendentes.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-ico amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/>
            </svg>
          </div>
          <div className="stat-info">
            <label>{isAdmin ? 'Vendas Realizadas' : 'Minhas Compras'}</label>
            <span>{minhasCompras.length}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="dash-grid">
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>{isAdmin ? 'Próximos Agendamentos (Sistema)' : 'Meus Próximos Agendamentos'}</h3>
            <span className="dash-card-link" onClick={() => navigate('/historico')}>Ver todos →</span>
          </div>
          <div className="appt-list">
            {pendentes.length === 0 ? (
              <p style={{ padding:'16px 22px', color:'var(--muted)', fontSize:'.875rem' }}>Nenhum agendamento pendente.</p>
            ) : (
              pendentes.slice(0, 4).map((ag, i) => (
                <div key={i} className="appt-item">
                  <div className="appt-avatar">{ag.petNome?.[0] || '?'}</div>
                  <div className="appt-info">
                    <div className="appt-name">{ag.petNome}</div>
                    <div className="appt-breed">{ag.servico}{isAdmin ? ` · ${ag.donoNome}` : ''}</div>
                  </div>
                  <div className="appt-time">
                    <div className="appt-date">{fmtData(ag.data)}</div>
                    <div className="appt-hour">{ag.hora}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {isAdmin ? (
          <div className="dash-card">
            <div className="dash-card-header">
              <h3>Últimas Vendas</h3>
              <span className="dash-card-link" onClick={() => navigate('/historico')}>Ver todas →</span>
            </div>
            <div className="appt-list">
              {allCompras.length === 0 ? (
                <p style={{ padding:'16px 22px', color:'var(--muted)', fontSize:'.875rem' }}>Nenhuma venda registrada.</p>
              ) : (
                allCompras.slice(-4).reverse().map((c, i) => (
                  <div key={i} className="appt-item">
                    <div className="appt-avatar" style={{ background:'var(--green-bg)', color:'var(--green)' }}>🛒</div>
                    <div className="appt-info">
                      <div className="appt-name">Pedido #{c.id}</div>
                      <div className="appt-breed">{c.donoNome} · {c.itens?.length || 0} item(s)</div>
                    </div>
                    <div className="appt-time">
                      <div className="appt-date" style={{ fontWeight:800, color:'var(--p)' }}>
                        R$ {Number(c.total).toFixed(2).replace('.', ',')}
                      </div>
                      <div className="appt-hour">{fmtData(c.data)}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="cta-card">
            <h3>Agende um serviço agora</h3>
            <p>Selecione o melhor horário para o seu pet com nossos profissionais especializados.</p>
            <button className="btn-cta" onClick={() => navigate('/agendar')}>Começar Agendamento</button>
          </div>
        )}
      </div>
    </div>
  )
}
