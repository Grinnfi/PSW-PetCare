// ══════════════════════════════════════════════
// CadastrarPet.jsx — Redux, isolamento por usuário
// ══════════════════════════════════════════════

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addPet } from '../store/petsSlice'

const PET_EMOJI = {
  Cachorro: '🐶', Gato: '🐱', Pássaro: '🐦',
  Peixe: '🐟', Coelho: '🐰', Outro: '🐾',
}

export default function CadastrarPet({ showToast }) {
  const navigate    = useNavigate()
  const dispatch    = useDispatch()
  const currentUser = useSelector(s => s.auth.currentUser)
  const allPets     = useSelector(s => s.pets.list)
  const petsStatus  = useSelector(s => s.pets.status)
  const isAdmin     = currentUser?.role === 'admin'

  // Admin vê todos; cliente vê só os seus
  const pets = isAdmin
    ? allPets
    : allPets.filter(p => p.donoId === currentUser?.id)

  const [nome,    setNome]    = useState('')
  const [especie, setEspecie] = useState('Cachorro')
  const [raca,    setRaca]    = useState('')
  const [sexo,    setSexo]    = useState('Macho')
  const [idade,   setIdade]   = useState('')
  const [obs,     setObs]     = useState('')

  const salvarPet = async () => {
    if (!currentUser) { showToast('Faça login para cadastrar um pet.', 'error'); return }
    if (!nome.trim()) { showToast('Nome é obrigatório.', 'error'); return }

    await dispatch(addPet({
      name:     nome.trim(),
      especie,
      raca:     raca.trim(),
      sexo,
      idade:    idade.trim(),
      obs:      obs.trim(),
      donoId:   currentUser.id,
      donoNome: currentUser.name,
    }))

    showToast(`Pet "${nome}" cadastrado com sucesso!`, 'success')
    setNome(''); setRaca(''); setIdade(''); setObs('')
    setEspecie('Cachorro'); setSexo('Macho')
  }

  // Proteção: se não há usuário logado, não renderiza nada problemático
  if (!currentUser) {
    return (
      <div className="page" style={{ padding: '40px', textAlign: 'center', color: 'var(--muted)' }}>
        <p>Faça login para acessar esta página.</p>
      </div>
    )
  }

  return (
    <div id="page-cadastrar" className="page">
      <div className="page-header-row">
        <div className="page-htitle">
          <h1>Cadastrar Pet</h1>
          <p>Adicione um novo animal ao sistema.</p>
        </div>
      </div>

      <div className="cadastrar-layout">

        {/* ── Formulário (coluna esquerda) ── */}
        <div className="form-card cadastrar-form-col">
          <div className="fg">
            <label>Nome do Pet <span>*</span></label>
            <input
              className="fc" type="text" placeholder="Ex: Rex, Mel, Thor..."
              value={nome} onChange={e => setNome(e.target.value)}
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
                className="fc" type="text" placeholder="Ex: Poodle"
                value={raca} onChange={e => setRaca(e.target.value)}
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
                className="fc" type="text" placeholder="Ex: 2 anos"
                value={idade} onChange={e => setIdade(e.target.value)}
              />
            </div>
          </div>

          {/* Dono — somente leitura, preenchido automaticamente */}
          <div className="fg">
            <label>Dono / Tutor <span>*</span></label>
            <input
              className="fc"
              type="text"
              value={currentUser.name}
              readOnly
              style={{ background: 'var(--bg)', color: 'var(--muted)', cursor: 'not-allowed' }}
            />
          </div>

          <div className="fg">
            <label>Observações</label>
            <textarea
              className="fc" placeholder="Alergias, cuidados especiais..."
              value={obs} onChange={e => setObs(e.target.value)}
            />
          </div>

          <div className="btn-form-row">
            <button className="btn-cancel-form" onClick={() => navigate('/dashboard')}>Cancelar</button>
            <button className="btn-save" onClick={salvarPet}>Cadastrar Pet</button>
          </div>
        </div>

        {/* ── Lista de Pets (coluna direita) ── */}
        <div className="cadastrar-pets-col">
          <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '16px' }}>
            {isAdmin ? 'Todos os Pets Cadastrados' : 'Pets Cadastrados'}
          </h3>

          {petsStatus === 'loading' && (
            <p style={{ color: 'var(--muted)', fontSize: '.875rem' }}>Carregando pets...</p>
          )}

          {petsStatus !== 'loading' && pets.length === 0 && (
            <div className="pets-empty">
              <span style={{ fontSize: '2.5rem' }}>🐾</span>
              <p style={{ color: 'var(--muted)', fontSize: '.875rem', marginTop: 8 }}>
                Nenhum pet cadastrado ainda.
              </p>
            </div>
          )}

          {pets.map(pet => (
            <div key={pet.id} className="pet-card">
              <div className="pet-card-top">
                <div className="pet-avatar">{PET_EMOJI[pet.especie] || '🐾'}</div>
                <div>
                  <div className="pet-pname">{pet.name}</div>
                  <div className="pet-species">
                    {pet.especie}{pet.raca ? ` · ${pet.raca}` : ''}
                  </div>
                </div>
              </div>
              <div className="pet-details">
                <div><strong>Sexo:</strong> {pet.sexo}</div>
                <div><strong>Idade:</strong> {pet.idade || '—'}</div>
                <div><strong>Tutor:</strong> {pet.donoNome}</div>
                {pet.obs && <div><strong>Obs:</strong> {pet.obs}</div>}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}