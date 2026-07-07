import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ShoppingBag, Mail, Lock, ArrowRight, Loader2, CheckCircle, RefreshCw } from 'lucide-react'

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18L12.048 13.56C11.24 14.1 10.211 14.42 9 14.42c-2.392 0-4.415-1.615-5.14-3.786H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
      <path d="M3.86 10.634A5.417 5.417 0 013.58 9c0-.566.098-1.115.28-1.634V5.034H.957A8.997 8.997 0 000 9c0 1.452.348 2.827.957 4.034l2.903-2.4z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 5.034L3.86 7.366C4.585 5.195 6.608 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState(() =>
    window.location.pathname === '/signup' ? 'register' : 'login'
  )
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [registered, setRegistered] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const [resetMode, setResetMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
    if (error) { setError('No se pudo conectar con Google. Intenta de nuevo.'); setGoogleLoading(false) }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        window.gtag?.('event', 'sign_up', { method: 'email' })
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

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (!email) { setError('Ingresa tu email para recuperar tu contraseña.'); return }
    setResetLoading(true)
    setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setResetLoading(false)
    if (error) { setError(error.message || 'No pudimos enviar el email.'); return }
    setResetSent(true)
  }

  // ── Pantalla recuperar contraseña ─────────────────────────────────────────
  if (resetMode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#FAF8FF' }}>
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)' }}>
              <Lock size={36} style={{ color: '#6366F1' }} />
            </div>
            {resetSent ? (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h2>
                <p className="text-sm text-gray-400 mb-1">Enviamos un link de recuperación a</p>
                <p className="text-sm font-semibold mb-6" style={{ color: '#6366F1' }}>{email}</p>
                <p className="text-sm text-gray-500 leading-relaxed">Haz clic en el enlace del correo para crear una nueva contraseña.</p>
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Recuperar contraseña</h2>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">Ingresa tu email y te enviamos un link para crear una nueva contraseña.</p>
                <form onSubmit={handleResetPassword} className="space-y-4 text-left">
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      placeholder="tu@email.com" required
                      className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-indigo-400" />
                  </div>
                  {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}
                  <button type="submit" disabled={resetLoading}
                    className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
                    {resetLoading ? <Loader2 size={18} className="animate-spin" /> : 'Enviar link de recuperación'}
                  </button>
                </form>
              </>
            )}
          </div>
          <button onClick={() => { setResetMode(false); setResetSent(false); setError('') }}
            className="w-full mt-4 text-sm text-gray-400 text-center">
            ← Volver a iniciar sesión
          </button>
        </div>
      </div>
    )
  }

  // ── Pantalla post-registro ─────────────────────────────────────────────────
  if (registered) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#FAF8FF' }}>
        <div className="w-full max-w-sm">

          {/* Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">

            {/* Icono */}
            <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)' }}>
              <Mail size={36} style={{ color: '#6366F1' }} />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">Revisa tu correo</h2>
            <p className="text-sm text-gray-400 mb-1 leading-relaxed">
              Enviamos un link de confirmación a
            </p>
            <p className="text-sm font-semibold mb-6" style={{ color: '#6366F1' }}>{email}</p>

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
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
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

        {/* Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-60 mb-4"
        >
          {googleLoading ? <Loader2 size={18} className="animate-spin text-gray-400" /> : <GoogleIcon />}
          Continuar con Google
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">o con email</span>
          <div className="flex-1 h-px bg-gray-200" />
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none transition-all focus:border-indigo-400 focus:shadow-sm focus:shadow-violet-100"
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
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none transition-all focus:border-indigo-400 focus:shadow-sm focus:shadow-violet-100"
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
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}
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

          {mode === 'login' && (
            <button type="button" onClick={() => { setResetMode(true); setError('') }}
              className="w-full text-center text-xs text-gray-400 pt-1 hover:text-[#6366F1] transition-colors">
              ¿Olvidaste tu contraseña?
            </button>
          )}
        </form>
      </div>
    </div>
  )
}
