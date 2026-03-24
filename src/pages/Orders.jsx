import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, ChevronDown, MessageCircle } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  pagado: { label: 'Pagado', color: 'text-[#2D68F6]', bg: 'bg-blue-50', dot: 'bg-[#2D68F6]' },
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
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-8 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Crear pedido</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Cliente</label>
            <input required value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
              placeholder="Nombre del cliente"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Producto</label>
            <div className="relative">
              <select required value={form.productId} onChange={e => setForm(f => ({ ...f, productId: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent">
                <option value="">Selecciona un producto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Cantidad</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center">−</button>
              <input type="number" min="1" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                className="w-12 h-12 rounded-xl bg-[#2D68F6] text-white font-bold text-xl flex items-center justify-center">+</button>
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nota <span className="text-gray-300 normal-case font-normal">(opcional)</span></label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Ej: Sin sal, dirección de entrega..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>

          {total > 0 && (
            <div className="bg-blue-50 rounded-2xl p-3.5 flex items-center justify-between">
              <span className="text-sm text-gray-600">Total</span>
              <span className="text-lg font-bold text-[#2D68F6]">{fmt(total)}</span>
            </div>
          )}

          <button type="submit" className="w-full bg-[#2D68F6] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all">
            Crear pedido
          </button>

          <button type="button" onClick={handleWhatsApp}
            className="w-full bg-[#25D366] text-white font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
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

  return (
    <div className="page-content">
      <div className="flex items-center justify-between pt-2 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Pedidos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{orders.length} pedidos registrados</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-[#2D68F6] text-white text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm shadow-blue-200">
          <Plus size={16} />
          Crear
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {['todos', 'pendiente', 'pagado', 'entregado'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f ? 'bg-[#2D68F6] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-3">📦</p>
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
    const msg = `Hola ${order.customer}, tu pedido de ${order.quantity} ${order.productName} está ${order.status}. Total ${new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.total)}. 🙌`
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
          <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${config.bg} ${config.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`}></span>
            {config.label}
          </span>
          <p className="text-sm font-bold text-gray-900">
            {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(order.total)}
          </p>
        </div>
      </div>
      {order.note && <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2 rounded-xl mb-3">"{order.note}"</p>}
      <div className="flex gap-2 mt-2">
        {order.status !== 'entregado' && (
          <button onClick={nextStatus}
            className="flex-1 bg-[#2D68F6] text-white text-xs font-semibold py-2.5 rounded-xl active:scale-95 transition-all">
            {order.status === 'pendiente' ? 'Marcar como pagado' : 'Marcar como entregado'}
          </button>
        )}
        <button onClick={whatsApp}
          className="w-10 h-10 bg-[#25D366]/10 rounded-xl flex items-center justify-center flex-shrink-0 active:scale-95">
          <MessageCircle size={16} className="text-[#25D366]" />
        </button>
      </div>
    </div>
  )
}
