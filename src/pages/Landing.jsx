import {
  Check, ArrowRight, Star, TrendingUp, Package, BarChart2,
  X, ChevronRight, Heart, ShoppingBag, MessageCircle
} from 'lucide-react'

// ─── BRAND ──────────────────────────────────────────────────────────────────
const BLUE       = '#3A86FF'
const TEAL       = '#2EC4B6'
const GRAD       = 'linear-gradient(135deg, #3A86FF 0%, #2EC4B6 100%)'
const POPPINS    = "'Poppins', sans-serif"

const SIGNUP_URL  = 'https://zimplex.app/signup'
const LOGIN_URL   = 'https://zimplex.app/login'
const UPGRADE_URL = 'https://minegociosimple.lemonsqueezy.com/checkout/buy/ef3fd402-6b9a-4693-9c4b-5a4974929973'

// ─── DATA ────────────────────────────────────────────────────────────────────

const problems = [
  { emoji: '😮‍💨', title: 'Vendes todos los días, pero no sabes cuánto ganas realmente', desc: 'A fin de mes no entiendes a dónde fue la plata.' },
  { emoji: '💬',   title: 'Se te pierden pedidos en WhatsApp',                           desc: 'Entre mensajes, fotos y audios, los pedidos se mezclan y se olvidan.' },
  { emoji: '📦',   title: 'No sabes cuánto stock te queda',                              desc: 'Un cliente pide y tú no tienes. Ventas perdidas por no llevar el control.' },
  { emoji: '📋',   title: 'Todo lo llevas en tu cabeza o en Excel',                      desc: 'Y cuando necesitas un dato importante, no está donde deberías buscarlo.' },
]

const coreBenefits = [
  { icon: TrendingUp,    title: 'Registra ventas en segundos',    desc: 'Sin planillas ni fórmulas. Tres toques y la venta queda guardada al instante.',                   color: BLUE, bg: '#EFF6FF' },
  { icon: Package,       title: 'Controla tu stock sin esfuerzo', desc: 'Alerta automática cuando algo se agota. Nunca más pierdas una venta por falta de stock.',         color: TEAL, bg: '#F0FDFA' },
  { icon: BarChart2,     title: 'Entiende tu negocio de verdad',  desc: 'Ve cuánto ganas hoy, esta semana y este mes. Un vistazo y tienes toda la claridad.',              color: BLUE, bg: '#EFF6FF' },
]

const steps = [
  { num: 1, title: 'Registra tus ventas',         desc: 'Selecciona el producto, la cantidad y confirma. En 10 segundos está registrado y el stock actualizado.' },
  { num: 2, title: 'Mira cómo crece tu negocio',  desc: 'Tu dashboard te muestra cuánto vendiste hoy, esta semana y este mes. Un vistazo y ya sabes todo.' },
  { num: 3, title: 'Toma mejores decisiones',      desc: 'Con datos reales sabes qué producto vende más, cuándo reponer y cuánto estás ganando de verdad.' },
]

const emotionalBenefits = [
  { icon: BarChart2,     title: 'Sabes cuánto ganas de verdad', desc: 'Sin estimaciones. Número real, todos los días.',                            color: BLUE, bg: '#EFF6FF' },
  { icon: Check,         title: 'Dejas de perder ventas',       desc: 'Alerta de stock bajo y pedidos organizados. Ninguna venta se pierde.',       color: TEAL, bg: '#F0FDFA' },
  { icon: ShoppingBag,   title: 'Tienes control total',         desc: 'Un solo lugar con toda la info. Sin cuadernos, sin Excel.',                  color: BLUE, bg: '#EFF6FF' },
  { icon: Heart,         title: 'Te sientes más tranquilo',     desc: 'Saber cómo va tu negocio da paz mental. Dejas de vivir adivinando.',         color: TEAL, bg: '#F0FDFA' },
]

const testimonials = [
  { quote: '"Antes vendía todos los días, pero no sabía si realmente estaba ganando plata. Ahora tengo todo claro en un solo lugar."', name: 'María Contreras', role: 'Jugos y empanadas, Valparaíso',  initial: 'M' },
  { quote: '"Lo mejor es el control de stock. Me avisaba cuando me quedaba poco y dejé de perder ventas. Muy recomendado."',           name: 'Carlos Morales',  role: 'Frutas y verduras, Santiago',    initial: 'C' },
  { quote: '"Lo del WhatsApp automático me cambió la vida. Antes escribía el mismo mensaje 20 veces al día. Ahora es un toque."',      name: 'Valentina Rojas', role: 'Ropa por encargo, Concepción',   initial: 'V' },
]

const freeFeatures = ['Registro de ventas', 'Control básico de stock', 'Visualización simple', 'Hasta 100 ventas al mes']
const proExcluded  = ['Control de stock avanzado', 'Reportes completos', 'Pedidos por WhatsApp', 'Soporte prioritario']
const proFeatures  = ['Ventas ilimitadas', 'Control de stock avanzado', 'Reportes completos', 'Pedidos por WhatsApp', 'Insights automáticos', 'Prioridad en soporte']

const faqs = [
  { q: '¿Necesito descargar una app?',       a: 'No. Zimplex funciona directo en el navegador de tu celular. Sin descargar nada. Puedes guardarla en tu pantalla de inicio y se comporta como una app nativa.' },
  { q: '¿Funciona sin internet?',             a: 'Necesitas conexión para sincronizar datos, pero está optimizada para conexiones lentas o inestables como las de datos móviles.' },
  { q: '¿Mis datos están seguros?',           a: 'Sí. Tus datos se almacenan con encriptación en servidores seguros. Solo tú tienes acceso a la información de tu negocio.' },
  { q: '¿Para qué tipo de negocios sirve?',   a: 'Para cualquier negocio pequeño: frutas, ropa, comida casera, artesanías, cosméticos y más. Si vendes por WhatsApp, ferias o en tu casa, esto es para ti.' },
  { q: '¿Puedo cancelar en cualquier momento?', a: 'Sí, sin contratos ni cargos extra. Si cancelas Pro, sigues usando el plan Gratis sin perder tus datos.' },
]

// ─── SVG LOGO ────────────────────────────────────────────────────────────────

function ZimplexLogo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="zgrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3A86FF" />
          <stop offset="1" stopColor="#2EC4B6" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#zgrad)" />
      <path d="M8 9.5H24L8 22.5H24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// ─── PHONE MOCKUP ────────────────────────────────────────────────────────────

function PhoneMockup() {
  const bars = [55, 70, 40, 85, 60, 75, 100]
  return (
    <div style={{
      maxWidth: 260, margin: '0 auto', background: 'white',
      borderRadius: 32, padding: 8,
      boxShadow: '0 24px 80px rgba(58,134,255,0.14), 0 0 0 1px rgba(58,134,255,0.07)'
    }}>
      <div style={{ background: '#F8FAFC', borderRadius: 26, overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px 4px' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#64748B', fontFamily: POPPINS }}>9:41</span>
        </div>
        <div style={{ background: 'white', padding: '0 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
          <p style={{ fontSize: 11, color: '#9CA3AF', fontFamily: POPPINS }}>Buenos días</p>
          <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Dashboard</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, padding: 12 }}>
          {[
            { label: 'Ventas Hoy', value: '$48.000', sub: '↑ 12%',      subColor: TEAL },
            { label: 'Ventas Mes', value: '$820k',   sub: '↑ 8%',       subColor: TEAL },
            { label: 'Pedidos',    value: '3',        sub: 'pendientes', subColor: '#F59E0B', valueColor: '#F59E0B' },
            { label: 'Stock bajo', value: '2',        sub: 'productos',  subColor: '#94A3B8', valueColor: '#EF4444' },
          ].map(({ label, value, sub, subColor, valueColor }) => (
            <div key={label} style={{ background: 'white', borderRadius: 12, padding: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: 10, color: '#9CA3AF', marginBottom: 2, fontFamily: POPPINS }}>{label}</p>
              <p style={{ fontSize: 15, fontWeight: 700, color: valueColor || '#111827', fontFamily: POPPINS }}>{value}</p>
              <p style={{ fontSize: 10, color: subColor, fontFamily: POPPINS }}>{sub}</p>
            </div>
          ))}
        </div>
        <div style={{ padding: '0 12px 8px' }}>
          <div style={{ background: 'white', borderRadius: 12, padding: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 10, color: '#64748B', fontWeight: 500, marginBottom: 6, fontFamily: POPPINS }}>Últimos 7 días</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 3, height: 36 }}>
              {bars.map((h, i) => (
                <div key={i} style={{
                  flex: 1, borderRadius: 3,
                  height: `${h}%`,
                  background: i === 6 ? GRAD : (i % 2 === 0 ? '#DBEAFE' : '#CCFBF1')
                }} />
              ))}
            </div>
          </div>
        </div>
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ background: GRAD, borderRadius: 12, padding: '10px 0', textAlign: 'center', color: 'white', fontSize: 12, fontWeight: 600, fontFamily: POPPINS }}>
            + Registrar venta
          </div>
        </div>
        <div style={{ background: 'white', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-around', padding: '8px 8px' }}>
          {['Inicio', 'Ventas', 'Stock', 'Pedidos', 'Metas'].map((label, i) => (
            <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              {i === 0 && <div style={{ width: 5, height: 5, borderRadius: '50%', background: BLUE }} />}
              <span style={{ fontSize: 10, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? BLUE : '#9CA3AF', fontFamily: POPPINS }}>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

function BtnPrimary({ href, onClick, children, style = {} }) {
  const base = {
    background: GRAD, color: 'white',
    padding: '14px 28px', borderRadius: 14,
    fontSize: 16, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 8,
    cursor: 'pointer', border: 'none', textDecoration: 'none',
    transition: 'opacity 0.15s, transform 0.15s',
    boxShadow: '0 8px 24px rgba(58,134,255,0.28)',
    fontFamily: POPPINS, ...style
  }
  if (href) return <a href={href} style={base}>{children}</a>
  return <button onClick={onClick} style={base}>{children}</button>
}

function BtnSecondary({ href, onClick, children, style = {} }) {
  const base = {
    background: 'white', color: BLUE,
    padding: '14px 28px', borderRadius: 14,
    fontSize: 16, fontWeight: 600,
    display: 'inline-flex', alignItems: 'center', gap: 8,
    cursor: 'pointer', border: '2px solid #E2E8F0', textDecoration: 'none',
    transition: 'border-color 0.15s, background 0.15s',
    fontFamily: POPPINS, ...style
  }
  if (href) return <a href={href} style={base}>{children}</a>
  return <button onClick={onClick} style={base}>{children}</button>
}

function Chip({ children, style = {} }) {
  return (
    <span style={{
      display: 'inline-block', padding: '6px 16px', borderRadius: 999,
      fontSize: 12, fontWeight: 600, fontFamily: POPPINS,
      background: 'linear-gradient(135deg, #EFF6FF, #F0FDFA)',
      color: BLUE, border: '1px solid rgba(58,134,255,0.14)',
      ...style
    }}>
      {children}
    </span>
  )
}

// ─── SECTIONS ────────────────────────────────────────────────────────────────

function Header({ onLogin }) {
  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid #F1F5F9'
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <ZimplexLogo size={34} />
          <span style={{ fontWeight: 700, fontSize: 17, color: '#111827', fontFamily: POPPINS, letterSpacing: '-0.3px' }}>Zimplex</span>
        </a>

        <nav className="hidden md:flex" style={{ gap: 28, display: 'flex', alignItems: 'center' }}>
          {[['#como-funciona', 'Cómo funciona'], ['#beneficios', 'Beneficios'], ['#precios', 'Precios']].map(([href, label]) => (
            <a key={label} href={href} style={{ color: '#64748B', fontSize: 14, fontWeight: 500, textDecoration: 'none', fontFamily: POPPINS }}>{label}</a>
          ))}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={onLogin} className="hidden md:block" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', fontSize: 14, fontWeight: 500, fontFamily: POPPINS }}>
            Entrar
          </button>
          <BtnPrimary href={SIGNUP_URL} style={{ padding: '10px 18px', fontSize: 14, boxShadow: '0 4px 12px rgba(58,134,255,0.22)' }}>
            Empezar gratis
          </BtnPrimary>
        </div>
      </div>
    </header>
  )
}

function MobileCTABar({ onLogin }) {
  return (
    <div className="md:hidden" style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
      display: 'flex', gap: 10, padding: '12px 16px',
      background: 'rgba(255,255,255,0.96)', backdropFilter: 'blur(16px)',
      borderTop: '1px solid #F1F5F9', boxShadow: '0 -4px 24px rgba(0,0,0,0.05)'
    }}>
      <BtnSecondary onClick={onLogin} style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14 }}>Ya tengo cuenta</BtnSecondary>
      <BtnPrimary   href={SIGNUP_URL}  style={{ flex: 1, justifyContent: 'center', padding: '12px 16px', fontSize: 14, boxShadow: 'none' }}>Comenzar gratis</BtnPrimary>
    </div>
  )
}

function Hero({ onLogin }) {
  return (
    <section style={{ paddingTop: 80, paddingBottom: 96, paddingLeft: 24, paddingRight: 24, textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 50% at 50% -10%, rgba(58,134,255,0.07) 0%, transparent 65%)' }} />

      <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
        <Chip>✦ Para emprendedores que venden por WhatsApp</Chip>

        <h1 style={{ marginTop: 24, fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#111827', fontFamily: POPPINS }}>
          Deja de adivinar<br />cuánto ganas.
        </h1>
        <h1 style={{ margin: '4px 0 0', fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', fontFamily: POPPINS }}>
          Empieza a tener control real.
        </h1>

        <p style={{ marginTop: 20, fontSize: 17, color: '#64748B', lineHeight: 1.7, maxWidth: 520, margin: '20px auto 0', fontFamily: POPPINS }}>
          Registra tus ventas en segundos, controla tu stock y entiende tu negocio sin usar Excel.
        </p>

        <div style={{ marginTop: 32, display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <BtnPrimary href={SIGNUP_URL} style={{ fontSize: 17, padding: '16px 32px' }}>
            Comenzar gratis <ArrowRight size={18} />
          </BtnPrimary>
          <BtnSecondary onClick={onLogin} style={{ fontSize: 17, padding: '16px 32px' }}>
            Ya tengo cuenta
          </BtnSecondary>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20 }}>
          {['Sin tarjeta de crédito', 'Gratis para empezar', 'Listo en 2 minutos'].map(t => (
            <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8', fontFamily: POPPINS }}>
              <Check size={13} color={TEAL} strokeWidth={2.5} />{t}
            </span>
          ))}
        </div>

        <div style={{ marginTop: 64 }}>
          <PhoneMockup />
        </div>

        <div style={{ marginTop: 36, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 24, fontSize: 13, color: '#94A3B8', fontFamily: POPPINS }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex' }}>
              {[BLUE, TEAL, '#059669', '#DC2626'].map((bg, i) => (
                <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: bg, border: '2px solid white', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'white', fontFamily: POPPINS }}>
                  {['M','V','C','A'][i]}
                </div>
              ))}
            </div>
            <span>+200 emprendedores ya lo usan</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ color: '#F59E0B' }}>★★★★★</span>
            <span>4.9 en reseñas</span>
          </div>
        </div>
      </div>
    </section>
  )
}

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
            <div key={title} style={{ background: 'white', borderRadius: 16, padding: '18px 22px', borderLeft: '4px solid #FCA5A5', boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 22 }}>{emoji}</span>
                <div>
                  <p style={{ fontWeight: 600, color: '#111827', fontSize: 14, marginBottom: 4, fontFamily: POPPINS }}>{title}</p>
                  <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>{desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 16, fontWeight: 600, color: '#334155', fontFamily: POPPINS }}>
          No eres el único. A muchos emprendedores les pasa lo mismo.
        </p>
      </div>
    </section>
  )
}

function CoreBenefits() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Por qué Zimplex</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>
            Todo lo que necesitas,<br />
            <span style={{ background: GRAD, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>nada de lo que no.</span>
          </h2>
          <p style={{ marginTop: 12, fontSize: 15, color: '#94A3B8', maxWidth: 440, margin: '12px auto 0', fontFamily: POPPINS }}>
            Zimplex te ayuda a ordenar tu negocio en minutos.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 20 }}>
          {coreBenefits.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{ background: 'white', borderRadius: 20, padding: 28, border: '1.5px solid #F1F5F9', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', transition: 'box-shadow 0.2s' }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon size={22} style={{ color }} />
              </div>
              <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: 8, fontSize: 15, fontFamily: POPPINS }}>{title}</h3>
              <p style={{ fontSize: 13, color: '#94A3B8', lineHeight: 1.65, fontFamily: POPPINS }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section style={{ padding: '80px 24px', background: 'linear-gradient(180deg, #EFF6FF 0%, white 100%)' }} id="como-funciona">
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <Chip>Cómo funciona</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Así de simple</h2>
          <p style={{ marginTop: 8, fontSize: 15, color: '#94A3B8', fontFamily: POPPINS }}>Sin planillas. Sin enredos.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {steps.map(({ num, title, desc }) => (
            <div key={num} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, color: 'white', fontFamily: POPPINS, boxShadow: '0 8px 20px rgba(58,134,255,0.22)' }}>
                {num}
              </div>
              <div style={{ paddingTop: 4 }}>
                <h3 style={{ fontWeight: 700, color: '#111827', marginBottom: 6, fontSize: 16, fontFamily: POPPINS }}>{title}</h3>
                <p style={{ color: '#94A3B8', lineHeight: 1.65, fontSize: 14, fontFamily: POPPINS }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 48, padding: 24, borderRadius: 20, textAlign: 'center', background: 'white', border: '1.5px solid #DBEAFE' }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: '#111827', marginBottom: 8, fontFamily: POPPINS }}>¿Cuánto demora en configurarse?</p>
          <p style={{ color: '#94A3B8', marginBottom: 20, fontSize: 14, fontFamily: POPPINS }}>
            Menos de <strong style={{ color: BLUE }}>5 minutos</strong> desde que abres la app hasta tu primera venta registrada.
          </p>
          <BtnPrimary href={SIGNUP_URL}>Quiero empezar ahora</BtnPrimary>
        </div>
      </div>
    </section>
  )
}

function EmotionalBenefits() {
  return (
    <section style={{ padding: '80px 24px', background: '#F8FAFC' }} id="beneficios">
      <div style={{ maxWidth: 820, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Beneficios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>
            Lo que cambia cuando empiezas a usarlo
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {emotionalBenefits.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: 18, background: 'white', borderRadius: 16, border: '1.5px solid #F1F5F9' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={17} style={{ color }} />
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#111827', marginBottom: 3, fontSize: 14, fontFamily: POPPINS }}>{title}</p>
                <p style={{ fontSize: 12, color: '#94A3B8', fontFamily: POPPINS }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 19, fontWeight: 700, color: '#111827', marginBottom: 24, fontFamily: POPPINS }}>Tu negocio deja de ser un caos.</p>
          <BtnPrimary href={SIGNUP_URL} style={{ fontSize: 17, padding: '16px 32px' }}>
            Empezar gratis ahora <ArrowRight size={18} />
          </BtnPrimary>
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Testimonios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>
            Lo que dicen quienes lo usan
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
          {testimonials.map(({ quote, name, role, initial }, i) => (
            <div key={name} style={{ background: 'white', borderRadius: 20, padding: 24, border: `1.5px solid ${i === 1 ? '#DBEAFE' : '#F1F5F9'}`, boxShadow: i === 1 ? '0 4px 20px rgba(58,134,255,0.08)' : '0 2px 8px rgba(0,0,0,0.03)' }}>
              <div style={{ display: 'flex', gap: 2, marginBottom: 12 }}>
                {[...Array(5)].map((_, j) => <Star key={j} size={13} fill="#F59E0B" color="#F59E0B" />)}
              </div>
              <p style={{ color: '#334155', fontSize: 14, lineHeight: 1.65, marginBottom: 16, fontFamily: POPPINS }}>{quote}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: '50%', background: GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, fontWeight: 700, fontFamily: POPPINS }}>
                  {initial}
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', fontFamily: POPPINS }}>{name}</p>
                  <p style={{ fontSize: 11, color: '#94A3B8', fontFamily: POPPINS }}>{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section style={{ padding: '80px 24px', background: '#F8FAFC' }} id="precios">
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Chip>Precios</Chip>
          <h2 style={{ marginTop: 16, fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 700, color: '#111827', fontFamily: POPPINS }}>Simple como la app</h2>
          <p style={{ marginTop: 8, fontSize: 15, color: '#94A3B8', fontFamily: POPPINS }}>Empieza gratis. Actualiza solo si lo necesitas.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
          {/* Free */}
          <div style={{ background: 'white', borderRadius: 24, padding: 28, border: '2px solid #F1F5F9' }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: '#94A3B8', marginBottom: 8, fontFamily: POPPINS, letterSpacing: '0.08em' }}>GRATIS</p>
            <p style={{ fontSize: 40, fontWeight: 800, color: '#111827', fontFamily: POPPINS, lineHeight: 1 }}>$0</p>
            <p style={{ fontSize: 13, color: '#94A3B8', margin: '6px 0 20px', fontFamily: POPPINS }}>Para empezar</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {freeFeatures.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334155', fontFamily: POPPINS }}>
                  <Check size={13} color={TEAL} strokeWidth={2.5} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
              {proExcluded.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#CBD5E1', fontFamily: POPPINS }}>
                  <X size={13} color="#CBD5E1" strokeWidth={2} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
            <p style={{ textAlign: 'center', fontSize: 11, color: '#94A3B8', marginBottom: 14, fontFamily: POPPINS }}>Gratis para siempre</p>
            <BtnSecondary href={SIGNUP_URL} style={{ width: '100%', justifyContent: 'center', fontSize: 14 }}>Empezar gratis</BtnSecondary>
          </div>

          {/* Pro */}
          <div style={{ background: GRAD, borderRadius: 24, padding: 28, position: 'relative', boxShadow: '0 20px 56px rgba(58,134,255,0.22)' }}>
            <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}>
              <span style={{ background: 'rgba(255,255,255,0.22)', backdropFilter: 'blur(8px)', color: 'white', fontSize: 11, fontWeight: 700, padding: '5px 14px', borderRadius: 999, fontFamily: POPPINS }}>
                Más elegido
              </span>
            </div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.7)', marginBottom: 8, fontFamily: POPPINS, letterSpacing: '0.08em' }}>PRO</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              <p style={{ fontSize: 40, fontWeight: 800, color: 'white', fontFamily: POPPINS, lineHeight: 1 }}>USD 5</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 4, fontFamily: POPPINS }}>/mes</p>
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '6px 0 20px', fontFamily: POPPINS }}>Para hacer crecer tu negocio</p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {proFeatures.map(t => (
                <li key={t} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'white', fontFamily: POPPINS }}>
                  <Check size={13} color="rgba(255,255,255,0.75)" strokeWidth={2.5} style={{ flexShrink: 0 }} />{t}
                </li>
              ))}
            </ul>
            <a href={UPGRADE_URL} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '14px 0', borderRadius: 14, background: 'white', color: BLUE, fontWeight: 600, fontSize: 14, textDecoration: 'none', fontFamily: POPPINS }}>
              Pasar a Pro <ChevronRight size={15} />
            </a>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: '#94A3B8', marginTop: 18, fontFamily: POPPINS }}>
          Empieza gratis. No necesitas tarjeta.
        </p>
      </div>
    </section>
  )
}

function FAQ() {
  return (
    <section style={{ padding: '80px 24px', background: 'white' }} id="faq">
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

function FinalCTA({ onLogin }) {
  return (
    <section style={{ padding: '80px 24px', background: '#0F172A' }}>
      <div style={{ maxWidth: 580, margin: '0 auto', textAlign: 'center' }}>
        <Chip style={{ background: 'rgba(58,134,255,0.15)', color: '#93C5FD', border: '1px solid rgba(58,134,255,0.2)' }}>Empieza hoy</Chip>
        <h2 style={{ marginTop: 20, fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: 'white', lineHeight: 1.2, fontFamily: POPPINS }}>
          Empieza hoy a ordenar<br />tu negocio.
        </h2>
        <p style={{ marginTop: 14, fontSize: 15, color: '#94A3B8', marginBottom: 36, fontFamily: POPPINS }}>
          No necesitas ser experto. Solo necesitas empezar.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', marginBottom: 16 }}>
          <BtnPrimary href={SIGNUP_URL} style={{ fontSize: 17, padding: '16px 36px' }}>
            Crear cuenta gratis <ArrowRight size={18} />
          </BtnPrimary>
          <BtnSecondary onClick={onLogin} style={{ fontSize: 17, padding: '16px 36px', borderColor: 'rgba(255,255,255,0.1)', color: '#94A3B8', background: 'transparent' }}>
            Ya tengo cuenta
          </BtnSecondary>
        </div>
        <p style={{ fontSize: 12, color: '#475569', fontFamily: POPPINS }}>Sin tarjeta · Sin contratos · Gratis para empezar</p>
      </div>
    </section>
  )
}

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
              <p style={{ fontWeight: 600, color: '#334155', fontSize: 12, marginBottom: 12, fontFamily: POPPINS, letterSpacing: '0.05em' }}>PRODUCTO</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[['#como-funciona','Cómo funciona'], ['#precios','Precios'], ['#faq','FAQ']].map(([href, label]) => (
                  <li key={label}><a href={href} style={{ fontSize: 13, color: '#94A3B8', textDecoration: 'none', fontFamily: POPPINS }}>{label}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p style={{ fontWeight: 600, color: '#334155', fontSize: 12, marginBottom: 12, fontFamily: POPPINS, letterSpacing: '0.05em' }}>CUENTA</p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[[SIGNUP_URL,'Crear cuenta'], [LOGIN_URL,'Iniciar sesión']].map(([href, label]) => (
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

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Landing({ onLogin }) {
  return (
    <div style={{ minHeight: '100vh', background: 'white', paddingBottom: 72, fontFamily: POPPINS }}>
      <Header onLogin={onLogin} />
      <MobileCTABar onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Problem />
      <CoreBenefits />
      <HowItWorks />
      <EmotionalBenefits />
      <Testimonials />
      <Pricing />
      <FAQ />
      <FinalCTA onLogin={onLogin} />
      <Footer />
    </div>
  )
}
