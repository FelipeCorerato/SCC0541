import { useState } from 'react'
import wallpaper from './assets/wallpaper.jpg'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Authentication logic here
    console.log('Login with:', username, password)
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
            
            <h1>Welcome</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Login</label>
              <input 
                type="text" 
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            
            <button type="submit" className="login-button">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
