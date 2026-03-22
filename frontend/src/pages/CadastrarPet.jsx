// ══════════════════════════════════════════════
// CadastrarPet.jsx — Formulário de cadastro de pets
// Props: pets, setPets, showToast
// Demonstra: useState para formulário, lista dinâmica
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Emoji por espécie
const PET_EMOJI = { Cachorro: '🐶', Gato: '🐱', Pássaro: '🐦', Peixe: '🐟', Coelho: '🐰', Outro: '🐾' }

export default function CadastrarPet({ pets, setPets, showToast }) {
  const navigate = useNavigate()

  // ── Estado do formulário ──
  const [nome,    setNome]    = useState('')
  const [especie, setEspecie] = useState('Cachorro')
  const [raca,    setRaca]    = useState('')
  const [sexo,    setSexo]    = useState('Macho')
  const [idade,   setIdade]   = useState('')
  const [dono,    setDono]    = useState('')
  const [obs,     setObs]     = useState('')

  // ── Ação: Salvar pet ──
  const salvarPet = () => {
    if (!nome.trim() || !dono.trim()) {
      showToast('Nome e Dono são obrigatórios.', 'error')
      return
    }

    // Cria novo pet e adiciona ao array
    const novoPet = {
      id: Date.now(), // ID único baseado no timestamp
      name: nome.trim(),
      especie,
      raca: raca.trim(),
      sexo,
      idade: idade.trim(),
      dono: dono.trim(),
      obs: obs.trim(),
    }

    setPets(prev => [...prev, novoPet])
    showToast(`Pet "${nome}" cadastrado com sucesso!`, 'success')

    // Reseta o formulário
    setNome(''); setRaca(''); setIdade(''); setDono(''); setObs('')
    setEspecie('Cachorro'); setSexo('Macho')
  }

  return (
    <div id="page-cadastrar" className="page">

      <div className="page-header-row">
        <div className="page-htitle">
          <h1>Cadastrar Pet</h1>
          <p>Adicione um novo animal ao sistema.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '28px', alignItems: 'start' }}>

        {/* ── Formulário ── */}
        <div className="form-card">

          <div className="fg">
            <label>Nome do Pet <span>*</span></label>
            <input
              className="fc"
              type="text"
              placeholder="Ex: Rex, Mel, Thor..."
              value={nome}
              onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="fg fg-row2">
            <div>
              <label>Espécie <span>*</span></label>
              <select className="fc" value={especie} onChange={e => setEspecie(e.target.value)}>
                <option>Cachorro</option>
                <option>Gato</option>
                <option>Pássaro</option>
                <option>Peixe</option>
                <option>Coelho</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label>Raça</label>
              <input
                className="fc"
                type="text"
                placeholder="Ex: Poodle"
                value={raca}
                onChange={e => setRaca(e.target.value)}
              />
            </div>
          </div>

          <div className="fg fg-row2">
            <div>
              <label>Sexo <span>*</span></label>
              <select className="fc" value={sexo} onChange={e => setSexo(e.target.value)}>
                <option>Macho</option>
                <option>Fêmea</option>
              </select>
            </div>
            <div>
              <label>Idade</label>
              <input
                className="fc"
                type="text"
                placeholder="Ex: 2 anos"
                value={idade}
                onChange={e => setIdade(e.target.value)}
              />
            </div>
          </div>

          <div className="fg">
            <label>Dono / Tutor <span>*</span></label>
            <input
              className="fc"
              type="text"
              placeholder="Nome do tutor"
              value={dono}
              onChange={e => setDono(e.target.value)}
            />
          </div>

          <div className="fg">
            <label>Observações</label>
            <textarea
              className="fc"
              placeholder="Alergias, cuidados especiais..."
              value={obs}
              onChange={e => setObs(e.target.value)}
            />
          </div>

          <div className="btn-form-row">
            <button className="btn-cancel-form" onClick={() => navigate('/dashboard')}>
              Cancelar
            </button>
            <button className="btn-save" onClick={salvarPet}>
              Cadastrar Pet
            </button>
          </div>
        </div>

        {/* ── Lista de Pets Cadastrados ── */}
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
            Pets Cadastrados
          </h3>

          {pets.length === 0 ? (
            <p style={{ color: 'var(--muted)', fontSize: '.875rem' }}>
              Nenhum pet cadastrado.
            </p>
          ) : (
            <div className="pets-grid">
              {pets.map(pet => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-card-top">
                    <div className="pet-avatar">
                      {PET_EMOJI[pet.especie] || '🐾'}
                    </div>
                    <div>
                      <div className="pet-pname">{pet.name}</div>
                      <div className="pet-species">{pet.especie} · {pet.raca || 'S/R'}</div>
                    </div>
                  </div>
                  <div className="pet-details">
                    <div><strong>Sexo:</strong> {pet.sexo}</div>
                    <div><strong>Idade:</strong> {pet.idade || '—'}</div>
                    <div><strong>Tutor:</strong> {pet.dono}</div>
                    {pet.obs && <div><strong>Obs:</strong> {pet.obs}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
