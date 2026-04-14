import { useApp } from '../context/AppContext'
import { LayoutDashboard, ShoppingCart, Package, ClipboardList, Target, UserCircle } from 'lucide-react'

const tabs = [
  { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
  { id: 'ventas', label: 'Ventas', icon: ShoppingCart },
  { id: 'productos', label: 'Stock', icon: Package },
  { id: 'pedidos', label: 'Pedidos', icon: ClipboardList },
  { id: 'metas', label: 'Metas', icon: Target },
  { id: 'perfil', label: 'Perfil', icon: UserCircle },
]

export default function Navigation() {
  const { activeTab, setActiveTab, businessName } = useApp()

  return (
    <>
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-56 h-screen border-r border-gray-100 bg-white px-3 py-6 shrink-0">
        <div className="px-3 mb-8">
          <span className="text-lg font-bold truncate" style={{ color: 'var(--color-primary)' }}>
            {businessName || 'Mi Negocio'}
          </span>
        </div>
        <nav className="flex flex-col gap-1 flex-1">
          {tabs.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full"
                style={active ? {
                  background: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                } : {}}
              >
                <Icon
                  size={18}
                  strokeWidth={active ? 2.5 : 1.8}
                  className={active ? '' : 'text-gray-500'}
                  style={active ? { color: 'var(--color-primary)' } : {}}
                />
                <span className={active ? '' : 'text-gray-500'}>{label}</span>
              </button>
            )
          })}
        </nav>
      </aside>

      {/* Bottom nav mobile */}
      <nav className="md:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
        <div className="mx-3 mb-3 bg-white rounded-[28px] shadow-xl shadow-black/10 border border-gray-100">
          <div className="flex items-center justify-around px-2 py-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className="flex flex-col items-center gap-1 flex-1 py-1.5 rounded-2xl transition-all duration-200 active:scale-95"
                >
                  <div
                    className="w-10 h-8 flex items-center justify-center rounded-2xl transition-all duration-200"
                    style={active ? { background: 'var(--color-primary-light)' } : {}}
                  >
                    <Icon
                      size={20}
                      strokeWidth={active ? 2.5 : 1.8}
                      style={{ color: active ? 'var(--color-primary)' : '#9CA3AF' }}
                    />
                  </div>
                  <span
                    className="text-[10px] font-semibold transition-colors"
                    style={{ color: active ? 'var(--color-primary)' : '#9CA3AF' }}
                  >
                    {label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </nav>
    </>
  )
}
