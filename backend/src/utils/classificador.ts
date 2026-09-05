export function classificarTransacao(descricao: string): string {
  const texto = descricao.toLowerCase()

  if (
    texto.includes('supermercado') ||
    texto.includes('restaurante')
  ) {
    return 'Alimentação'
  }

  if (
    texto.includes('uber') ||
    texto.includes('posto') ||
    texto.includes('transporte')
  ) {
    return 'Transporte'
  }

  if (
    texto.includes('farmácia') ||
    texto.includes('farmacia')
  ) {
    return 'Saúde'
  }

  if (
    texto.includes('netflix') ||
    texto.includes('spotify') ||
    texto.includes('assinatura')
  ) {
    return 'Assinaturas'
  }

  if (
    texto.includes('roupas') ||
    texto.includes('loja')
  ) {
    return 'Compras'
  }

  return 'Outros'
}