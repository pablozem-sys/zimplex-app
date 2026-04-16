import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { HelpCircle, Send, Check, Loader2, ChevronDown } from 'lucide-react'
import { useApp } from '../context/AppContext'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const inputClass =
  'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:border-transparent transition-colors'

const TIPOS_APP = [
  'No puedo registrar una venta',
  'Problema con el stock',
  'Los datos no cuadran',
  'Problema con pedidos',
  'Cuenta o acceso',
  'Pregunta sobre el plan',
  'Sugerencia de mejora',
  'Otro',
]

export default function Help() {
  const { userId, businessName, activeTab } = useApp()

  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState('')
  const [asunto, setAsunto] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setNombre(user.user_metadata?.name || '')
      setEmail(user.email || '')
    })
  }, [])

  function validate() {
    const e = {}
    if (!nombre.trim()) e.nombre = 'Ingresa tu nombre.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Correo inválido.'
    if (!tipo) e.tipo = 'Selecciona el tipo de problema.'
    if (!asunto.trim()) e.asunto = 'Escribe un asunto breve.'
    if (mensaje.trim().length < 10) e.mensaje = 'Describe el problema (mínimo 10 caracteres).'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()

      const res = await fetch(`${SUPABASE_URL}/functions/v1/send-support-email`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session?.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          email: email.trim(),
          tipo,
          asunto: asunto.trim(),
          mensaje: mensaje.trim(),
          origen: 'app',
          user_id: userId,
          negocio: businessName || '—',
        }),
      })

      const json = await res.json()
      if (!res.ok || !json.success) throw new Error()
      setSent(true)
    } catch {
      setSubmitError('No se pudo enviar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSent(false)
    setTipo('')
    setAsunto('')
    setMensaje('')
    setErrors({})
    setSubmitError('')
  }

  if (sent) {
    return (
      <div className="page-content">
        <div className="pt-2 mb-6">
          <h1 className="text-xl font-bold text-gray-900">Soporte & Ayuda</h1>
        </div>
        <div className="flex flex-col items-center text-center py-12 px-4">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5"
            style={{ background: 'var(--color-primary-light)' }}
          >
            <Check size={36} style={{ color: 'var(--color-primary)' }} strokeWidth={2.5} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h2>
          <p className="text-sm text-gray-500 mb-8 max-w-xs leading-relaxed">
            Recibimos tu mensaje y te responderemos a la brevedad al correo{' '}
            <span className="font-semibold text-gray-700">{email}</span>.
          </p>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-2xl text-sm font-semibold border border-gray-200 bg-white text-gray-700 active:scale-[.98] transition-all"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-content">
      <div className="pt-2 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Soporte & Ayuda</h1>
        <p className="text-sm text-gray-400 mt-1">Cuéntanos tu problema y te respondemos pronto.</p>
      </div>

      {/* Tarjeta intro */}
      <div
        className="rounded-3xl p-4 mb-6 flex items-center gap-4"
        style={{ background: 'var(--color-primary-light)' }}
      >
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'var(--color-primary)' }}
        >
          <HelpCircle size={20} color="white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">¿Tienes un problema o duda?</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
            Tu solicitud llega directamente a nuestro equipo.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>

        {/* Nombre */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tu nombre</label>
          <input
            value={nombre}
            onChange={e => { setNombre(e.target.value); setErrors(p => ({ ...p, nombre: '' })) }}
            placeholder="Ej: María González"
            className={`${inputClass} ${errors.nombre ? 'border-red-400 bg-red-50' : ''}`}
          />
          {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tu correo</label>
          <input
            type="email"
            value={email}
            onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: '' })) }}
            placeholder="tu@correo.com"
            className={`${inputClass} ${errors.email ? 'border-red-400 bg-red-50' : ''}`}
          />
          {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
        </div>

        {/* Tipo */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Tipo de problema</label>
          <div className="relative">
            <select
              value={tipo}
              onChange={e => { setTipo(e.target.value); setErrors(p => ({ ...p, tipo: '' })) }}
              className={`${inputClass} appearance-none pr-10 ${errors.tipo ? 'border-red-400 bg-red-50' : ''}`}
            >
              <option value="">Seleccionar...</option>
              {TIPOS_APP.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
          {errors.tipo && <p className="text-xs text-red-500 mt-1">{errors.tipo}</p>}
        </div>

        {/* Asunto */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Asunto</label>
          <input
            value={asunto}
            onChange={e => { setAsunto(e.target.value); setErrors(p => ({ ...p, asunto: '' })) }}
            placeholder="Describe brevemente el problema"
            className={`${inputClass} ${errors.asunto ? 'border-red-400 bg-red-50' : ''}`}
          />
          {errors.asunto && <p className="text-xs text-red-500 mt-1">{errors.asunto}</p>}
        </div>

        {/* Mensaje */}
        <div>
          <label className="text-xs font-medium text-gray-500 mb-1.5 block">Descripción</label>
          <textarea
            value={mensaje}
            onChange={e => { setMensaje(e.target.value); setErrors(p => ({ ...p, mensaje: '' })) }}
            placeholder="¿Qué ocurrió? ¿Cuándo pasó? ¿Qué esperabas que pasara?"
            rows={5}
            className={`${inputClass} resize-none ${errors.mensaje ? 'border-red-400 bg-red-50' : ''}`}
          />
          {errors.mensaje && <p className="text-xs text-red-500 mt-1">{errors.mensaje}</p>}
        </div>

        {submitError && (
          <div className="bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <p className="text-sm text-red-500">{submitError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
          style={{ background: 'var(--color-primary)', boxShadow: '0 8px 20px var(--color-primary-shadow)' }}
        >
          {loading
            ? <><Loader2 size={18} className="animate-spin" /> Enviando...</>
            : <><Send size={18} /> Enviar solicitud</>
          }
        </button>

      </form>
    </div>
  )
}
