import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Check, ArrowRight, Star, BarChart2,
  X, ChevronRight, Heart, ShoppingBag, AlertTriangle, Send, Loader2
} from 'lucide-react'

// ─── BRAND ───────────────────────────────────────────────────────────────────
const BLUE    = '#3B82F6'
const TEAL    = '#4ADE80'
const GREEN2  = '#22C55E'
const INDIGO  = '#6366F1'
const INDIGO2 = '#5B5BD6'
const GRAD    = 'linear-gradient(135deg, #4ADE80 0%, #3B82F6 50%, #6366F1 100%)'
const POPPINS = "'Nunito', sans-serif"
const DARK    = '#0B1220'

// App real colors (match screenshots)
const APP_BG   = '#EEEEF8'
const APP_CARD = '#FFFFFF'

const SIGNUP_URL  = 'https://zimplex.app/signup'
const LOGIN_URL   = 'https://zimplex.app/login'
const UPGRADE_URL = 'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=1d44657e88c94c5d91ccc04db531ebef'
const TIPOS_LANDING = ['Tengo un problema técnico', 'Quiero saber más sobre los planes', 'Tengo una sugerencia', 'Otro']

// ─── DATA ─────────────────────────────────────────────────────────────────────
const problems = [
  { emoji: '😮‍💨', title: 'Vendes todos los días, pero no sabes cuánto ganas',           desc: 'A fin de mes no entiendes a dónde fue la plata.' },
  { emoji: '💬',   title: 'Se te pierden pedidos en WhatsApp',                           desc: 'Entre mensajes, fotos y audios, los pedidos se mezclan y se olvidan.' },
  { emoji: '📦',   title: 'No sabes cuánto stock te queda',                              desc: 'Un cliente te pide algo y no lo tienes. Así se pierden ventas.' },
  { emoji: '📋',   title: 'Todo lo llevas en la cabeza o en Excel',                      desc: 'Cuando necesitas un dato, no lo encuentras rápido.' },
]

const features = [
  { label: 'Ventas',    title: 'Registra ventas en segundos',        text: 'Anota cada venta en el momento y mantén tu negocio siempre al día.',                                                              bullets: ['Registro rápido', 'Menos errores', 'Más control diario'],       color: INDIGO2, bg: '#EEF2FF' },
  { label: 'Control',   title: 'Sabe cuánto ganas realmente',        text: 'Ve tus ingresos del día y del mes, y entiende de verdad cómo va tu negocio.',                                                    bullets: ['Ventas del día', 'Resumen mensual', 'Mayor claridad financiera'], color: BLUE,    bg: '#EFF6FF' },
  { label: 'Stock',     title: 'Controla tu stock sin complicarte',  text: 'Sabe siempre cuánto te queda de cada producto y evita quedarte sin stock justo cuando más vendes.',                              bullets: ['Stock actual', 'Alertas simples', 'Menos desorden'],             color: '#EF4444', bg: '#FFF5F5' },
  { label: 'Todo en uno', title: 'Todo tu negocio en un solo lugar', text: 'Olvídate de los cuadernos, las planillas de Excel y los chats desordenados.',                                                    bullets: ['Menos caos', 'Más orden', 'Más tranquilidad'],                   color: '#F59E0B', bg: '#FFFBEB' },
]

const emotionalBenefits = [
  { icon: BarChart2,   title: 'Sabes cuánto ganas de verdad', desc: 'Nada de adivinar. Ves el número real todos los días.',                   color: INDIGO2, bg: '#EEF2FF' },
  { icon: Check,       title: 'Dejas de perder ventas',       desc: 'Te avisamos cuando el stock está bajo y tus pedidos quedan organizados.',  color: GREEN2, bg: '#F0FDF4' },
  { icon: ShoppingBag, title: 'Tienes todo en un solo lugar', desc: 'Se acabaron los cuadernos y las planillas. Todo en tu celular.',           color: INDIGO2, bg: '#EEF2FF' },
  { icon: Heart,       title: 'Te sientes más tranquilo',     desc: 'Cuando sabes cómo va tu negocio, dejas de vivir apagando incendios.',      color: GREEN2, bg: '#F0FDF4' },
]

const testimonials = [
  { quote: '"Antes vendía todos los días, pero no sabía si realmente estaba ganando plata. Ahora tengo todo claro en un solo lugar."', name: 'María Contreras', role: 'Jugos y empanadas, Valparaíso',  initial: 'M' },
  { quote: '"Lo mejor es el control de stock. Me avisaba cuando me quedaba poco y dejé de perder ventas. Muy recomendado."',           name: 'Carlos Morales',  role: 'Frutas y verduras, Santiago',    initial: 'C' },
  { quote: '"Lo del WhatsApp automático me cambió la vida. Antes escribía el mismo mensaje 20 veces al día. Ahora es un toque."',      name: 'Valentina Rojas', role: 'Ropa por encargo, Concepción',   initial: 'V' },
]

const freeFeatures = ['Hasta 10 productos', 'Hasta 50 ventas al mes', 'Dashboard básico', 'Control de stock']
const proExcluded  = ['Ventas ilimitadas', 'Productos ilimitados', 'Pedidos por WhatsApp', 'Soporte prioritario']
const proFeatures  = ['Productos ilimitados', 'Ventas ilimitadas', 'Control de stock avanzado', 'Pedidos por WhatsApp', 'Reportes completos', 'Prioridad en soporte']

const faqs = [
  { q: '¿Necesito descargar una app?',         a: 'No. Zimplex funciona directo en el navegador de tu celular. Sin descargar nada. Puedes guardarla en tu pantalla de inicio y se comporta como una app nativa.' },
  { q: '¿Funciona sin internet?',               a: 'Necesitas conexión para sincronizar datos, pero está optimizada para conexiones lentas o inestables como las de datos móviles.' },
  { q: '¿Mis datos están seguros?',             a: 'Sí. Tus datos se almacenan con encriptación en servidores seguros. Solo tú tienes acceso a la información de tu negocio.' },
  { q: '¿Para qué tipo de negocios sirve?',     a: 'Para cualquier negocio pequeño: frutas, ropa, comida casera, artesanías, cosméticos y más. Si vendes por WhatsApp, ferias o en tu casa, esto es para ti.' },
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin contratos ni cargos extra. Si cancelas Pro, sigues usando el plan Gratis sin perder tus datos.' },
]

// ─── SVG LOGO ─────────────────────────────────────────────────────────────────
function ZimplexLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="zgrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3A86FF" /><stop offset="1" stopColor="#2EC4B6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#zgrad)" />
      <path d="M8 9.5H24L8 22.5H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── PHONE FRAME ──────────────────────────────────────────────────────────────
function PhoneFrame({ children, scale = 1 }) {
  const w = 240 * scale
  return (
    <div style={{
      width: w, flexShrink: 0,
      background: '#1a1f2e',
      borderRadius: 36 * scale,
      padding: 7 * scale,
      boxShadow: '0 32px 80px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.07)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 5 * scale, paddingTop: 6 * scale }}>
        <div style={{ width: 56 * scale, height: 7 * scale, borderRadius: 10, background: '#2d3348' }} />
      </div>
      <div style={{ background: APP_BG, borderRadius: 28 * scale, overflow: 'hidden', height: 380 * scale }}>
        {children}
      </div>
    </div>
  )
}

// ─── PHONE SCREENS (fieles a la app real) ────────────────────────────────────
function ScreenDashboard() {
  const pts = [[0,55],[30,40],[60,35],[90,15],[120,28],[150,70],[180,72]]
  const path = pts.map((p, i) => `${i===0?'M':'L'}${p[0]},${p[1]}`).join(' ')
  return (
    <div style={{ background: APP_BG, minHeight: 380 }}>
      <div style={{ background: APP_BG, padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 9, color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', fontFamily: POPPINS }}>Jueves, 23 de abril</div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#111827', fontFamily: POPPINS, lineHeight: 1.2 }}>Zimplex</div>
        </div>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: INDIGO2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 10, fontWeight: 800, color: 'white', fontFamily: POPPINS }}>ZA</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: '0 10px 8px' }}>
        {[
          { icon: '📈', bg: '#EEF2FF', l: 'Ventas Hoy',        v: '$48.000', s: '12 ventas' },
          { icon: '✅', bg: '#F0FDF4', l: 'Ventas del Mes',    v: '$215.500', s: 'Este mes' },
          { icon: '⏰', bg: '#FFFBEB', l: 'Pedidos Pendientes', v: '3',       s: 'Por entregar' },
          { icon: '📦', bg: '#FFF5F5', l: 'Stock Bajo',         v: '1',       s: 'Productos' },
        ].map(({ icon, bg, l, v, s }) => (
          <div key={l} style={{ background: APP_CARD, borderRadius: 14, padding: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
            <div style={{ width: 24, height: 24, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, marginBottom: 6 }}>{icon}</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#111827', fontFamily: POPPINS, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 8, color: '#94A3B8', fontFamily: POPPINS, marginTop: 2 }}>{s}</div>
            <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', fontFamily: POPPINS }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 10px 8px' }}>
        <div style={{ background: INDIGO2, borderRadius: 14, padding: '11px 0', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <span style={{ color: 'white', fontSize: 13 }}>+</span>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>Registrar venta</div>
        </div>
      </div>
      <div style={{ margin: '0 10px 8px', background: APP_CARD, borderRadius: 14, padding: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', fontFamily: POPPINS }}>Ventas últimos 7 días</div>
          <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: POPPINS }}>CLP</div>
        </div>
        <svg width="100%" height="50" viewBox="0 0 180 75" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={INDIGO2} stopOpacity="0.15"/>
              <stop offset="100%" stopColor={INDIGO2} stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d={path + ' L180,75 L0,75 Z'} fill="url(#chartGrad)"/>
          <path d={path} fill="none" stroke={INDIGO2} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          {pts.map(([x, y], i) => i === 3 && <circle key={i} cx={x} cy={y} r="3.5" fill={INDIGO2}/>)}
        </svg>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
          {['Vie','Sáb','Dom','Lun','Mar','Mié','Jue'].map(d => (
            <div key={d} style={{ fontSize: 7, color: '#94A3B8', fontFamily: POPPINS }}>{d}</div>
          ))}
        </div>
      </div>
      <div style={{ margin: '0 10px', background: APP_CARD, borderRadius: 14, padding: '10px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#334155', marginBottom: 8, fontFamily: POPPINS }}>Últimas ventas</div>
        {[
          { n: 'Barra de proteína ×1', s: 'Sin cliente', a: '$10.000', m: 'Efectivo' },
          { n: 'Aceite de oliva ×2',   s: 'Nacho',       a: '$15.000', m: 'Transf.' },
        ].map(({ n, s, a, m }) => (
          <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0', borderBottom: '1px solid #F8FAFC' }}>
            <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>📈</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#334155', fontFamily: POPPINS }}>{n}</div>
              <div style={{ fontSize: 8, color: '#94A3B8', fontFamily: POPPINS }}>{s}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#111827', fontFamily: POPPINS }}>{a}</div>
              <div style={{ fontSize: 8, color: INDIGO2, background: '#EEF2FF', padding: '1px 5px', borderRadius: 4, fontFamily: POPPINS }}>{m}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScreenSale() {
  return (
    <div style={{ background: APP_BG, minHeight: 380 }}>
      <div style={{ padding: '12px 14px 8px' }}>
        <div style={{ fontSize: 16, fontWeight: 900, color: '#111827', fontFamily: POPPINS }}>Ventas</div>
      </div>
      <div style={{ margin: '0 10px 10px', background: APP_CARD, borderRadius: 12, padding: 3, display: 'flex', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 10, background: APP_CARD, border: `1.5px solid ${INDIGO2}` }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: INDIGO2, fontFamily: POPPINS }}>Registrar</span>
        </div>
        <div style={{ flex: 1, textAlign: 'center', padding: '6px 0', borderRadius: 10 }}>
          <span style={{ fontSize: 10, color: '#94A3B8', fontFamily: POPPINS }}>Historial</span>
        </div>
      </div>
      <div style={{ margin: '0 10px', background: APP_CARD, borderRadius: 14, padding: 12, boxShadow: '0 1px 6px rgba(0,0,0,0.06)', marginBottom: 8 }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: POPPINS }}>Agregar producto</div>
        <div style={{ border: `1.5px solid ${INDIGO2}`, borderRadius: 10, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 10, color: '#334155', fontFamily: POPPINS }}>Aceite de oliva</span>
          <span style={{ color: '#94A3B8', fontSize: 10 }}>▾</span>
        </div>
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 8, color: '#94A3B8', marginBottom: 4, fontFamily: POPPINS }}>Cantidad</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#64748B' }}>−</div>
            <div style={{ flex: 1, background: '#F8FAFC', borderRadius: 8, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#111827', fontFamily: POPPINS }}>2</span>
            </div>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: INDIGO2, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: 'white' }}>+</div>
          </div>
        </div>
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 8, color: '#94A3B8', marginBottom: 4, fontFamily: POPPINS }}>Precio unitario</div>
          <div style={{ background: '#F8FAFC', borderRadius: 10, padding: '7px 10px', display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 10, color: '#64748B', fontFamily: POPPINS }}>$</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>7.500</span>
          </div>
        </div>
        <div style={{ border: '1.5px dashed #C7D2FE', borderRadius: 10, padding: '7px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: INDIGO2, fontFamily: POPPINS, fontWeight: 700 }}>+ Agregar producto</span>
        </div>
      </div>
      <div style={{ margin: '0 10px 10px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6, fontFamily: POPPINS }}>Método de pago</div>
        <div style={{ display: 'flex', gap: 6 }}>
          {[{l:'Efectivo',a:true},{l:'Transfer.',a:false},{l:'Tarjeta',a:false}].map(({l,a}) => (
            <div key={l} style={{ flex: 1, padding: '7px 4px', borderRadius: 10, border: `1.5px solid ${a ? INDIGO2 : '#E2E8F0'}`, background: APP_CARD, textAlign: 'center' }}>
              <div style={{ fontSize: 9, fontWeight: a ? 700 : 400, color: a ? INDIGO2 : '#94A3B8', fontFamily: POPPINS }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: '0 10px' }}>
        <div style={{ background: INDIGO2, borderRadius: 14, padding: '11px 0', textAlign: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>Registrar venta</span>
        </div>
      </div>
    </div>
  )
}

function ScreenStock() {
  return (
    <div style={{ background: APP_BG, minHeight: 380 }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#111827', fontFamily: POPPINS }}>Productos</div>
          <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: POPPINS }}>5 productos en stock</div>
        </div>
        <div style={{ background: INDIGO2, borderRadius: 10, padding: '5px 10px' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>+ Agregar</span>
        </div>
      </div>
      <div style={{ margin: '0 10px 8px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '8px 10px', display: 'flex', gap: 6, alignItems: 'center' }}>
        <span style={{ fontSize: 11 }}>⚠️</span>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#DC2626', fontFamily: POPPINS }}>1 producto con stock bajo</div>
          <div style={{ fontSize: 8, color: '#EF4444', fontFamily: POPPINS }}>Barra de proteína cookies</div>
        </div>
      </div>
      <div style={{ padding: '0 10px 4px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#EF4444', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: POPPINS }}>Stock bajo</div>
      </div>
      <div style={{ margin: '0 10px 8px', background: APP_CARD, borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
        <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📦</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Barra de proteína</div>
            <div style={{ fontSize: 7, fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '1px 5px', borderRadius: 4 }}>BAJO</div>
          </div>
          <div style={{ fontSize: 8, color: '#EF4444', fontFamily: POPPINS }}>$10.000/unidades · Stock: 2 unidades</div>
        </div>
      </div>
      <div style={{ padding: '0 10px 4px' }}>
        <div style={{ fontSize: 8, fontWeight: 700, color: '#64748B', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: POPPINS }}>En stock</div>
      </div>
      {[
        { n: 'Polera Brooklyn', p: '$15.000/unidades', s: '30 unidades' },
        { n: 'Miel',            p: '$7.000/unidades',  s: '26 unidades' },
        { n: 'Aceite de oliva', p: '$7.500/unidades',  s: '31 unidades' },
        { n: 'Palta',           p: '$4.500/kg',         s: '22 kg' },
      ].map(({ n, p, s }) => (
        <div key={n} style={{ margin: '0 10px 6px', background: APP_CARD, borderRadius: 12, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>📦</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>{n}</div>
            <div style={{ fontSize: 8, color: '#94A3B8', fontFamily: POPPINS }}>{p} · Stock: <span style={{ color: '#334155', fontWeight: 600 }}>{s}</span></div>
          </div>
        </div>
      ))}
    </div>
  )
}

function ScreenPedidos() {
  return (
    <div style={{ background: APP_BG, minHeight: 380 }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#111827', fontFamily: POPPINS }}>Pedidos</div>
          <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: POPPINS }}>5 pedidos registrados</div>
        </div>
        <div style={{ background: INDIGO2, borderRadius: 10, padding: '5px 10px' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>+ Crear</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6, padding: '0 10px 10px' }}>
        {['Todos','Pendiente','Pagado','Entregado'].map((l, i) => (
          <div key={l} style={{ padding: '4px 8px', borderRadius: 20, background: i === 0 ? INDIGO2 : APP_CARD, border: `1px solid ${i === 0 ? INDIGO2 : '#E2E8F0'}` }}>
            <span style={{ fontSize: 8, fontWeight: 700, color: i === 0 ? 'white' : '#94A3B8', fontFamily: POPPINS }}>{l}</span>
          </div>
        ))}
      </div>
      {[
        { n: 'Mari',   p: 'Miel, Palta, Aceite ×4', status: 'Pagado',    sc: INDIGO2,   a: '$26.500', cta: 'Marcar como entregado' },
        { n: 'Pablo',  p: 'Barra de proteína ×2',   status: 'Pendiente', sc: '#F59E0B', a: '$20.000', cta: 'Marcar como pagado' },
        { n: 'Beatriz',p: 'Palta ×2',               status: 'Entregado', sc: GREEN2,    a: '$9.000',  cta: null },
      ].map(({ n, p, status, sc, a, cta }) => (
        <div key={n} style={{ margin: '0 10px 8px', background: APP_CARD, borderRadius: 14, padding: '10px 12px', boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: cta ? 8 : 0 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#111827', fontFamily: POPPINS }}>{n}</div>
              <div style={{ fontSize: 9, color: '#94A3B8', fontFamily: POPPINS }}>{p}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'flex-end', marginBottom: 2 }}>
                <div style={{ width: 5, height: 5, borderRadius: '50%', background: sc }} />
                <span style={{ fontSize: 8, fontWeight: 700, color: sc, fontFamily: POPPINS }}>{status}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#111827', fontFamily: POPPINS }}>{a}</div>
            </div>
          </div>
          {cta && (
            <div style={{ background: INDIGO2, borderRadius: 10, padding: '7px 0', textAlign: 'center' }}>
              <span style={{ fontSize: 9, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>{cta}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── ANIMATED PHONE ───────────────────────────────────────────────────────────
const PHONE_SCREENS = [
  { screen: <ScreenDashboard />, dot: INDIGO2 },
  { screen: <ScreenSale />,      dot: GREEN2 },
  { screen: <ScreenStock />,     dot: '#EF4444' },
  { screen: <ScreenPedidos />,   dot: '#F59E0B' },
]

function AnimatedPhone({ scale = 1.1 }) {
  const [idx, setIdx] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setIdx(i => (i + 1) % PHONE_SCREENS.length)
        setFading(false)
      }, 300)
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  const handleDot = (i) => {
    setFading(true)
    setTimeout(() => { setIdx(i); setFading(false) }, 300)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <PhoneFrame scale={scale}>
        <div style={{ transition: 'opacity 0.3s ease', opacity: fading ? 0 : 1 }}>
          {PHONE_SCREENS[idx].screen}
        </div>
      </PhoneFrame>
      <div style={{ display: 'flex', gap: 6 }}>
        {PHONE_SCREENS.map((s, i) => (
          <div
            key={i}
            onClick={() => handleDot(i)}
            style={{
              width: idx === i ? 20 : 6, height: 6, borderRadius: 6,
              background: idx === i ? PHONE_SCREENS[i].dot : 'rgba(255,255,255,0.2)',
              transition: 'all 0.3s', cursor: 'pointer'
            }}
          />
        ))}
      </div>
    </div>
  )
}

// ─── SHARED ───────────────────────────────────────────────────────────────────
function BtnPrimary({ href, onClick, children, style = {} }) {
  const base = { background: GRAD, color: 'white', padding: '14px 28px', borderRadius: 14, fontSize: 16, fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: 'none', textDecoration: 'none', transition: 'opacity 0.15s, transform 0.15s', boxShadow: '0 8px 24px rgba(58,134,255,0.28)', fontFamily: POPPINS, ...style }
  if (href) return <a href={href} style={base}>{children}</a>
  return <button onClick={onClick} style={base}>{children}</button>
}

function BtnSecondary({ href, onClick, children, style = {} }) {
  const base = { background: 'white', color: INDIGO, padding: '14px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8, cursor: 'pointer', border: '2px solid #E2E8F0', textDecoration: 'none', transition: 'border-color 0.15s', fontFamily: POPPINS, ...style }
  if (href) return <a href={href} style={base}>{children}</a>
  return <button onClick={onClick} style={base}>{children}</button>
}

function Chip({ children, style = {} }) {
  return (
    <span style={{ display: 'inline-block', padding: '6px 16px', borderRadius: 999, fontSize: 12, fontWeight: 700, fontFamily: POPPINS, background: '#EEF2FF', color: INDIGO2, border: '1px solid rgba(99,102,241,0.14)', ...style }}>
      {children}
    </span>
  )
}

// ─── HEADER ───────────────────────────────────────────────────────────────────
function Header({ onLogin }) {
  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #F1F5F9' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <ZimplexLogo size={34} />
          <span style={{ fontWeight: 800, fontSize: 17, color: '#111827', fontFamily: POPPINS, letterSpacing: '-0.3px' }}>Zimplex</span>
        </a>
        <div className="hidden md:block">
          <nav style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['#funcionalidades','Funcionalidades'],['#beneficios','Beneficios'],['#precios','Precios']].map(([href, label]) => (
              <a key={label} href={href} style={{ color: '#64748B', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: POPPINS }}>{label}</a>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="hidden md:block">
            <button onClick={onLogin} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 14, fontWeight: 500, fontFamily: POPPINS }}>Entrar</button>
          </div>
          <a href={SIGNUP_URL} style={{ background: INDIGO2, color: 'white', padding: '10px 18px', borderRadius: 10, fontSize: 14, fontWeight: 700, textDecoration: 'none', fontFamily: POPPINS, boxShadow: `0 4px 12px ${INDIGO2}30` }}>
            Empezar gratis
          </a>
        </div>
      </div>
    </header>
  )
}

function MobileCTABar({ onLogin }) {
  return (
    <div className="md:hidden" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40, display: 'flex', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)', borderTop: '1px solid #F1F5F9', boxShadow: '0 -4px 24px rgba(0,0,0,0.05)' }}>
      <BtnSecondary onClick={onLogin} style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14 }}>Ya tengo cuenta</BtnSecondary>
      <BtnPrimary   href={SIGNUP_URL}  style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14, boxShadow: 'none' }}>Comenzar gratis</BtnPrimary>
    </div>
  )
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function Hero({ onLogin }) {
  return (
    <section style={{ background: DARK, overflow: 'hidden' }}>
      <div className="max-w-[1100px] mx-auto px-6 py-14 md:px-12 md:py-[72px] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 20, background: `${GREEN2}18`, border: `1px solid ${GREEN2}35`, width: 'fit-content' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: GREEN2 }} />
            <span style={{ fontSize: 12, fontWeight: 700, color: GREEN2, fontFamily: POPPINS }}>Para emprendedores que venden todos los días</span>
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 900, color: 'white', lineHeight: 1.15, letterSpacing: '-0.5px', fontFamily: POPPINS, margin: 0 }}>
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Deja de adivinar cuánto ganas.</span><br />
            Registra ventas,<br />
            controla tu stock.
          </h1>

          {/* Sub */}
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, fontFamily: POPPINS, maxWidth: 440, margin: 0 }}>
            Solo abres Zimplex en el celular, anotas y listo. Sin planillas, sin cuadernos, sin caos. Tu negocio siempre al día.
          </p>

          {/* How it works strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {['📝 Anota la venta', '→', '📊 Ve tus ganancias', '→', '📦 Stock al día'].map((s, i) => (
              <span key={i} style={{
                fontSize: 12, fontWeight: 700, fontFamily: POPPINS,
                color: s === '→' ? 'rgba(255,255,255,0.2)' : TEAL,
                background: s === '→' ? 'none' : 'rgba(74,222,128,0.08)',
                padding: s === '→' ? '0' : '5px 12px',
                borderRadius: 8,
                border: s === '→' ? 'none' : '1px solid rgba(74,222,128,0.2)',
              }}>{s}</span>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4, flexWrap: 'wrap' }}>
            <a href={SIGNUP_URL} style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              padding: '14px 28px', borderRadius: 12,
              background: GREEN2, color: 'white',
              fontWeight: 800, fontSize: 15, textDecoration: 'none',
              fontFamily: POPPINS, boxShadow: `0 8px 28px ${GREEN2}45`,
            }}>
              Empezar gratis ahora →
            </a>
            <button onClick={onLogin} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '14px 22px', borderRadius: 12,
              background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.65)',
              fontWeight: 700, fontSize: 14, border: '1.5px solid rgba(255,255,255,0.1)',
              cursor: 'pointer', fontFamily: POPPINS,
            }}>
              Ver cómo funciona
            </button>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 4 }}>
            <div style={{ display: 'flex' }}>
              {['M','C','V','A','R'].map((l, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: [BLUE, GREEN2, '#8B5CF6', '#F59E0B', '#EF4444'][i],
                  border: '2px solid rgba(11,18,32,0.8)',
                  marginLeft: i > 0 ? -8 : 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: 'white', fontFamily: POPPINS
                }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ display: 'flex', gap: 1 }}>
                {[...Array(5)].map((_, i) => <Star key={i} size={11} fill="#FCD34D" color="#FCD34D" />)}
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: POPPINS, marginTop: 2 }}>Gratis para empezar · Sin tarjeta · Sin instalación</div>
            </div>
          </div>
        </div>

        {/* Right — Phone animado (solo desktop) */}
        <div className="hidden md:flex relative justify-center items-center">
          <div style={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${INDIGO2}22 0%, transparent 70%)`, pointerEvents: 'none' }} />
          <AnimatedPhone scale={1.4} />
        </div>
      </div>

      {/* Social proof bar */}
      <div className="flex flex-wrap justify-center gap-5 md:gap-12 px-6 md:px-12 py-3.5" style={{ background: 'rgba(0,0,0,0.3)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        {['Sin tarjeta de crédito','Sin instalación','Listo en 2 minutos'].map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.4)', fontFamily: POPPINS }}>
            <Check size={13} color="rgba(255,255,255,0.3)" strokeWidth={2.5} />{t}
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── PROBLEM ──────────────────────────────────────────────────────────────────
function Problem() {
  return (
    <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip style={{ background: '#FFF1F2', color: '#EF4444', border: '1px solid rgba(239,68,68,0.14)' }}>El problema</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>¿Te pasa esto?</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
          {problems.map(({ emoji, title, desc }) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.35, ease: 'easeOut' }}
              style={{ background: 'white', borderRadius: 16, padding: '18px 22px', borderLeft: '4px solid #FCA5A5', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <div>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: 14, marginBottom: 4, fontFamily: POPPINS }}>{title}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 600, color: '#334155', fontFamily: POPPINS }}>
          No eres el único. Le pasa a la mayoría de los emprendedores.
        </p>
      </div>
    </section>
  )
}

// ─── INTERACTIVE FEATURES (nuevo: tabs) ──────────────────────────────────────
const FEAT_SCREENS = [<ScreenSale />, <ScreenDashboard />, <ScreenStock />, <ScreenPedidos />]

function InteractiveFeatures() {
  const [active, setActive] = useState(0)
  const feat = features[active]

  return (
    <section id="funcionalidades" style={{ background: '#F8FAFC', padding: '96px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <Chip>El producto</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)', fontWeight: 900, color: '#111827', fontFamily: POPPINS, letterSpacing: '-0.3px', lineHeight: 1.2 }}>
            Todo lo que necesitas<br />
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>para ordenar tu negocio.</span>
          </h2>
        </div>

        {/* Tab pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 48, flexWrap: 'wrap' }}>
          {features.map((f, i) => (
            <button key={i} onClick={() => setActive(i)} style={{
              padding: '10px 20px', borderRadius: 12,
              border: `2px solid ${active === i ? f.color : '#E2E8F0'}`,
              background: active === i ? f.bg : 'white',
              color: active === i ? f.color : '#94A3B8',
              fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: POPPINS,
              transition: 'all 0.18s',
              boxShadow: active === i ? `0 4px 16px ${f.color}22` : 'none',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Content panel — desktop */}
        <div className="hidden md:block">
          <div style={{
            background: 'white', borderRadius: 24,
            border: `2px solid ${feat.color}25`,
            display: 'grid', gridTemplateColumns: '1fr 1fr',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${feat.color}12`,
            minHeight: 420,
          }}>
            {/* Left: text */}
            <div style={{ padding: '52px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 18, borderRight: `1px solid ${feat.color}15` }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: feat.color, letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: POPPINS }}>{feat.label}</span>
              <h3 style={{ fontSize: 'clamp(1.4rem, 2vw, 1.8rem)', fontWeight: 900, color: '#111827', fontFamily: POPPINS, lineHeight: 1.2, letterSpacing: '-0.2px', margin: 0 }}>{feat.title}</h3>
              <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.75, fontFamily: POPPINS, margin: 0 }}>{feat.text}</p>
              <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 10, margin: 0 }}>
                {feat.bullets.map(b => (
                  <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: feat.bg, border: `1.5px solid ${feat.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={12} color={feat.color} strokeWidth={2.5} />
                    </div>
                    <span style={{ fontSize: 14, color: '#334155', fontFamily: POPPINS, fontWeight: 600 }}>{b}</span>
                  </li>
                ))}
              </ul>
              {/* Progress dots */}
              <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 8 }}>
                {features.map((f, i) => (
                  <div key={i} onClick={() => setActive(i)} style={{
                    height: 4, borderRadius: 4, cursor: 'pointer',
                    width: active === i ? 28 : 8,
                    background: active === i ? feat.color : '#E2E8F0',
                    transition: 'all 0.2s',
                  }} />
                ))}
              </div>
            </div>
            {/* Right: phone */}
            <AnimatePresence mode="wait">
              <motion.div key={active}
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: feat.bg, padding: 40, position: 'relative' }}
              >
                <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: `radial-gradient(circle, ${feat.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
                <PhoneFrame scale={1.2}>
                  {FEAT_SCREENS[active]}
                </PhoneFrame>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile: stacked */}
        <div className="md:hidden">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, ease: 'easeOut' }}
                style={{ background: 'white', borderRadius: 24, padding: 24, border: '1.5px solid #F1F5F9', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700, background: f.bg, color: f.color, marginBottom: 14, fontFamily: POPPINS, border: `1px solid ${f.color}25` }}>{f.label}</span>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 8, fontFamily: POPPINS, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.65, marginBottom: 16, fontFamily: POPPINS }}>{f.text}</p>
                <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
                  {f.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', fontFamily: POPPINS }}>
                      <div style={{ width: 18, height: 18, borderRadius: 5, background: f.bg, border: `1px solid ${f.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Check size={10} color={f.color} strokeWidth={3} />
                      </div>
                      {b}
                    </li>
                  ))}
                </ul>
                <div style={{ transform: 'scale(0.88)', transformOrigin: 'top center', pointerEvents: 'none' }}>
                  {FEAT_SCREENS[i]}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────────
function Benefits() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }} id="beneficios">
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Beneficios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>
            Lo que cambia cuando empiezas<br />a usar Zimplex
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {emotionalBenefits.map(({ icon: Icon, title, desc, color, bg }, idx) => (
            <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.35, delay: idx * 0.07, ease: 'easeOut' }}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, background: '#F8FAFC', borderRadius: 16, border: '1.5px solid #F1F5F9' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p style={{ fontWeight: 700, color: '#111827', marginBottom: 3, fontSize: 14, fontFamily: POPPINS }}>{title}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 19, fontWeight: 700, color: '#111827', marginBottom: 24, fontFamily: POPPINS }}>Tu negocio pasa del caos al control.</p>
          <BtnPrimary href={SIGNUP_URL} style={{ fontSize: 17, padding: '16px 32px' }}>
            Empezar gratis ahora <ArrowRight size={18} />
          </BtnPrimary>
        </div>
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section style={{ padding: '80px 24px', background: '#F8FAFC' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Testimonios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>
            Lo que dicen quienes lo usan
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 48 }}>
          {[
            { num: 'Muchos',  label: 'ya nos están prefiriendo' },
            { num: '4.8★',   label: 'Calificación promedio' },
            { num: '2 min',  label: 'Para empezar' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign: 'center', padding: '20px 12px', background: 'white', borderRadius: 16 }}>
              <p style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 800, color: '#111827', fontFamily: POPPINS, lineHeight: 1 }}>{num}</p>
              <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 6, fontFamily: POPPINS }}>{label}</p>
            </div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {testimonials.map(({ quote, name, role, initial }, i) => (
            <motion.div key={name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.35, delay: i * 0.08, ease: 'easeOut' }}
              style={{ background: 'white', borderRadius: 20, padding: 24, border: `1.5px solid ${i === 1 ? '#DBEAFE' : '#F1F5F9'}`, boxShadow: i === 1 ? '0 4px 20px rgba(58,134,255,0.08)' : '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ color: '#334155', fontSize: 14, lineHeight: 1.65, marginBottom: 16, fontFamily: POPPINS }}>{quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, fontFamily: POPPINS }}>{initial}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: POPPINS }}>{name}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: POPPINS }}>{role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── PRICING ──────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }} id="precios">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Precios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Simple como la app</h2>
          <p style={{ marginTop: 8, fontSize: 15, color: '#94A3B8', fontFamily: POPPINS }}>Empieza gratis. Paga solo si quieres más.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Free */}
          <div style={{ background: '#F8FAFC', borderRadius: 24, padding: 28, border: '2px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: '#94A3B8', marginBottom: 8, fontFamily: POPPINS, letterSpacing: '0.08em' }}>GRATIS</p>
            <p style={{ fontSize: 40, fontWeight: 800, color: '#111827', fontFamily: POPPINS, lineHeight: 1 }}>$0</p>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 20px', fontFamily: POPPINS }}>Para siempre</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {freeFeatures.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', fontFamily: POPPINS }}>
                  <Check size={13} color={GREEN2} strokeWidth={2.5} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
              {proExcluded.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#CBD5E1', fontFamily: POPPINS }}>
                  <X size={13} color="#CBD5E1" strokeWidth={2} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
            <BtnSecondary href={SIGNUP_URL} style={{ width: '100%', justifyContent: 'center', fontSize: 14, marginTop: 'auto' }}>Empezar gratis</BtnSecondary>
          </div>
          {/* Pro */}
          <div style={{ background: GRAD, borderRadius: 24, padding: 28, position: 'relative', boxShadow: '0 20px 56px rgba(58,134,255,0.22)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999, fontFamily: POPPINS }}>Más elegido</span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontFamily: POPPINS, letterSpacing: '0.08em' }}>PRO</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <p style={{ fontSize: 36, fontWeight: 800, color: 'white', fontFamily: POPPINS, lineHeight: 1 }}>$4.990 CLP</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4, fontFamily: POPPINS }}>/mes</p>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '6px 0 20px', fontFamily: POPPINS }}>Todo lo que necesitas para crecer sin límites</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {proFeatures.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'white', fontFamily: POPPINS }}>
                  <Check size={13} color="rgba(255,255,255,0.75)" strokeWidth={2.5} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.8)', marginBottom: 10, marginTop: 'auto', fontFamily: POPPINS }}>✓ Sin tarjeta hasta que decidas pagar</p>
            <a href={UPGRADE_URL} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '14px 0', borderRadius: 14, background: 'white', color: INDIGO2, fontWeight: 700, fontSize: 14, textDecoration: 'none', fontFamily: POPPINS }}>
              Pasar a Pro <ChevronRight size={15} />
            </a>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 10, fontFamily: POPPINS }}>Cancela cuando quieras. Sin contratos.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQ() {
  return (
    <section style={{ padding: '80px 24px', background: '#F8FAFC' }} id="faq">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>FAQ</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Preguntas frecuentes</h2>
        </div>
        <div style={{ borderTop: '1px solid #F1F5F9' }}>
          {faqs.map(({ q, a }) => (
            <details key={q} className="group" style={{ borderBottom: '1px solid #F1F5F9' }}>
              <summary className="flex justify-between items-center cursor-pointer py-5 list-none" style={{ fontWeight: 600, color: '#111827', fontSize: 14, fontFamily: POPPINS }}>
                {q}
                <ChevronRight size={17} className="text-slate-300 flex-shrink-0 transition-transform duration-200 group-open:rotate-90" />
              </summary>
              <p style={{ paddingBottom: 16, color: '#94A3B8', fontSize: 13, lineHeight: 1.7, fontFamily: POPPINS }}>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── SUPPORT ──────────────────────────────────────────────────────────────────
function Support() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [tipo, setTipo] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const inp = (err) => ({
    width: '100%', padding: '10px 14px', borderRadius: 12, border: `1.5px solid ${err ? '#FCA5A5' : '#E2E8F0'}`,
    fontSize: 13, fontFamily: POPPINS, color: '#111827', background: 'white', outline: 'none', boxSizing: 'border-box',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const newErrors = {}
    if (!nombre.trim()) newErrors.nombre = 'Ingresa tu nombre'
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Correo inválido'
    if (!tipo) newErrors.tipo = 'Selecciona un tipo'
    if (!mensaje.trim() || mensaje.trim().length < 10) newErrors.mensaje = 'Mensaje demasiado corto'
    if (Object.keys(newErrors).length) { setErrors(newErrors); return }
    setLoading(true); setSubmitError('')
    try {
      const res = await fetch('https://formspree.io/f/xeojpppo', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ nombre, email, tipo, mensaje }),
      })
      if (res.ok) { setSent(true) } else { setSubmitError('Hubo un error. Intenta de nuevo.') }
    } catch { setSubmitError('Sin conexión. Intenta más tarde.') }
    setLoading(false)
  }

  return (
    <section style={{ padding: '80px 24px', background: 'white' }} id="soporte">
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <Chip>Soporte</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>¿Tienes una duda?</h2>
          <p style={{ color: '#94A3B8', fontSize: 14, fontFamily: POPPINS, marginTop: 8 }}>Cuéntanos en qué podemos ayudarte y te respondemos a la brevedad.</p>
        </div>
        {sent ? (
          <div style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 24, padding: '48px 32px', textAlign: 'center' }}>
            <div style={{ width: 64, height: 64, background: '#EEF2FF', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Check size={30} color={INDIGO2} strokeWidth={2.5} />
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: '#111827', fontFamily: POPPINS, marginBottom: 8 }}>¡Mensaje enviado!</h3>
            <p style={{ fontSize: 14, color: '#94A3B8', fontFamily: POPPINS, lineHeight: 1.6, marginBottom: 24 }}>
              Recibimos tu consulta y te responderemos al correo <strong style={{ color: '#374151' }}>{email}</strong>.
            </p>
            <button onClick={() => { setSent(false); setNombre(''); setEmail(''); setTipo(''); setMensaje('') }}
              style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 12, padding: '10px 24px', fontSize: 13, fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: POPPINS }}>
              Enviar otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate style={{ background: 'white', border: '1.5px solid #E2E8F0', borderRadius: 24, padding: '32px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, fontFamily: POPPINS }}>Nombre <span style={{ color: '#EF4444' }}>*</span></label>
                <input value={nombre} onChange={e => { setNombre(e.target.value); setErrors(p => ({...p, nombre: ''})) }} placeholder="Tu nombre" style={inp(!!errors.nombre)} />
                {errors.nombre && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, fontFamily: POPPINS }}>{errors.nombre}</p>}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, fontFamily: POPPINS }}>Correo <span style={{ color: '#EF4444' }}>*</span></label>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors(p => ({...p, email: ''})) }} placeholder="tu@correo.com" style={inp(!!errors.email)} />
                {errors.email && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, fontFamily: POPPINS }}>{errors.email}</p>}
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, fontFamily: POPPINS }}>Tipo de consulta <span style={{ color: '#EF4444' }}>*</span></label>
              <div style={{ position: 'relative' }}>
                <select value={tipo} onChange={e => { setTipo(e.target.value); setErrors(p => ({...p, tipo: ''})) }}
                  style={{ ...inp(!!errors.tipo), appearance: 'none', paddingRight: 36, cursor: 'pointer' }}>
                  <option value="">Seleccionar...</option>
                  {TIPOS_LANDING.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <ChevronRight size={15} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%) rotate(90deg)', color: '#94A3B8', pointerEvents: 'none' }} />
              </div>
              {errors.tipo && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, fontFamily: POPPINS }}>{errors.tipo}</p>}
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#64748B', marginBottom: 6, fontFamily: POPPINS }}>Mensaje <span style={{ color: '#EF4444' }}>*</span></label>
              <textarea value={mensaje} onChange={e => { setMensaje(e.target.value); setErrors(p => ({...p, mensaje: ''})) }}
                placeholder="Cuéntanos con detalle tu consulta o problema..." rows={5}
                style={{ ...inp(!!errors.mensaje), resize: 'vertical', minHeight: 110 }} />
              {errors.mensaje && <p style={{ fontSize: 11, color: '#EF4444', marginTop: 4, fontFamily: POPPINS }}>{errors.mensaje}</p>}
            </div>
            {submitError && (
              <div style={{ background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, padding: '12px 16px', marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: '#EF4444', fontFamily: POPPINS, margin: 0 }}>{submitError}</p>
              </div>
            )}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: POPPINS, maxWidth: 220 }}>Tu correo solo se usa para responderte.</p>
              <button type="submit" disabled={loading}
                style={{ background: GRAD, color: 'white', border: 'none', borderRadius: 14, padding: '12px 24px', fontSize: 14, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: POPPINS, opacity: loading ? 0.7 : 1, transition: 'opacity .15s' }}>
                {loading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Enviando...</> : <><Send size={16} /> Enviar mensaje</>}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
function FinalCTA({ onLogin }) {
  return (
    <section style={{ padding: '80px 24px', background: DARK }}>
      <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
        <Chip style={{ background: `${INDIGO2}25`, color: '#A5B4FC', border: `1px solid ${INDIGO2}30` }}>Empieza hoy</Chip>
        <h2 style={{ marginTop: 20, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, fontFamily: POPPINS }}>
          Empieza hoy a ordenar<br />tu negocio.
        </h2>
        <p style={{ marginTop: 14, fontSize: 15, color: '#94A3B8', marginBottom: 36, fontFamily: POPPINS }}>
          No necesitas ser experto. Solo necesitas empezar.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <BtnPrimary href={SIGNUP_URL} style={{ fontSize: 17, padding: '16px 32px' }}>
            Comenzar gratis ahora <ArrowRight size={18} />
          </BtnPrimary>
          <button onClick={onLogin} style={{ background: 'rgba(255,255,255,0.07)', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.65)', padding: '16px 28px', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer', fontFamily: POPPINS }}>
            Ya tengo cuenta
          </button>
        </div>
        <p style={{ marginTop: 20, fontSize: 12, color: '#475569', fontFamily: POPPINS }}>Sin tarjeta · Sin instalación · Listo en 2 minutos</p>
      </div>
    </section>
  )
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: 'white', borderTop: '1px solid #F1F5F9', padding: '48px 24px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: 32, marginBottom: 36 }}>
          <div>
            <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', marginBottom: 10 }}>
              <ZimplexLogo size={28} />
              <span style={{ fontWeight: 700, color: '#111827', fontSize: 15, fontFamily: POPPINS }}>Zimplex</span>
            </a>
            <p style={{ fontSize: 13, color: '#94A3B8', maxWidth: 210, lineHeight: 1.6, fontFamily: POPPINS }}>
              La forma más simple de llevar tu negocio. Hecho con ❤️ para microemprendedores.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontWeight: 700, color: '#334155', fontSize: 12, marginBottom: 12, fontFamily: POPPINS, letterSpacing: '0.05em' }}>PRODUCTO</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['#funcionalidades','Funcionalidades'],['#precios','Precios'],['#faq','FAQ']].map(([href, label]) => (
                  <li key={label}><a href={href} style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontFamily: POPPINS }}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontWeight: 700, color: '#334155', fontSize: 12, marginBottom: 12, fontFamily: POPPINS, letterSpacing: '0.05em' }}>CUENTA</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[[SIGNUP_URL,'Crear cuenta'],[LOGIN_URL,'Iniciar sesión'],['#soporte','Soporte']].map(([href, label]) => (
                  <li key={label}><a href={href} style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontFamily: POPPINS }}>{label}</a></li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div style={{ borderTop: '1px solid #F1F5F9', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
          <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>© {new Date().getFullYear()} Zimplex. Todos los derechos reservados.</p>
          <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>Hecho en 🇨🇱 Chile</p>
        </div>
      </div>
    </footer>
  )
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
export default function Landing({ onLogin }) {
  return (
    <div style={{ minHeight: '100vh', background: 'white', paddingBottom: 72, fontFamily: POPPINS }}>
      <Header onLogin={onLogin} />
      <MobileCTABar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Problem />
      <InteractiveFeatures />
      <Benefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <Support />
      <FinalCTA onLogin={onLogin} />
      <Footer />
    </div>
  )
}
