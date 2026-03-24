import { useApp } from '../context/AppContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, AlertCircle, Package, Plus } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl px-3 py-2 shadow-lg">
        <p className="text-[#2D68F6] font-semibold text-sm">{fmt(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { todayTotal, monthTotal, pendingOrders, lowStockProducts, last7Days, todaySalesCount, setActiveTab } = useApp()

  const cards = [
    {
      label: 'Ventas Hoy',
      value: fmt(todayTotal),
      sub: `${todaySalesCount} transacciones`,
      icon: TrendingUp,
      color: 'text-[#2D68F6]',
      bg: 'bg-blue-50',
    },
    {
      label: 'Ventas del Mes',
      value: fmt(monthTotal),
      sub: 'Este mes',
      icon: ShoppingBag,
      color: 'text-[#7CD09B]',
      bg: 'bg-green-50',
    },
    {
      label: 'Pedidos Pendientes',
      value: pendingOrders,
      sub: 'Por entregar',
      icon: AlertCircle,
      color: pendingOrders > 0 ? 'text-amber-500' : 'text-gray-400',
      bg: pendingOrders > 0 ? 'bg-amber-50' : 'bg-gray-50',
    },
    {
      label: 'Stock Bajo',
      value: lowStockProducts,
      sub: 'Productos',
      icon: Package,
      color: lowStockProducts > 0 ? 'text-[#DC4B56]' : 'text-gray-400',
      bg: lowStockProducts > 0 ? 'bg-red-50' : 'bg-gray-50',
    },
  ]

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">MiNegocioSimple</h1>
        </div>
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D68F6] to-[#5794F7] flex items-center justify-center">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">{card.label}</p>
            </div>
          )
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Ventas últimos 7 días</h2>
          <span className="text-xs text-gray-400">CLP</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={last7Days} margin={{ top: 0, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D68F6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2D68F6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="total" stroke="#2D68F6" strokeWidth={2.5}
              fill="url(#colorSales)" dot={{ r: 3, fill: '#2D68F6', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#2D68F6' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* CTA */}
      <button
        onClick={() => setActiveTab('ventas')}
        className="w-full bg-[#2D68F6] hover:bg-[#1a56e0] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all duration-200 shadow-md shadow-blue-200"
      >
        <Plus size={20} />
        Registrar venta
      </button>
    </div>
  )
}
