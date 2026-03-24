import { useApp } from '../context/AppContext'
import { LayoutDashboard, ShoppingCart, Package, ClipboardList, Target } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'productos', label: 'Stock', icon: Package },
  { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
  { id: 'metas', label: 'Metas', icon: Target },
]

export default function Navigation() {
  const { activeTab, setActiveTab } = useApp()

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-100 z-50">
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className="flex flex-col items-center gap-1 flex-1 py-1 rounded-xl transition-all duration-200"
            >
              <div className={`w-10 h-8 flex items-center justify-center rounded-xl transition-all duration-200 ${active ? 'bg-blue-50' : ''}`}>
                <Icon
                  size={20}
                  className={active ? 'text-[#2D68F6]' : 'text-gray-400'}
                  strokeWidth={active ? 2.5 : 1.8}
                />
              </div>
              <span className={`text-[10px] font-medium transition-colors ${active ? 'text-[#2D68F6]' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
