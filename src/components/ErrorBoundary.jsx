import { Component } from 'react'
import * as Sentry from '@sentry/react'
import { RefreshCw } from 'lucide-react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('App error:', error, info)
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center" style={{ background: '#FAF8FF' }}>
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <RefreshCw size={28} className="text-red-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">Algo salió mal</h2>
          <p className="text-sm text-gray-400 mb-6">Hubo un error inesperado. Por favor recarga la página.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #6366F1, #818CF8)' }}
          >
            Recargar
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
