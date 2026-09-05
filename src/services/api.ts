const API_URL = 'http://localhost:3000'

export async function buscarTransacoes(usuarioId: number) {
  const response = await fetch(
    `${API_URL}/transacoes?usuario_id=${usuarioId}`,
  )

  if (!response.ok) {
    throw new Error('Erro ao buscar transações.')
  }

  return response.json()
}


export async function buscarResumo(usuarioId: number) {
  const response = await fetch(
    `${API_URL}/resumo?usuario_id=${usuarioId}`,
  )
  if (!response.ok) {
    throw new Error('Erro ao buscar resumo financeiro.')
  }

  return response.json()
}

export async function buscarDespesasPorCategoria(usuarioId: number) {
  const response = await fetch(
    `${API_URL}/resumo/despesas-categoria?usuario_id=${usuarioId}`,
  )

  if (!response.ok) {
    throw new Error(
      'Erro ao buscar despesas por categoria.',
    )
  }

  return response.json()
}
export async function buscarEvolucao(meses: number) {
  const response = await fetch(
    `${API_URL}/resumo/evolucao?meses=${meses}`,
  )

  if (!response.ok) {
    throw new Error(
      'Erro ao buscar evolução financeira.',
    )
  }

  return response.json()
}