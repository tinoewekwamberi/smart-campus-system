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
import StudentSessions from './components/Wellness/StudentSessions'
import StudentGrades from './components/Grades/StudentGrades'
import GradeManagement from './components/Grades/GradeManagement'
import ProductList from './components/Ordering/ProductList'
import Cart from './components/Ordering/Cart'
import { CartProvider } from './components/Ordering/CartContext'
import OrderHistory from './components/Ordering/OrderHistory'
import OrderManagement from './components/Ordering/OrderManagement'
import SupportRequestForm from './components/Support/SupportRequestForm'
import SupportRequestHistory from './components/Support/SupportRequestHistory'
import SupportDashboard from './components/Support/SupportDashboard'
import { DiaryEntryList, CalendarEventList } from './components/Diary'
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
          const response = await fetch(`${API_BASE_URL}/users/profile/self_profile/`, {
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
          <Route path="/wellness/sessions" element={
            <ProtectedRoute>
              {user.role === 'student' ? (
                <AppLayout>
                  <StudentSessions user={user} />
                </AppLayout>
              ) : (
                <Navigate to="/dashboard" replace />
              )}
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
          <Route path="/grades" element={
            <ProtectedRoute>
              <AppLayout>
                {user.role === 'student' ? (
                  <StudentGrades />
                ) : (
                  <GradeManagement user={user} />
                )}
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ordering" element={
            <ProtectedRoute>
              <AppLayout>
                <CartProvider>
                  <ProductList />
                </CartProvider>
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ordering/cart" element={
            <ProtectedRoute>
              <AppLayout>
                <CartProvider>
                  <Cart />
                </CartProvider>
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ordering/history" element={
            <ProtectedRoute>
              <AppLayout>
                <CartProvider>
                  <OrderHistory />
                </CartProvider>
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/ordering/manage" element={
            <ProtectedRoute>
              <AppLayout>
                <CartProvider>
                  <OrderManagement />
                </CartProvider>
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/request" element={
            <ProtectedRoute>
              <AppLayout>
                <SupportRequestForm />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/history" element={
            <ProtectedRoute>
              <AppLayout>
                <SupportRequestHistory />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/support/manage" element={
            <ProtectedRoute>
              <AppLayout>
                <SupportDashboard />
              </AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/diary" element={<DiaryEntryList />} />
          <Route path="/calendar" element={<CalendarEventList />} />
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
