import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, AlertTriangle, Package, X, Trash2, Pencil } from 'lucide-react'
import UpgradeModal from '../components/UpgradeModal'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)
const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent'

const UNITS = ['unidades', 'kg', 'gramos', 'litros', 'ml', 'metros', 'cajas', 'docenas', 'bolsas', 'porciones']

function ProductFormModal({ title, initial, onClose, onSave }) {
  const [form, setForm] = useState(initial)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      name: form.name,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      lowStockThreshold: form.lowStockThreshold === '' ? 0 : parseInt(form.lowStockThreshold),
      description: form.description,
      unit: form.unit || 'unidades',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[430px] rounded-t-[32px] overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 80px)', marginBottom: '84px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 pb-10">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Nombre</label>
              <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Tomate cherry" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Precio</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input required type="number" min="0" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                    placeholder="0" className={`${inputClass} pl-8`} />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Stock inicial</label>
                <input required type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))}
                  placeholder="0" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                Alerta de stock bajo <span className="text-gray-300 normal-case font-normal">(avisarme cuando queden menos de...)</span>
              </label>
              <div className="relative">
                <input type="number" min="0" value={form.lowStockThreshold}
                  onChange={e => setForm(f => ({ ...f, lowStockThreshold: e.target.value }))}
                  placeholder="Ej: 5 — dejar en 0 para no alertar"
                  className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Unidad de medida</label>
              <div className="flex flex-wrap gap-2">
                {UNITS.map(u => (
                  <button key={u} type="button"
                    onClick={() => setForm(f => ({ ...f, unit: u }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      (form.unit || 'unidades') === u
                        ? 'bg-indigo-50 border-[#6366F1] text-[#6366F1]'
                        : 'bg-gray-50 border-gray-200 text-gray-500'
                    }`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">
                Descripción <span className="text-gray-300 normal-case font-normal">(opcional)</span>
              </label>
              <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descripción breve" className={inputClass} />
            </div>
            <button type="submit"
              className="w-full bg-[#6366F1] text-white font-semibold py-4 rounded-2xl mt-2 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function DeleteConfirmModal({ product, onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10" style={{ marginBottom: '84px' }} onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-[#DC4B56]" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">Eliminar producto</h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          ¿Eliminar <strong className="text-gray-700">{product.name}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="flex gap-3">
          <button onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl active:scale-95 transition-all">
            Cancelar
          </button>
          <button onClick={() => { onConfirm(product.id); onClose() }}
            className="flex-1 bg-[#DC4B56] text-white font-semibold py-4 rounded-2xl active:scale-95 transition-all shadow-lg shadow-red-200">
            Eliminar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const { products, isPro, planLimits, addProduct, updateProduct, deleteProduct } = useApp()
  const [showAdd, setShowAdd] = useState(false)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deletingProduct, setDeletingProduct] = useState(null)

  const atLimit = !isPro && products.length >= planLimits.maxProducts

  const handleAddClick = () => {
    if (atLimit) {
      setShowUpgrade(true)
    } else {
      setShowAdd(true)
    }
  }

  const lowStock = products.filter(p => p.stock <= p.lowStockThreshold)
  const okStock = products.filter(p => p.stock > p.lowStockThreshold)

  return (
    <div className="page-content">
      <div className="flex items-center justify-between pt-2 mb-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-400 mt-0.5">{products.length} productos en stock</p>
        </div>
        <button onClick={handleAddClick}
          className="flex items-center gap-1.5 bg-[#6366F1] text-white text-sm font-semibold px-4 py-2.5 rounded-2xl active:scale-95 transition-all shadow-md shadow-indigo-200">
          <Plus size={16} />
          Agregar
        </button>
      </div>

      {/* Contador de uso plan gratis */}
      {!isPro && (
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-400">{products.length} de {planLimits.maxProducts} productos usados</span>
            {atLimit && <span className="text-[#DC4B56] font-semibold">Límite alcanzado</span>}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${Math.min(100, (products.length / planLimits.maxProducts) * 100)}%`,
                backgroundColor: atLimit ? '#DC4B56' : '#6366F1',
              }}
            />
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-[#DC4B56]/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-[#DC4B56]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#DC4B56]">{lowStock.length} producto{lowStock.length > 1 ? 's' : ''} con stock bajo</p>
            <p className="text-xs text-red-400 mt-0.5">{lowStock.map(p => p.name).join(', ')}</p>
          </div>
        </div>
      )}

      {lowStock.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#DC4B56] uppercase tracking-wide mb-2 px-1">Stock bajo</p>
          <div className="space-y-2">
            {lowStock.map(product => (
              <ProductCard key={product.id} product={product}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => setDeletingProduct(product)} />
            ))}
          </div>
        </div>
      )}

      {okStock.length > 0 && (
        <div className="mt-2">
          {lowStock.length > 0 && <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 px-1">En stock</p>}
          <div className="space-y-2">
            {okStock.map(product => (
              <ProductCard key={product.id} product={product}
                onEdit={() => setEditingProduct(product)}
                onDelete={() => setDeletingProduct(product)} />
            ))}
          </div>
        </div>
      )}

      {products.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Package size={40} className="mx-auto mb-3 text-gray-200" />
          <p className="text-sm font-medium">Sin productos aún</p>
          <p className="text-xs mt-1">Agrega tu primer producto</p>
        </div>
      )}

      {showAdd && (
        <ProductFormModal title="Agregar producto"
          initial={{ name: '', price: '', stock: '', lowStockThreshold: '', description: '', unit: 'unidades' }}
          onClose={() => setShowAdd(false)} onSave={addProduct} />
      )}
      {editingProduct && (
        <ProductFormModal title="Editar producto"
          initial={{ name: editingProduct.name, price: editingProduct.price, stock: editingProduct.stock, lowStockThreshold: editingProduct.lowStockThreshold ?? '', description: editingProduct.description || '', unit: editingProduct.unit || 'unidades' }}
          onClose={() => setEditingProduct(null)} onSave={(data) => updateProduct(editingProduct.id, data)} />
      )}
      {deletingProduct && (
        <DeleteConfirmModal product={deletingProduct}
          onClose={() => setDeletingProduct(null)} onConfirm={deleteProduct} />
      )}
      {showUpgrade && <UpgradeModal variant="products" onClose={() => setShowUpgrade(false)} />}
    </div>
  )
}

function ProductCard({ product, onEdit, onDelete }) {
  const isLow = product.stock <= product.lowStockThreshold

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${isLow ? 'bg-red-50' : 'bg-indigo-50'}`}>
        <Package size={18} className={isLow ? 'text-[#DC4B56]' : 'text-[#6366F1]'} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900">{product.name}</p>
          {isLow && <span className="text-[10px] font-bold text-[#DC4B56] bg-red-50 px-1.5 py-0.5 rounded-full">BAJO</span>}
        </div>
        <p className="text-xs text-gray-400 mt-0.5">
          {fmt(product.price)}/{product.unit || 'und'} · Stock: <span className={`font-semibold ${isLow ? 'text-[#DC4B56]' : 'text-gray-700'}`}>{product.stock} {product.unit || 'und'}</span>
        </p>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <button onClick={onEdit} className="w-9 h-9 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center active:scale-95">
          <Pencil size={14} className="text-gray-400" />
        </button>
        <button onClick={onDelete} className="w-9 h-9 rounded-2xl bg-red-50 flex items-center justify-center active:scale-95">
          <Trash2 size={14} className="text-[#DC4B56]" />
        </button>
      </div>
    </div>
  )
}
