import { X, Zap } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { UPGRADE_URL_BASE } from '../lib/plans'

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
    text: 'El envío de pedidos por WhatsApp está disponible en el plan Pro. Mejora la comunicación con tus clientes y desbloquea esta herramienta.',
  },
  feature: {
    title: 'Disponible en Pro',
    text: 'Esta funcionalidad está disponible en el plan Pro. Mejora el control de tu negocio y desbloquea herramientas avanzadas.',
  },
}

export default function UpgradeModal({ variant = 'feature', onClose }) {
  const { userId } = useApp()
  const upgradeUrl = userId
    ? `${UPGRADE_URL_BASE}?checkout[custom][user_id]=${userId}`
    : UPGRADE_URL_BASE
  const { title, text } = VARIANTS[variant] || VARIANTS.feature

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div
        className="bg-white w-full max-w-[430px] rounded-t-[32px] p-6 pb-10 relative"
        style={{ marginBottom: '84px' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center"
        >
          <X size={16} className="text-gray-500" />
        </button>
        <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center mx-auto mb-4">
          <Zap size={26} className="text-[#7C3AED]" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 text-center mb-2">{title}</h2>
        <p className="text-sm text-gray-400 text-center leading-relaxed mb-6">{text}</p>
        <a
          href={upgradeUrl}
          target="_blank"
          rel="noreferrer"
          className="w-full bg-[#7C3AED] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-violet-200 active:scale-[0.98] transition-all"
        >
          <Zap size={18} />
          Pasar a Pro — USD 5/mes
        </a>
        <button
          onClick={onClose}
          className="w-full mt-3 text-sm text-gray-400 py-2 active:opacity-70"
        >
          Seguir en gratis
        </button>
      </div>
    </div>
  )
}
