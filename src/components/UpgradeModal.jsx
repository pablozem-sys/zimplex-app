import { useState } from 'react'
import { X, Zap, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const VARIANTS = {
  products: {
    title: 'Llegaste al límite de productos',
    text: 'Tu plan gratis permite hasta 3 productos activos. Pásate a Pro para gestionar todos los productos que necesites.',
  },
  sales: {
    title: 'Llegaste al límite de ventas mensuales',
    text: 'Tu plan gratis incluye hasta 20 ventas al mes. Pásate a Pro para seguir registrando ventas sin límites.',
  },
  whatsapp: {
    title: 'Disponible en Pro',
    text: 'El envío de pedidos por WhatsApp está disponible en el plan Pro. Mejora la comunicación con tus clientes.',
  },
  feature: {
    title: 'Disponible en Pro',
    text: 'Esta funcionalidad está disponible en el plan Pro. Mejora el control de tu negocio y desbloquea herramientas avanzadas.',
  },
}

export default function UpgradeModal({ variant = 'feature', onClose }) {
  const [loading, setLoading] = useState(false)
  const { title, text } = VARIANTS[variant] || VARIANTS.feature

  const handleUpgrade = async () => {
    setLoading(true)
    // Abrir ventana inmediatamente (dentro del evento click) para evitar popup blocker
    const newWindow = window.open('', '_blank')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mp-create-subscription`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (data.init_point && newWindow) {
        newWindow.location.href = data.init_point
      } else {
        newWindow?.close()
      }
    } catch (err) {
      console.error('Error creando suscripción:', err)
      newWindow?.close()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 relative"
        style={{ marginBottom: '84px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
          <X size={16} className="text-gray-500" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <Zap size={26} className="text-[#7C3AED]" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h2>
        <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">{text}</p>
        <button
          onClick={handleUpgrade}
          disabled={loading}
          className="w-full bg-[#7C3AED] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {loading ? 'Preparando...' : 'Pasar a Pro — $4.990/mes'}
        </button>
        <button onClick={onClose} className="w-full mt-3 text-sm text-gray-400 py-2 active:opacity-70">
          Seguir en gratis
        </button>
      </div>
    </div>
  )
}
