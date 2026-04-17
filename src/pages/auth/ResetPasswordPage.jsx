import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { Lock, Loader2, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== confirm) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6) { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { setError('No se pudo actualizar la contraseña. Intenta solicitar un nuevo link.'); return }
    setDone(true)
    setTimeout(() => { window.location.href = '/' }, 2500)
  }

  if (done) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ background: '#FAF8FF' }}>
        <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-4">
          <CheckCircle size={40} className="text-[#7CD09B]" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">¡Contraseña actualizada!</h2>
        <p className="text-sm text-gray-400">Redirigiendo a la app...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12" style={{ background: '#FAF8FF' }}>
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #F5F3FF, #EEF2FF)' }}>
            <Lock size={30} style={{ color: '#6366F1' }} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Nueva contraseña</h2>
          <p className="text-sm text-gray-400 text-center mb-6">Elige una contraseña segura para tu cuenta.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Nueva contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres" required minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-indigo-400" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 block mb-1.5">Confirmar contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña" required minLength={6}
                  className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-2xl text-sm outline-none focus:border-indigo-400" />
              </div>
            </div>
            {error && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}>
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Guardar contraseña'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
