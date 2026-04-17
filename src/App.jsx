import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { AppProvider, useApp } from './context/AppContext'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import RegisterSale from './pages/RegisterSale'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Goals from './pages/Goals'
import AuthPage from './pages/auth/AuthPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import Profile from './pages/Profile'
import Help from './pages/Help'
import Landing from './pages/Landing'
import './index.css'

function AppContent() {
  const { activeTab } = useApp()

  const pages = {
    dashboard: <Dashboard />,
    ventas: <RegisterSale />,
    productos: <Products />,
    pedidos: <Orders />,
    metas: <Goals />,
    ayuda: <Help />,
    perfil: <Profile />,
  }

  return (
    <div className="flex h-screen" style={{ background: '#FAF8FF' }}>
      {/* Sidebar — solo desktop */}
      <div className="hidden md:flex">
        <Navigation />
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto pb-20 md:pb-6">
          <div className="max-w-3xl mx-auto">
            {pages[activeTab]}
          </div>
        </div>
      </div>

      {/* Bottom nav — solo mobile */}
      <div className="md:hidden">
        <Navigation />
      </div>
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const path = window.location.pathname
  const [showAuth, setShowAuth] = useState(path === '/login' || path === '/signup')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    }).catch(() => {
      setSession(null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF8FF' }}>
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-violet-600 animate-spin" />
      </div>
    )
  }

  // Detectar link de recuperación de contraseña
  const hash = window.location.hash
  if (hash.includes('type=recovery')) return <ResetPasswordPage />

  const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL)
  if (!session && hasSupabase) {
    if (showAuth) return <AuthPage />
    return <Landing onLogin={() => setShowAuth(true)} />
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
