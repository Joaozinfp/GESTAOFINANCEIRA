import { useEffect, useState } from 'react'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { buscarDespesasPorCategoria } from '../services/api'

interface DespesaCategoria {
  categoria: string
  valor: number
}

const cores = [
  '#256348',
  '#4f8f68',
  '#7aae87',
  '#a8c7ad',
  '#d0ddd2',
]

function ExpenseChart() {
  const [dados, setDados] = useState<DespesaCategoria[]>([])

  useEffect(() => {
  async function carregarDespesas() {
    try {
      const usuarioSalvo = localStorage.getItem('usuario')

      if (!usuarioSalvo) {
        return
      }

      const usuario = JSON.parse(usuarioSalvo)

      const resultado = await buscarDespesasPorCategoria(usuario.id)

      setDados(resultado)
    } catch (error) {
      console.error(
        'Erro ao carregar despesas por categoria:',
        error,
      )
    }
  }

  carregarDespesas()
}, [])

  return (
    <div className="expense-chart">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dados}
            dataKey="valor"
            nameKey="categoria"
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
          >
            {dados.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={cores[index % cores.length]}
              />
            ))}
          </Pie>

          <Tooltip
            formatter={(value) =>
              `R$ ${Number(value).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
              })}`
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ExpenseChart