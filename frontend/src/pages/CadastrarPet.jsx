// ══════════════════════════════════════════════
// CadastrarPet.jsx — Formulário de cadastro de pets
// Props: pets, setPets, showToast
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const PET_EMOJI = { Cachorro:'🐶', Gato:'🐱', Pássaro:'🐦', Peixe:'🐟', Coelho:'🐰', Outro:'🐾' }

export default function CadastrarPet({ pets, setPets, showToast }) {
  const navigate = useNavigate()

  const [nome,    setNome]    = useState('')
  const [especie, setEspecie] = useState('Cachorro')
  const [raca,    setRaca]    = useState('')
  const [sexo,    setSexo]    = useState('Macho')
  const [idade,   setIdade]   = useState('')
  const [dono,    setDono]    = useState('')
  const [obs,     setObs]     = useState('')

  const salvarPet = () => {
    if (!nome.trim() || !dono.trim()) {
      showToast('Nome e Dono são obrigatórios.', 'error')
      return
    }
    const novoPet = {
      id: Date.now(),
      name: nome.trim(), especie,
      raca: raca.trim(), sexo,
      idade: idade.trim(), dono: dono.trim(), obs: obs.trim(),
    }
    setPets(prev => [...prev, novoPet])
    showToast(`Pet "${nome}" cadastrado com sucesso!`, 'success')
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

      {/*
        Layout responsivo:
        • Desktop: form (esquerda, order:1) | pets (direita, order:2)
        • Mobile: DOM order → pets aparece PRIMEIRO, form abaixo
        O truque é: no DOM os pets vêm antes do form,
        e no desktop usamos CSS order para inverter a posição visual.
      */}
      <div className="cadastrar-layout">

        {/* ── Lista de Pets — aparece 1ª no mobile, 2ª no desktop (order via CSS) ── */}
        <div className="cadastrar-pets-col">
          <h3 style={{ fontSize:'1rem', fontWeight:800, marginBottom:'16px' }}>
            Pets Cadastrados
          </h3>

          {pets.length === 0 ? (
            <div className="pets-empty">
              <span style={{ fontSize:'2.5rem' }}>🐾</span>
              <p style={{ color:'var(--muted)', fontSize:'.875rem', marginTop:8 }}>
                Nenhum pet cadastrado ainda.
              </p>
            </div>
          ) : (
            <div className="pets-grid-cadastrar">
              {pets.map(pet => (
                <div key={pet.id} className="pet-card">
                  <div className="pet-card-top">
                    <div className="pet-avatar">{PET_EMOJI[pet.especie] || '🐾'}</div>
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

        {/* ── Formulário — aparece 2ª no mobile, 1ª no desktop (order via CSS) ── */}
        <div className="form-card cadastrar-form-col">

          <div className="fg">
            <label>Nome do Pet <span>*</span></label>
            <input
              className="fc" type="text"
              placeholder="Ex: Rex, Mel, Thor..."
              value={nome} onChange={e => setNome(e.target.value)}
            />
          </div>

          <div className="fg fg-row2">
            <div>
              <label>Espécie <span>*</span></label>
              <select className="fc" value={especie} onChange={e => setEspecie(e.target.value)}>
                <option>Cachorro</option><option>Gato</option>
                <option>Pássaro</option><option>Peixe</option>
                <option>Coelho</option><option>Outro</option>
              </select>
            </div>
            <div>
              <label>Raça</label>
              <input className="fc" type="text" placeholder="Ex: Poodle"
                value={raca} onChange={e => setRaca(e.target.value)} />
            </div>
          </div>

          <div className="fg fg-row2">
            <div>
              <label>Sexo <span>*</span></label>
              <select className="fc" value={sexo} onChange={e => setSexo(e.target.value)}>
                <option>Macho</option><option>Fêmea</option>
              </select>
            </div>
            <div>
              <label>Idade</label>
              <input className="fc" type="text" placeholder="Ex: 2 anos"
                value={idade} onChange={e => setIdade(e.target.value)} />
            </div>
          </div>

          <div className="fg">
            <label>Dono / Tutor <span>*</span></label>
            <input className="fc" type="text" placeholder="Nome do tutor"
              value={dono} onChange={e => setDono(e.target.value)} />
          </div>

          <div className="fg">
            <label>Observações</label>
            <textarea className="fc" placeholder="Alergias, cuidados especiais..."
              value={obs} onChange={e => setObs(e.target.value)} />
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

      </div>
    </div>
  )
}
