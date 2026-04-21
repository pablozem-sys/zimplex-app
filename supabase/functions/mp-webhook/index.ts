import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const ADMIN_EMAIL = 'hola@zimplex.app'

async function alertAdmin(subject: string, body: string) {
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Zimplex Alertas <alertas@zimplex.app>',
        to: ADMIN_EMAIL,
        subject: `[Zimplex] ${subject}`,
        text: body,
      }),
    })
  } catch (err) {
    console.error('Error enviando alerta admin:', err)
  }
}

serve(async (req) => {
  if (req.method === 'GET') return new Response('ok', { status: 200 })
  try {
    const body = await req.json()
    console.log('MP webhook:', JSON.stringify(body))

    if (body.type !== 'subscription_preapproval') return new Response('ignored', { status: 200 })

    const subscriptionId = body.data?.id
    if (!subscriptionId) {
      await alertAdmin('Webhook sin ID de suscripción', `Payload recibido sin data.id:\n\n${JSON.stringify(body, null, 2)}`)
      return new Response('no id', { status: 200 })
    }

    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    })

    if (!mpRes.ok) {
      const errText = await mpRes.text()
      await alertAdmin(
        `Error consultando MP (${mpRes.status})`,
        `No se pudo obtener la suscripción ${subscriptionId} de MercadoPago.\nStatus: ${mpRes.status}\nRespuesta: ${errText}`,
      )
      return new Response('mp error', { status: 200 })
    }

    const subscription = await mpRes.json()
    console.log('Status:', subscription.status, 'external_reference:', subscription.external_reference)

    if (subscription.status !== 'authorized') {
      console.log('Suscripción no autorizada, status:', subscription.status)
      return new Response('ok', { status: 200 })
    }

    const userId = subscription.external_reference
    if (!userId) {
      await alertAdmin(
        '⚠️ Pago autorizado sin usuario — ACCIÓN REQUERIDA',
        `MercadoPago autorizó la suscripción ${subscriptionId} pero no tiene external_reference.\n\nEl usuario pagó pero NO se le activó el plan Pro.\n\nDatos de suscripción:\n${JSON.stringify(subscription, null, 2)}`,
      )
      return new Response('no user reference', { status: 200 })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ plan: 'pro', updated_at: new Date().toISOString() })
      .eq('id', userId)

    if (updateError) {
      await alertAdmin(
        '⚠️ Error activando plan Pro — ACCIÓN REQUERIDA',
        `MercadoPago autorizó el pago pero falló la actualización en Supabase.\n\nUsuario: ${userId}\nSuscripción: ${subscriptionId}\nError: ${updateError.message}\n\nActivar manualmente en Supabase:\nUPDATE profiles SET plan = 'pro' WHERE id = '${userId}';`,
      )
      return new Response('db error', { status: 500 })
    }

    await alertAdmin(
      `✅ Plan Pro activado — ${userId.slice(0, 8)}`,
      `Se activó correctamente el plan Pro.\n\nUsuario: ${userId}\nSuscripción: ${subscriptionId}\nFecha: ${new Date().toISOString()}`,
    )
    console.log('Plan Pro activado para userId:', userId)
    return new Response('ok', { status: 200 })

  } catch (err) {
    console.error('Error inesperado:', err.message)
    await alertAdmin(
      '⚠️ Error inesperado en webhook',
      `Error no controlado en mp-webhook:\n${err.message}\n\nStack: ${err.stack}`,
    )
    return new Response('error', { status: 500 })
  }
})
