import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { useLocale } from '../context/LocaleContext'
import { supabase } from '../lib/supabase'
import { Sparkles, TrendingUp, Package, Megaphone, Copy, Check } from 'lucide-react'

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

async function callClaude(system, userContent) {
  if (ANTHROPIC_KEY) {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        system,
        messages: [{ role: 'user', content: userContent }],
      }),
    })
    const d = await res.json()
    if (d.error) throw new Error(d.error.message)
    return JSON.parse(d.content[0].text.match(/\{[\s\S]*\}/)[0])
  }
  const fnName = system.includes('ventas') ? 'ia-ventas' : system.includes('inventario') ? 'ia-stock' : 'ia-marketing'
  const { data, error } = await supabase.functions.invoke(fnName, { body: { content: userContent } })
  if (error) throw error
  return data
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-3 mt-2">
      <div className="bg-white rounded-2xl p-4 space-y-3">
        <div className="h-3 bg-gray-200 rounded-full w-1/3" />
        <div className="h-16 bg-gray-100 rounded-xl" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-14 bg-gray-100 rounded-xl" />
          <div className="h-14 bg-gray-100 rounded-xl" />
        </div>
        <div className="h-4 bg-gray-200 rounded-full w-2/3" />
      </div>
    </div>
  )
}

// ─── GADGET 1: ANÁLISIS DE VENTAS ─────────────────────────────────────────────
function AnalisisVentas() {
  const { sales } = useApp()
  const { formatCurrency: fmt, t, country } = useLocale()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 7)
  const last7 = sales.filter(s => new Date(s.date + 'T12:00:00') >= cutoff)
  const totalPeriodo = last7.reduce((s, v) => s + v.total, 0)

  const handleAnalizar = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = last7.map(s => ({
        fecha: s.date,
        producto: s.productName,
        cantidad: s.quantity,
        monto: s.total,
      }))
      const system = `Eres el asistente de ventas de Zimplex, una app para microemprendedores de ${country.name}. Recibes el historial de ventas de los últimos 7 días. Responde SOLO con un JSON con esta estructura exacta: {"total_periodo": string, "producto_estrella": string, "mejor_dia": string, "consejo": string}. El consejo debe ser práctico, en ${country.language === 'pt-BR' ? 'português simples' : 'español simple'}, máximo 2 oraciones.`
      const data = await callClaude(system, JSON.stringify(payload))
      setResult(data)
    } catch (e) {
      setError('Error: ' + (e?.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  const handleCompartir = () => {
    if (!result) return
    const texto = `📊 *Resumen de ventas — últimos 7 días*\n\n💰 Total: ${result.total_periodo}\n⭐ Producto estrella: ${result.producto_estrella}\n📅 Mejor día: ${result.mejor_dia}\n\n💡 ${result.consejo}\n\n_Generado con Zimplex_`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Últimos 7 días</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>{fmt(totalPeriodo)}</p>
            <p className="text-sm text-gray-400">{last7.length} venta{last7.length !== 1 ? 's' : ''} registrada{last7.length !== 1 ? 's' : ''}</p>
          </div>
          <TrendingUp size={36} className="text-gray-100" />
        </div>
      </div>

      <button
        onClick={handleAnalizar}
        disabled={loading || last7.length === 0}
        className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
        style={{ background: 'var(--color-primary)' }}
      >
        <Sparkles size={15} />
        {loading ? t('analizando') : `✦ ${t('analizar_ventas')}`}
      </button>

      {last7.length === 0 && (
        <p className="text-center text-sm text-gray-400">{t('sin_ventas_analizar')}</p>
      )}

      {loading && <Skeleton />}

      {error && (
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="bg-white rounded-2xl p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Total período</p>
              <p className="text-sm font-bold text-gray-800">{result.total_periodo}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('producto_estrella')}</p>
              <p className="text-sm font-bold text-gray-800">{result.producto_estrella}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{t('mejor_dia')}</p>
              <p className="text-sm font-bold text-gray-800">{result.mejor_dia}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 col-span-2">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">💡 {t('consejo')}</p>
              <p className="text-sm text-gray-700 leading-relaxed">{result.consejo}</p>
            </div>
          </div>
          <button
            onClick={handleCompartir}
            className="w-full py-3 rounded-full text-sm font-semibold border-2 transition-colors"
            style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
          >
            {t('compartir_whatsapp')}
          </button>
        </div>
      )}
    </div>
  )
}

// ─── GADGET 2: REVISIÓN DE STOCK ──────────────────────────────────────────────
function RevisionStock() {
  const { products } = useApp()
  const { country } = useLocale()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const bajoMinimo = products.filter(p => p.stock <= p.lowStockThreshold)

  const handleRevisar = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const payload = products.map(p => ({
        nombre: p.name,
        stock_actual: p.stock,
        stock_minimo: p.lowStockThreshold,
        precio_unitario: p.price,
      }))
      const system = `Eres el asistente de inventario de Zimplex para comercios de ${country.name}. Recibes la lista de productos con su stock. Responde SOLO con un JSON: {"productos": [{"nombre": string, "estado": "critico", "pronto" o "ok", "cantidad_sugerida": number, "razon": string}]}. Ordena por urgencia (critico primero). La razon debe ser maximo 8 palabras en ${country.language === 'pt-BR' ? 'português' : 'español'}.`
      const data = await callClaude(system, JSON.stringify(payload))
      setResult(data)
    } catch (e) {
      setError('Error: ' + (e?.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  const estadoConfig = {
    critico: { label: '🔴 Crítico', color: 'text-red-600',   bg: 'bg-red-50' },
    pronto:  { label: '🟡 Pronto',  color: 'text-amber-600', bg: 'bg-amber-50' },
    ok:      { label: '🟢 OK',      color: 'text-green-600', bg: 'bg-green-50' },
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Tu inventario</p>
        <div className="flex gap-6">
          <div>
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            <p className="text-sm text-gray-400">productos</p>
          </div>
          <div>
            <p className="text-2xl font-bold" style={{ color: bajoMinimo.length > 0 ? '#EF4444' : '#22C55E' }}>
              {bajoMinimo.length}
            </p>
            <p className="text-sm text-gray-400">bajo mínimo</p>
          </div>
        </div>
      </div>

      <button
        onClick={handleRevisar}
        disabled={loading || products.length === 0}
        className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
        style={{ background: 'var(--color-primary)' }}
      >
        <Sparkles size={15} />
        {loading ? 'Revisando...' : '✦ Revisar con IA'}
      </button>

      {products.length === 0 && (
        <p className="text-center text-sm text-gray-400">Agrega productos para revisar el stock.</p>
      )}

      {loading && <Skeleton />}

      {error && (
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-2">
          {result.productos?.length === 0 ? (
            <div className="bg-green-50 rounded-2xl p-5 text-center">
              <p className="text-green-600 font-semibold">✅ Todo tu stock está bien</p>
              <p className="text-sm text-green-500 mt-1">No hay productos que necesiten reposición urgente.</p>
            </div>
          ) : (
            result.productos?.map((p, i) => {
              const cfg = estadoConfig[p.estado] ?? estadoConfig.ok
              return (
                <div key={i} className="bg-white rounded-2xl p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="text-sm font-semibold text-gray-800 truncate">{p.nombre}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${cfg.color} ${cfg.bg}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">{p.razon}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>{p.cantidad_sugerida}</p>
                    <p className="text-xs text-gray-400">sugerido</p>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// ─── GADGET 3: CREADOR DE POSTS ───────────────────────────────────────────────
function CreadorPost() {
  const { businessName } = useApp()
  const [desc, setDesc] = useState('')
  const [red, setRed] = useState('instagram')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(null)

  const redes = [
    { id: 'instagram', label: 'Instagram' },
    { id: 'facebook',  label: 'Facebook' },
    { id: 'whatsapp',  label: 'WhatsApp' },
  ]

  const handleGenerar = async () => {
    if (!desc.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const system = `Eres el asistente de marketing de Zimplex para pequeños comercios de Latinoamérica. El usuario te describe su promoción y la red social destino. Responde SOLO con JSON: {"variante_1": string, "variante_2": string, "hashtags": string}. Reglas: Instagram = emojis + visual + hashtags en el texto, Facebook = informativo + cercano, WhatsApp = corto + directo + llamada a accion. Hashtags solo si es Instagram (maximo 5, al final). Nunca uses palabras en ingles. Autentico, no corporativo.`
      const msg = 'Red social: ' + red + '\nNegocio: ' + (businessName || 'mi negocio') + '\nPromoción: ' + desc
      const data = await callClaude(system, msg)
      setResult(data)
    } catch (e) {
      setError('Error: ' + (e?.message || JSON.stringify(e)))
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text, which) => {
    await navigator.clipboard.writeText(text)
    setCopied(which)
    setTimeout(() => setCopied(null), 2000)
  }

  const renderText = (text) => {
    if (red !== 'instagram') return text
    return text.split(/(\s+)/).map((token, i) =>
      token.startsWith('#')
        ? <span key={i} style={{ color: 'var(--color-primary)' }}>{token}</span>
        : token
    )
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">¿Qué quieres promocionar?</p>
        <textarea
          value={desc}
          onChange={e => setDesc(e.target.value)}
          placeholder="Ej: 50% de descuento en empanadas este fin de semana"
          rows={3}
          className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none"
          style={{ '--tw-ring-color': 'var(--color-primary)' }}
        />
        <div className="flex gap-2">
          {redes.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRed(id)}
              className="flex-1 py-2.5 rounded-full text-xs font-semibold transition-all"
              style={red === id
                ? { background: 'var(--color-primary)', color: 'white' }
                : { background: '#F3F4F6', color: '#6B7280' }
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleGenerar}
        disabled={loading || !desc.trim()}
        className="w-full py-3.5 rounded-full text-white font-semibold text-sm flex items-center justify-center gap-2 transition-opacity disabled:opacity-50"
        style={{ background: 'var(--color-primary)' }}
      >
        <Sparkles size={15} />
        {loading ? 'Generando...' : '✦ Generar post'}
      </button>

      {loading && <Skeleton />}

      {error && (
        <div className="bg-red-50 rounded-2xl p-4">
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      {result && !loading && (
        <div className="space-y-3">
          {[result.variante_1, result.variante_2].map((texto, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Variante {idx + 1}</p>
                <button
                  onClick={() => handleCopy(texto, idx)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border-2 transition-all"
                  style={{ borderColor: 'var(--color-primary)', color: 'var(--color-primary)' }}
                >
                  {copied === idx ? <><Check size={11} /> Copiado</> : <><Copy size={11} /> Copiar</>}
                </button>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {renderText(texto)}
              </p>
              {red === 'whatsapp' && (
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(texto)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full text-white text-sm font-semibold"
                  style={{ background: '#22C55E' }}
                >
                  Enviar por WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'ventas',    label: 'Ventas',    icon: TrendingUp },
  { id: 'stock',     label: 'Stock',     icon: Package },
  { id: 'marketing', label: 'Marketing', icon: Megaphone },
]

export default function IA() {
  const [tab, setTab] = useState('ventas')

  return (
    <div className="p-4 pb-28 md:p-6 space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={20} style={{ color: 'var(--color-primary)' }} />
          <h1 className="text-lg font-bold text-gray-800">Asistente IA</h1>
        </div>
        <p className="text-sm text-gray-400">Analiza tu negocio y crea contenido con inteligencia artificial.</p>
      </div>

      <div className="flex gap-1.5 bg-white rounded-2xl p-1.5">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all"
            style={tab === id
              ? { background: 'var(--color-primary)', color: 'white' }
              : { color: '#9CA3AF' }
            }
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'ventas'    && <AnalisisVentas />}
      {tab === 'stock'     && <RevisionStock />}
      {tab === 'marketing' && <CreadorPost />}
    </div>
  )
}
