import { AppProvider, useApp } from './context/AppContext'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import RegisterSale from './pages/RegisterSale'
import Products from './pages/Products'
import Orders from './pages/Orders'
import Goals from './pages/Goals'
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
    <>
      <div className="overflow-y-auto h-screen">
        {pages[activeTab]}
      </div>
      <Navigation />
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
