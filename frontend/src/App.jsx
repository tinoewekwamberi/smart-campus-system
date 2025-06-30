import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './Login'
import Register from './Register'
import MainNavbar from './components/Navigation/Navbar'
import MainDashboard from './components/Dashboard/MainDashboard'
import CourseList from './components/Course/CourseList'
import CourseDetail from './components/Course/CourseDetail'
import ProfilePage from './components/Profile/ProfilePage'
import StudentCheckin from './components/Wellness/StudentCheckin'
import StaffDashboard from './components/Wellness/StaffDashboard'
import './App.css'

const API_BASE_URL = 'http://localhost:8000/api'

function isAuthenticated() {
  return !!localStorage.getItem('access')
}

function App() {
  const [loggedIn, setLoggedIn] = useState(isAuthenticated())
  const [showRegister, setShowRegister] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Restore user authentication state on page refresh
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem('access')
      if (token) {
        try {
          const response = await fetch(`${API_BASE_URL}/accounts/me/`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const userData = await response.json()
            setUser(userData)
            setLoggedIn(true)
          } else {
            // Token is invalid, clear it
            localStorage.removeItem('access')
            localStorage.removeItem('refresh')
            setLoggedIn(false)
            setUser(null)
          }
        } catch (error) {
          console.error('Error restoring authentication:', error)
          // Clear invalid tokens
          localStorage.removeItem('access')
          localStorage.removeItem('refresh')
          setLoggedIn(false)
          setUser(null)
        }
      }
      setLoading(false)
    }

    restoreAuth()
  }, [])

  const handleLogin = (userData) => {
    setUser(userData)
    setLoggedIn(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setUser(null)
    setLoggedIn(false)
  }

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!loggedIn || !user || !user.role) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  // Main app layout with navigation
  const AppLayout = ({ children }) => (
    <MainNavbar user={user} onLogout={handleLogout}>
      {children}
    </MainNavbar>
  )

  // Show loading while restoring authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    )
  }

  if (loggedIn && user && user.role) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <AppLayout>
                <MainDashboard user={user} />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AppLayout>
                <MainDashboard user={user} />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/courses" element={
            <ProtectedRoute>
              <AppLayout>
                <CourseList user={user} />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/courses/:courseId" element={
            <ProtectedRoute>
              <AppLayout>
                <CourseDetail user={user} />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <AppLayout>
                <ProfilePage />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/wellness" element={
            <ProtectedRoute>
              <AppLayout>
                <StudentCheckin user={user} />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/wellness/staff" element={
            <ProtectedRoute>
              {user.role === 'staff' ? (
                <AppLayout>
                  <StaffDashboard user={user} />
                </AppLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
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
