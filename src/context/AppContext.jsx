import { createContext, useContext, useState } from 'react'

const initialProducts = [
  { id: 1, name: 'Palta', price: 1000, stock: 50, description: 'Paltas frescas', lowStockThreshold: 10 },
  { id: 2, name: 'Huevos', price: 300, stock: 8, description: 'Huevos de campo', lowStockThreshold: 20 },
  { id: 3, name: 'Pan', price: 500, stock: 80, description: 'Pan artesanal', lowStockThreshold: 15 },
  { id: 4, name: 'Leche', price: 800, stock: 25, description: 'Leche fresca 1L', lowStockThreshold: 10 },
]

const today = new Date()
const fmt = (d) => d.toISOString().split('T')[0]
const daysAgo = (n) => { const d = new Date(today); d.setDate(d.getDate() - n); return fmt(d) }

const initialSales = [
  { id: 1, productId: 1, productName: 'Palta', quantity: 5, unitPrice: 1000, total: 5000, customer: 'María González', paymentMethod: 'efectivo', date: fmt(today) },
  { id: 2, productId: 3, productName: 'Pan', quantity: 4, unitPrice: 500, total: 2000, customer: 'Carlos Pérez', paymentMethod: 'transferencia', date: fmt(today) },
  { id: 3, productId: 2, productName: 'Huevos', quantity: 12, unitPrice: 300, total: 3600, customer: '', paymentMethod: 'efectivo', date: fmt(today) },
  { id: 4, productId: 1, productName: 'Palta', quantity: 3, unitPrice: 1000, total: 3000, customer: 'Ana Martínez', paymentMethod: 'tarjeta', date: daysAgo(1) },
  { id: 5, productId: 3, productName: 'Pan', quantity: 10, unitPrice: 500, total: 5000, customer: '', paymentMethod: 'efectivo', date: daysAgo(1) },
  { id: 6, productId: 4, productName: 'Leche', quantity: 8, unitPrice: 800, total: 6400, customer: 'Pedro López', paymentMethod: 'transferencia', date: daysAgo(2) },
  { id: 7, productId: 1, productName: 'Palta', quantity: 10, unitPrice: 1000, total: 10000, customer: '', paymentMethod: 'efectivo', date: daysAgo(2) },
  { id: 8, productId: 2, productName: 'Huevos', quantity: 20, unitPrice: 300, total: 6000, customer: 'Lucía Silva', paymentMethod: 'tarjeta', date: daysAgo(3) },
  { id: 9, productId: 3, productName: 'Pan', quantity: 15, unitPrice: 500, total: 7500, customer: '', paymentMethod: 'efectivo', date: daysAgo(3) },
  { id: 10, productId: 1, productName: 'Palta', quantity: 7, unitPrice: 1000, total: 7000, customer: 'Roberto Castro', paymentMethod: 'transferencia', date: daysAgo(4) },
  { id: 11, productId: 4, productName: 'Leche', quantity: 5, unitPrice: 800, total: 4000, customer: '', paymentMethod: 'efectivo', date: daysAgo(5) },
  { id: 12, productId: 2, productName: 'Huevos', quantity: 30, unitPrice: 300, total: 9000, customer: 'Valentina Rojas', paymentMethod: 'transferencia', date: daysAgo(6) },
]

const initialOrders = [
  { id: 1, customer: 'María González', productId: 1, productName: 'Palta', quantity: 5, total: 5000, status: 'pendiente', note: '', date: fmt(today) },
  { id: 2, customer: 'Carlos Pérez', productId: 3, productName: 'Pan', quantity: 10, total: 5000, status: 'pagado', note: 'Sin sal', date: fmt(today) },
  { id: 3, customer: 'Ana Martínez', productId: 2, productName: 'Huevos', quantity: 24, total: 7200, status: 'entregado', note: '', date: daysAgo(1) },
]

const initialGoals = [
  { id: 1, name: 'Vacaciones', target: 1000000, current: 320000, deadline: '2026-12-31' },
  { id: 2, name: 'Nueva vitrina', target: 200000, current: 150000, deadline: '2026-05-01' },
]

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [products, setProducts] = useState(initialProducts)
  const [sales, setSales] = useState(initialSales)
  const [orders, setOrders] = useState(initialOrders)
  const [goals, setGoals] = useState(initialGoals)
  const [activeTab, setActiveTab] = useState('dashboard')

  const addSale = (sale) => {
    const newSale = { ...sale, id: Date.now(), date: fmt(new Date()) }
    setSales(prev => [newSale, ...prev])
    setProducts(prev => prev.map(p =>
      p.id === sale.productId ? { ...p, stock: Math.max(0, p.stock - sale.quantity) } : p
    ))
  }

  const addProduct = (product) => {
    setProducts(prev => [...prev, { ...product, id: Date.now(), lowStockThreshold: 10 }])
  }

  const updateProduct = (id, data) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
  }

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  const addOrder = (order) => {
    setOrders(prev => [{ ...order, id: Date.now(), date: fmt(new Date()) }, ...prev])
  }

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const addGoal = (goal) => {
    setGoals(prev => [...prev, { ...goal, id: Date.now(), current: 0 }])
  }

  const updateGoalProgress = (id, amount) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, current: Math.min(g.target, g.current + amount) } : g))
  }

  const deleteGoal = (id) => {
    setGoals(prev => prev.filter(g => g.id !== id))
  }

  // Derived data
  const todaySales = sales.filter(s => s.date === fmt(new Date()))
  const todayTotal = todaySales.reduce((sum, s) => sum + s.total, 0)

  const currentMonth = fmt(new Date()).slice(0, 7)
  const monthSales = sales.filter(s => s.date.startsWith(currentMonth))
  const monthTotal = monthSales.reduce((sum, s) => sum + s.total, 0)

  const pendingOrders = orders.filter(o => o.status === 'pendiente').length
  const lowStockProducts = products.filter(p => p.stock <= p.lowStockThreshold).length

  // Last 7 days chart data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = daysAgo(6 - i)
    const daySales = sales.filter(s => s.date === date)
    const total = daySales.reduce((sum, s) => sum + s.total, 0)
    const label = new Date(date + 'T12:00:00').toLocaleDateString('es-CL', { weekday: 'short' })
    return { date, label: label.charAt(0).toUpperCase() + label.slice(1), total }
  })

  return (
    <AppContext.Provider value={{
      products, sales, orders, goals, activeTab, setActiveTab,
      addSale, addProduct, updateProduct, deleteProduct,
      addOrder, updateOrderStatus,
      addGoal, updateGoalProgress, deleteGoal,
      todayTotal, monthTotal, pendingOrders, lowStockProducts, last7Days,
      todaySalesCount: todaySales.length,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
