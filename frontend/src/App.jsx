import { useState } from 'react'
import Login from './Login'
import Register from './Register'
import MainNavbar from './components/Navigation/Navbar'
import MainDashboard from './components/Dashboard/MainDashboard'
import './App.css'

function isAuthenticated() {
  return !!localStorage.getItem('access')
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)

  const handleLogin = (userData) => {
    setUser(userData)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    setUser(null)
    setLoggedIn(false)
  }

  if (loggedIn && user && user.role) {
    return (
      <MainNavbar user={user} onLogout={handleLogout}>
        <MainDashboard user={user} />
      </MainNavbar>
    )
  }

  if (showRegister) {
    return (
      <Register
        onRegister={() => setShowRegister(false)}
        onSwitchToLogin={() => setShowRegister(false)}
      />
    )
  }

  return (
    <Login
      onLogin={handleLogin}
      onSwitchToRegister={() => setShowRegister(true)}
    />
  )
}

export default App
