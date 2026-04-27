import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const SUPABASE_URL       = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY  = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `Eres el asistente de inventario de Zimplex para comercios chilenos. Recibes la lista de productos con su stock. Responde SOLO con un JSON: {"productos": [{"nombre": string, "estado": "critico o pronto o ok", "cantidad_sugerida": number, "razon": string}]}. Ordena por urgencia (critico primero). La razon debe ser maximo 8 palabras.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  // Verificar JWT del usuario
  const authHeader = req.headers.get('Authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  const { data: { user }, error: authError } = await supabase.auth.getUser(
    authHeader.replace('Bearer ', '')
  )
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), {
      status: 401, headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }

  try {
    const body = await req.json()
    const content = typeof body.content === 'string' ? body.content : JSON.stringify(body.content ?? body)

    if (!content) {
      return new Response(JSON.stringify({ error: 'Contenido vacío' }), {
        status: 400, headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content }],
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Anthropic error:', err)
      return new Response(JSON.stringify({ error: 'Error al llamar a la IA' }), {
        status: 500, headers: { 'Content-Type': 'application/json', ...CORS },
      })
    }

    const anthropicData = await res.json()
    const text = anthropicData.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('JSON no encontrado en la respuesta')
    const json = JSON.parse(match[0])

    return new Response(JSON.stringify(json), {
      headers: { 'Content-Type': 'application/json', ...CORS },
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: 'Error interno' }), {
      status: 500, headers: { 'Content-Type': 'application/json', ...CORS },
    })
  }
})
