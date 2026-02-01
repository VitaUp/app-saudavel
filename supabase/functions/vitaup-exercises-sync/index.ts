// VitaUp Exercises Sync Edge Function
// Sincroniza exercícios do WGER para o banco Supabase

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
    // Inicializa Supabase com service role (precisa de permissão para inserir em exercises)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let allExercises = []
    let offset = 0
    const limit = 50
    let hasMore = true

    // Busca exercícios do WGER (language=2 é inglês, 5 é português)
    while (hasMore && offset < 200) { // Limita a 200 exercícios para não sobrecarregar
      const response = await fetch(
        `https://wger.de/api/v2/exercise/?limit=${limit}&offset=${offset}&language=2`
      )
      const data = await response.json()

      if (!data.results || data.results.length === 0) {
        hasMore = false
        break
      }

      allExercises = allExercises.concat(data.results)
      offset += limit

      if (!data.next) {
        hasMore = false
      }
    }

    // Normaliza e insere no Supabase
    const normalized = allExercises.map((exercise: any) => ({
      wger_id: exercise.id,
      name: exercise.name,
      description: exercise.description || '',
      category: getCategoryName(exercise.category),
      equipment: exercise.equipment || [],
      muscles: exercise.muscles || [],
      difficulty: 'intermediate', // WGER não tem difficulty, usar padrão
    }))

    // Insere em lotes de 50
    for (let i = 0; i < normalized.length; i += 50) {
      const batch = normalized.slice(i, i + 50)
      await supabaseClient
        .from('exercises')
        .upsert(batch, { onConflict: 'wger_id' })
    }

    return new Response(
      JSON.stringify({ 
        ok: true, 
        synced: normalized.length,
        message: `${normalized.length} exercícios sincronizados com sucesso`
      }),
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

function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    8: 'arms',
    9: 'legs',
    10: 'abs',
    11: 'chest',
    12: 'back',
    13: 'shoulders',
    14: 'calves',
  }
  return categories[categoryId] || 'other'
}
