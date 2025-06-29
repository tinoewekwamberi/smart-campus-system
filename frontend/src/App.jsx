import { useState } from 'react'
import Login from './Login'
import Home from './Home'
import Register from './Register'
import './App.css'

function isAuthenticated() {
  return !!localStorage.getItem('access')
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())
  const [showRegister, setShowRegister] = useState(false)

  if (loggedIn) {
    return <Home onLogout={() => setLoggedIn(false)} />
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
      onLogin={() => setLoggedIn(true)}
      onSwitchToRegister={() => setShowRegister(true)}
    />
  )
}

export default App
