import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, AlertTriangle, Package, X, ChevronRight } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

function AddProductModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', price: '', stock: '', description: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name: form.name, price: parseInt(form.price), stock: parseInt(form.stock), description: form.description })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Agregar producto</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nombre</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Tomate cherry"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Precio</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="0"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-7 pr-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Stock inicial</label>
              <input required type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Descripción <span className="text-gray-300 normal-case font-normal">(opcional)</span></label>
            <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Descripción breve"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>
          <button type="submit"
            className="w-full bg-[#2D68F6] text-white font-semibold py-4 rounded-2xl mt-2 active:scale-[0.98] transition-all">
            Agregar producto
          </button>
        </form>
      </div>
    </div>
  )
}

function EditStockModal({ product, onClose, onUpdate }) {
  const [stock, setStock] = useState(product.stock)

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Editar stock</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-4">{product.name}</p>
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStock(s => Math.max(0, s - 1))}
            className="w-12 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold text-xl flex items-center justify-center">−</button>
          <input type="number" value={stock} onChange={e => setStock(parseInt(e.target.value) || 0)}
            className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          <button onClick={() => setStock(s => s + 1)}
            className="w-12 h-12 rounded-xl bg-[#2D68F6] text-white font-bold text-xl flex items-center justify-center">+</button>
        </div>
        <button onClick={() => { onUpdate(product.id, { stock }); onClose() }}
          className="w-full bg-[#2D68F6] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all">
          Guardar
        </button>
      </div>
    </div>
  )
}

export default function Products() {
  const { products, addProduct, updateProduct, deleteProduct } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold)
  const okStock = products.filter(p => p.stock > p.lowStockThreshold)

  return (
    <div className="page-content">
      <div className="flex items-center justify-between pt-2 mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} productos en stock</p>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-1.5 bg-[#2D68F6] text-white text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm shadow-blue-200">
          <Plus size={16} />
          Agregar
        </button>
      </div>

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-3.5 mb-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#DC4B56]/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-[#DC4B56]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#DC4B56]">{lowStock.length} producto{lowStock.length > 1 ? 's' : ''} con stock bajo</p>
            <p className="text-xs text-red-400">{lowStock.map(p => p.name).join(', ')}</p>
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="mb-2">
          <p className="text-xs font-semibold text-[#DC4B56] uppercase tracking-wide mb-2">Stock bajo</p>
          <div className="space-y-2">
            {lowStock.map(product => <ProductCard key={product.id} product={product} onEdit={() => setEditingProduct(product)} onDelete={() => deleteProduct(product.id)} />)}
          </div>
        </div>
      )}

      {okStock.length > 0 && (
        <div className="mt-4">
          {lowStock.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">En stock</p>}
          <div className="space-y-2">
            {okStock.map(product => <ProductCard key={product.id} product={product} onEdit={() => setEditingProduct(product)} onDelete={() => deleteProduct(product.id)} />)}
          </div>
        </div>
      )}

      {showAdd && <AddProductModal onClose={() => setShowAdd(false)} onAdd={addProduct} />}
      {editingProduct && <EditStockModal product={editingProduct} onClose={() => setEditingProduct(null)} onUpdate={updateProduct} />}
    </div>
  )
}

function ProductCard({ product, onEdit, onDelete }) {
  const isLow = product.stock <= product.lowStockThreshold

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isLow ? 'bg-red-50' : 'bg-blue-50'}`}>
        <Package size={18} className={isLow ? 'text-[#DC4B56]' : 'text-[#2D68F6]'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
          {isLow && (
            <span className="text-[10px] font-bold text-[#DC4B56] bg-red-50 px-1.5 py-0.5 rounded-full">BAJO</span>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(product.price)} · Stock: <span className={`font-semibold ${isLow ? 'text-[#DC4B56]' : 'text-gray-700'}`}>{product.stock}</span>
        </p>
      </div>
      <button onClick={onEdit} className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0 active:scale-95">
        <ChevronRight size={16} className="text-gray-400" />
      </button>
    </div>
  )
}
