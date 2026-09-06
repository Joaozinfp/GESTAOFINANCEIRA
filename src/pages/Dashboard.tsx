import { useEffect, useState } from 'react'
import Chart from '../components/Chart'
import ExpenseChart from '../components/ExpenseChart'
import Extrato from './Extrato'
import { buscarResumo, buscarTransacoes } from '../services/api'

function Dashboard() {
  const [resumo, setResumo] = useState({
    saldo: 0,
    receitas: 0,
    despesas: 0,
  })

  const [transacoes, setTransacoes] = useState<any[]>([])

  const [pagina, setPagina] = useState('dashboard')

  useEffect(() => {
    async function carregarDados() {
      try {
       const usuarioSalvo =
  localStorage.getItem('usuario') ||
  sessionStorage.getItem('usuario')

if (!usuarioSalvo) {
  return
}
const usuario = JSON.parse(usuarioSalvo)

const [dadosResumo, dadosTransacoes] = await Promise.all([
  buscarResumo(usuario.id),
  buscarTransacoes(usuario.id),
])

        setResumo(dadosResumo)
        setTransacoes(dadosTransacoes)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }

    carregarDados()
  }, [])
    return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo">
          <span>F</span>
          FinanceControl
        </div>

       <nav className="menu">
  <button
    className={`menu-item ${pagina === 'dashboard' ? 'active' : ''}`}
    onClick={() => setPagina('dashboard')}
  >
    Dashboard
  </button>

  <button
    className={`menu-item ${pagina === 'extrato' ? 'active' : ''}`}
    onClick={() => setPagina('extrato')}
  >
    Extratos
  </button>

  
  <button className="menu-item">Relatórios</button>
  <button className="menu-item">Configurações</button>
</nav>
      </aside>

      <main className="dashboard-content">
        {pagina === 'extrato' ? (
            <Extrato />
            ) : (
             <>
        <header className="dashboard-header">
          <div>
            <p>Visão geral</p>
            <h1>Dashboard</h1>
          </div>

          <div className="user">
            <div className="user-avatar">A</div>

            <div>
              <strong>
  {JSON.parse(
    localStorage.getItem('usuario') ||
    sessionStorage.getItem('usuario') ||
    '{}'
  ).nome}
</strong>
<span>Minha conta</span>
            </div>
          </div>
        </header>

        <section className="summary-cards">

  <div className="summary-card">
    <div className="summary-card-top">
      <span>Saldo atual</span>

      <div className="card-icon">
        R$
      </div>
    </div>

    <strong className="card-value">
      R$ {resumo.saldo.toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
})}
    </strong>

    <div className="card-footer">
      <span className="positive">
        ↑ 8,4%
      </span>

      <span>vs. mês anterior</span>
    </div>
  </div>


  <div className="summary-card">
    <div className="summary-card-top">
      <span>Receitas</span>

      <div className="card-icon">
        ↑
      </div>
    </div>

    <strong className="card-value">
      R$ {resumo.receitas.toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
})}
    </strong>

    <div className="card-footer">
      <span className="positive">
        ↑ 12,6%
      </span>

      <span>vs. mês anterior</span>
    </div>
  </div>


  <div className="summary-card">
    <div className="summary-card-top">
      <span>Despesas</span>

      <div className="card-icon">
        ↓
      </div>
    </div>

    <strong className="card-value">
      R$ {resumo.despesas.toLocaleString('pt-BR', {
  minimumFractionDigits: 2,
})}
    </strong>

    <div className="card-footer">
      <span className="negative">
        ↓ 4,2%
      </span>

      <span>vs. mês anterior</span>
    </div>
  </div>

</section>

        <section className="dashboard-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <span>Evolução</span>
                <h2>Movimentação financeira</h2>
              </div>

              
            </div>

           <Chart />
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <span>Categorias</span>
                <h2>Despesas</h2>
              </div>
            </div>

           <ExpenseChart />
          </div>
        </section>

        <section className="panel transactions-panel">
          <div className="panel-header">
            <div>
              <span>Movimentações</span>
              <h2>Últimas transações</h2>
            </div>

            <button className="view-all">
              Ver todas
            </button>
          </div>

{transacoes.slice(0, 5).map((transacao) => (
  <div className="transaction" key={transacao.id}>
    <div>
      <strong>{transacao.descricao}</strong>
      <span>{transacao.categoria}</span>
    </div>

    <strong
      className={
        transacao.tipo === 'receita'
          ? 'income'
          : 'expense'
      }
    >
      {transacao.tipo === 'receita' ? '+' : '-'} R${' '}
      {Number(transacao.valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
      })}
    </strong>
  </div>
))}
        </section>
          
        </>
            )}
      </main>
    </div>
  )
}

export default Dashboard;