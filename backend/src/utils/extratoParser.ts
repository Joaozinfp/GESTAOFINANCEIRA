export interface TransacaoExtraida {
  data: string
  descricao: string
  valor: number
  tipo: 'receita' | 'despesa'
}

export function extrairTransacoes(texto: string): TransacaoExtraida[] {
  const linhas = texto
    .split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)

  const transacoes: TransacaoExtraida[] = []

  for (const linha of linhas) {
    const correspondencia = linha.match(
      /^(\d{2}\/\d{2}\/\d{4})\s+(.+?)\s+([+-])\s*R\$\s*([\d.,]+)$/
    )

    if (!correspondencia) {
      continue
    }

    const [, data, descricao, sinal, valorTexto] = correspondencia

    const valor = Number(
      valorTexto.replace(/\./g, '').replace(',', '.')
    )

    if (Number.isNaN(valor)) {
      continue
    }

    const partesData = data.split('/')

    const dataFormatada = `${partesData[2]}-${partesData[1]}-${partesData[0]}`

    transacoes.push({
      data: dataFormatada,
      descricao: descricao.trim(),
      valor,
      tipo: sinal === '+' ? 'receita' : 'despesa',
    })
  }

  return transacoes
}