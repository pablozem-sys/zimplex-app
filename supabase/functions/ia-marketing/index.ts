const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `Eres el asistente de marketing de Zimplex para pequenos comercios de Latinoamerica. El usuario te describe su promocion y la red social destino. Responde SOLO con JSON: {"variante_1": string, "variante_2": string, "hashtags": string}. Reglas: Instagram = emojis + visual + hashtags en el texto, Facebook = informativo + cercano, WhatsApp = corto + directo + llamada a accion. Hashtags solo si es Instagram (maximo 5, al final). Nunca uses palabras en ingles. Autentico, no corporativo.`

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const { content } = await req.json()

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
