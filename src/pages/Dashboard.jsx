import { useApp } from '../context/AppContext'
import { useLocale } from '../context/LocaleContext'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingBag, AlertCircle, Package, Plus, ArrowRight, Zap, X } from 'lucide-react'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import OnboardingChecklist from '../components/OnboardingChecklist'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const paymentColors = {
  efectivo: 'text-emerald-600 bg-emerald-50',
  transferencia: 'text-[#6366F1] bg-indigo-50',
  tarjeta: 'text-purple-600 bg-purple-50',
}
const paymentLabels = { efectivo: 'Efectivo', transferencia: 'Transf.', tarjeta: 'Tarjeta' }

const CustomTooltip = ({ active, payload, formatter }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl px-3 py-2 shadow-lg">
        <p className="text-[#6366F1] font-semibold text-sm">{formatter(payload[0].value)}</p>
      </div>
    )
  }
  return null
}

export default function Dashboard() {
  const {
    todayTotal, monthTotal, pendingOrders, lowStockProducts,
    last7Days, todaySalesCount, sales, setActiveTab,
    products, monthlySalesCount, isPro, planLimits, userId, businessName,
  } = useApp()
  const { formatCurrency: fmt, t, country } = useLocale()

  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState(false)
  const [limitAlertDismissed, setLimitAlertDismissed] = useState(
    () => !!sessionStorage.getItem('limit_alert_dismissed')
  )

  const dismissLimitAlert = () => {
    sessionStorage.setItem('limit_alert_dismissed', '1')
    setLimitAlertDismissed(true)
  }

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    setUpgradeError(false)
    const newWindow = window.open('', '_blank')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mp-create-subscription`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.init_point && newWindow) {
        newWindow.location.href = data.init_point
      } else {
        newWindow?.close()
        setUpgradeError(true)
      }
    } catch (err) {
      console.error(err)
      newWindow?.close()
      setUpgradeError(true)
    } finally {
      setUpgradeLoading(false)
    }
  }

  const recentSales = sales.slice(0, 5)

  const cards = [
    {
      label: t('ventas_hoy'),
      value: fmt(todayTotal),
      sub: `${todaySalesCount} venta${todaySalesCount !== 1 ? 's' : ''}`,
      icon: TrendingUp,
      color: 'text-[#6366F1]',
      bg: 'bg-indigo-50',
    },
    {
      label: t('ventas_mes'),
      value: fmt(monthTotal),
      sub: 'Este mes',
      icon: ShoppingBag,
      color: 'text-[#7CD09B]',
      bg: 'bg-green-50',
    },
    {
      label: t('pedidos_pendientes'),
      value: pendingOrders,
      sub: 'Por entregar',
      icon: AlertCircle,
      color: pendingOrders > 0 ? 'text-amber-500' : 'text-gray-400',
      bg: pendingOrders > 0 ? 'bg-amber-50' : 'bg-gray-50',
      tab: 'pedidos',
    },
    {
      label: t('stock_bajo'),
      value: lowStockProducts,
      sub: t('productos'),
      icon: Package,
      color: lowStockProducts > 0 ? 'text-[#DC4B56]' : 'text-gray-400',
      bg: lowStockProducts > 0 ? 'bg-red-50' : 'bg-gray-50',
      tab: 'productos',
    },
  ]

  const productPct = Math.min(100, (products.length / planLimits.maxProducts) * 100)
  const salesPct = Math.min(100, (monthlySalesCount / planLimits.maxMonthlySales) * 100)
  const productAtLimit = products.length >= planLimits.maxProducts
  const salesAtLimit = monthlySalesCount >= planLimits.maxMonthlySales
  const nearProductLimit = !productAtLimit && productPct >= 80
  const nearSalesLimit = !salesAtLimit && salesPct >= 80
  const showLimitAlert = !isPro && !limitAlertDismissed && (nearProductLimit || nearSalesLimit)

  return (
    <div className="page-content">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
            {new Date().toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">Zimplex</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-md shadow-indigo-200">
          <span className="text-white font-bold text-sm">
            {businessName
              ? businessName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
              : '?'}
          </span>
        </div>
      </div>

      <OnboardingChecklist />

      {/* Alerta límite al 80% */}
      {showLimitAlert && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
          <Zap size={16} className="text-amber-500 flex-shrink-0" />
          <p className="flex-1 text-xs text-amber-700">
            {nearProductLimit
              ? `Te quedan ${planLimits.maxProducts - products.length} productos disponibles en tu plan gratis.`
              : `Te quedan ${planLimits.maxMonthlySales - monthlySalesCount} ventas este mes en tu plan gratis.`}
            {' '}
            <button onClick={handleUpgrade} disabled={upgradeLoading} className="font-bold underline underline-offset-2 disabled:opacity-60">
              {upgradeLoading ? 'Cargando...' : 'Pasate a Pro'}
            </button>
          </p>
          <button onClick={dismissLimitAlert} className="text-amber-400 active:scale-95 flex-shrink-0">
            <X size={14} />
          </button>
        </div>
      )}

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
        className="w-full bg-[#6366F1] active:scale-[0.98] text-white font-semibold py-4 rounded-[18px] flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-indigo-200 mb-5"
      >
        <Plus size={20} />
        Registrar venta
      </button>

      {/* Plan usage — solo plan gratis */}
      {!isPro && (
        <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm mb-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Uso del plan gratis</h2>
            <button onClick={handleUpgrade} disabled={upgradeLoading}
              className="flex items-center gap-1 text-xs text-[#6366F1] font-semibold disabled:opacity-60">
              <Zap size={11} />
              {upgradeLoading ? 'Cargando...' : upgradeError ? 'Error — intenta de nuevo' : 'Pasar a Pro'}
            </button>
          </div>

          {/* Productos */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400">Productos</span>
              <span className={productAtLimit ? 'text-[#DC4B56] font-semibold' : 'text-gray-500 font-medium'}>
                {products.length} de {planLimits.maxProducts}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${productPct}%`,
                  backgroundColor: productAtLimit ? '#DC4B56' : '#6366F1',
                }}
              />
            </div>
          </div>

          {/* Ventas mensuales */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-gray-400">Ventas este mes</span>
              <span className={salesAtLimit ? 'text-[#DC4B56] font-semibold' : 'text-gray-500 font-medium'}>
                {monthlySalesCount} de {planLimits.maxMonthlySales}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${salesPct}%`,
                  backgroundColor: salesAtLimit ? '#DC4B56' : salesPct >= 75 ? '#F59E0B' : '#6366F1',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-[20px] p-4 border border-gray-100 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-900">{t('ultimos_7_dias')}</h2>
          <span className="text-xs text-gray-400">{country.currency}</span>
        </div>
        <ResponsiveContainer width="100%" height={140}>
          <AreaChart data={last7Days} margin={{ top: 0, right: 4, left: -30, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false}
              tickFormatter={(v) => v >= 1000 ? `${v / 1000}k` : v} />
            <Tooltip content={<CustomTooltip formatter={fmt} />} />
            <Area type="monotone" dataKey="total" stroke="#6366F1" strokeWidth={2.5}
              fill="url(#colorSales)" dot={{ r: 3, fill: '#6366F1', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#6366F1' }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Recent transactions */}
      {recentSales.length > 0 && (
        <div className="bg-white rounded-[20px] border border-gray-100 shadow-sm overflow-hidden mb-2">
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <h2 className="text-sm font-semibold text-gray-900">Últimas ventas</h2>
            <button onClick={() => setActiveTab('ventas')} className="flex items-center gap-1 text-xs text-[#6366F1] font-medium">
              Ver todo <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recentSales.map((sale, i) => (
              <div key={sale.id} className={`flex items-center gap-3 px-4 py-3 ${i < recentSales.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                  <TrendingUp size={14} className="text-[#6366F1]" />
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
