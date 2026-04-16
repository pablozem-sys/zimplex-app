import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const TO_EMAIL = 'pablozem@gmail.com'

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS })
  }

  try {
    const raw = await req.json()

    const esc = (s) => String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')

    const nombre  = esc(raw.nombre)
    const email   = String(raw.email ?? '').trim()
    const tipo    = esc(raw.tipo)
    const asunto  = esc(raw.asunto)
    const mensaje = esc(raw.mensaje)
    const origen  = esc(raw.origen)
    const user_id = esc(raw.user_id)
    const negocio = esc(raw.negocio)
    const pagina  = esc(raw.pagina)

    if (!raw.nombre?.trim() || !raw.email?.trim() || !raw.mensaje?.trim()) {
      return new Response(JSON.stringify({ error: 'Campos requeridos faltantes' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    const isApp = origen === 'app'
    const timestamp = new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })

    const metadataRows = isApp ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;width:130px;">
          <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Negocio</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:14px;color:#111827;">${negocio || '—'}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Sección</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:14px;color:#111827;">${pagina || '—'}</span>
        </td>
      </tr>
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">User ID</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:12px;color:#6B7280;font-family:monospace;">${user_id || '—'}</span>
        </td>
      </tr>` : ''

    const asuntoRow = asunto ? `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Asunto</span>
        </td>
        <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
          <span style="font-size:14px;color:#111827;font-weight:500;">${asunto}</span>
        </td>
      </tr>` : ''

    const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:580px;margin:0 auto;">
      <div style="background:linear-gradient(135deg,#7C3AED,#A78BFA);padding:28px 32px;border-radius:16px 16px 0 0;">
        <p style="color:rgba(255,255,255,.7);font-size:12px;margin:0 0 4px;text-transform:uppercase;letter-spacing:.08em;">
          ${isApp ? 'App autenticada' : 'Landing pública'}
        </p>
        <h1 style="color:white;margin:0;font-size:22px;font-weight:700;">Nueva solicitud de soporte</h1>
      </div>

      <div style="background:#FAFAFA;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 16px 16px;padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;width:130px;">
              <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Nombre</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
              <span style="font-size:14px;color:#111827;font-weight:500;">${nombre}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
              <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Email</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
              <a href="mailto:${email}" style="font-size:14px;color:#7C3AED;font-weight:500;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
              <span style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;">Tipo</span>
            </td>
            <td style="padding:10px 0;border-bottom:1px solid #F3F4F6;">
              <span style="font-size:14px;color:#111827;">${tipo || '—'}</span>
            </td>
          </tr>
          ${asuntoRow}
          ${metadataRows}
        </table>

        <div style="margin-top:24px;">
          <p style="font-size:11px;font-weight:600;color:#9CA3AF;text-transform:uppercase;letter-spacing:.05em;margin:0 0 10px;">Mensaje</p>
          <div style="background:white;border:1.5px solid #E5E7EB;border-radius:12px;padding:18px;">
            <p style="font-size:14px;color:#374151;line-height:1.75;margin:0;white-space:pre-wrap;">${mensaje}</p>
          </div>
        </div>

        <div style="margin-top:24px;text-align:center;">
          <a href="mailto:${email}?subject=Re: ${asunto || tipo || 'Tu consulta'}"
             style="display:inline-block;background:#7C3AED;color:white;font-weight:600;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
            Responder a ${nombre}
          </a>
        </div>

        <p style="font-size:11px;color:#9CA3AF;text-align:center;margin-top:20px;border-top:1px solid #F3F4F6;padding-top:16px;">
          ${timestamp} · Zimplex Soporte
        </p>
      </div>
    </div>`

    const subject = isApp
      ? `[App] ${asunto || tipo} — ${nombre}`
      : `[Web] ${tipo} — ${nombre}`

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'Zimplex Soporte <onboarding@resend.dev>',
        to: [TO_EMAIL],
        reply_to: email,
        subject,
        html,
      }),
    })

    if (!resendRes.ok) {
      const err = await resendRes.json()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Error al enviar el email' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    })

  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }
})
