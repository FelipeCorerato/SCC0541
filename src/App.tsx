import { useState } from 'react'
import wallpaper from './assets/wallpaper.jpg'
import './App.css'
import './styles/Dashboard.css'
import Sidebar from './components/Sidebar'
import TotalSidebar from './components/TotalSidebar'
import Summary from './components/Resumo'
import Records from './components/Cadastro'
import Reports from './components/Relatorios'
import { login, type User } from './services/auth'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeScreen, setActiveScreen] = useState('resumo')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const authenticatedUser = await login(username, password)
      setUser(authenticatedUser)
      setIsLoggedIn(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao fazer login')
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUser(null)
    setUsername('')
    setPassword('')
    setActiveScreen('resumo')
    setError('')
  }

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen)
  }

  if (isLoggedIn) {
    return (
      <div className="dashboard-container">
        <Sidebar 
          activeScreen={activeScreen} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          user={user}
        />
        
        {activeScreen === 'resumo' && <Summary />}
        {activeScreen === 'cadastros' && <Records />}
        {activeScreen === 'relatorios' && <Reports />}
        
        <TotalSidebar />
      </div>
    )
  }

  return (
    <div className="login-container">
      <div className="login-wallpaper">
        <img src={wallpaper} alt="Formula 1" />
      </div>
      <div className="login-form-container">
        <div className="login-form">
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-circle">
                <div className="logo-gradient"></div>
              </div>
              <h2>F1 Data Explorer</h2>
            </div>
            
            <h1>Bem-vindo</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label>Login</label>
              <input 
                type="text" 
                placeholder="Usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <div className="form-group">
              <label>Senha</label>
              <input 
                type="password" 
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>
            
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
