// ══════════════════════════════════════════════
// LoginDropdown.jsx — Dropdown de Login/Cadastro
// Props: isOpen, onClose, users, onLogin, onRegister
// ══════════════════════════════════════════════

import { useState } from 'react'

export default function LoginDropdown({ isOpen, onClose, users, onLogin, onRegister }) {
  // Aba ativa: 'login' ou 'register'
  const [tab, setTab] = useState('login')

  // Estado do formulário de login
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPwd, setLoginPwd]     = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginMsg, setLoginMsg]     = useState({ text: '', type: '' })

  // Estado do formulário de cadastro
  const [regName, setRegName]   = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPwd, setRegPwd]     = useState('')
  const [regPwdC, setRegPwdC]   = useState('')
  const [showRegPwd, setShowRegPwd]   = useState(false)
  const [showRegPwdC, setShowRegPwdC] = useState(false)
  const [regMsg, setRegMsg]     = useState({ text: '', type: '' })

  // ── Ação: Fazer Login ──
  const handleLogin = () => {
    if (!loginEmail || !loginPwd) {
      setLoginMsg({ text: 'Preencha todos os campos.', type: 'error' })
      return
    }
    const user = users.find(u => u.email === loginEmail && u.password === loginPwd)
    if (!user) {
      setLoginMsg({ text: 'E-mail ou senha incorretos.', type: 'error' })
      return
    }
    // Reseta o formulário após login bem-sucedido
    setLoginEmail(''); setLoginPwd(''); setLoginMsg({ text: '', type: '' })
    onLogin(user)
  }

  // ── Ação: Cadastrar conta ──
  const handleRegister = () => {
    if (!regName || !regEmail || !regPwd || !regPwdC) {
      setRegMsg({ text: 'Preencha todos os campos.', type: 'error' })
      return
    }
    if (regPwd.length < 6) {
      setRegMsg({ text: 'Senha: mínimo 6 caracteres.', type: 'error' })
      return
    }
    if (regPwd !== regPwdC) {
      setRegMsg({ text: 'As senhas não coincidem.', type: 'error' })
      return
    }
    if (users.find(u => u.email === regEmail)) {
      setRegMsg({ text: 'E-mail já cadastrado.', type: 'error' })
      return
    }
    // Adiciona usuário na lista local
    onRegister({ email: regEmail, password: regPwd, name: regName, role: 'user' })
    setRegMsg({ text: '✓ Conta criada! Faça login.', type: 'success' })
    setRegName(''); setRegEmail(''); setRegPwd(''); setRegPwdC('')
    setTimeout(() => { setTab('login'); setRegMsg({ text: '', type: '' }) }, 1500)
  }

  // ── Ícones SVG inline ──
  const IconLogin = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/>
      <polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
    </svg>
  )
  const IconRegister = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
    </svg>
  )
  const IconEye = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  )
  const IconEyeOff = () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  )

  return (
    // className com 'open' é o que faz o CSS mostrar (display:none → display:block)
    <div className={`login-dropdown ${isOpen ? 'open' : ''}`}>

      {/* ── Tabs: Entrar / Cadastrar ── */}
      <div className="dd-tabs">
        <button className={`dd-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>
          <IconLogin /> Entrar
        </button>
        <button className={`dd-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>
          <IconRegister /> Cadastrar
        </button>
      </div>

      {/* ── Painel de Login ── */}
      {tab === 'login' && (
        <div>
          <p className="dd-title">Faça seu login</p>
          <p className="dd-sub">Acesse com email e senha:</p>

          {loginMsg.text && (
            <div className={`dd-msg ${loginMsg.type}`}>{loginMsg.text}</div>
          )}

          <div className="dd-field">
            <label className="dd-label">Email: *</label>
            <input
              className="dd-input"
              type="email"
              placeholder="email@dominio.com"
              value={loginEmail}
              onChange={e => setLoginEmail(e.target.value)}
            />
          </div>

          <div className="dd-field">
            <label className="dd-label">Senha: *</label>
            <div className="pw-wrap">
              <input
                className="dd-input"
                type={showLoginPwd ? 'text' : 'password'}
                placeholder="Digite aqui"
                value={loginPwd}
                onChange={e => setLoginPwd(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
              <button className="pw-eye" onClick={() => setShowLoginPwd(o => !o)} type="button">
                {showLoginPwd ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>
            <div className="dd-forgot">Esqueceu a senha?</div>
          </div>

          <button className="btn-dd-main" onClick={handleLogin}>
            <IconLogin /> Entrar
          </button>
          <button className="btn-dd-sec" onClick={() => setTab('register')}>
            Cadastre-se
          </button>
          <button className="btn-dd-back" onClick={onClose}>Voltar</button>
        </div>
      )}

      {/* ── Painel de Cadastro ── */}
      {tab === 'register' && (
        <div>
          <p className="dd-title">Criar conta</p>
          <p className="dd-sub">Preencha os dados para criar sua conta.</p>

          {regMsg.text && (
            <div className={`dd-msg ${regMsg.type}`}>{regMsg.text}</div>
          )}

          <div className="dd-field">
            <label className="dd-label">Nome completo</label>
            <input
              className="dd-input"
              type="text"
              placeholder="Seu nome"
              value={regName}
              onChange={e => setRegName(e.target.value)}
            />
          </div>

          <div className="dd-field">
            <label className="dd-label">E-mail</label>
            <input
              className="dd-input"
              type="email"
              placeholder="seu@email.com"
              value={regEmail}
              onChange={e => setRegEmail(e.target.value)}
            />
          </div>

          <div className="dd-field">
            <label className="dd-label">Senha &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Confirmar</label>
            <div className="dd-row2">
              <div className="pw-wrap">
                <input
                  className="dd-input"
                  type={showRegPwd ? 'text' : 'password'}
                  placeholder="••••••"
                  value={regPwd}
                  onChange={e => setRegPwd(e.target.value)}
                />
                <button className="pw-eye" onClick={() => setShowRegPwd(o => !o)} type="button">
                  {showRegPwd ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
              <div className="pw-wrap">
                <input
                  className="dd-input"
                  type={showRegPwdC ? 'text' : 'password'}
                  placeholder="••••••"
                  value={regPwdC}
                  onChange={e => setRegPwdC(e.target.value)}
                />
                <button className="pw-eye" onClick={() => setShowRegPwdC(o => !o)} type="button">
                  {showRegPwdC ? <IconEyeOff /> : <IconEye />}
                </button>
              </div>
            </div>
          </div>

          <button className="btn-dd-main" onClick={handleRegister}>
            <IconRegister /> Criar Conta
          </button>
          <button className="btn-dd-back" onClick={() => setTab('login')}>
            Já tenho conta → Entrar
          </button>
        </div>
      )}
    </div>
  )
}
