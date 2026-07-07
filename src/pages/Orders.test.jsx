import { describe, it, expect } from 'vitest'
import { cleanPhone, buildWhatsAppMsg } from './Orders'

describe('cleanPhone', () => {
  it('prepends 56 to a bare Chilean mobile number', () => {
    expect(cleanPhone('912345678')).toBe('56912345678')
  })

  it('leaves a number that already has the 56 prefix untouched', () => {
    expect(cleanPhone('56912345678')).toBe('56912345678')
  })

  it('strips spaces and symbols before checking the prefix', () => {
    expect(cleanPhone('+56 9 1234 5678')).toBe('56912345678')
    expect(cleanPhone('9 1234-5678')).toBe('56912345678')
  })
})

describe('buildWhatsAppMsg', () => {
  const fmt = (n) => `$${n}`
  const items = [{ quantity: 2, productName: 'Pan', subtotal: 2000 }]

  it('includes customer name, items and total, omits note/transfer sections when absent', () => {
    const msg = buildWhatsAppMsg('Juan', items, 2000, '', {}, fmt)
    expect(msg).toContain('Hola Juan')
    expect(msg).toContain('2 × Pan — $2000')
    expect(msg).toContain('Total: $2000')
    expect(msg).not.toContain('Nota:')
    expect(msg).not.toContain('transferencia')
  })

  it('includes the note section when a note is provided', () => {
    const msg = buildWhatsAppMsg('Juan', items, 2000, 'sin sal', {}, fmt)
    expect(msg).toContain('Nota: sin sal')
  })

  it('includes only the transfer fields that are actually set', () => {
    const msg = buildWhatsAppMsg('Juan', items, 2000, '', { bank: 'Banco Estado', holder: 'Juan Perez' }, fmt)
    expect(msg).toContain('Banco: Banco Estado')
    expect(msg).toContain('Titular: Juan Perez')
    expect(msg).not.toContain('N° cuenta:')
    expect(msg).not.toContain('RUT:')
  })
})
