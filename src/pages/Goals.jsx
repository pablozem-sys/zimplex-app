import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Plus, Target, X, Trash2 } from 'lucide-react'

const fmt = (n) => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(n)

function CreateGoalModal({ onClose, onAdd }) {
  const [form, setForm] = useState({ name: '', target: '', deadline: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd({ name: form.name, target: parseInt(form.target), deadline: form.deadline })
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">Crear meta</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Nombre de la meta</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Ej: Vacaciones, nuevo equipo..."
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Monto objetivo</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
              <input required type="number" value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))}
                placeholder="0"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Fecha objetivo</label>
            <input required type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
          </div>
          <button type="submit" className="w-full bg-[#2D68F6] text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all mt-2">
            Crear meta
          </button>
        </form>
      </div>
    </div>
  )
}

function AddFundsModal({ goal, onClose, onAdd }) {
  const [amount, setAmount] = useState('')

  const suggestions = [5000, 10000, 20000, 50000]

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-gray-900">Agregar progreso</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
            <X size={16} className="text-gray-500" />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-5">{goal.name} · Faltan {fmt(goal.target - goal.current)}</p>

        <div className="relative mb-4">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">$</span>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
            placeholder="0"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3.5 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#2D68F6] focus:border-transparent" />
        </div>

        <div className="flex gap-2 mb-5">
          {suggestions.map(s => (
            <button key={s} onClick={() => setAmount(s)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${parseInt(amount) === s ? 'bg-[#2D68F6] text-white' : 'bg-gray-100 text-gray-600'}`}>
              +{s >= 1000 ? `${s / 1000}k` : s}
            </button>
          ))}
        </div>

        <button onClick={() => { onAdd(goal.id, parseInt(amount) || 0); onClose() }}
          disabled={!amount || parseInt(amount) <= 0}
          className="w-full bg-[#2D68F6] disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl active:scale-[0.98] transition-all">
          Agregar {amount ? fmt(parseInt(amount)) : ''}
        </button>
      </div>
    </div>
  )
}

export default function Goals() {
  const { goals, addGoal, updateGoalProgress, deleteGoal, monthTotal } = useApp()
  const [showCreate, setShowCreate] = useState(false)
  const [addingTo, setAddingTo] = useState(null)

  const totalGoals = goals.reduce((sum, g) => sum + g.target, 0)
  const totalAchieved = goals.reduce((sum, g) => sum + g.current, 0)
  const overallProgress = totalGoals > 0 ? (totalAchieved / totalGoals) * 100 : 0

  return (
    <div className="page-content">
      <div className="flex items-center justify-between pt-2 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Metas</h1>
          <p className="text-sm text-gray-400 mt-0.5">{goals.length} metas activas</p>
        </div>
        <button onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 bg-[#2D68F6] text-white text-sm font-semibold px-4 py-2 rounded-xl active:scale-95 transition-all shadow-sm shadow-blue-200">
          <Plus size={16} />
          Nueva
        </button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="bg-gradient-to-br from-[#2D68F6] to-[#5794F7] rounded-2xl p-5 mb-5 text-white">
          <p className="text-sm font-medium text-blue-100 mb-1">Progreso total</p>
          <p className="text-3xl font-bold mb-1">{fmt(totalAchieved)}</p>
          <p className="text-sm text-blue-200 mb-4">de {fmt(totalGoals)}</p>
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="bg-white h-full rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, overallProgress)}%` }} />
          </div>
          <p className="text-right text-xs text-blue-200 mt-1">{overallProgress.toFixed(0)}%</p>
        </div>
      )}

      <div className="space-y-3">
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <Target size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="text-sm font-medium">Sin metas aún</p>
            <p className="text-xs mt-1">Crea tu primera meta financiera</p>
          </div>
        ) : (
          goals.map(goal => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onAdd={() => setAddingTo(goal)}
              onDelete={() => deleteGoal(goal.id)}
            />
          ))
        )}
      </div>

      {showCreate && <CreateGoalModal onClose={() => setShowCreate(false)} onAdd={addGoal} />}
      {addingTo && <AddFundsModal goal={addingTo} onClose={() => setAddingTo(null)} onAdd={updateGoalProgress} />}
    </div>
  )
}

function GoalCard({ goal, onAdd, onDelete }) {
  const progress = Math.min(100, (goal.current / goal.target) * 100)
  const remaining = goal.target - goal.current
  const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24))
  const done = progress >= 100

  const barColor = done ? '#7CD09B' : progress > 60 ? '#2D68F6' : progress > 30 ? '#5794F7' : '#DC4B56'

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${done ? 'bg-green-50' : 'bg-blue-50'}`}>
            <Target size={18} className={done ? 'text-[#7CD09B]' : 'text-[#2D68F6]'} />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{goal.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">
              {done ? '¡Meta cumplida! 🎉' : `Faltan ${daysLeft > 0 ? `${daysLeft} días` : 'plazo vencido'}`}
            </p>
          </div>
        </div>
        <button onClick={onDelete} className="w-7 h-7 rounded-lg bg-gray-50 flex items-center justify-center active:scale-95">
          <Trash2 size={13} className="text-gray-300" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
          <span className="font-medium text-gray-900">{fmt(goal.current)}</span>
          <span className="text-gray-400">{fmt(goal.target)}</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width: `${progress}%`, backgroundColor: barColor }} />
        </div>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs text-gray-400">
            {done ? 'Completado' : `Faltan ${fmt(remaining)}`}
          </span>
          <span className="text-xs font-bold" style={{ color: barColor }}>{progress.toFixed(0)}%</span>
        </div>
      </div>

      {!done && (
        <button onClick={onAdd}
          className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold py-2.5 rounded-xl active:scale-95 transition-all hover:bg-blue-50 hover:border-blue-200 hover:text-[#2D68F6]">
          + Agregar progreso
        </button>
      )}
    </div>
  )
}
