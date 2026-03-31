import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { ShoppingBag, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react'

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (mode === 'register') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      }
    } catch (err) {
      setError(err.message === 'Invalid login credentials'
        ? 'Email o contraseña incorrectos.'
        : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#FAF8FF' }}>
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-violet-200"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
          <ShoppingBag size={28} color="white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">MiNegocioSimple</h1>
        <p className="text-gray-400 text-sm mt-1">Organiza tu negocio en segundos</p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        {/* Toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
          <button
            onClick={() => { setMode('login'); setError(''); setSuccess('') }}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${mode === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-400'}`}
          >
            Iniciar sesión
          </button>
          <button
            onClick={() => { setMode('register'); setError(''); setSuccess('') }}
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

          {/* Error / Success */}
          {error && (
            <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>
          )}
          {success && (
            <p className="text-sm text-emerald-600 bg-emerald-50 px-4 py-3 rounded-2xl">{success}</p>
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

        {/* Demo mode notice */}
        <p className="text-center text-xs text-gray-400 mt-4">
          ¿Sin cuenta? Usa <strong>demo@demo.com</strong> / <strong>123456</strong>
        </p>
      </div>
    </div>
  )
}
