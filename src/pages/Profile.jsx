import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User, Mail, Store, LogOut, Save, Loader2, Check, Zap, CreditCard } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useLocale } from '../context/LocaleContext'
import { COUNTRIES } from '../lib/countries'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL

const inputClass = 'w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:border-transparent'

export default function Profile() {
  const { theme, setTheme, themes, isPro, userId, setBusinessName, setTransferDetails } = useApp()
  const { t, countryCode, setCountry, country } = useLocale()

  const [user, setUser]               = useState(null)
  const [name, setName]               = useState('')
  const [bizName, setBizName]         = useState('')
  const [loading, setLoading]         = useState(false)
  const [success, setSuccess]         = useState(false)
  const [saveError, setSaveError]     = useState('')
  const [upgradeLoading, setUpgradeLoading] = useState(false)
  const [upgradeError, setUpgradeError] = useState(false)
  const [transfer, setTransfer]       = useState({
    bank: '', holder: '', rut: '', account: '', accountType: '', email: ''
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return
      setUser(user)
      const m = user.user_metadata || {}
      setName(m.name || '')
      setBizName(m.business_name || '')
      setTransfer({
        bank:        m.transfer_bank         || '',
        holder:      m.transfer_holder       || '',
        rut:         m.transfer_rut          || '',
        account:     m.transfer_account      || '',
        accountType: m.transfer_account_type || '',
        email:       m.transfer_email        || '',
      })
    })
  }, [])

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaveError('')
    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        business_name:        bizName,
        transfer_bank:        transfer.bank,
        transfer_holder:      transfer.holder,
        transfer_rut:         transfer.rut,
        transfer_account:     transfer.account,
        transfer_account_type:transfer.accountType,
        transfer_email:       transfer.email,
      }
    })
    setLoading(false)
    if (error) { setSaveError(t('error_guardar')); return }
    setBusinessName(bizName)
    setTransferDetails({ ...transfer })
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2500)
  }

  const handleLogout = async () => { await supabase.auth.signOut() }

  const handleUpgrade = async () => {
    setUpgradeLoading(true)
    setUpgradeError(false)
    const newWindow = window.open('', '_blank')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch(`${SUPABASE_URL}/functions/v1/mp-create-subscription`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${session?.access_token}`, 'Content-Type': 'application/json' },
      })
      const data = await res.json()
      if (data.init_point && newWindow) {
        newWindow.location.href = data.init_point
      } else {
        newWindow?.close()
        setUpgradeError(true)
      }
    } catch (err) {
      console.error('Error upgrade:', err)
      newWindow?.close()
      setUpgradeError(true)
    } finally {
      setUpgradeLoading(false)
    }
  }

  const setT = (field) => (e) => setTransfer(prev => ({ ...prev, [field]: e.target.value }))

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
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-3"
          style={{ background: 'var(--color-gradient)', boxShadow: '0 8px 24px var(--color-primary-shadow)' }}>
          {initials}
        </div>
        <div className="flex items-center gap-2">
          {name && <p className="text-base font-semibold text-gray-900">{name}</p>}
          {isPro && (
            <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#2563EB' }}>
              PRO
            </span>
          )}
        </div>
        <p className="text-sm text-gray-400">{user?.email}</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 mb-6">

        {/* ── Datos personales ── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('datos_negocio')}</p>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('tu_nombre')}</label>
            <div className="relative">
              <User size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={name} onChange={e => setName(e.target.value)}
                placeholder="Ej: María González" className={`${inputClass} pl-10`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('nombre_negocio')}</label>
            <div className="relative">
              <Store size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={bizName} onChange={e => setBizName(e.target.value)}
                placeholder="Ej: Empanadas La Abuela" className={`${inputClass} pl-10`} />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-gray-500 mb-1.5 block">Email</label>
            <div className="relative">
              <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input value={user?.email || ''} disabled
                className={`${inputClass} pl-10 text-gray-400 cursor-not-allowed`} />
            </div>
          </div>
        </div>

        {/* ── Datos de transferencia ── */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-gray-400" />
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('datos_transferencia')}</p>
          </div>
          <p className="text-xs text-gray-400 -mt-2">{t('datos_transferencia_desc')}</p>

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('banco')}</label>
              {country.banks ? (
                <select value={transfer.bank} onChange={setT('bank')} className={`${inputClass} appearance-none`}>
                  <option value="">Selecciona tu banco</option>
                  {country.banks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              ) : (
                <input value={transfer.bank} onChange={setT('bank')}
                  placeholder="Ej: Banco Estado" className={inputClass} />
              )}
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('titular')}</label>
              <input value={transfer.holder} onChange={setT('holder')}
                placeholder="Ej: María González" className={inputClass} />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('id_field')}</label>
              <input value={transfer.rut} onChange={setT('rut')}
                placeholder={country.idField} className={inputClass} />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('tipo_cuenta')}</label>
              <select value={transfer.accountType} onChange={setT('accountType')}
                className={`${inputClass} appearance-none`}>
                <option value="">{t('selecciona')}</option>
                {country.accountTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('numero_cuenta')}</label>
              <input value={transfer.account} onChange={setT('account')}
                placeholder="000000000" className={inputClass} />
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">{t('email_transferencia')}</label>
              <input type="email" value={transfer.email} onChange={setT('email')}
                placeholder="pagos@minegocio.cl" className={inputClass} />
            </div>
          </div>
        </div>

        {/* ── Guardar ── */}
        {/* ── País ── */}
        <div className="space-y-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{t('pais')}</p>
          <select value={countryCode} onChange={e => setCountry(e.target.value)}
            className={`${inputClass} appearance-none`}>
            {Object.entries(COUNTRIES).map(([code, c]) => (
              <option key={code} value={code}>{c.flag} {c.name}</option>
            ))}
          </select>
        </div>

        {saveError && <p className="text-sm text-red-500 bg-red-50 px-4 py-3 rounded-2xl">{saveError}</p>}
        <button type="submit" disabled={loading}
          className="w-full text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-60"
          style={{ background: 'var(--color-primary)', boxShadow: '0 8px 20px var(--color-primary-shadow)' }}>
          {loading ? <Loader2 size={18} className="animate-spin" /> : success ? <Check size={18} /> : <Save size={18} />}
          {success ? t('guardado') : t('guardar')}
        </button>
      </form>

      {/* Selector de color */}
      <div className="mb-6">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 block">{t('color_plataforma')}</label>
        <div className="flex gap-3">
          {themes.map(t => (
            <button key={t.id} onClick={() => setTheme(t)}
              className="relative w-10 h-10 rounded-full transition-transform active:scale-95"
              style={{ background: t.gradient }} title={t.name}>
              {theme.id === t.id && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check size={16} color="white" strokeWidth={3} />
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Upgrade */}
      {!isPro && (
        <button onClick={handleUpgrade} disabled={upgradeLoading}
          className="w-full mb-3 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white active:scale-[0.98] transition-all disabled:opacity-60"
          style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)', boxShadow: '0 8px 20px rgba(124,58,237,0.25)' }}>
          {upgradeLoading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
          {upgradeLoading ? t('preparando') : upgradeError ? t('error_intentar') : `${t('pasar_pro')} — $4.990/mes`}
        </button>
      )}
      {isPro && (
        <div className="w-full mb-3 py-4 rounded-2xl flex items-center justify-center gap-2 font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
          <Zap size={18} />
          {t('plan_pro')}
        </div>
      )}

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full bg-white border border-gray-200 text-gray-600 font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
        <LogOut size={18} />
        {t('cerrar_sesion')}
      </button>
    </div>
  )
}
