import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { CheckCircle, ChevronDown } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const paymentMethods = [
  { id: 'efectivo', label: 'Efectivo', emoji: '💵' },
  { id: 'transferencia', label: 'Transferencia', emoji: '📲' },
  { id: 'tarjeta', label: 'Tarjeta', emoji: '💳' },
]

export default function RegisterSale() {
  const { products, addSale, setActiveTab } = useApp()
  const [form, setForm] = useState({
    productId: '',
    quantity: 1,
    unitPrice: '',
    customer: '',
    paymentMethod: 'efectivo',
  })
  const [success, setSuccess] = useState(false)

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
    setSuccess(true)
    setTimeout(() => {
      setSuccess(false)
      setForm({ productId: '', quantity: 1, unitPrice: '', customer: '', paymentMethod: 'efectivo' })
    }, 2000)
  }

  if (success) {
    return (
      <div className="page-content flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-[#7CD09B]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">¡Venta registrada!</h2>
        <p className="text-gray-500 text-sm text-center">El stock se actualizó automáticamente</p>
        <p className="text-2xl font-bold text-[#2D68F6] mt-4">{fmt(total)}</p>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="pt-2 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Registrar Venta</h1>
        <p className="text-sm text-gray-400 mt-0.5">Completa los datos de la venta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Producto</label>
          <div className="relative">
            <select
              value={form.productId}
              onChange={handleProductChange}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent"
            >
              <option value="">Selecciona un producto</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — Stock: {p.stock} — {fmt(p.price)}
                </option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {selectedProduct && selectedProduct.stock <= selectedProduct.lowStockThreshold && (
            <p className="text-xs text-[#DC4B56] mt-1 flex items-center gap-1">
              ⚠️ Stock bajo: solo quedan {selectedProduct.stock} unidades
            </p>
          )}
        </div>

        {/* Quantity */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Cantidad</label>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
              className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center active:scale-95">
              −
            </button>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 text-center font-semibold focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent"
            />
            <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
              className="w-12 h-12 rounded-xl bg-[#2D68F6] text-white font-bold text-xl flex items-center justify-center active:scale-95">
              +
            </button>
          </div>
        </div>

        {/* Unit price */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Precio unitario</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
            <input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm(f => ({ ...f, unitPrice: parseInt(e.target.value) || '' }))}
              placeholder="0"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent"
            />
          </div>
        </div>

        {/* Customer (optional) */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Cliente <span className="text-gray-300 normal-case font-normal">(opcional)</span></label>
          <input
            type="text"
            value={form.customer}
            onChange={(e) => setForm(f => ({ ...f, customer: e.target.value }))}
            placeholder="Nombre del cliente"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent"
          />
        </div>

        {/* Payment method */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Método de pago</label>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map(pm => (
              <button
                key={pm.id}
                type="button"
                onClick={() => setForm(f => ({ ...f, paymentMethod: pm.id }))}
                className={`py-3 rounded-xl border text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                  form.paymentMethod === pm.id
                    ? 'border-[#2D68F6] bg-blue-50 text-[#2D68F6]'
                    : 'border-gray-200 bg-gray-50 text-gray-500'
                }`}
              >
                <span className="text-lg">{pm.emoji}</span>
                {pm.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-50/50 rounded-2xl p-4 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total</span>
          <span className="text-2xl font-bold text-[#2D68F6]">{fmt(total)}</span>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#2D68F6] hover:bg-[#1a56e0] active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all duration-200 shadow-md shadow-blue-200 text-base"
        >
          Registrar venta
        </button>
      </form>
    </div>
  )
}
