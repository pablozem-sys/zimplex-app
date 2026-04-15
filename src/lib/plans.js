export const PLANS = {
  free: {
    maxProducts: 3,
    maxMonthlySales: 20,
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
  'https://minegociosimple.lemonsqueezy.com/checkout/buy/ef3fd402-6b9a-4693-9c4b-5a4974929973'

export const getPlanLimits = (plan) => PLANS[plan] ?? PLANS.free
export const hasFeature = (plan, feature) =>
  (PLANS[plan] ?? PLANS.free).features[feature] ?? false
