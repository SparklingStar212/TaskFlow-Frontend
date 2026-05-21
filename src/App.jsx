import { useState } from 'react'
import { useAuth } from './context/AuthContext'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Register from './pages/Register'

const App = () => {
  const { isAuthenticated } = useAuth()
  const [authScreen, setAuthScreen] = useState('login')

  if (isAuthenticated) {
    return <Dashboard />
  }

  return authScreen === 'login' ? (
    <Login onSwitchToRegister={() => setAuthScreen('register')} />
  ) : (
    <Register onSwitchToLogin={() => setAuthScreen('login')} />
  )
}

export default App
