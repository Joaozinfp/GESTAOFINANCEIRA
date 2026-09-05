import { FormEvent, useState } from 'react'
import Dashboard from './pages/Dashboard'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [message, setMessage] = useState('')
  const [loggedIn, setLoggedIn] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setMessage('')

    if (!email || !password) {
      setMessage('Preencha todos os campos.')
      return
    }

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          senha: password,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage(data.mensagem || 'E-mail ou senha incorretos.')
        return
      }

      if (remember) {
        localStorage.setItem('rememberLogin', email)
      }

     console.log('Usuário logado:', data.usuario)

localStorage.setItem(
  'usuario',
  JSON.stringify(data.usuario)
)

setLoggedIn(true)
    } catch (error) {
      console.error('Erro ao conectar com a API:', error)
      setMessage('Não foi possível conectar ao servidor.')
    }
  }

  if (loggedIn) {
    return <Dashboard />
  }

  return (
    <main className="page">
      <section className="login-card" aria-label="Tela de login">
        <div className="brand">
          <div className="brand-mark">E</div>

          <div>
            <strong>Empresa</strong>
            <span>Acesso ao sistema</span>
          </div>
        </div>

        <div className="heading">
          <p className="eyebrow">BEM-VINDO</p>

          <h1>Entre na sua conta</h1>

          <p>Informe seus dados para continuar.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email">E-mail</label>

          <input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
          />

          <div className="password-label">
            <label htmlFor="password">Senha</label>

            <button
              type="button"
              className="link-button"
              onClick={() =>
                setMessage(
                  'Recuperação de senha: conecte esta ação ao seu backend.',
                )
              }
            >
              Esqueci minha senha
            </button>
          </div>

          <div className="password-wrapper">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="eye-button"
              aria-label={
                showPassword ? 'Ocultar senha' : 'Mostrar senha'
              }
              onClick={() =>
                setShowPassword((current) => !current)
              }
            >
              {showPassword ? 'Ocultar' : 'Mostrar'}
            </button>
          </div>

          <label className="remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) =>
                setRemember(event.target.checked)
              }
            />

            <span>Manter conectado</span>
          </label>

          <button className="submit-button" type="submit">
            Entrar
          </button>

          {message && (
            <div
              className={`message ${
                message.includes('sucesso')
                  ? 'success'
                  : 'error'
              }`}
            >
              {message}
            </div>
          )}
        </form>

        <div className="divider">
          <span>ou</span>
        </div>

        <p className="signup">
          Ainda não possui uma conta?

          <button
            type="button"
            onClick={() =>
              setMessage(
                'Cadastro: conecte esta ação à sua tela de cadastro.',
              )
            }
          >
            Criar conta
          </button>
        </p>
      </section>
    </main>
  )
}

export default App