import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { THEMES, DEFAULT_THEME, applyTheme } from '../lib/themes'
import { getPlanLimits } from '../lib/plans'

const AppContext = createContext(null)

const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return fmt(d) }

export function AppProvider({ children }) {
  const [products, setProducts] = useState([])
  const [sales, setSales] = useState([])
  const [orders, setOrders] = useState([])
  const [goals, setGoals] = useState([])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState(null)
  const [plan, setPlan] = useState('free')
  const [businessName, setBusinessName] = useState('')
  const [transferDetails, setTransferDetails] = useState({
    bank: '', holder: '', rut: '', account: '', accountType: '', email: ''
  })
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem('app-theme')
      return THEMES.find(t => t.id === saved) || DEFAULT_THEME
    } catch {
      return DEFAULT_THEME
    }
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = (t) => {
    try { localStorage.setItem('app-theme', t.id) } catch { /* private mode */ }
    setThemeState(t)
  }

  // ─── GET USER ─────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? 'demo')
      setBusinessName(user?.user_metadata?.business_name || '')
      const m = user?.user_metadata || {}
      setTransferDetails({
        bank:        m.transfer_bank        || '',
        holder:      m.transfer_holder      || '',
        rut:         m.transfer_rut         || '',
        account:     m.transfer_account     || '',
        accountType: m.transfer_account_type|| '',
        email:       m.transfer_email       || '',
      })
    })
  }, [])

  // ─── LOAD DATA ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!userId) return
    loadAll()
  }, [userId])

  // ─── REFRESH PLAN al volver a la app (ej: después de pagar en MP) ─────────
  useEffect(() => {
    if (!userId) return
    const handleVisibility = async () => {
      if (document.visibilityState === 'visible') {
        const { data } = await supabase.from('profiles').select('plan').eq('id', userId).single()
        if (data?.plan) setPlan(data.plan)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [userId])

  async function loadAll() {
    setLoading(true)
    try {
      const [p, s, o, g, profile] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('sales').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
        supabase.from('goals').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('plan').eq('id', userId).single(),
      ])
      setProducts((p.data || []).map(dbToProduct))
      setSales((s.data || []).map(dbToSale))
      setOrders((o.data || []).map(dbToOrder))
      setGoals(g.data || [])
      setPlan(profile.data?.plan || 'free')
    } catch (err) {
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }

  // ─── DB MAPPERS ───────────────────────────────────────────────────────────
  const dbToProduct = (r) => ({
    id: r.id,
    name: r.name,
    price: r.price,
    stock: r.stock,
    lowStockThreshold: r.low_stock_threshold,
    description: r.description,
    unit: r.unit || 'unidades',
  })

  const dbToSale = (r) => ({
    id: r.id,
    productId: r.product_id,
    productName: r.product_name,
    quantity: r.quantity,
    unitPrice: r.unit_price,
    total: r.total_amount,
    customer: r.customer_name,
    paymentMethod: r.payment_method,
    date: r.sale_date,
  })

  const dbToOrder = (r) => ({
    id: r.id,
    customer: r.customer,
    productId: r.product_id,
    productName: r.product_name,
    quantity: r.quantity,
    total: r.total,
    status: r.status,
    note: r.note,
    date: r.date,
  })

  // ─── PLANS ────────────────────────────────────────────────────────────────
  const isPro = plan === 'pro'
  const planLimits = getPlanLimits(plan)

  // ─── PRODUCTS ─────────────────────────────────────────────────────────────
  const addProduct = async (product) => {
    if (!isPro && products.length >= planLimits.maxProducts) {
      return { error: { message: 'LIMIT_REACHED' } }
    }
    const { data, error } = await supabase.from('products').insert({
      user_id: userId,
      name: product.name,
      price: product.price,
      stock: product.stock,
      low_stock_threshold: product.lowStockThreshold ?? 0,
      description: product.description || null,
      unit: product.unit || 'unidades',
    }).select().single()
    if (!error && data) setProducts(prev => [dbToProduct(data), ...prev])
    return { error: error || null }
  }

  const updateProduct = async (id, changes) => {
    const dbChanges = {}
    if (changes.name !== undefined) dbChanges.name = changes.name
    if (changes.price !== undefined) dbChanges.price = changes.price
    if (changes.stock !== undefined) dbChanges.stock = changes.stock
    if (changes.lowStockThreshold !== undefined) dbChanges.low_stock_threshold = changes.lowStockThreshold
    if (changes.description !== undefined) dbChanges.description = changes.description
    if (changes.unit !== undefined) dbChanges.unit = changes.unit
    await supabase.from('products').update(dbChanges).eq('id', id)
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p))
  }

  const deleteProduct = async (id) => {
    await supabase.from('products').delete().eq('id', id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  // ─── SALES ────────────────────────────────────────────────────────────────
  const addSale = async (sale) => {
    if (!isPro) {
      const currentMonth = fmt(new Date()).slice(0, 7)
      const count = sales.filter(s => s.date?.startsWith(currentMonth)).length
      if (count >= planLimits.maxMonthlySales) {
        return { error: { message: 'LIMIT_REACHED' } }
      }
    }

    const { data, error } = await supabase.from('sales').insert({
      user_id: userId,
      product_id: sale.productId,
      product_name: sale.productName,
      quantity: sale.quantity,
      unit_price: sale.unitPrice,
      total_amount: sale.total,
      customer_name: sale.customer || null,
      payment_method: sale.paymentMethod,
      sale_date: fmt(new Date()),
    }).select().single()

    if (error) return { error }

    setSales(prev => [dbToSale(data), ...prev])
    const product = products.find(p => p.id === sale.productId)
    if (product) {
      await updateProduct(sale.productId, {
        stock: Math.max(0, product.stock - sale.quantity)
      })
    }
    return { error: null }
  }

  // ─── ORDERS ───────────────────────────────────────────────────────────────
  const addOrder = async (order) => {
    const { data, error } = await supabase.from('orders').insert({
      user_id: userId,
      customer: order.customer,
      product_id: order.productId || null,
      product_name: order.productName,
      quantity: order.quantity,
      total: order.total,
      status: 'pendiente',
      note: order.note || null,
      date: fmt(new Date()),
    }).select().single()
    if (!error && data) setOrders(prev => [dbToOrder(data), ...prev])
  }

  const updateOrderStatus = async (id, status) => {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  // ─── GOALS ────────────────────────────────────────────────────────────────
  const addGoal = async (goal) => {
    const { data, error } = await supabase.from('goals').insert({
      user_id: userId,
      name: goal.name,
      target: goal.target,
      current: 0,
      deadline: goal.deadline || null,
    }).select().single()
    if (!error && data) setGoals(prev => [...prev, data])
  }

  const updateGoalProgress = async (id, amount) => {
    const goal = goals.find(g => g.id === id)
    if (!goal) return
    const newCurrent = Math.min(goal.target, goal.current + amount)
    await supabase.from('goals').update({ current: newCurrent }).eq('id', id)
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: newCurrent } : g))
  }

  const deleteGoal = async (id) => {
    await supabase.from('goals').delete().eq('id', id)
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  // ─── DERIVED ─────────────────────────────────────────────────────────────
  const todayStr = fmt(new Date())
  const currentMonth = todayStr.slice(0, 7)

  const todaySales = sales.filter(s => s.date === todayStr)
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)
  const monthlySales = sales.filter(s => s.date?.startsWith(currentMonth))
  const monthTotal = monthlySales.reduce((sum, s) => sum + s.total, 0)
  const monthlySalesCount = monthlySales.length
  const pendingOrders = orders.filter(o => o.status === 'pendiente').length
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i)
    const total = sales.filter(s => s.date === date).reduce((sum, s) => sum + s.total, 0)
    const label = new Date(date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short' })
    return { date, label: label.charAt(0).toUpperCase() + label.slice(1), total }
  })

  return (
    <AppContext.Provider value={{
      products, sales, orders, goals,
      activeTab, setActiveTab,
      loading,
      theme, setTheme, themes: THEMES,
      userId, businessName, setBusinessName,
      transferDetails, setTransferDetails,
      plan, isPro, planLimits,
      monthlySalesCount,
      addSale, addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus,
      addGoal, updateGoalProgress, deleteGoal,
      todayTotal, monthTotal, pendingOrders, lowStockProducts,
      todaySalesCount: todaySales.length,
      last7Days,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
