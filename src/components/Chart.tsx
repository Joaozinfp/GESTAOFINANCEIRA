import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { buscarEvolucao } from '../services/api'

interface Evolucao {
  mes: string
  receitas: number
  despesas: number
}

function formatarMes(mes: string) {
  const [ano, numeroMes] = mes.split('-')

  const data = new Date(
    Number(ano),
    Number(numeroMes) - 1,
  )

  return data
    .toLocaleDateString('pt-BR', {
      month: 'short',
    })
    .replace('.', '')
}

function Chart() {
  const [dados, setDados] = useState<Evolucao[]>([])
  const [meses, setMeses] = useState(6)

  useEffect(() => {
    async function carregarEvolucao() {
      try {
        const resultado = await buscarEvolucao(meses)

        setDados(resultado)
      } catch (error) {
        console.error(
          'Erro ao carregar evolução financeira:',
          error,
        )
      }
    }

    carregarEvolucao()
  }, [meses])

  return (
    <div>
      <div className="chart-filter">
        <select
          value={meses}
          onChange={(event) =>
            setMeses(Number(event.target.value))
          }
        >
          <option value={6}>Últimos 6 meses</option>
          <option value={12}>Últimos 12 meses</option>
        </select>
      </div>

      <div className="finance-chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={dados}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
            />

            <XAxis
              dataKey="mes"
              tickFormatter={formatarMes}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) =>
                `R$ ${Number(value).toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                })}`
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="receitas"
              name="Receitas"
              stroke="#256348"
              strokeWidth={3}
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="despesas"
              name="Despesas"
              stroke="#c65c5c"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Chart