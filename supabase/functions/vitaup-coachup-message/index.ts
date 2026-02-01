// VitaUp CoachUp Message Edge Function
// Integra OpenAI para respostas personalizadas do coach

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { date, user_message, daily_summary, settings } = await req.json()

    // Inicializa Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    // Pega user_id do token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser()
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Pega perfil do usuário
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Monta contexto para a IA
    const systemPrompt = `Você é o CoachUp, um coach de saúde e bem-estar do VitaUp.

Perfil do usuário:
- Nome: ${profile?.preferred_name || profile?.full_name || 'usuário'}
- Objetivo: ${profile?.goal || 'não definido'}
- Nível de atividade: ${profile?.activity_level || 'não definido'}

Tom de comunicação: ${settings?.tone || 'acolhedor e motivador'}
Objetivo do usuário: ${settings?.goal || 'constância'}

Resumo do dia:
${JSON.stringify(daily_summary, null, 2)}

IMPORTANTE:
- Use linguagem brasileira informal e acolhedora
- Seja breve e direto (máx 2-3 frases)
- Foque em ações práticas e simples
- Celebre pequenas vitórias
- Não julgue, apenas oriente com leveza
- Use emojis com moderação

Além da resposta em texto, você pode sugerir ações estruturadas no formato JSON:
{
  "reply": "sua resposta em texto",
  "actions": [
    { "type": "meal_suggestion", "title": "Título", "items": ["item1", "item2"] },
    { "type": "habit", "title": "Hábito", "target_ml": 2000 },
    { "type": "exercise", "title": "Exercício", "duration_minutes": 20 }
  ]
}
`

    // Chama OpenAI
    const openaiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: user_message }
        ],
        temperature: 0.8,
        max_tokens: 500,
      }),
    })

    const openaiData = await openaiResponse.json()
    const aiResponse = openaiData.choices[0].message.content

    // Tenta parsear como JSON, senão retorna como texto puro
    let reply = aiResponse
    let actions = []

    try {
      const parsed = JSON.parse(aiResponse)
      reply = parsed.reply
      actions = parsed.actions || []
    } catch {
      // Se não for JSON, usa como texto puro
      reply = aiResponse
    }

    // Salva mensagem no histórico
    await supabaseClient
      .from('coach_messages')
      .insert({
        user_id: user.id,
        date,
        user_message,
        coach_reply: reply,
        actions: actions.length > 0 ? actions : null,
        daily_summary,
      })

    return new Response(
      JSON.stringify({ reply, actions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
