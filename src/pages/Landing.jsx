import {
  ShoppingBag, ArrowRight, CheckCircle2, TrendingUp, Package,
  MessageCircle, BarChart2, AlertCircle, Zap, Clock, DollarSign,
  Star, ChevronRight, X, Check
} from 'lucide-react'

const SIGNUP_URL  = 'https://minegociosimple.vercel.app/signup'
const LOGIN_URL   = 'https://minegociosimple.vercel.app/login'
const UPGRADE_URL = 'https://minegociosimple.lemonsqueezy.com/checkout/buy/ef3fd402-6b9a-4693-9c4b-5a4974929973'

// ─── DATA ───────────────────────────────────────────────────────────────────

const problems = [
  { icon: DollarSign, text: 'No sabes cuánto ganas realmente', color: '#EF4444', bg: '#FEF2F2' },
  { icon: MessageCircle, text: 'Pierdes pedidos en el chat de WhatsApp', color: '#F59E0B', bg: '#FFFBEB' },
  { icon: Package, text: 'No controlas cuánto stock te queda', color: '#8B5CF6', bg: '#F5F3FF' },
  { icon: AlertCircle, text: 'Manejas todo en tu cabeza o en Excel', color: '#EC4899', bg: '#FDF2F8' },
]

const solutions = [
  { icon: TrendingUp, title: 'Registra ventas en segundos', desc: 'Sin planillas, sin fórmulas. Tocas tres botones y la venta queda guardada.', color: '#2563EB', bg: '#EFF6FF' },
  { icon: BarChart2, title: 'Visualiza tu negocio en tiempo real', desc: 'Cuánto ganaste hoy, esta semana y este mes. Todo visible de un vistazo.', color: '#059669', bg: '#ECFDF5' },
  { icon: Package, title: 'Controla el stock automáticamente', desc: 'Cada venta descuenta del stock. Recibes una alerta cuando algo se está por agotar.', color: '#D97706', bg: '#FFFBEB' },
  { icon: ShoppingBag, title: 'Todo en un solo lugar', desc: 'Ventas, pedidos, productos y metas. Sin saltar entre apps ni chats.', color: '#7C3AED', bg: '#F5F3FF' },
]

const steps = [
  { num: '01', title: 'Registra tus ventas', desc: 'Cada vez que vendes, lo cargas en segundos. Producto, cantidad, forma de pago.' },
  { num: '02', title: 'Visualiza tu negocio', desc: 'Un dashboard simple te muestra cuánto ganas, qué vendes más y cómo va tu mes.' },
  { num: '03', title: 'Toma mejores decisiones', desc: 'Con datos claros, sabes qué producto empujar, cuándo reponer y cuánto puedes gastar.' },
]

const benefits = [
  { icon: Clock, title: 'Ahorras tiempo', desc: 'Lo que antes te llevaba una hora en Excel, ahora son segundos.' },
  { icon: AlertCircle, title: 'Menos errores', desc: 'Sin números a mano, sin fórmulas rotas, sin olvidos.' },
  { icon: DollarSign, title: 'Claridad financiera', desc: 'Sabes exactamente cuánto entra, cuánto sale y cuánto ganas.' },
  { icon: TrendingUp, title: 'Crece con datos', desc: 'Tomas decisiones basadas en números reales, no en intuición.' },
]

const freeFeatures = [
  { text: 'Registro de ventas', included: true },
  { text: 'Control básico de ingresos', included: true },
  { text: 'Visualización simple', included: true },
  { text: 'Hasta 100 registros por mes', included: true },
  { text: 'Control de stock avanzado', included: false },
  { text: 'Reportes completos', included: false },
  { text: 'Integración pedidos WhatsApp', included: false },
  { text: 'Soporte prioritario', included: false },
]

const proFeatures = [
  { text: 'Todo del plan gratis', included: true },
  { text: 'Ventas ilimitadas', included: true },
  { text: 'Control de stock avanzado', included: true },
  { text: 'Reportes completos', included: true },
  { text: 'Integración pedidos WhatsApp', included: true },
  { text: 'Insights automáticos', included: true },
  { text: 'Exportar datos', included: true },
  { text: 'Soporte prioritario', included: true },
]

// ─── SECTIONS ───────────────────────────────────────────────────────────────

function Header({ onLogin }) {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #2563EB, #60A5FA)' }}>
            <ShoppingBag size={16} color="white" />
          </div>
          <span className="font-bold text-gray-900">Mi Negocio Simple</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onLogin}
            className="text-sm font-medium text-gray-500 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            Iniciar sesión
          </button>
          <a href={SIGNUP_URL}
            className="text-sm font-semibold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90"
            style={{ background: '#2563EB' }}>
            Empezar gratis
          </a>
        </div>
      </div>
    </header>
  )
}

function Hero({ onLogin }) {
  return (
    <section className="max-w-6xl mx-auto px-5 pt-20 pb-24 text-center">
      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 text-xs font-semibold px-4 py-1.5 rounded-full mb-7 border border-blue-100">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
        Para emprendedores que venden por WhatsApp, Instagram o en persona
      </div>

      <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
        Ordena tu negocio<br />
        <span style={{ color: '#2563EB' }}>en minutos, sin Excel</span>
      </h1>

      <p className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
        Registra tus ventas, controla tu dinero y entiende cuánto ganas realmente. Sin complicaciones.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
        <a href={SIGNUP_URL}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: '#2563EB', boxShadow: '0 12px 32px rgba(37,99,235,0.3)' }}>
          Empezar gratis
          <ArrowRight size={18} />
        </a>
        <button
          onClick={onLogin}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-gray-600 font-semibold text-base bg-white border border-gray-200 hover:border-gray-300 transition-all">
          Ya tengo cuenta
        </button>
      </div>

      {/* Social proof */}
      <div className="flex flex-wrap justify-center gap-3">
        {['Sin tarjeta de crédito', 'Gratis para empezar', 'Listo en 2 minutos'].map(t => (
          <span key={t} className="flex items-center gap-1.5 text-sm text-gray-400">
            <CheckCircle2 size={14} className="text-emerald-500" />
            {t}
          </span>
        ))}
      </div>
    </section>
  )
}

function Problem() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">El problema</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            ¿Te suena familiar?
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {problems.map(({ icon: Icon, text, color, bg }) => (
            <div key={text} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: bg }}>
                <Icon size={20} style={{ color }} />
              </div>
              <p className="text-gray-700 font-medium text-sm leading-snug">{text}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-gray-400 mt-8 text-sm">
          Si te identificas con alguno de estos, Mi Negocio Simple es para ti.
        </p>
      </div>
    </section>
  )
}

function Solution() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">La solución</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Simple, claro, y en tu bolsillo
          </h2>
          <p className="text-gray-400 mt-3 max-w-md mx-auto">
            Todo lo que necesitas para entender tu negocio, sin necesitar ser contador.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {solutions.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="flex gap-4 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
                <Icon size={22} style={{ color }} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-5">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Cómo funciona</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Tres pasos. Nada más.
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-6 relative">
          {/* connector line desktop */}
          <div className="hidden md:block absolute top-8 left-[calc(16.666%+1.5rem)] right-[calc(16.666%+1.5rem)] h-0.5 bg-gray-200" />

          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex-1 text-center relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 font-bold text-lg text-white relative z-10"
                style={{ background: '#2563EB', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' }}>
                {num}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Benefits() {
  return (
    <section className="py-20">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-blue-500 uppercase tracking-widest mb-3">Beneficios</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Lo que ganas al usarlo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {benefits.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="text-center p-6 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-blue-50">
                <Icon size={22} style={{ color: '#2563EB' }} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-3">Precios</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Sin sorpresas
          </h2>
          <p className="text-gray-400 mt-3">Empieza gratis. Pasa a Pro cuando estés listo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Free */}
          <div className="bg-white rounded-3xl p-7 border border-gray-200 shadow-sm">
            <p className="text-sm font-semibold text-gray-400 mb-4">GRATIS</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-extrabold text-gray-900">$0</span>
            </div>
            <p className="text-sm text-gray-400 mb-7">Para siempre</p>

            <a href={SIGNUP_URL}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm hover:border-gray-300 hover:bg-gray-50 transition-all mb-7">
              Empezar gratis
            </a>

            <ul className="space-y-3">
              {freeFeatures.map(({ text, included }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  {included
                    ? <Check size={16} className="text-emerald-500 shrink-0" />
                    : <X size={16} className="text-gray-300 shrink-0" />}
                  <span className={included ? 'text-gray-700' : 'text-gray-300'}>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="rounded-3xl p-7 border-2 shadow-xl relative overflow-hidden"
            style={{ background: '#2563EB', borderColor: '#2563EB', boxShadow: '0 20px 60px rgba(37,99,235,0.3)' }}>

            {/* Recommended badge */}
            <div className="absolute top-5 right-5 bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
              Recomendado
            </div>

            <p className="text-sm font-semibold text-blue-200 mb-4">PRO</p>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-4xl font-extrabold text-white">$5</span>
              <span className="text-blue-200 mb-1.5">USD / mes</span>
            </div>
            <p className="text-sm text-blue-200 mb-7">Todo lo que necesitas para crecer</p>

            <a href={UPGRADE_URL} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-white font-semibold text-sm hover:bg-blue-50 transition-all mb-7"
              style={{ color: '#2563EB' }}>
              Pasar a Pro
              <ChevronRight size={16} />
            </a>

            <ul className="space-y-3">
              {proFeatures.map(({ text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <Check size={16} className="text-blue-200 shrink-0" />
                  <span className="text-white">{text}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </section>
  )
}

function Testimonial() {
  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto px-5 text-center">
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={20} fill="#F59E0B" color="#F59E0B" />
          ))}
        </div>
        <blockquote className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug mb-6">
          "Antes no sabía cuánto ganaba. Ahora tengo todo claro en un solo lugar."
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
            M
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">María González</p>
            <p className="text-xs text-gray-400">Emprendedora, venta de ropa online</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-3xl mx-auto text-center rounded-3xl p-12"
        style={{ background: 'linear-gradient(135deg, #1D4ED8, #2563EB, #3B82F6)' }}>
        <Zap size={32} color="white" className="mx-auto mb-5 opacity-80" />
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Empieza hoy a ordenar tu negocio
        </h2>
        <p className="text-blue-100 mb-8 max-w-md mx-auto">
          Miles de emprendedores ya entienden su negocio. Únete gratis, en menos de 2 minutos.
        </p>
        <a href={SIGNUP_URL}
          className="inline-flex items-center gap-2 px-8 py-4 bg-white font-bold rounded-2xl text-base transition-all hover:bg-blue-50 active:scale-[0.98]"
          style={{ color: '#2563EB' }}>
          Crear cuenta gratis
          <ArrowRight size={18} />
        </a>
        <p className="text-blue-200 text-xs mt-4">Sin tarjeta de crédito · Gratis para siempre</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-gray-100 py-8 text-center">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="w-6 h-6 rounded-md flex items-center justify-center"
          style={{ background: '#2563EB' }}>
          <ShoppingBag size={12} color="white" />
        </div>
        <span className="text-sm font-semibold text-gray-700">Mi Negocio Simple</span>
      </div>
      <p className="text-xs text-gray-400">© {new Date().getFullYear()} Mi Negocio Simple · Hecho para emprendedores reales</p>
    </footer>
  )
}

// ─── MAIN ────────────────────────────────────────────────────────────────────

export default function Landing({ onLogin }) {
  return (
    <div className="min-h-screen bg-white">
      <Header onLogin={onLogin} />
      <Hero onLogin={onLogin} />
      <Problem />
      <Solution />
      <HowItWorks />
      <Benefits />
      <Pricing />
      <Testimonial />
      <FinalCTA />
      <Footer />
    </div>
  )
}
