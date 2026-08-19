import { describe, it, expect } from 'vitest'
import { computeStockDeltas } from './AppContext'

// Regression: ISSUE-005 — editar un pedido ya pagado no ajustaba el stock,
// y un delete posterior (que restaura stock según los items vigentes)
// terminaba "creando" stock de la nada.
// Found by /qa on 2026-08-19
// Report: .gstack/qa-reports/qa-report-zimplex-app-2026-08-19.md
describe('computeStockDeltas', () => {
  it('returns a positive delta when the edited quantity increases', () => {
    // Producto con stock 10 → pedido pagado de 2 unidades (stock ya en 8) →
    // se sube la cantidad a 5. Debe descontarse 3 más (delta = +3), para que
    // el stock final quede en 5 (10 - 5), no en 8.
    const before = [{ productId: 'p1', quantity: 2 }]
    const after = [{ productId: 'p1', quantity: 5 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.get('p1')).toBe(3)
  })

  it('returns a negative delta when the edited quantity decreases', () => {
    const before = [{ productId: 'p1', quantity: 5 }]
    const after = [{ productId: 'p1', quantity: 2 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.get('p1')).toBe(-3)
  })

  it('omits products whose quantity did not change', () => {
    const before = [{ productId: 'p1', quantity: 2 }]
    const after = [{ productId: 'p1', quantity: 2 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.has('p1')).toBe(false)
  })

  it('treats a removed product as a full negative delta (stock restored)', () => {
    const before = [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 1 }]
    const after = [{ productId: 'p2', quantity: 1 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.get('p1')).toBe(-2)
    expect(deltas.has('p2')).toBe(false)
  })

  it('treats a newly added product as a full positive delta', () => {
    const before = [{ productId: 'p1', quantity: 2 }]
    const after = [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 4 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.has('p1')).toBe(false)
    expect(deltas.get('p2')).toBe(4)
  })

  it('sums duplicate line items for the same product before diffing', () => {
    const before = [{ productId: 'p1', quantity: 1 }, { productId: 'p1', quantity: 1 }]
    const after = [{ productId: 'p1', quantity: 5 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.get('p1')).toBe(3)
  })

  it('ignores items without a productId (free-text products do not affect stock)', () => {
    const before = [{ productId: null, quantity: 2 }]
    const after = [{ productId: null, quantity: 9 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.size).toBe(0)
  })

  it('returns an empty map when nothing changed', () => {
    const before = [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 3 }]
    const after = [{ productId: 'p1', quantity: 2 }, { productId: 'p2', quantity: 3 }]
    const deltas = computeStockDeltas(before, after)
    expect(deltas.size).toBe(0)
  })
})
