import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { AppProvider, useApp } from './context/AppContext'
import { LocaleProvider } from './context/LocaleContext'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import RegisterSale from './pages/RegisterSale'
import Products from './pages/Products'
import Orders from './pages/Orders'
import AuthPage from './pages/auth/AuthPage'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import Profile from './pages/Profile'
import Help from './pages/Help'
import IA from './pages/IA'
import Landing from './pages/Landing'
import './index.css'

const IS_QA = import.meta.env.MODE === 'qa'

function QABanner() {
  if (!IS_QA) return null
  return (
    <div
      style={{ background: '#F59E0B', color: '#1C1917', fontFamily: 'Nunito, sans-serif' }}
      className="w-full text-center text-xs font-bold py-1 px-3 tracking-wide z-50 shrink-0"
    >
      ⚠️ AMBIENTE QA — datos de prueba, no es producción
    </div>
  )
}

function AppContent() {
  const { activeTab } = useApp()

  const pages = {
    dashboard: <Dashboard />,
    ventas: <RegisterSale />,
    productos: <Products />,
    pedidos: <Orders />,
    ia: <IA />,
    ayuda: <Help />,
    perfil: <Profile />,
  }

  return (
    <div className="flex flex-col h-screen" style={{ background: '#FAF8FF' }}>
      <QABanner />
      <div className="flex flex-1 overflow-hidden">
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
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading
  const [isRecovery, setIsRecovery] = useState(false)
  const path = window.location.pathname
  const [showAuth, setShowAuth] = useState(path === '/login' || path === '/signup')

  useEffect(() => {
    // onAuthStateChange es la fuente de verdad — incluye el procesamiento del hash de recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true)
        setSession(session)
      } else {
        setIsRecovery(false)
        setSession(session)
      }
    })

    // Inicializar sesión desde caché local (solo para el estado inicial de carga)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(prev => prev === undefined ? (session ?? null) : prev)
    }).catch(() => {
      setSession(prev => prev === undefined ? null : prev)
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

  if (isRecovery) return <ResetPasswordPage />

  const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL)
  if (!session && hasSupabase) {
    if (showAuth) return <AuthPage />
    return <Landing onLogin={() => setShowAuth(true)} />
  }

  return (
    <LocaleProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </LocaleProvider>
  )
}
