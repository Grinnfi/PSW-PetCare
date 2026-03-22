// ══════════════════════════════════════════════
// Dashboard.jsx — Painel de controle do usuário
// Props: currentUser, pets
// ══════════════════════════════════════════════

import { useNavigate } from 'react-router-dom'

// Agendamentos fixos (futuramente virão do banco)
const AGENDAMENTOS = [
  { inicial: 'M', nome: 'Mel',  raca: 'Poodle',          data: '17 de março', hora: '10:00' },
  { inicial: 'T', nome: 'Thor', raca: 'Golden Retriever', data: '19 de março', hora: '14:30' },
]

export default function Dashboard({ currentUser, pets }) {
  const navigate = useNavigate()

  return (
    <div id="page-dashboard" className="page">

      {/* Cabeçalho */}
      <div className="dash-header">
        <div className="dash-title">
          <h1>Bem-vindo ao PetCare Web 👋 {currentUser?.name}</h1>
          <p>Gestão inteligente para o seu pet shop.</p>
        </div>
        <div className="dash-actions">
          <button className="btn-primary" onClick={() => navigate('/cadastrar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Pet
          </button>
          <button className="btn-secondary" onClick={() => navigate('/agendar')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Agendar
          </button>
        </div>
      </div>

      {/* Cards de estatísticas */}
      <div className="stat-cards">
        <div className="stat-card">
          <div className="stat-ico purple">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <ellipse cx="12" cy="5" rx="9" ry="3"/>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
            </svg>
          </div>
          <div className="stat-info">
            <label>Total de Pets</label>
            {/* Valor dinâmico: baseado no array de pets */}
            <span>{pets.length}</span>
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
            <label>Agendamentos</label>
            <span>{AGENDAMENTOS.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-ico amber">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="stat-info">
            <label>Clientes Ativos</label>
            <span>2</span>
          </div>
        </div>
      </div>

      {/* Grid com agendamentos e CTA */}
      <div className="dash-grid">
        {/* Lista de próximos agendamentos */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>Próximos Agendamentos</h3>
            <span className="dash-card-link" onClick={() => navigate('/historico')}>
              Ver todos →
            </span>
          </div>
          <div className="appt-list">
            {AGENDAMENTOS.map((ag, i) => (
              <div key={i} className="appt-item">
                <div className="appt-avatar">{ag.inicial}</div>
                <div className="appt-info">
                  <div className="appt-name">{ag.nome}</div>
                  <div className="appt-breed">{ag.raca}</div>
                </div>
                <div className="appt-time">
                  <div className="appt-date">{ag.data}</div>
                  <div className="appt-hour">{ag.hora}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card de call-to-action */}
        <div className="cta-card">
          <h3>Agende um serviço agora</h3>
          <p>Selecione o melhor horário para o seu pet com nossos profissionais especializados.</p>
          <button className="btn-cta" onClick={() => navigate('/agendar')}>
            Começar Agendamento
          </button>
        </div>
      </div>

    </div>
  )
}
