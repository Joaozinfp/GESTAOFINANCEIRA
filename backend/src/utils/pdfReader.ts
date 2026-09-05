import fs from 'fs'
import { PDFParse } from 'pdf-parse'

export async function lerPDF(caminhoArquivo: string) {
  const arquivo = fs.readFileSync(caminhoArquivo)

  const parser = new PDFParse({
    data: arquivo,
  })

  const resultado = await parser.getText()

  await parser.destroy()

  return resultado.text
}