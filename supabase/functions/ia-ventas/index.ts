const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? ''

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const SYSTEM_PROMPT = `Eres el asistente de ventas de Zimplex, una app para microemprendedores chilenos. Recibes el historial de ventas de los últimos 7 días. Responde SOLO con un JSON con esta estructura exacta: {"total_periodo": string, "producto_estrella": string, "mejor_dia": string, "consejo": string}. El consejo debe ser práctico, en español chileno simple, máximo 2 oraciones.`

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
        max_tokens: 512,
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
