import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN        = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL           = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, content-type',
}

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } })

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    // ── Auth ─────────────────────────────────────────────────────────────────
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) return json({ error: 'No autorizado' }, 401)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (authError || !user) return json({ error: 'Usuario inválido' }, 401)

    // ── Input ─────────────────────────────────────────────────────────────────
    const { orderId } = await req.json()
    if (!orderId) return json({ error: 'orderId requerido' }, 400)

    // ── Ownership: leer pedido desde BD, nunca confiar en montos del frontend ─
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, customer, customer_phone, product_name, quantity, total, note, status, payment_link, mercadopago_preference_id')
      .eq('id', orderId)
      .eq('user_id', user.id)   // ownership check
      .single()

    if (orderError || !order) return json({ error: 'Pedido no encontrado' }, 404)

    // Si ya tiene link, devolverlo sin generar uno nuevo
    if (order.payment_link) {
      return json({ payment_link: order.payment_link, preference_id: order.mercadopago_preference_id })
    }

    // ── Crear preferencia en Mercado Pago ─────────────────────────────────────
    const preference = {
      items: [{
        id: orderId,
        title: order.product_name ?? 'Pedido',
        quantity: 1,
        unit_price: Number(order.total),  // monto de BD, siempre entero para CLP
        currency_id: 'CLP',
      }],
      payer: {
        name: order.customer ?? 'Cliente',
      },
      external_reference: orderId,
      notification_url: `${SUPABASE_URL}/functions/v1/mp-order-webhook`,
      back_urls: {
        success: 'https://zimplex.app',
        failure: 'https://zimplex.app',
        pending: 'https://zimplex.app',
      },
    }

    console.log('Creando preferencia MP:', JSON.stringify(preference))

    const mpRes = await fetch('https://api.mercadopago.com/checkout/preferences', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${MP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preference),
    })

    const mpData = await mpRes.json()
    console.log('MP response status:', mpRes.status, JSON.stringify(mpData).slice(0, 300))

    if (!mpRes.ok) {
      return json({ error: 'Error MP', detail: mpData }, 502)
    }

    // ── Guardar en BD ─────────────────────────────────────────────────────────
    await supabase.from('orders').update({
      mercadopago_preference_id: mpData.id,
      payment_link: mpData.init_point,
      external_reference: orderId,
      payment_link_generated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq('id', orderId)

    return json({ payment_link: mpData.init_point, preference_id: mpData.id })

  } catch (err) {
    console.error('Error:', err)
    return json({ error: 'Error interno' }, 500)
  }
})
