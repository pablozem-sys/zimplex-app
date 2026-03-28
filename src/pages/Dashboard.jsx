import { useApp } from '../context/AppContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, AlertCircle, Package, Plus, ArrowRight } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const paymentColors = {
  efectivo: 'text-emerald-600 bg-emerald-50',
  transferencia: 'text-[#2D68F6] bg-blue-50',
  tarjeta: 'text-purple-600 bg-purple-50',
}
const paymentLabels = { efectivo: 'Efectivo', transferencia: 'Transf.', tarjeta: 'Tarjeta' }

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-lg">
        <p className="text-[#2D68F6] font-semibold text-sm">{fmt(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const { todayTotal, monthTotal, pendingOrders, lowStockProducts, last7Days, todaySalesCount, sales, setActiveTab } = useApp()

  const recentSales = sales.slice(0, 5)

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
      tab: 'pedidos',
    },
    {
      label: 'Stock Bajo',
      value: lowStockProducts,
      sub: 'Productos',
      icon: Package,
      color: lowStockProducts > 0 ? 'text-[#DC4B56]' : 'text-gray-400',
      bg: lowStockProducts > 0 ? 'bg-red-50' : 'bg-gray-50',
      tab: 'productos',
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
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D68F6] to-[#5794F7] flex items-center justify-center shadow-md shadow-blue-200">
          <span className="text-white font-bold text-sm">M</span>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <button
              key={card.label}
              onClick={() => card.tab && setActiveTab(card.tab)}
              className={`bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm text-left w-full ${card.tab ? 'active:scale-[0.97] transition-transform' : ''}`}
            >
              <div className={`w-9 h-9 rounded-2xl ${card.bg} flex items-center justify-center mb-3`}>
                <Icon size={17} className={card.color} />
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">{card.label}</p>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <button
        onClick={() => setActiveTab('ventas')}
        className="w-full bg-[#2D68F6] active:scale-[0.98] text-white font-semibold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-blue-200 mb-5"
      >
        <Plus size={20} />
        Registrar venta
      </button>

      {/* Chart */}
      <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">Ventas últimos 7 días</h2>
          <span className="text-xs text-gray-400">CLP</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={last7Days} margin={{ top: 0, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D68F6" stopOpacity={0.12} />
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

      {/* Recent transactions */}
      {recentSales.length > 0 && (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden mb-2">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h2 className="text-sm font-semibold text-gray-900">Últimas ventas</h2>
            <button onClick={() => setActiveTab('ventas')} className="flex items-center gap-1 text-xs text-[#2D68F6] font-medium">
              Ver todo <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recentSales.map((sale, i) => (
              <div key={sale.id} className={`flex items-center gap-3 px-4 py-3 ${i < recentSales.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-8 h-8 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} className="text-[#2D68F6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{sale.productName} ×{sale.quantity}</p>
                  <p className="text-xs text-gray-400 truncate">{sale.customer || 'Sin cliente'}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">{fmt(sale.total)}</p>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${paymentColors[sale.paymentMethod]}`}>
                    {paymentLabels[sale.paymentMethod]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
