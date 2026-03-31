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
import './index.css'

function AppContent() {
  const { activeTab } = useApp()

  const pages = {
    dashboard: <Dashboard />,
    ventas: <RegisterSale />,
    productos: <Products />,
    pedidos: <Orders />,
    metas: <Goals />,
  }

  return (
    <div className="max-w-md mx-auto relative h-screen flex flex-col overflow-hidden" style={{ background: '#FAF8FF' }}>
      <div className="flex-1 overflow-y-auto pb-20">
        {pages[activeTab]}
      </div>
      <Navigation />
    </div>
  )
}

export default function App() {
  const [session, setSession] = useState(undefined) // undefined = loading

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
        <div className="w-10 h-10 rounded-full border-4 border-violet-200 border-t-violet-600 animate-spin" />
      </div>
    )
  }

  const hasSupabase = !!(import.meta.env.VITE_SUPABASE_URL)
  if (!session && hasSupabase) {
    return <AuthPage />
  }

  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
