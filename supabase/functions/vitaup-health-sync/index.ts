// VitaUp Health Sync Edge Function
// Recebe dados do Apple Health / Google Fit e salva no Supabase

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
    const { date, steps, active_minutes, sleep_minutes, sleep_data } = await req.json()

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

    // Atualiza health_metrics
    if (steps !== undefined || active_minutes !== undefined) {
      await supabaseClient
        .from('health_metrics')
        .upsert({
          user_id: user.id,
          date,
          steps: steps || 0,
          active_minutes: active_minutes || 0,
          source: 'apple_health', // ou 'google_fit' baseado no header
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,date'
        })
    }

    // Atualiza sleep_logs se tiver dados de sono
    if (sleep_data) {
      await supabaseClient
        .from('sleep_logs')
        .upsert({
          user_id: user.id,
          date,
          total_hours: sleep_data.total_hours || (sleep_minutes ? sleep_minutes / 60 : null),
          light_sleep_minutes: sleep_data.light_sleep_minutes || 0,
          deep_sleep_minutes: sleep_data.deep_sleep_minutes || 0,
          rem_sleep_minutes: sleep_data.rem_sleep_minutes || 0,
          awake_minutes: sleep_data.awake_minutes || 0,
          heart_rate_avg: sleep_data.heart_rate_avg,
          quality_score: sleep_data.quality_score,
          source: 'apple_health',
        }, {
          onConflict: 'user_id,date'
        })
    }

    // Atualiza última sincronização
    await supabaseClient
      .from('integrations')
      .update({
        apple_health_last_sync: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id)

    return new Response(
      JSON.stringify({ ok: true }),
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
