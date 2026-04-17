import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN       = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL          = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // MP envía GET para verificar que el endpoint existe
  if (req.method === 'GET') return new Response('ok', { status: 200 })

  try {
    const body = await req.json()
    console.log('mp-order-webhook:', JSON.stringify(body))

    // Solo procesar notificaciones de pago
    if (body.type !== 'payment') return new Response('ignored', { status: 200 })

    const paymentId = String(body.data?.id ?? '')
    if (!paymentId) return new Response('no payment id', { status: 200 })

    // ── Obtener detalles del pago desde MP ────────────────────────────────────
    const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    })
    if (!mpRes.ok) {
      console.error('MP fetch error:', mpRes.status)
      return new Response('mp error', { status: 200 })
    }
    const payment = await mpRes.json()
    console.log('payment status:', payment.status, 'ref:', payment.external_reference)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)

    // ── Idempotencia: verificar si este payment_id ya fue procesado ───────────
    const { data: alreadyProcessed } = await supabase
      .from('orders')
      .select('id')
      .eq('mercadopago_payment_id', paymentId)
      .maybeSingle()

    if (alreadyProcessed) {
      console.log('payment ya procesado, skip')
      return new Response('already processed', { status: 200 })
    }

    // ── Buscar pedido por external_reference ─────────────────────────────────
    const orderId = payment.external_reference
    if (!orderId) {
      console.error('sin external_reference')
      return new Response('no reference', { status: 200 })
    }

    const { data: order } = await supabase
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .maybeSingle()

    if (!order) {
      console.error('pedido no encontrado:', orderId)
      return new Response('order not found', { status: 200 })
    }

    // No retroceder un pedido que ya fue entregado
    if (order.status === 'entregado') {
      return new Response('order already delivered', { status: 200 })
    }

    // ── Actualizar pedido según estado del pago ───────────────────────────────
    type OrderUpdate = {
      mercadopago_payment_id: string
      updated_at: string
      payment_status: string
      status?: string
    }

    const updates: OrderUpdate = {
      mercadopago_payment_id: paymentId,
      updated_at: new Date().toISOString(),
      payment_status: payment.status,
    }

    if (payment.status === 'approved') {
      updates.status = 'pagado'
    }
    // rejected / cancelled: solo actualiza payment_status, no cambia status del pedido

    const { error: updateError } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', orderId)

    if (updateError) console.error('update error:', updateError.message)
    else console.log('pedido actualizado:', orderId, updates)

    return new Response('ok', { status: 200 })

  } catch (err) {
    console.error('webhook error:', err)
    // Siempre responder 200 a MP para que no reintente indefinidamente
    return new Response('error', { status: 200 })
  }
})
