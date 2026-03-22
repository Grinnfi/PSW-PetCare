// ══════════════════════════════════════════════
// Historico.jsx — Histórico de serviços e compras
// ══════════════════════════════════════════════

// Dados fixos (futuramente virão de uma API)
const HISTORICO = [
  {
    icon: '🛁',
    titulo: 'Banho & Tosa – Mel',
    sub: 'Poodle · Ana Lima',
    data: '10 mar 2026',
    valor: 'R$ 55,00',
    valorColor: 'var(--p)',
    status: 'done',
    statusLabel: 'Concluído',
  },
  {
    icon: '🩺',
    titulo: 'Consulta Veterinária – Thor',
    sub: 'Golden Retriever · Carlos Souza',
    data: '05 mar 2026',
    valor: 'R$ 90,00',
    valorColor: 'var(--p)',
    status: 'done',
    statusLabel: 'Concluído',
  },
  {
    icon: '🛒',
    titulo: 'Pedido #2841 – 3 produtos',
    sub: 'Ração, Shampoo, Coleira',
    data: '28 fev 2026',
    valor: 'R$ 163,80',
    valorColor: 'var(--p)',
    status: 'done',
    statusLabel: 'Entregue',
  },
  {
    icon: '💉',
    titulo: 'Vacinação – Mel',
    sub: 'Poodle · Clínica PetCare',
    data: '17 mar 2026',
    valor: 'R$ 55,00',
    valorColor: 'var(--yellow)',
    status: 'pend',
    statusLabel: 'Pendente',
  },
]

export default function Historico() {
  return (
    <div id="page-historico" className="page">

      <div className="page-htitle" style={{ marginBottom: '20px' }}>
        <h1>Histórico</h1>
        <p>Serviços e compras realizados.</p>
      </div>

      <div className="hist-list">
        {HISTORICO.map((item, i) => (
          <div key={i} className="hist-item">
            <div className="hist-icon">{item.icon}</div>
            <div className="hist-info">
              <div className="hist-title">{item.titulo}</div>
              <div className="hist-sub">{item.sub}</div>
            </div>
            <div>
              <div className="hist-date">{item.data}</div>
              <div className="hist-date" style={{ marginTop: '4px', fontWeight: 800, color: item.valorColor }}>
                {item.valor}
              </div>
            </div>
            <span className={`hist-status ${item.status}`}>{item.statusLabel}</span>
          </div>
        ))}
      </div>

    </div>
  )
}
