import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, ChevronDown, MessageCircle } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent'

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  pagado: { label: 'Pagado', color: 'text-[#7C3AED]', bg: 'bg-violet-50', dot: 'bg-[#7C3AED]' },
  entregado: { label: 'Entregado', color: 'text-[#7CD09B]', bg: 'bg-green-50', dot: 'bg-[#7CD09B]' },
}

function CreateOrderModal({ onClose, onAdd, products }) {
  const [form, setForm] = useState({ customer: '', productId: '', quantity: 1, note: '' })

  const selectedProduct = products.find(p => p.id === parseInt(form.productId))
  const total = selectedProduct ? selectedProduct.price * form.quantity : 0

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({
      customer: form.customer,
      productId: parseInt(form.productId),
      productName: selectedProduct?.name || '',
      quantity: parseInt(form.quantity),
      total,
      status: 'pendiente',
      note: form.note,
    })
    onClose()
  }

  const handleWhatsApp = () => {
    if (!form.customer || !selectedProduct) return
    const msg = `Hola ${form.customer}, tu pedido de ${form.quantity} ${selectedProduct.name} está confirmado. Total ${fmt(total)}. ¡Gracias! 🙌`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Crear pedido</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Cliente</label>
            <input required value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
              placeholder="Nombre del cliente" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Producto</label>
            <div className="relative">
              <select required value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                className={`${inputClass} appearance-none`}>
                <option value="">Selecciona un producto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Cantidad</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center active:scale-95">−</button>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent" />
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white font-bold text-xl flex items-center justify-center active:scale-95 shadow-md shadow-violet-200">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Nota <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Ej: Sin sal, dirección de entrega..." className={inputClass} />
          </div>

          {total > 0 && (
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-violet-200">
              <span className="text-sm text-blue-100">Total</span>
              <span className="text-xl font-bold text-white">{fmt(total)}</span>
            </div>
          )}

          <button type="submit"
            className="w-full bg-[#7C3AED] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-violet-200">
            Crear pedido
          </button>

          <button type="button" onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-green-200">
            <MessageCircle size={18} />
            Enviar por WhatsApp
          </button>
        </form>
      </div>
    </div>
  )
}

export default function Orders() {
  const { orders, products, addOrder, updateOrderStatus } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter] = useState('todos')

  const filtered = filter === 'todos' ? orders : orders.filter(o => o.status === filter)

  const filterLabels = { todos: 'Todos', pendiente: 'Pendiente', pagado: 'Pagado', entregado: 'Entregado' }

  return (
    <div className="page-content">
      <div className="flex items-center justify-between pt-2 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} pedidos registrados</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-[#7C3AED] text-white text-sm font-semibold px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-violet-200">
          <Plus size={16} />
          Crear
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['todos', 'pendiente', 'pagado', 'entregado'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f ? 'bg-[#7C3AED] text-white shadow-md shadow-violet-200' : 'bg-white text-gray-500 border border-gray-200'
            }`}>
            {filterLabels[f]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-5xl mb-3">📦</p>
            <p className="text-sm font-medium">No hay pedidos</p>
          </div>
        ) : (
          filtered.map(order => <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} />)
        )}
      </div>

      {showCreate && <CreateOrderModal onClose={() => setShowCreate(false)} onAdd={addOrder} products={products} />}
    </div>
  )
}

function OrderCard({ order, onStatusChange }) {
  const config = statusConfig[order.status]
  const statuses = ['pendiente', 'pagado', 'entregado']

  const nextStatus = () => {
    const idx = statuses.indexOf(order.status)
    if (idx < statuses.length - 1) onStatusChange(order.id, statuses[idx + 1])
  }

  const whatsApp = () => {
    const msg = `Hola ${order.customer}, tu pedido de ${order.quantity} ${order.productName} está ${order.status}. Total ${fmt(order.total)}. 🙌`
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
          <p className="text-xs text-gray-400 mt-0.5">{order.productName} × {order.quantity}</p>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
          </span>
          <p className="text-sm font-bold text-gray-900">{fmt(order.total)}</p>
        </div>
      </div>
      {order.note && (
        <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2.5 rounded-2xl mb-3">"{order.note}"</p>
      )}
      <div className="flex gap-2 mt-2">
        {order.status !== 'entregado' && (
          <button onClick={nextStatus}
            className="flex-1 bg-[#7C3AED] text-white text-xs font-semibold py-3 rounded-2xl active:scale-95 transition-all shadow-md shadow-blue-100">
            {order.status === 'pendiente' ? 'Marcar como pagado' : 'Marcar como entregado'}
          </button>
        )}
        <button onClick={whatsApp}
          className="w-11 h-11 bg-[#25D366]/10 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95">
          <MessageCircle size={18} className="text-[#25D366]" />
        </button>
      </div>
    </div>
  )
}
