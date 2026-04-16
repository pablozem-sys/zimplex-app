import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, X, ChevronDown, MessageCircle, Lock, Loader2, Trash2 } from 'lucide-react'
import UpgradeModal from '../components/UpgradeModal'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent'

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  pagado:    { label: 'Pagado',    color: 'text-[#7C3AED]', bg: 'bg-violet-50', dot: 'bg-[#7C3AED]' },
  entregado: { label: 'Entregado', color: 'text-[#7CD09B]', bg: 'bg-green-50',  dot: 'bg-[#7CD09B]' },
}

function buildWhatsAppMsg(customer, quantity, productName, total, note, transfer) {
  const lines = [
    `Hola ${customer} 👋`,
    ``,
    `Tu pedido está confirmado:`,
    `• ${quantity} × ${productName}`,
    `• Total: *${fmt(total)}*`,
  ]
  if (note) lines.push(`• Nota: ${note}`)

  const hasTransfer = transfer.bank || transfer.account || transfer.holder
  if (hasTransfer) {
    lines.push(``, `💳 *Datos para transferencia:*`)
    if (transfer.bank)        lines.push(`Banco: ${transfer.bank}`)
    if (transfer.accountType) lines.push(`Tipo: ${transfer.accountType}`)
    if (transfer.holder)      lines.push(`Titular: ${transfer.holder}`)
    if (transfer.rut)         lines.push(`RUT: ${transfer.rut}`)
    if (transfer.account)     lines.push(`N° cuenta: ${transfer.account}`)
    if (transfer.email)       lines.push(`Email: ${transfer.email}`)
  }

  lines.push(``, `¡Gracias por tu compra! 🙌`)
  return lines.join('\n')
}

function cleanPhone(raw) {
  const digits = raw.replace(/\D/g, '')
  return digits.startsWith('56') ? digits : `56${digits}`
}

// ─── CREATE ORDER MODAL ───────────────────────────────────────────────────────
function CreateOrderModal({ onClose, onAdd, products, transfer }) {
  const [form, setForm] = useState({
    customer: '',
    phone: '',
    productId: '',
    quantity: 1,
    unitPrice: '',
    note: '',
  })
  const [loading, setLoading]   = useState(false)
  const [loadingWA, setLoadingWA] = useState(false)
  const [error, setError]       = useState(null)

  const selectedProduct = products.find(p => p.id === form.productId)
  const total = (form.unitPrice || 0) * form.quantity

  const handleProductChange = (e) => {
    const product = products.find(p => p.id === e.target.value)
    setForm(f => ({ ...f, productId: e.target.value, unitPrice: product ? product.price : '' }))
  }

  const orderPayload = () => ({
    customer: form.customer,
    customerPhone: form.phone ? cleanPhone(form.phone) : null,
    productId: form.productId,
    productName: selectedProduct?.name || '',
    quantity: parseInt(form.quantity),
    unitPrice: parseInt(form.unitPrice),
    total,
    note: form.note,
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: err } = await onAdd(orderPayload())
    setLoading(false)
    if (err) { setError('Error al crear el pedido. Intenta de nuevo.'); return }
    onClose()
  }

  const handleCreateAndWhatsApp = async () => {
    if (!form.customer || !form.productId || !form.unitPrice) {
      setError('Completa los campos requeridos')
      return
    }
    setError(null)
    setLoadingWA(true)

    const { data: order, error: orderErr } = await onAdd(orderPayload())
    if (orderErr) {
      setError('Error al crear el pedido. Intenta de nuevo.')
      setLoadingWA(false)
      return
    }

    const msg = buildWhatsAppMsg(
      order.customer,
      order.quantity,
      order.productName,
      order.total,
      order.note,
      transfer
    )
    const phone = form.phone ? cleanPhone(form.phone) : ''
    const url = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')

    setLoadingWA(false)
    onClose()
  }

  const busy = loading || loadingWA

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
        style={{ marginBottom: '84px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Crear pedido</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleCreate} className="space-y-4">
          {/* Cliente */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Cliente</label>
            <input
              required
              value={form.customer}
              onChange={e => setForm(f => ({ ...f, customer: e.target.value }))}
              placeholder="Nombre del cliente"
              className={inputClass}
            />
          </div>

          {/* Teléfono (opcional) */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Teléfono <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-500 font-medium whitespace-nowrap">+56</span>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="9 1234 5678"
                className={inputClass}
              />
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Producto</label>
            <div className="relative">
              <select required value={form.productId} onChange={handleProductChange}
                className={`${inputClass} appearance-none`}>
                <option value="">Selecciona un producto</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* Precio unitario */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Precio unitario</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">$</span>
              <input
                type="number" value={form.unitPrice} required
                onChange={e => setForm(f => ({ ...f, unitPrice: parseInt(e.target.value) || '' }))}
                placeholder="0"
                className={`${inputClass} pl-8`}
              />
            </div>
          </div>

          {/* Cantidad */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Cantidad</label>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: Math.max(1, f.quantity - 1) }))}
                className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center active:scale-95">−</button>
              <input type="number" min="1" value={form.quantity}
                onChange={e => setForm(f => ({ ...f, quantity: parseInt(e.target.value) || 1 }))}
                className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent" />
              <button type="button" onClick={() => setForm(f => ({ ...f, quantity: f.quantity + 1 }))}
                className="w-12 h-12 rounded-2xl bg-[#7C3AED] text-white font-bold text-xl flex items-center justify-center active:scale-95 shadow-md shadow-violet-200">+</button>
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Nota <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <input value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
              placeholder="Ej: dirección de entrega, sin sal..." className={inputClass} />
          </div>

          {/* Total */}
          {total > 0 && (
            <div className="bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-violet-200">
              <span className="text-sm text-blue-100">Total</span>
              <span className="text-xl font-bold text-white">{fmt(total)}</span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>
          )}

          <button type="submit" disabled={busy}
            className="w-full bg-[#7C3AED] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-violet-200 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" />Creando...</> : 'Crear pedido'}
          </button>

          <button type="button" onClick={handleCreateAndWhatsApp} disabled={busy}
            className="w-full bg-[#25D366] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-green-200 disabled:opacity-60">
            {loadingWA
              ? <><Loader2 size={18} className="animate-spin" />Enviando...</>
              : <><MessageCircle size={18} />Crear y enviar por WhatsApp</>
            }
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
export default function Orders() {
  const { orders, products, addOrder, updateOrderStatus, deleteOrder, transferDetails } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [filter, setFilter]         = useState('todos')

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
          filtered.map(order => (
            <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} onDelete={deleteOrder} transfer={transferDetails} />
          ))
        )}
      </div>

      {showCreate && (
        <CreateOrderModal
          onClose={() => setShowCreate(false)}
          onAdd={addOrder}
          products={products}
          transfer={transferDetails}
        />
      )}
    </div>
  )
}

// ─── ORDER CARD ───────────────────────────────────────────────────────────────
function OrderCard({ order, onStatusChange, onDelete, transfer }) {
  const { isPro } = useApp()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const config = statusConfig[order.status]
  const statuses = ['pendiente', 'pagado', 'entregado']

  const nextStatus = () => {
    const idx = statuses.indexOf(order.status)
    if (idx < statuses.length - 1) onStatusChange(order.id, statuses[idx + 1])
  }

  const handleWhatsApp = () => {
    if (!isPro) { setShowUpgrade(true); return }
    const msg = buildWhatsAppMsg(order.customer, order.quantity, order.productName, order.total, order.note, transfer)
    const url = order.customerPhone
      ? `https://wa.me/${order.customerPhone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
            <p className="text-xs text-gray-400 mt-0.5">{order.productName} × {order.quantity}</p>
            {order.customerPhone && (
              <p className="text-xs text-gray-300 mt-0.5">+{order.customerPhone}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${config.bg} ${config.color}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
              {config.label}
            </span>
            <p className="text-sm font-bold text-gray-900">{fmt(order.total)}</p>
          </div>
        </div>

        {order.note && (
          <p className="text-xs text-gray-400 bg-gray-50 px-3 py-2.5 rounded-2xl mb-3">"{order.note}"</p>
        )}

        {/* Confirmar eliminación */}
        {confirmDelete && (
          <div className="bg-red-50 border border-red-100 rounded-2xl px-3 py-2.5 mb-3 flex items-center justify-between gap-2">
            <p className="text-xs text-red-500 font-medium">¿Eliminar este pedido?</p>
            <div className="flex gap-2">
              <button onClick={() => setConfirmDelete(false)}
                className="text-xs text-gray-400 font-semibold px-3 py-1.5 rounded-xl bg-white border border-gray-200">
                No
              </button>
              <button onClick={() => onDelete(order.id)}
                className="text-xs text-white font-semibold px-3 py-1.5 rounded-xl bg-red-500 active:scale-95">
                Sí, eliminar
              </button>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-2">
          {order.status !== 'entregado' && (
            <button onClick={nextStatus}
              className="flex-1 bg-[#7C3AED] text-white text-xs font-semibold py-3 rounded-2xl active:scale-95 transition-all shadow-md shadow-blue-100">
              {order.status === 'pendiente' ? 'Marcar como pagado' : 'Marcar como entregado'}
            </button>
          )}
          <button onClick={handleWhatsApp}
            className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 active:scale-95 ${
              isPro ? 'bg-[#25D366]/10' : 'bg-gray-100'
            }`}>
            {isPro
              ? <MessageCircle size={18} className="text-[#25D366]" />
              : <Lock size={16} className="text-gray-400" />
            }
          </button>
          <button onClick={() => setConfirmDelete(true)}
            className="w-11 h-11 rounded-2xl bg-red-50 flex items-center justify-center flex-shrink-0 active:scale-95">
            <Trash2 size={16} className="text-red-400" />
          </button>
        </div>
      </div>
      {showUpgrade && <UpgradeModal variant="whatsapp" onClose={() => setShowUpgrade(false)} />}
    </>
  )
}
