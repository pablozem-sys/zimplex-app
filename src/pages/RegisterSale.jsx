import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CheckCircle, ChevronDown, Clock, TrendingUp } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const paymentMethods = [
  { id: 'efectivo', label: 'Efectivo', emoji: '💵' },
  { id: 'transferencia', label: 'Transferencia', emoji: '📲' },
  { id: 'tarjeta', label: 'Tarjeta', emoji: '💳' },
]

const paymentColors = {
  efectivo: 'text-emerald-600 bg-emerald-50',
  transferencia: 'text-[#7C3AED] bg-violet-50',
  tarjeta: 'text-purple-600 bg-purple-50',
}
const paymentLabels = { efectivo: 'Efectivo', transferencia: 'Transferencia', tarjeta: 'Tarjeta' }

const inputClass = 'w-full bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent shadow-sm'

export default function RegisterSale() {
  const { products, sales, addSale } = useApp()
  const [tab, setTab] = useState('registrar')
  const [form, setForm] = useState({
    productId: '',
    quantity: 1,
    unitPrice: '',
    customer: '',
    paymentMethod: 'efectivo',
  })
  const [success, setSuccess] = useState(false)
  const [lastTotal, setLastTotal] = useState(0)

  const selectedProduct = products.find(p => p.id === parseInt(form.productId))
  const total = (form.unitPrice || 0) * form.quantity

  const handleProductChange = (e) => {
    const product = products.find(p => p.id === parseInt(e.target.value))
    setForm(f => ({ ...f, productId: e.target.value, unitPrice: product ? product.price : '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.productId || !form.unitPrice || form.quantity < 1) return
    addSale({
      productId: parseInt(form.productId),
      productName: selectedProduct.name,
      quantity: parseInt(form.quantity),
      unitPrice: parseInt(form.unitPrice),
      total,
      customer: form.customer,
      paymentMethod: form.paymentMethod,
    })
    setLastTotal(total)
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setForm({ productId: '', quantity: 1, unitPrice: '', customer: '', paymentMethod: 'efectivo' })
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
        <p className="text-3xl font-bold text-[#7C3AED] mt-4">{fmt(lastTotal)}</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="pt-2 mb-5">
        <h1 className="text-xl font-bold text-gray-900">Ventas</h1>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-2xl p-1 mb-5">
        <button
          onClick={() => setTab('registrar')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'registrar' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-400'}`}
        >
          Registrar
        </button>
        <button
          onClick={() => setTab('historial')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === 'historial' ? 'bg-white text-[#7C3AED] shadow-sm' : 'text-gray-400'}`}
        >
          Historial
        </button>
      </div>

      {tab === 'registrar' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Producto</label>
            <div className="relative">
              <select
                value={form.productId}
                onChange={handleProductChange}
                required
                className={`${inputClass} appearance-none`}
              >
                <option value="">Selecciona un producto</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Stock: {p.stock} {p.unit || 'und'} — {fmt(p.price)}/{p.unit || 'und'}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            {selectedProduct && selectedProduct.stock <= selectedProduct.lowStockThreshold && (
              <p className="text-xs text-[#DC4B56] mt-1.5">⚠️ Stock bajo: solo quedan {selectedProduct.stock} unidades</p>
            )}
          </div>

          {/* Quantity */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
            Cantidad {selectedProduct?.unit ? <span className="normal-case font-normal text-gray-300">({selectedProduct.unit})</span> : ''}
          </label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                className="w-12 h-12 rounded-2xl bg-white border border-gray-200 shadow-sm text-gray-600 font-bold text-xl flex items-center justify-center active:scale-95">
                −
              </button>
              <input
                type="number"
                min="1"
                value={form.quantity}
                onChange={(e) => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                className="flex-1 bg-white border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-900 text-center font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent"
              />
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white font-bold text-xl flex items-center justify-center active:scale-95 shadow-md shadow-violet-200">
                +
              </button>
            </div>
          </div>

          {/* Unit price */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Precio unitario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number"
                value={form.unitPrice}
                onChange={(e) => setForm(f => ({ ...f, unitPrice: parseInt(e.target.value) || '' }))}
                placeholder="0"
                required
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* Customer */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Cliente <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={form.customer}
              onChange={(e) => setForm(f => ({ ...f, customer: e.target.value }))}
              placeholder="Nombre del cliente"
              className={inputClass}
            />
          </div>

          {/* Payment method */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Método de pago</label>
            <div className="grid grid-cols-3 gap-2">
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, paymentMethod: pm.id }))}
                  className={`py-3.5 rounded-2xl border text-sm font-medium flex flex-col items-center gap-1 transition-all shadow-sm ${
                    form.paymentMethod === pm.id
                      ? 'border-[#7C3AED] bg-violet-50 text-[#7C3AED] shadow-blue-100'
                      : 'border-gray-200 bg-white text-gray-400'
                  }`}
                >
                  <span className="text-xl">{pm.emoji}</span>
                  <span className="text-xs">{pm.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-violet-200">
            <span className="text-sm font-medium text-blue-100">Total</span>
            <span className="text-2xl font-bold text-white">{fmt(total)}</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-[#7C3AED] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-lg shadow-violet-200 text-base"
          >
            Registrar venta
          </button>
        </form>
      ) : (
        <SaleHistory sales={sales} />
      )}
    </div>
  )
}

function SaleHistory({ sales }) {
  const today = new Date().toISOString().split('T')[0]
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
    if (dateStr === today) return 'Hoy'
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    if (dateStr === yesterday.toISOString().split('T')[0]) return 'Ayer'
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'long', day: 'numeric', month: 'short' })
  }

  return (
    <div className="space-y-5">
      {todaySales.length > 0 && (
        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-violet-200">
          <div>
            <p className="text-blue-100 text-xs font-medium">Total hoy</p>
            <p className="text-white text-xl font-bold">{fmt(todayTotal)}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-xs">{todaySales.length} ventas</p>
            <Clock size={20} className="text-blue-200 mt-1 ml-auto" />
          </div>
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
                  <div className="w-9 h-9 rounded-2xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                    <TrendingUp size={15} className="text-[#7C3AED]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{sale.productName} <span className="text-gray-400 font-normal">×{sale.quantity}</span></p>
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
        )
      })}
    </div>
  )
}
