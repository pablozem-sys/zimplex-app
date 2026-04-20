export const PLANS = {
  free: {
    maxProducts: 10,
    maxMonthlySales: 50,
    features: {
      whatsappOrders: false,
    },
  },
  pro: {
    maxProducts: Infinity,
    maxMonthlySales: Infinity,
    features: {
      whatsappOrders: true,
    },
  },
}

export const UPGRADE_URL_BASE =
  'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=1d44657e88c94c5d91ccc04db531ebef'

export const getPlanLimits = (plan) => PLANS[plan] ?? PLANS.free
export const hasFeature = (plan, feature) =>
  (PLANS[plan] ?? PLANS.free).features[feature] ?? false

// Construye la URL de checkout de MP con email pre-cargado (opcional)
export const buildUpgradeUrl = (email) => {
  if (!email) return UPGRADE_URL_BASE
  return `${UPGRADE_URL_BASE}&payer_email=${encodeURIComponent(email)}`
}
