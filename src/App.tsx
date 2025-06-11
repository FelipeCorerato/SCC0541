import { useState, useEffect } from 'react'
import wallpaper from './assets/wallpaper.jpg'
import './App.css'
import './styles/Dashboard.css'
import Sidebar from './components/Sidebar'
import EscuderiaSidebar from './components/EscuderiaSidebar'
import PilotoSidebar from './components/PilotoSidebar'
import TotalSidebar from './components/TotalSidebar'
import EscuderiaRightSidebar from './components/EscuderiaRightSidebar'
import PilotoRightSidebar from './components/PilotoRightSidebar'
import Summary from './components/Resumo'
import Records from './components/Cadastro'
import Reports from './components/Relatorios'
import EscuderiaRelatorios from './components/EscuderiaRelatorios'
import EscuderiaConsultar from './components/EscuderiaConsultar'
import EscuderiaCadastrar from './components/EscuderiaCadastrar'
import PilotoResumo from './components/PilotoResumo'
import PilotoRelatorios from './components/PilotoRelatorios'
import { login, createUserLog, type User } from './services/auth'
import { ToastContainer } from 'react-toastify'
import { showSuccess, showError, showInfo, toastContainerConfig } from './utils/toast'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [activeScreen, setActiveScreen] = useState('resumo')
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Carrega dados do localStorage na inicialização
  useEffect(() => {
    const savedUser = localStorage.getItem('f1_user')
    const savedIsLoggedIn = localStorage.getItem('f1_isLoggedIn')
    const savedActiveScreen = localStorage.getItem('f1_activeScreen')

    if (savedUser && savedIsLoggedIn === 'true') {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        setIsLoggedIn(true)
        
        // Define tela inicial baseada na role ou tela salva
        if (savedActiveScreen) {
          setActiveScreen(savedActiveScreen)
        } else if (parsedUser.tipo === 'Escuderia') {
          setActiveScreen('consultar')
        } else {
          setActiveScreen('resumo')
        }
      } catch (error) {
        console.error('Erro ao carregar dados do localStorage:', error)
        // Limpa dados corrompidos
        localStorage.removeItem('f1_user')
        localStorage.removeItem('f1_isLoggedIn')
        localStorage.removeItem('f1_activeScreen')
      }
    }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const authenticatedUser = await login(username, password)
      setUser(authenticatedUser)
      setIsLoggedIn(true)
      
      // Registra o log de login
      await createUserLog(authenticatedUser.userid, 'login')
      
      // Define tela inicial baseada na role
      const initialScreen = authenticatedUser.tipo === 'Escuderia' ? 'consultar' : 'resumo'
      setActiveScreen(initialScreen)
      
      // Salva no localStorage
      localStorage.setItem('f1_user', JSON.stringify(authenticatedUser))
      localStorage.setItem('f1_isLoggedIn', 'true')
      localStorage.setItem('f1_activeScreen', initialScreen)
      
      showSuccess('Login realizado com sucesso!')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao fazer login'
      showError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    // Registra o log de logout antes de limpar os dados
    if (user) {
      await createUserLog(user.userid, 'logout');
    }
    
    setIsLoggedIn(false)
    setUser(null)
    setUsername('')
    setPassword('')
    setActiveScreen('resumo')
    
    // Remove dados do localStorage
    localStorage.removeItem('f1_user')
    localStorage.removeItem('f1_isLoggedIn')
    localStorage.removeItem('f1_activeScreen')
    
    showInfo('Logout realizado com sucesso!')
  }

  const handleNavigate = (screen: string) => {
    setActiveScreen(screen)
    // Salva a tela ativa no localStorage
    localStorage.setItem('f1_activeScreen', screen)
  }

  // Renderiza experiência específica para Escuderia
  const renderEscuderiaExperience = () => {
    return (
      <div className="dashboard-container">
        <EscuderiaSidebar 
          activeScreen={activeScreen} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          user={user}
        />
        
        {activeScreen === 'consultar' && <EscuderiaConsultar user={user} />}
        {activeScreen === 'cadastrar' && <EscuderiaCadastrar />}
        {activeScreen === 'relatorios' && <EscuderiaRelatorios user={user} />}
        
        <EscuderiaRightSidebar user={user} />
        <ToastContainer {...toastContainerConfig} />
      </div>
    )
  }

  // Renderiza experiência específica para Piloto
  const renderPilotoExperience = () => {
    return (
      <div className="dashboard-container">
        <PilotoSidebar 
          activeScreen={activeScreen} 
          onNavigate={handleNavigate} 
          onLogout={handleLogout}
          user={user}
        />
        
        {activeScreen === 'resumo' && <PilotoResumo user={user} />}
        {activeScreen === 'relatorios' && <PilotoRelatorios />}
        
        <PilotoRightSidebar user={user} />
        <ToastContainer {...toastContainerConfig} />
      </div>
    )
  }

  // Renderiza experiência padrão (Administrador)
  const renderDefaultExperience = () => {
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
        <ToastContainer {...toastContainerConfig} />
      </div>
    )
  }

  if (isLoggedIn) {
    // Renderiza experiência baseada na role do usuário
    if (user?.tipo === 'Escuderia') {
      return renderEscuderiaExperience()
    } else if (user?.tipo === 'Piloto') {
      return renderPilotoExperience()
    }
    
    // Experiência padrão para Administrador e outros tipos
    return renderDefaultExperience()
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
              </div>
              <h2>F1 Data Explorer</h2>
            </div>
            
            <h1>Bem-vindo</h1>
          </div>
          
          <form onSubmit={handleLogin}>
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
      <ToastContainer {...toastContainerConfig} />
    </div>
  )
}

export default App
