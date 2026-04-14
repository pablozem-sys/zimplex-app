import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ShoppingBag, Mail, Lock, ArrowRight, Loader2, CheckCircle, RefreshCw } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false) // estado post-registro
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        // Si no hay sesión, Supabase requiere confirmar email
        if (!data.session) setRegistered(true)
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(
        err.message === 'Invalid login credentials'
          ? 'Email o contraseña incorrectos.'
          : err.message === 'Email not confirmed'
          ? 'Debes confirmar tu email antes de entrar. Revisa tu bandeja de entrada.'
          : err.message
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    const { error } = await supabase.auth.resend({ type: 'signup', email })
    setResending(false)
    if (!error) setResent(true)
  }

  // ── Pantalla post-registro ─────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#F0F4FF' }}>
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">

            {/* Icono */}
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #EFF6FF, #F0FDFA)' }}>
              <Mail size={36} style={{ color: '#3A86FF' }} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h2>
            <p className="text-sm text-gray-400 mb-1 leading-relaxed">
              Enviamos un link de confirmación a
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: '#3A86FF' }}>{email}</p>

            <p className="text-sm text-gray-500 leading-relaxed mb-6">
              Haz clic en el botón del correo para activar tu cuenta y entrar a Zimplex.
            </p>

            {/* Resend */}
            {!resent ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold border-2 border-gray-100 text-gray-500 hover:border-blue-100 hover:text-blue-500 transition-all disabled:opacity-50"
              >
                {resending
                  ? <><Loader2 size={15} className="animate-spin" /> Reenviando...</>
                  : <><RefreshCw size={15} /> No llegó — reenviar correo</>
                }
              </button>
            ) : (
              <div className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-sm font-semibold bg-emerald-50 text-emerald-600">
                <CheckCircle size={15} /> ¡Correo reenviado!
              </div>
            )}

            <p className="text-xs text-gray-300 mt-4">
              Revisa también tu carpeta de spam.
            </p>
          </div>

          {/* Volver al login */}
          <button
            onClick={() => { setRegistered(false); setMode('login'); setError('') }}
            className="w-full mt-4 text-sm text-gray-400 text-center"
          >
            ← Volver a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  // ── Pantalla login / registro ──────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#FAF8FF' }}>
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
          <ShoppingBag size={28} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Zimplex</h1>
        <p className="text-gray-400 text-sm mt-1">Organiza tu negocio en segundos</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError('') }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setMode('register'); setError('') }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Registrarse
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none transition-all focus:border-violet-400 focus:shadow-sm focus:shadow-violet-100"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-600 block mb-1.5">Contraseña</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none transition-all focus:border-violet-400 focus:shadow-sm focus:shadow-violet-100"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Entrar a mi negocio' : 'Crear cuenta gratis'}
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
