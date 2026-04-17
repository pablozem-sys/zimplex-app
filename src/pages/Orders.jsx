import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { supabase } from '../lib/supabase'
import { Plus, X, ChevronDown, MessageCircle, Lock, Loader2, Trash2, Pencil } from 'lucide-react'
import UpgradeModal from '../components/UpgradeModal'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent'

const statusConfig = {
  pendiente: { label: 'Pendiente', color: 'text-amber-600', bg: 'bg-amber-50', dot: 'bg-amber-400' },
  pagado:    { label: 'Pagado',    color: 'text-[#6366F1]', bg: 'bg-indigo-50', dot: 'bg-[#6366F1]' },
  entregado: { label: 'Entregado', color: 'text-[#7CD09B]', bg: 'bg-green-50',  dot: 'bg-[#7CD09B]' },
}

function buildWhatsAppMsg(customer, items, total, note, transfer) {
  const lines = [`Hola ${customer} 👋`, ``, `Tu pedido está confirmado:`]
  items.forEach(({ quantity, productName, subtotal }) => {
    lines.push(`• ${quantity} × ${productName} — ${fmt(subtotal)}`)
  })
  lines.push(``, `💰 *Total: ${fmt(total)}*`)
  if (note) lines.push(``, `📝 Nota: ${note}`)

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
const EMPTY_ITEM = { productId: '', quantity: 1, unitPrice: '' }

function CreateOrderModal({ onClose, onAdd, products, transfer }) {
  const [customer, setCustomer] = useState('')
  const [phone, setPhone]       = useState('')
  const [note, setNote]         = useState('')
  const [items, setItems]       = useState([])
  const [current, setCurrent]   = useState(EMPTY_ITEM)
  const [itemError, setItemError] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [loadingWA, setLoadingWA] = useState(false)
  const [error, setError]       = useState(null)

  const currentProduct  = products.find(p => p.id === current.productId)
  const currentSubtotal = (current.unitPrice || 0) * current.quantity
  const grandTotal      = items.reduce((s, i) => s + i.subtotal, 0)
  const busy            = loading || loadingWA

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

    const existing = items.findIndex(i => i.productId === current.productId)
    if (existing !== -1) {
      const newQty = items[existing].quantity + current.quantity
      setItems(prev => prev.map((item, idx) => idx === existing
        ? { ...item, quantity: newQty, subtotal: newQty * item.unitPrice }
        : item
      ))
    } else {
      setItems(prev => [...prev, {
        productId: current.productId,
        productName: p.name,
        quantity: current.quantity,
        unitPrice: parseInt(current.unitPrice),
        subtotal: current.quantity * parseInt(current.unitPrice),
      }])
    }
    setCurrent(EMPTY_ITEM)
    setItemError(null)
  }

  const handleRemoveItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

  const buildPayload = () => ({
    customer,
    customerPhone: phone ? cleanPhone(phone) : null,
    note,
    items,
  })

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!customer.trim()) { setError('Ingresa el nombre del cliente.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    setError(null)
    setLoading(true)
    const { error: err } = await onAdd(buildPayload())
    setLoading(false)
    if (err) { setError('Error al crear el pedido. Intenta de nuevo.'); return }
    onClose()
  }

  const handleCreateAndWhatsApp = async () => {
    if (!customer.trim()) { setError('Ingresa el nombre del cliente.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    setError(null)
    setLoadingWA(true)
    const { data: order, error: orderErr } = await onAdd(buildPayload())
    if (orderErr) { setError('Error al crear el pedido.'); setLoadingWA(false); return }

    const msg = buildWhatsAppMsg(order.customer, items, grandTotal, note, transfer)
    const p = phone ? cleanPhone(phone) : ''
    window.open(p ? `https://wa.me/${p}?text=${encodeURIComponent(msg)}` : `https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
    setLoadingWA(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
        style={{ marginBottom: '84px' }} onClick={e => e.stopPropagation()}>
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
            <input value={customer} onChange={e => setCustomer(e.target.value)}
              placeholder="Nombre del cliente" className={inputClass} />
          </div>

          {/* Teléfono */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Teléfono <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-500 font-medium whitespace-nowrap">+56</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="9 1234 5678" className={inputClass} />
            </div>
          </div>

          {/* Items agregados */}
          {items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Productos</p>
              {items.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.quantity} und. × {fmt(item.unitPrice)}</p>
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

          {/* Agregar producto */}
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
              {items.length === 0 ? 'Agregar producto' : 'Agregar otro producto'}
            </p>

            <div className="relative">
              <select value={current.productId} onChange={handleCurrentProductChange}
                className={`${inputClass} appearance-none bg-white`}>
                <option value="">Selecciona un producto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

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
                    placeholder="0" className={`${inputClass} pl-8 bg-white`} />
                </div>
              </div>
            </div>

            {currentSubtotal > 0 && (
              <p className="text-xs text-gray-400 text-right">Subtotal: <span className="font-semibold text-gray-700">{fmt(currentSubtotal)}</span></p>
            )}
            {itemError && <p className="text-xs text-red-500">{itemError}</p>}

            <button type="button" onClick={handleAddItem}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#6366F1]/30 text-[#6366F1] text-sm font-semibold active:scale-[0.98] transition-all hover:bg-indigo-50">
              <Plus size={16} /> Agregar producto
            </button>
          </div>

          {/* Nota */}
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Nota <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <input value={note} onChange={e => setNote(e.target.value)}
              placeholder="Ej: dirección de entrega, sin sal..." className={inputClass} />
          </div>

          {/* Total */}
          {grandTotal > 0 && (
            <div className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-200">
              <div>
                <p className="text-blue-100 text-xs">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
                <span className="text-sm text-blue-100">Total</span>
              </div>
              <span className="text-xl font-bold text-white">{fmt(grandTotal)}</span>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}

          <button type="submit" disabled={busy}
            className="w-full bg-[#6366F1] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60">
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

// ─── EDIT ORDER MODAL ─────────────────────────────────────────────────────────
function EditOrderModal({ order, onClose, onSave, products }) {
  const [customer, setCustomer]     = useState(order.customer || '')
  const [phone, setPhone]           = useState(order.customerPhone ? String(order.customerPhone).replace(/^56/, '') : '')
  const [note, setNote]             = useState(order.note || '')
  const [items, setItems]           = useState([])
  const [loadingItems, setLoadingItems] = useState(true)

  useEffect(() => {
    supabase.from('order_items').select('*').eq('order_id', order.id).then(({ data }) => {
      if (data && data.length > 0) {
        setItems(data.map(i => ({
          productId:   i.product_id  || '',
          productName: i.product_name,
          quantity:    i.quantity,
          unitPrice:   i.unit_price,
          subtotal:    i.subtotal,
        })))
      } else {
        setItems([{
          productId:   order.productId || '',
          productName: order.productName,
          quantity:    order.quantity,
          unitPrice:   order.quantity > 0 ? Math.round(order.total / order.quantity) : 0,
          subtotal:    order.total,
        }])
      }
      setLoadingItems(false)
    })
  }, [order.id])
  const [current, setCurrent]   = useState(EMPTY_ITEM)
  const [itemError, setItemError] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const currentProduct  = products.find(p => p.id === current.productId)
  const currentSubtotal = (current.unitPrice || 0) * current.quantity
  const grandTotal      = items.reduce((s, i) => s + i.subtotal, 0)

  const handleCurrentProductChange = (e) => {
    const p = products.find(x => x.id === e.target.value)
    setCurrent(c => ({ ...c, productId: e.target.value, unitPrice: p ? p.price : '' }))
    setItemError(null)
  }

  const handleAddItem = () => {
    if (!current.productId || !current.unitPrice || current.quantity < 1) { setItemError('Selecciona un producto.'); return }
    const p = products.find(x => x.id === current.productId)
    if (!p) return
    const existing = items.findIndex(i => i.productId === current.productId)
    if (existing !== -1) {
      const newQty = items[existing].quantity + current.quantity
      setItems(prev => prev.map((item, idx) => idx === existing ? { ...item, quantity: newQty, subtotal: newQty * item.unitPrice } : item))
    } else {
      setItems(prev => [...prev, { productId: current.productId, productName: p.name, quantity: current.quantity, unitPrice: parseInt(current.unitPrice), subtotal: current.quantity * parseInt(current.unitPrice) }])
    }
    setCurrent(EMPTY_ITEM)
    setItemError(null)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!customer.trim()) { setError('Ingresa el nombre del cliente.'); return }
    if (items.length === 0) { setError('Agrega al menos un producto.'); return }
    setError(null)
    setLoading(true)
    await onSave(order.id, { customer, customerPhone: phone ? cleanPhone(phone) : null, note, items })
    setLoading(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 max-h-[90vh] overflow-y-auto"
        style={{ marginBottom: '84px' }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Editar pedido</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {loadingItems ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[#6366F1]" />
          </div>
        ) : null}

        <form onSubmit={handleSave} className={`space-y-4 ${loadingItems ? 'hidden' : ''}`}>
          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Cliente</label>
            <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nombre del cliente" className={inputClass} />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Teléfono <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm text-gray-500 font-medium whitespace-nowrap">+56</span>
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="9 1234 5678" className={inputClass} />
            </div>
          </div>

          {/* Items */}
          {items.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Productos</p>
              {items.map((item, idx) => (
                <div key={idx} className="bg-white border border-gray-100 rounded-2xl px-4 py-3 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.productName}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.quantity} und. × {fmt(item.unitPrice)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-bold text-[#6366F1]">{fmt(item.subtotal)}</p>
                    <button type="button" onClick={() => setItems(prev => prev.filter((_, i) => i !== idx))}
                      className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center active:scale-95">
                      <Trash2 size={14} className="text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Agregar producto */}
          <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-4 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Agregar producto</p>
            <div className="relative">
              <select value={current.productId} onChange={handleCurrentProductChange}
                className={`${inputClass} appearance-none bg-white`}>
                <option value="">Selecciona un producto</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.name} — {fmt(p.price)}</option>)}
              </select>
              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
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
                    placeholder="0" className={`${inputClass} pl-8 bg-white`} />
                </div>
              </div>
            </div>
            {currentSubtotal > 0 && <p className="text-xs text-gray-400 text-right">Subtotal: <span className="font-semibold text-gray-700">{fmt(currentSubtotal)}</span></p>}
            {itemError && <p className="text-xs text-red-500">{itemError}</p>}
            <button type="button" onClick={handleAddItem}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 border-dashed border-[#6366F1]/30 text-[#6366F1] text-sm font-semibold active:scale-[0.98] transition-all hover:bg-indigo-50">
              <Plus size={16} /> Agregar producto
            </button>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
              Nota <span className="text-gray-300 normal-case font-normal">(opcional)</span>
            </label>
            <input value={note} onChange={e => setNote(e.target.value)} placeholder="Ej: dirección de entrega..." className={inputClass} />
          </div>

          {grandTotal > 0 && (
            <div className="bg-gradient-to-r from-[#6366F1] to-[#818CF8] rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-indigo-200">
              <div>
                <p className="text-blue-100 text-xs">{items.length} producto{items.length !== 1 ? 's' : ''}</p>
                <span className="text-sm text-blue-100">Total</span>
              </div>
              <span className="text-xl font-bold text-white">{fmt(grandTotal)}</span>
            </div>
          )}

          {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full bg-[#6366F1] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <><Loader2 size={18} className="animate-spin" />Guardando...</> : 'Guardar cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── ORDERS PAGE ──────────────────────────────────────────────────────────────
export default function Orders() {
  const { orders, products, addOrder, updateOrderStatus, updateOrder, deleteOrder, transferDetails } = useApp()
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
          className="flex items-center gap-1.5 bg-[#6366F1] text-white text-sm font-semibold px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-indigo-200">
          <Plus size={16} />
          Crear
        </button>
      </div>

      <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
        {['todos', 'pendiente', 'pagado', 'entregado'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === f ? 'bg-[#6366F1] text-white shadow-md shadow-indigo-200' : 'bg-white text-gray-500 border border-gray-200'
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
            <OrderCard key={order.id} order={order} onStatusChange={updateOrderStatus} onUpdate={updateOrder} onDelete={deleteOrder} transfer={transferDetails} products={products} />
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
function OrderCard({ order, onStatusChange, onUpdate, onDelete, transfer, products }) {
  const { isPro } = useApp()
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const config = statusConfig[order.status]
  const statuses = ['pendiente', 'pagado', 'entregado']

  const nextStatus = () => {
    const idx = statuses.indexOf(order.status)
    if (idx < statuses.length - 1) onStatusChange(order.id, statuses[idx + 1])
  }

  const handleWhatsApp = () => {
    if (!isPro) { setShowUpgrade(true); return }
    const items = [{ quantity: order.quantity, productName: order.productName, subtotal: order.total }]
    const msg = buildWhatsAppMsg(order.customer, items, order.total, order.note, transfer)
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
              className="flex-1 bg-[#6366F1] text-white text-xs font-semibold py-3 rounded-2xl active:scale-95 transition-all shadow-md shadow-blue-100">
              {order.status === 'pendiente' ? 'Marcar como pagado' : 'Marcar como entregado'}
            </button>
          )}
          <button onClick={() => setShowEdit(true)}
            className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center flex-shrink-0 active:scale-95">
            <Pencil size={15} className="text-gray-500" />
          </button>
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
      {showEdit && <EditOrderModal order={order} onClose={() => setShowEdit(false)} onSave={onUpdate} products={products} />}
    </>
  )
}
