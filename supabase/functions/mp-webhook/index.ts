import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const MP_ACCESS_TOKEN = Deno.env.get('MP_ACCESS_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'GET') {
    return new Response('ok', { status: 200 })
  }

  try {
    const body = await req.json()
    console.log('MP webhook recibido:', JSON.stringify(body))

    if (body.type !== 'subscription_preapproval') {
      return new Response('ignored', { status: 200 })
    }

    const subscriptionId = body.data?.id
    if (!subscriptionId) {
      return new Response('no id', { status: 200 })
    }

    const mpRes = await fetch(`https://api.mercadopago.com/preapproval/${subscriptionId}`, {
      headers: { 'Authorization': `Bearer ${MP_ACCESS_TOKEN}` },
    })

    if (!mpRes.ok) {
      console.error('Error al obtener suscripción de MP:', mpRes.status)
      return new Response('mp error', { status: 200 })
    }

    const subscription = await mpRes.json()

    // Log completo para debuggear estructura
    console.log('Subscription completa:', JSON.stringify(subscription))

    // Buscar email en múltiples ubicaciones posibles de la respuesta MP
    const payerEmail =
      subscription.payer_email ||
      subscription.payer?.email ||
      subscription.payer?.identification?.email ||
      null

    console.log('Status:', subscription.status, '| Email:', payerEmail)

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

    if (subscription.status === 'authorized') {
      if (!payerEmail) {
        console.error('Sin email del pagador — subscription:', JSON.stringify(subscription))
        return new Response('no email', { status: 200 })
      }

      const { data: users, error: userError } = await supabase.auth.admin.listUsers()
      if (userError) {
        console.error('Error listando usuarios:', userError)
        return new Response('user error', { status: 200 })
      }

      const user = users.users.find(u => u.email?.toLowerCase() === payerEmail.toLowerCase())
      if (!user) {
        console.error('Usuario no encontrado para email:', payerEmail)
        return new Response('user not found', { status: 200 })
      }

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          email: user.email,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          plan: 'pro',
        }, { onConflict: 'id' })

      if (updateError) {
        console.error('Error actualizando plan:', updateError)
        return new Response('update error', { status: 500 })
      }

      console.log('Plan Pro activado para:', payerEmail)

    } else if (subscription.status === 'cancelled' || subscription.status === 'paused') {
      if (payerEmail) {
        const { data: users } = await supabase.auth.admin.listUsers()
        const user = users?.users.find(u => u.email?.toLowerCase() === payerEmail.toLowerCase())
        if (user) {
          await supabase.from('profiles').update({ plan: 'free', updated_at: new Date().toISOString() }).eq('id', user.id)
          console.log('Plan revertido a free para:', payerEmail)
        }
      }
    }

    return new Response('ok', { status: 200 })

  } catch (err) {
    console.error('Error en webhook:', err)
    return new Response('error', { status: 500 })
  }
})
