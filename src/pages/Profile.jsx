import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User, Mail, Store, LogOut, Save, Loader2 } from 'lucide-react'

const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED] focus:border-transparent'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [name, setName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setName(user?.user_metadata?.name || '')
      setBusinessName(user?.user_metadata?.business_name || '')
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.updateUser({
      data: { name, business_name: businessName }
    })
    setLoading(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const initials = name
    ? name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div className="page-content">
      <div className="pt-2 mb-6">
        <h1 className="text-xl font-bold text-gray-900">Perfil</h1>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-violet-200 mb-3"
          style={{ background: 'linear-gradient(135deg, #7C3AED, #A78BFA)' }}>
          {initials}
        </div>
        {name && <p className="text-base font-semibold text-gray-900">{name}</p>}
        <p className="text-sm text-gray-400">{user?.email}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="space-y-4 mb-6">
        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Tu nombre</label>
          <div className="relative">
            <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={name} onChange={e => setName(e.target.value)}
              placeholder="Ej: María González"
              className={`${inputClass} pl-10`} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Nombre del negocio</label>
          <div className="relative">
            <Store size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={businessName} onChange={e => setBusinessName(e.target.value)}
              placeholder="Ej: Empanadas La Abuela"
              className={`${inputClass} pl-10`} />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 block">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={user?.email || ''} disabled
              className={`${inputClass} pl-10 text-gray-400 cursor-not-allowed`} />
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full bg-[#7C3AED] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg shadow-violet-200 disabled:opacity-60">
          {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {success ? '¡Guardado!' : 'Guardar cambios'}
        </button>
      </form>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
        <LogOut size={18} />
        Cerrar sesión
      </button>
    </div>
  )
}
