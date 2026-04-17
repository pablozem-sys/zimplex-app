export const THEMES = [
  {
    id: 'zimplex',
    name: 'Zimplex',
    primary: '#6366F1',
    primaryLight: '#EEF2FF',
    primaryShadow: 'rgba(99, 102, 241, 0.25)',
    gradient: 'linear-gradient(135deg, #4ADE80, #3B82F6, #6366F1)',
  },
  {
    id: 'violet',
    name: 'Violeta',
    primary: '#7C3AED',
    primaryLight: '#EDE9FE',
    primaryShadow: 'rgba(124, 58, 237, 0.25)',
    gradient: 'linear-gradient(135deg, #7C3AED, #A78BFA)',
  },
  {
    id: 'blue',
    name: 'Azul',
    primary: '#2563EB',
    primaryLight: '#DBEAFE',
    primaryShadow: 'rgba(37, 99, 235, 0.25)',
    gradient: 'linear-gradient(135deg, #2563EB, #60A5FA)',
  },
  {
    id: 'emerald',
    name: 'Verde',
    primary: '#059669',
    primaryLight: '#D1FAE5',
    primaryShadow: 'rgba(5, 150, 105, 0.25)',
    gradient: 'linear-gradient(135deg, #059669, #34D399)',
  },
  {
    id: 'rose',
    name: 'Rosa',
    primary: '#DB2777',
    primaryLight: '#FCE7F3',
    primaryShadow: 'rgba(219, 39, 119, 0.25)',
    gradient: 'linear-gradient(135deg, #DB2777, #F472B6)',
  },
  {
    id: 'orange',
    name: 'Naranja',
    primary: '#EA580C',
    primaryLight: '#FFEDD5',
    primaryShadow: 'rgba(234, 88, 12, 0.25)',
    gradient: 'linear-gradient(135deg, #EA580C, #FB923C)',
  },
]

export const DEFAULT_THEME = THEMES[0]

export function applyTheme(theme) {
  const root = document.documentElement
  root.style.setProperty('--color-primary', theme.primary)
  root.style.setProperty('--color-primary-light', theme.primaryLight)
  root.style.setProperty('--color-primary-shadow', theme.primaryShadow)
  root.style.setProperty('--color-gradient', theme.gradient)
}
