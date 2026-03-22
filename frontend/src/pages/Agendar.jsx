// ══════════════════════════════════════════════
// Agendar.jsx — Agendamento de serviços
// Props: pets, showToast
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SERVICOS = [
  { emoji: '🛁', nome: 'Banho & Tosa',        preco: 'A partir de R$ 45,00' },
  { emoji: '🩺', nome: 'Consulta Veterinária', preco: 'A partir de R$ 90,00' },
  { emoji: '💉', nome: 'Vacinação',            preco: 'A partir de R$ 55,00' },
  { emoji: '🏠', nome: 'Hotel Pet',            preco: 'A partir de R$ 80,00/dia' },
]

const AGENDAMENTOS_FIXOS = [
  { inicial: 'M', nome: 'Mel',  servico: 'Banho & Tosa',  data: '17 mar', hora: '10:00' },
  { inicial: 'T', nome: 'Thor', servico: 'Consulta Vet.', data: '19 mar', hora: '14:30' },
]

export default function Agendar({ pets, showToast }) {
  const navigate = useNavigate()

  // ── Estado do agendamento ──
  const [servicoSelecionado, setServicoSelecionado] = useState('')
  const [data, setData]   = useState('')
  const [hora, setHora]   = useState('08:00')
  const [petId, setPetId] = useState(pets[0]?.name || '')

  // ── Ação: Confirmar agendamento ──
  const confirmarAgendamento = () => {
    if (!servicoSelecionado) {
      showToast('Selecione um serviço.', 'error')
      return
    }
    if (!data) {
      showToast('Selecione uma data.', 'error')
      return
    }
    showToast(`Agendamento de "${servicoSelecionado}" confirmado!`, 'success')
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  return (
    <div id="page-agendar" className="page">

      <div className="page-header-row">
        <div className="page-htitle">
          <h1>Agendar Serviço</h1>
          <p>Escolha o serviço e horário ideal para o seu pet.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '28px', alignItems: 'start' }}>

        {/* ── Coluna principal ── */}
        <div>
          <h3 style={{ fontSize: '.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em', color: 'var(--muted)', marginBottom: '14px' }}>
            Selecione o Serviço
          </h3>

          {/* Cards de serviço */}
          <div className="svc-cards">
            {SERVICOS.map(svc => (
              <div
                key={svc.nome}
                className={`svc-card ${servicoSelecionado === svc.nome ? 'selected' : ''}`}
                onClick={() => setServicoSelecionado(svc.nome)}
              >
                <div className="svc-icon">{svc.emoji}</div>
                <div className="svc-name">{svc.nome}</div>
                <div className="svc-price">{svc.preco}</div>
              </div>
            ))}
          </div>

          {/* Formulário de agendamento */}
          <div className="form-card" style={{ marginTop: '20px' }}>
            <div className="fg fg-row2">
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, marginBottom: '7px' }}>Pet</label>
                <select className="fc" value={petId} onChange={e => setPetId(e.target.value)}>
                  {pets.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.raca || p.especie})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, marginBottom: '7px' }}>Data</label>
                <input
                  className="fc"
                  type="date"
                  value={data}
                  onChange={e => setData(e.target.value)}
                />
              </div>
            </div>

            <div className="fg fg-row2">
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, marginBottom: '7px' }}>Horário</label>
                <select className="fc" value={hora} onChange={e => setHora(e.target.value)}>
                  {['08:00','09:00','10:00','11:00','14:00','15:00','16:00'].map(h => (
                    <option key={h}>{h}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, marginBottom: '7px' }}>Profissional</label>
                <select className="fc">
                  <option>Qualquer disponível</option>
                  <option>Ana Lima</option>
                  <option>Carlos Souza</option>
                </select>
              </div>
            </div>

            <div className="fg">
              <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 700, marginBottom: '7px' }}>Observações</label>
              <textarea className="fc" placeholder="Informações adicionais..." />
            </div>

            <div className="btn-form-row">
              <button className="btn-cancel-form" onClick={() => navigate('/dashboard')}>Cancelar</button>
              <button className="btn-save" onClick={confirmarAgendamento}>Confirmar Agendamento</button>
            </div>
          </div>
        </div>

        {/* ── Sidebar: próximos agendamentos ── */}
        <div className="dash-card" style={{ position: 'sticky', top: '120px' }}>
          <div className="dash-card-header">
            <h3>Próximos Agendamentos</h3>
          </div>
          <div className="appt-list">
            {AGENDAMENTOS_FIXOS.map((ag, i) => (
              <div key={i} className="appt-item">
                <div className="appt-avatar">{ag.inicial}</div>
                <div className="appt-info">
                  <div className="appt-name">{ag.nome}</div>
                  <div className="appt-breed">{ag.servico}</div>
                </div>
                <div className="appt-time">
                  <div className="appt-date">{ag.data}</div>
                  <div className="appt-hour">{ag.hora}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
