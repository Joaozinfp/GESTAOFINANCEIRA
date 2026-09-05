import { ChangeEvent, useEffect, useState } from 'react'
import { buscarTransacoes } from '../services/api'

function Extrato() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [enviando, setEnviando] = useState(false)
  const [mensagem, setMensagem] = useState('')
  const [transacoes, setTransacoes] = useState<any[]>([])
  const [carregandoTransacoes, setCarregandoTransacoes] = useState(true)

async function carregarTransacoes() {
  try {
    const usuarioSalvo = localStorage.getItem('usuario')

if (!usuarioSalvo){
  return
}

const usuario = JSON.parse(usuarioSalvo)

const dados = await buscarTransacoes(usuario.id)

    setTransacoes(dados)
  } catch (error) {
    console.error('Erro ao carregar transações:', error)
  } finally {
    setCarregandoTransacoes(false)
  }
}

useEffect(() => {
  carregarTransacoes()
}, [])

  function selecionarArquivo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setArquivo(file)
    setMensagem('')
  }

  async function enviarArquivo() {
    if (!arquivo) {
      return
    }

    setEnviando(true)
    setMensagem('')

    try {
      const formData = new FormData()

      formData.append('extrato', arquivo)

      const usuarioSalvo = localStorage.getItem('usuario')

if (!usuarioSalvo) {
  setMensagem('Usuário não encontrado.')
  return
}

const usuario = JSON.parse(usuarioSalvo)

formData.append('usuario_id', String(usuario.id))

      const response = await fetch(
        'http://localhost:3000/extrato/upload',
        {
          method: 'POST',
          body: formData,
        },
      )

      const data = await response.json()

      if (!response.ok) {
        setMensagem(data.mensagem || 'Erro ao enviar o extrato.')
        return
      }

      setMensagem('Extrato enviado com sucesso!')

await carregarTransacoes()
    } catch (error) {
      console.error('Erro ao enviar extrato:', error)
      setMensagem('Não foi possível conectar ao servidor.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="extrato-page">
      <div className="extrato-header">
        <div>
          <span>Importação</span>

          <h1>Importar extrato</h1>

          <p>
            Envie seu extrato bancário em PDF para organizar suas
            movimentações automaticamente.
          </p>
        </div>
      </div>

      <div className="upload-card">
        <div className="upload-icon">PDF</div>

        <h2>Envie seu extrato bancário</h2>

        <p>
          Selecione um arquivo PDF do seu computador.
        </p>

        <label className="upload-button">
          Selecionar PDF

          <input
            type="file"
            accept=".pdf,application/pdf"
            hidden
            onChange={selecionarArquivo}
          />
        </label>

        {arquivo && (
          <div className="selected-file">
            <strong>Arquivo selecionado:</strong>

            <span>{arquivo.name}</span>
          </div>
        )}

        {arquivo && (
          <button
            type="button"
            className="send-file-button"
            onClick={enviarArquivo}
            disabled={enviando}
          >
            {enviando ? 'Enviando...' : 'Enviar extrato'}
          </button>
        )}

        {mensagem && (
          <div className="upload-message">
            {mensagem}
          </div>
        )}

        <span className="upload-info">
          Formato permitido: PDF
        </span>
      </div>

      <div className="transactions-list">
        <div className="transactions-list-header">
          <div>
            <span>Movimentações</span>
            <h2>Extrato importado</h2>
          </div>

          <span className="transaction-count">
            {transacoes.length} transações
          </span>
        </div>

        {carregandoTransacoes ? (
          <p className="transactions-loading">
            Carregando transações...
          </p>
        ) : transacoes.length === 0 ? (
          <p className="transactions-empty">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <div className="transactions-table-wrapper">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição</th>
                  <th>Categoria</th>
                  <th>Tipo</th>
                  <th>Valor</th>
                </tr>
              </thead>

              <tbody>
                {transacoes.map((transacao) => (
                  <tr key={transacao.id}>
                    <td>
                      {new Date(
                        transacao.data_transacao + 'T00:00:00',
                      ).toLocaleDateString('pt-BR')}
                    </td>

                    <td>{transacao.descricao}</td>

                    <td>
                      <span className="transaction-category">
                        {transacao.categoria}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          transacao.tipo === 'receita'
                            ? 'transaction-type income'
                            : 'transaction-type expense'
                        }
                      >
                        {transacao.tipo === 'receita'
                          ? 'Receita'
                          : 'Despesa'}
                      </span>
                    </td>

                    <td
                      className={
                        transacao.tipo === 'receita'
                          ? 'transaction-value income'
                          : 'transaction-value expense'
                      }
                    >
                      {transacao.tipo === 'receita' ? '+' : '-'} R${' '}
                      {Number(transacao.valor).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default Extrato