// ══════════════════════════════════════════════
// Agendar.jsx — Agendamento de serviços (Redux)
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addAgendamento } from '../store/agendamentosSlice'

const SERVICOS = [
  { emoji: '🛁', nome: 'Banho & Tosa',        preco: 'A partir de R$ 45,00' },
  { emoji: '🩺', nome: 'Consulta Veterinária', preco: 'A partir de R$ 90,00' },
  { emoji: '💉', nome: 'Vacinação',            preco: 'A partir de R$ 55,00' },
  { emoji: '🏠', nome: 'Hotel Pet',            preco: 'A partir de R$ 80,00/dia' },
]

const HORAS = ['08:00','09:00','10:00','11:00','13:00','14:00','15:00','16:00','17:00']

export default function Agendar({ showToast }) {
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const currentUser = useSelector(s => s.auth.currentUser)
  const allPets     = useSelector(s => s.pets.list)
  const isAdmin     = currentUser?.role === 'admin'

  // Cada usuário agenda apenas com seus pets
  const pets = isAdmin ? allPets : allPets.filter(p => p.donoId === currentUser?.id)

  // Agendamentos: admin vê todos, cliente vê os seus
  const allAgendamentos = useSelector(s => s.agendamentos.list)
  const proximosAgs = isAdmin
    ? allAgendamentos.filter(a => a.status === 'pendente')
    : allAgendamentos.filter(a => a.donoId === currentUser?.id && a.status === 'pendente')

  const [servicoSelecionado, setServicoSelecionado] = useState('')
  const [data, setData] = useState('')
  const [hora, setHora] = useState('08:00')
  const [petId, setPetId] = useState(pets[0]?.id || '')

  const confirmarAgendamento = async () => {
    if (!servicoSelecionado) { showToast('Selecione um serviço.', 'error'); return }
    if (!data) { showToast('Selecione uma data.', 'error'); return }
    if (pets.length === 0) { showToast('Cadastre um pet primeiro.', 'error'); return }

    const pet = pets.find(p => p.id === Number(petId)) || pets[0]

    const novoAg = {
      petId:    pet.id,
      petNome:  pet.name,
      petEspecie: pet.especie,
      donoId:   currentUser.id,
      donoNome: currentUser.name,
      servico:  servicoSelecionado,
      data, hora,
      status: 'pendente',
    }

    await dispatch(addAgendamento(novoAg))
    showToast(`Agendamento de "${servicoSelecionado}" confirmado!`, 'success')
    setTimeout(() => navigate('/dashboard'), 1200)
  }

  const fmtData = (d) => {
    if (!d) return ''
    const [a, m, dia] = d.split('-')
    return `${dia}/${m}/${a}`
  }

  return (
    <div id="page-agendar" className="page">
      <div className="page-header-row">
        <div className="page-htitle">
          <h1>Agendar Serviço</h1>
          <p>Escolha o serviço e horário ideal para o seu pet.</p>
        </div>
      </div>

      <div className="agendar-layout">
        <div>
          <h3 style={{ fontSize:'.85rem', fontWeight:700, textTransform:'uppercase', letterSpacing:'.06em', color:'var(--muted)', marginBottom:'14px' }}>
            Selecione o Serviço
          </h3>
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

          <div className="form-card" style={{ marginTop:'20px' }}>
            <div className="fg fg-row2">
              <div>
                <label className="fg">
                  <span style={{ fontSize:'.8rem', fontWeight:700, display:'block', marginBottom:7 }}>Pet</span>
                  <select className="fc" value={petId} onChange={e => setPetId(e.target.value)}>
                    {pets.length === 0
                      ? <option value="">Nenhum pet cadastrado</option>
                      : pets.map(p => <option key={p.id} value={p.id}>{p.name}{isAdmin ? ` (${p.donoNome})` : ''}</option>)
                    }
                  </select>
                </label>
              </div>
              <div>
                <label className="fg">
                  <span style={{ fontSize:'.8rem', fontWeight:700, display:'block', marginBottom:7 }}>Data</span>
                  <input
                    className="fc" type="date" value={data}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setData(e.target.value)}
                  />
                </label>
              </div>
            </div>
            <div className="fg">
              <label style={{ fontSize:'.8rem', fontWeight:700, display:'block', marginBottom:7 }}>Horário</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                {HORAS.map(h => (
                  <button
                    key={h} onClick={() => setHora(h)}
                    style={{
                      padding:'7px 14px', borderRadius:8, border:'1.5px solid',
                      borderColor: hora === h ? 'var(--p)' : 'var(--border)',
                      background:  hora === h ? 'var(--p-light)' : '#fff',
                      color:       hora === h ? 'var(--p)' : 'var(--text)',
                      fontSize:'.82rem', fontWeight:600, cursor:'pointer', transition:'all .15s'
                    }}
                  >{h}</button>
                ))}
              </div>
            </div>
            <button className="btn-primary" style={{ width:'100%', justifyContent:'center', marginTop:8 }} onClick={confirmarAgendamento}>
              Confirmar Agendamento
            </button>
          </div>
        </div>

        {/* ── Coluna lateral: próximos agendamentos ── */}
        <div className="dash-card">
          <div className="dash-card-header">
            <h3>{isAdmin ? 'Todos os Pendentes' : 'Meus Próximos'}</h3>
            <span className="dash-card-link" onClick={() => navigate('/historico')}>Ver todos →</span>
          </div>
          <div className="appt-list">
            {proximosAgs.length === 0 ? (
              <p style={{ padding:'16px 22px', color:'var(--muted)', fontSize:'.875rem' }}>Nenhum agendamento pendente.</p>
            ) : (
              proximosAgs.slice(0, 5).map((a, i) => (
                <div key={i} className="appt-item">
                  <div className="appt-avatar">{a.petNome?.[0] || '?'}</div>
                  <div className="appt-info">
                    <div className="appt-name">{a.petNome}</div>
                    <div className="appt-breed">{a.servico}{isAdmin ? ` · ${a.donoNome}` : ''}</div>
                  </div>
                  <div className="appt-time">
                    <div className="appt-date">{fmtData(a.data)}</div>
                    <div className="appt-hour">{a.hora}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
