import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLocale } from '../context/LocaleContext'
import { CheckCircle, ChevronDown, Clock, TrendingUp, Zap, Lock, Loader2, Plus, Trash2, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

async function getUpgradeUrl() {
  const { data: { session } } = await supabase.auth.getSession()
  const res = await fetch(`${SUPABASE_URL}/functions/v1/mp-create-subscription`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
  })
  const data = await res.json()
  return data.init_point || null
}


const paymentMethods = [
  { id: 'efectivo',      label: 'Efectivo',      emoji: '💵' },
  { id: 'transferencia', label: 'Transferencia',  emoji: '📲' },
  { id: 'tarjeta',       label: 'Tarjeta',        emoji: '💳' },
]

const paymentColors = {
  efectivo:      'text-emerald-600 bg-emerald-50',
  transferencia: 'text-[#6366F1] bg-indigo-50',
  tarjeta:       'text-purple-600 bg-purple-50',
}
const paymentLabels = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' }

const inputClass = 'w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent shadow-sm'

const EMPTY_ITEM = { productId: '', quantity: 1, unitPrice: '' }

export default function RegisterSale() {
  const { products, sales, addSale, isPro, monthlySalesCount, planLimits } = useApp()
  const { formatCurrency: fmt, country, t } = useLocale()
  const [upgradeLoading, setUpgradeLoading] = useState(false)

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    const newWindow = window.open('', '_blank')
    try {
      const url = await getUpgradeUrl()
      if (url && newWindow) newWindow.location.href = url
      else newWindow?.close()
    } catch { newWindow?.close() }
    finally { setUpgradeLoading(false) }
  }

  const [tab, setTab]               = useState('registrar')
  const [items, setItems]           = useState([])
  const [current, setCurrent]       = useState(EMPTY_ITEM)
  const [customer, setCustomer]     = useState('')
  const [paymentMethod, setPaymentMethod] = useState('efectivo')
  const [success, setSuccess]       = useState(false)
  const [lastTotal, setLastTotal]   = useState(0)
  const [error, setError]           = useState(null)
  const [itemError, setItemError]   = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const currentProduct = products.find(p => p.id === current.productId)
  const currentSubtotal = (current.unitPrice || 0) * current.quantity
  const grandTotal = items.reduce((s, i) => s + i.subtotal, 0)

  const handleCurrentProductChange = (e) => {
    const p = products.find(x => x.id === e.target.value)
    setCurrent(c => ({ ...c, productId: e.target.value, unitPrice: p ? p.price : '' }))
    setItemError(null)
  }

  const handleAddItem = () => {
    if (!current.productId || !current.unitPrice || current.quantity < 1) {
      setItemError('Selecciona un producto y verifica la cantidad.')
      return
    }
    const p = products.find(x => x.id === current.productId)
    if (!p) return

    // Si el mismo producto ya está en la lista, sumar cantidad
    const existing = items.findIndex(i => i.productId === current.productId)
    if (existing !== -1) {
      const newQty = items[existing].quantity + current.quantity
      if (newQty > p.stock) {
        setItemError(`Stock insuficiente. Máximo ${p.stock} ${p.unit || 'unidades'}.`)
        return
      }
      setItems(prev => prev.map((item, idx) => idx === existing
        ? { ...item, quantity: newQty, subtotal: newQty * item.unitPrice }
        : item
      ))
    } else {
      if (current.quantity > p.stock) {
        setItemError(`Stock insuficiente. Solo hay ${p.stock} ${p.unit || 'unidades'}.`)
        return
      }
      setItems(prev => [...prev, {
        productId: current.productId,
        productName: p.name,
        quantity: current.quantity,
        unitPrice: parseInt(current.unitPrice),
        subtotal: current.quantity * parseInt(current.unitPrice),
        unit: p.unit || 'unidades',
        stock: p.stock,
      }])
    }
    setCurrent(EMPTY_ITEM)
    setItemError(null)
  }

  const handleRemoveItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    if (submitting) return

    if (!isPro) {
      const remaining = planLimits.maxMonthlySales - monthlySalesCount
      if (items.length > remaining) {
        setError(`Solo te quedan ${remaining} venta${remaining !== 1 ? 's' : ''} este mes. Reduce los productos o pasa a Pro.`)
        return
      }
    }

    setError(null)
    setSubmitting(true)

    for (const item of items) {
      const p = products.find(x => x.id === item.productId)
      const { error: err } = await addSale({
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        total: item.subtotal,
        customer,
        paymentMethod,
      })
      if (err) {
        setError(err.message === 'LIMIT_REACHED'
          ? 'Límite del plan alcanzado. Pasa a Pro para seguir.'
          : 'Error al registrar. Intenta de nuevo.')
        setSubmitting(false)
        return
      }
    }

    setSubmitting(false)
    setLastTotal(grandTotal)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setItems([])
      setCurrent(EMPTY_ITEM)
      setCustomer('')
      setPaymentMethod('efectivo')
    }, 2000)
  }

  if (success) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle size={44} className="text-[#7CD09B]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">¡Venta registrada!</h2>
        <p className="text-gray-400 text-sm text-center">El stock se actualizó automáticamente</p>
        <p className="text-3xl font-bold text-[#6366F1] mt-4">{fmt(lastTotal)}</p>
      </div>
    )
  }

  const atSalesLimit = !isPro && monthlySalesCount >= planLimits.maxMonthlySales
  const nearLimit    = !isPro && monthlySalesCount >= planLimits.maxMonthlySales - 5

  return (
    <div className="page-content">
      <div className="pt-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Ventas</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
        <button onClick={() => setTab('registrar')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'registrar' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-gray-400'}`}>
          Registrar
        </button>
        <button onClick={() => setTab('historial')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'historial' ? 'bg-white text-[#6366F1] shadow-sm' : 'text-gray-400'}`}>
          Historial
        </button>
      </div>

      {tab === 'registrar' ? (
        atSalesLimit ? (
          <UpgradeWall count={monthlySalesCount} limit={planLimits.maxMonthlySales} onUpgrade={handleUpgrade} upgradeLoading={upgradeLoading} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Contador de uso */}
            {!isPro && (
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-gray-400">{monthlySalesCount} de {planLimits.maxMonthlySales} ventas este mes</span>
                  {nearLimit && <span className="text-amber-500 font-semibold">Quedan {planLimits.maxMonthlySales - monthlySalesCount}</span>}
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-1.5 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (monthlySalesCount / planLimits.maxMonthlySales) * 100)}%`, backgroundColor: nearLimit ? '#F59E0B' : '#6366F1' }} />
                </div>
              </div>
            )}

            {nearLimit && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 flex items-start gap-3">
                <span className="text-lg leading-none mt-0.5">⚠️</span>
                <div>
                  <p className="text-sm font-semibold text-amber-800">Te quedan {planLimits.maxMonthlySales - monthlySalesCount} ventas este mes</p>
                  <p className="text-xs text-amber-600 mt-0.5">
                    <button onClick={handleUpgrade} type="button" className="font-semibold underline">Pasa a Pro</button> para ventas ilimitadas.
                  </p>
                </div>
              </div>
            )}

            {/* ── LISTA DE PRODUCTOS AGREGADOS ── */}
            {items.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Productos</p>
                {items.map((item, idx) => (
                  <div key={idx} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{item.quantity} {item.unit} × {fmt(item.unitPrice)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-sm font-bold text-[#6366F1]">{fmt(item.subtotal)}</p>
                      <button type="button" onClick={() => handleRemoveItem(idx)}
                        className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center active:scale-95">
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* ── AGREGAR PRODUCTO ── */}
            <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 space-y-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                {items.length === 0 ? 'Agregar producto' : 'Agregar otro producto'}
              </p>

              {/* Selector de producto */}
              <div className="relative">
                <select value={current.productId} onChange={handleCurrentProductChange}
                  className={`${inputClass} appearance-none`}>
                  <option value="">Selecciona un producto</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} — Stock: {p.stock} {p.unit || 'und'} — {fmt(p.price)}/{p.unit || 'und'}
                    </option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>

              {currentProduct && currentProduct.stock <= currentProduct.lowStockThreshold && (
                <p className="text-xs text-[#DC4B56]">⚠️ Stock bajo: {currentProduct.stock} unidades disponibles</p>
              )}

              {/* Cantidad + precio apilados */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Cantidad</label>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setCurrent(c => ({ ...c, quantity: Math.max(1, c.quantity - 1) }))}
                      className="w-11 h-11 rounded-xl bg-white border border-gray-200 text-gray-600 font-bold text-lg flex items-center justify-center active:scale-95 shadow-sm flex-shrink-0">−</button>
                    <input type="number" min="1" value={current.quantity}
                      onChange={e => setCurrent(c => ({ ...c, quantity: parseInt(e.target.value) || 1 }))}
                      className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-center font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1]" />
                    <button type="button" onClick={() => setCurrent(c => ({ ...c, quantity: c.quantity + 1 }))}
                      className="w-11 h-11 rounded-xl bg-[#6366F1] text-white font-bold text-lg flex items-center justify-center active:scale-95 shadow-md shadow-indigo-200 flex-shrink-0">+</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-400 mb-1.5 block">Precio unitario</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                    <input type="number" value={current.unitPrice}
                      onChange={e => setCurrent(c => ({ ...c, unitPrice: parseInt(e.target.value) || '' }))}
                      placeholder="0" className={`${inputClass} pl-8`} />
                  </div>
                </div>
              </div>

              {currentSubtotal > 0 && (
                <p className="text-xs text-gray-400 text-right">Subtotal: <span className="font-semibold text-gray-700">{fmt(currentSubtotal)}</span></p>
              )}

              {itemError && <p className="text-xs text-red-500">{itemError}</p>}

              <button type="button" onClick={handleAddItem}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#6366F1]/30 text-[#6366F1] text-sm font-semibold active:scale-[0.98] transition-all hover:bg-indigo-50">
                <Plus size={16} />
                Agregar producto
              </button>
            </div>

            {/* ── CLIENTE ── */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                Cliente <span className="text-gray-300 normal-case font-normal">(opcional)</span>
              </label>
              <input type="text" value={customer}
                onChange={e => setCustomer(e.target.value)}
                placeholder="Nombre del cliente" className={inputClass} />
            </div>

            {/* ── MÉTODO DE PAGO ── */}
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Método de pago</label>
              <div className="grid grid-cols-3 gap-2">
                {paymentMethods.map(pm => (
                  <button key={pm.id} type="button" onClick={() => setPaymentMethod(pm.id)}
                    className={`py-3.5 rounded-2xl border text-sm font-medium flex flex-col items-center gap-1 transition-all shadow-sm ${
                      paymentMethod === pm.id
                        ? 'border-[#6366F1] bg-indigo-50 text-[#6366F1] shadow-blue-100'
                        : 'border-gray-200 bg-white text-gray-400'
                    }`}>
                    <span className="text-xl">{pm.emoji}</span>
                    <span className="text-xs">{pm.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* ── TOTAL ── */}
            {grandTotal > 0 && (
              <div className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-200">
                <div>
                  <p className="text-blue-100 text-xs font-medium">
                    {items.length} producto{items.length !== 1 ? 's' : ''}
                  </p>
                  <span className="text-sm font-medium text-blue-100">Total</span>
                </div>
                <span className="text-2xl font-bold text-white">{fmt(grandTotal)}</span>
              </div>
            )}

            {error && <p className="text-sm text-[#DC4B56] bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}

            <button type="submit" disabled={submitting || items.length === 0}
              className="w-full bg-[#6366F1] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-indigo-200 text-base disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={18} className="animate-spin" /> Registrando...</> : 'Registrar venta'}
            </button>

          </form>
        )
      ) : (
        <SaleHistory sales={sales} />
      )}
    </div>
  )
}

function UpgradeWall({ count, limit, onUpgrade, upgradeLoading }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-2 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
        <Lock size={28} className="text-[#6366F1]" />
      </div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">Llegaste al límite de ventas mensuales</h2>
      <p className="text-sm text-gray-400 mb-1">
        Tu plan gratis incluye hasta {limit} ventas al mes. Pásate a Pro para seguir sin límites.
      </p>
      <p className="text-xs text-gray-300 mb-6">El contador se reinicia el 1 del próximo mes.</p>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-6">
        <div className="bg-[#DC4B56] h-2 rounded-full w-full" />
      </div>
      <button onClick={onUpgrade} disabled={upgradeLoading}
        className="w-full bg-[#6366F1] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 active:scale-[0.98] transition-all disabled:opacity-60">
        {upgradeLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
        {upgradeLoading ? 'Preparando...' : 'Pasar a Pro — $4.990/mes'}
      </button>
      <p className="text-xs text-gray-300 mt-3">Ventas ilimitadas + historial completo</p>
    </div>
  )
}

function downloadDayReport(todaySales, today, country) {
  const fmtTime = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleTimeString(country.locale, { timeZone: country.timezone, hour: '2-digit', minute: '2-digit' })
  }
  const methodLabel = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' }

  const headers = ['Producto', 'Cantidad', 'Precio Unitario', 'Total', 'Método de Pago', 'Cliente', 'Hora']
  const rows = todaySales.map(s => [
    s.productName,
    s.quantity,
    s.unitPrice ?? '',
    s.total,
    methodLabel[s.paymentMethod] || s.paymentMethod,
    s.customer || 'Sin cliente',
    fmtTime(s.createdAt),
  ])

  const totalDia = todaySales.reduce((sum, s) => sum + s.total, 0)
  const porMetodo = todaySales.reduce((acc, s) => {
    const label = methodLabel[s.paymentMethod] || s.paymentMethod
    acc[label] = (acc[label] || 0) + s.total
    return acc
  }, {})

  const summaryRows = [
    [],
    ['RESUMEN'],
    ['Total transacciones', todaySales.length, '', '', '', '', ''],
    ['Total del día', '', '', totalDia, '', '', ''],
    ...Object.entries(porMetodo).map(([m, v]) => [`Total ${m}`, '', '', v, '', '', '']),
  ]

  const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`
  const csv = [
    [`Reporte de ventas — ${today}`, '', '', '', '', '', ''],
    [],
    headers,
    ...rows,
    ...summaryRows,
  ].map(r => r.map(escape).join(',')).join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `ventas-${today}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

function SaleHistory({ sales }) {
  const { country, formatCurrency: fmt, t } = useLocale()
  const fmtTime = (isoString) => {
    if (!isoString) return ''
    return new Date(isoString).toLocaleTimeString(country.locale, { timeZone: country.timezone, hour: '2-digit', minute: '2-digit' })
  }
  const today = new Date().toLocaleString('sv-SE', { timeZone: country.timezone }).slice(0, 10)
  const todaySales = sales.filter(s => s.date === today)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)

  if (sales.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <TrendingUp size={40} className="mx-auto mb-3 text-gray-200" />
        <p className="text-sm font-medium">Sin ventas aún</p>
        <p className="text-xs mt-1">Registra tu primera venta</p>
      </div>
    )
  }

  const grouped = sales.reduce((acc, s) => {
    if (!acc[s.date]) acc[s.date] = []
    acc[s.date].push(s)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  const dateLabel = (dateStr) => {
    if (dateStr === today) return t('hoy')
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === yesterday.toLocaleString('sv-SE', { timeZone: country.timezone }).slice(0, 10)) return t('ayer')
    return new Date(dateStr + 'T12:00:00').toLocaleDateString(country.locale, { weekday: 'long', day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-5">
      {todaySales.length > 0 && (
        <div className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-2xl p-4 shadow-lg shadow-indigo-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-xs font-medium">Total hoy</p>
              <p className="text-white text-xl font-bold">{fmt(todayTotal)}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-100 text-xs">{todaySales.length} ventas</p>
              <Clock size={20} className="text-blue-200 mt-1 ml-auto" />
            </div>
          </div>
          <button
            onClick={() => downloadDayReport(todaySales, today, country)}
            className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 active:scale-[0.98] transition-all text-white text-sm font-semibold"
          >
            <Download size={15} />
            Descargar reporte del día
          </button>
        </div>
      )}

      {sortedDates.map(date => {
        const daySales = grouped[date]
        const dayTotal = daySales.reduce((sum, s) => sum + s.total, 0)
        return (
          <div key={date}>
            <div className="flex items-center justify-between mb-2 px-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide capitalize">{dateLabel(date)}</p>
              <p className="text-xs font-semibold text-gray-600">{fmt(dayTotal)}</p>
            </div>
            <div className="space-y-2">
              {daySales.map(sale => (
                <div key={sale.id} className="bg-white border border-gray-100 rounded-2xl px-4 py-3.5 flex items-center gap-3 shadow-sm">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={15} className="text-[#6366F1]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{sale.productName} <span className="text-gray-400 font-normal">×{sale.quantity}</span></p>
                    <p className="text-xs text-gray-400 truncate">
                      {sale.customer || 'Sin cliente'}
                      {date === today && sale.createdAt && <span className="ml-1.5 text-gray-300">· {fmtTime(sale.createdAt)}</span>}
                    </p>
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
        )
      })}
    </div>
  )
}
