import { describe, it, expect } from 'vitest'
import { getPlanLimits, hasFeature, buildUpgradeUrl, PLANS } from './plans'

describe('getPlanLimits', () => {
  it('returns the pro plan limits for "pro"', () => {
    expect(getPlanLimits('pro')).toBe(PLANS.pro)
  })

  it('falls back to free plan for an unknown plan value', () => {
    expect(getPlanLimits('nonexistent')).toBe(PLANS.free)
  })

  it('falls back to free plan when plan is undefined', () => {
    expect(getPlanLimits(undefined)).toBe(PLANS.free)
  })
})

describe('hasFeature', () => {
  it('free plan does not have whatsappOrders', () => {
    expect(hasFeature('free', 'whatsappOrders')).toBe(false)
  })

  it('pro plan has whatsappOrders', () => {
    expect(hasFeature('pro', 'whatsappOrders')).toBe(true)
  })

  it('returns false for an unknown feature key', () => {
    expect(hasFeature('pro', 'unknownFeature')).toBe(false)
  })
})

describe('buildUpgradeUrl', () => {
  it('returns the base URL with no email', () => {
    expect(buildUpgradeUrl(undefined)).toBe(
      'https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=1d44657e88c94c5d91ccc04db531ebef'
    )
  })

  it('appends the encoded email as payer_email when provided', () => {
    const url = buildUpgradeUrl('user+test@example.com')
    expect(url).toContain('payer_email=user%2Btest%40example.com')
  })
})
