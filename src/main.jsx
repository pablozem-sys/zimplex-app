import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  enabled: !!import.meta.env.VITE_SENTRY_DSN && import.meta.env.PROD,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.2,
  beforeSend(event) {
    // No reportar errores de red o de extensiones del navegador
    if (event.exception?.values?.[0]?.value?.includes('NetworkError')) return null
    if (event.exception?.values?.[0]?.value?.includes('chrome-extension')) return null
    return event
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
