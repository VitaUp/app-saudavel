// VitaUp Food Search Edge Function
// Integra Open Food Facts, USDA e Nutritionix
// Retorna formato normalizado único

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface NormalizedFood {
  id: string
  source: 'openfoodfacts' | 'usda' | 'nutritionix' | 'custom'
  source_id: string
  barcode?: string
  name: string
  brand?: string
  image_url?: string
  nutrition_per_100g: {
    kcal: number
    protein_g: number
    carbs_g: number
    fat_g: number
    fiber_g: number
    sodium_mg: number
  }
  servings: Array<{ label: string; grams: number }>
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { query, barcode, type, fdcId } = await req.json()

    // Inicializa Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    let results: NormalizedFood[] = []

    // 1. Busca por código de barras (Open Food Facts)
    if (barcode) {
      const offResult = await searchOpenFoodFacts(barcode, supabaseClient)
      if (offResult) {
        results.push(offResult)
      }
      
      // Se OFF falhar, tenta USDA como fallback
      if (!offResult && query) {
        const usdaFallback = await searchUSDA(query, supabaseClient)
        results = results.concat(usdaFallback)
      }
    }

    // 2. Busca por fdcId específico (USDA Details)
    if (fdcId) {
      const usdaDetail = await getUSDADetails(fdcId, supabaseClient)
      if (usdaDetail) {
        results.push(usdaDetail)
      }
    }

    // 3. Busca por texto (Nutritionix para autocomplete + USDA para dados confiáveis)
    if (query && type === 'autocomplete') {
      const nutritionixResults = await searchNutritionix(query)
      results = results.concat(nutritionixResults)
    }

    // 4. Busca detalhada (USDA)
    if (query && type === 'detailed') {
      const usdaResults = await searchUSDA(query, supabaseClient)
      results = results.concat(usdaResults)
    }

    // 5. Busca no cache local (Supabase)
    if (query || barcode) {
      const cachedResults = await searchCachedFoods(query || barcode, supabaseClient)
      results = results.concat(cachedResults)
    }

    // Remove duplicatas
    const uniqueResults = Array.from(
      new Map(results.map(item => [item.source_id, item])).values()
    )

    return new Response(
      JSON.stringify({ foods: uniqueResults }),
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

// ============================================
// OPEN FOOD FACTS
// ============================================
async function searchOpenFoodFacts(barcode: string, supabase: any): Promise<NormalizedFood | null> {
  try {
    const response = await fetch(`https://world.openfoodfacts.net/api/v2/product/${barcode}`)
    const data = await response.json()

    if (data.status !== 1 || !data.product) {
      return null
    }

    const product = data.product
    const normalized: NormalizedFood = {
      id: crypto.randomUUID(),
      source: 'openfoodfacts',
      source_id: barcode,
      barcode: barcode,
      name: product.product_name || 'Unknown Product',
      brand: product.brands || undefined,
      image_url: product.image_front_url || undefined,
      nutrition_per_100g: {
        kcal: product.nutriments?.['energy-kcal_100g'] || 0,
        protein_g: product.nutriments?.proteins_100g || 0,
        carbs_g: product.nutriments?.carbohydrates_100g || 0,
        fat_g: product.nutriments?.fat_100g || 0,
        fiber_g: product.nutriments?.fiber_100g || 0,
        sodium_mg: (product.nutriments?.sodium_100g || 0) * 1000,
      },
      servings: [{ label: '100g', grams: 100 }],
    }

    // Salva no cache
    await supabase.from('foods').upsert(normalized, { onConflict: 'source,source_id' })

    return normalized
  } catch (error) {
    console.error('Open Food Facts error:', error)
    return null
  }
}

// ============================================
// USDA FOODDATA CENTRAL - SEARCH
// ============================================
async function searchUSDA(query: string, supabase: any): Promise<NormalizedFood[]> {
  try {
    const apiKey = Deno.env.get('USDA_API_KEY')
    if (!apiKey) {
      console.warn('USDA_API_KEY not configured')
      return []
    }

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=10`
    )
    
    if (!response.ok) {
      console.error('USDA API error:', response.status)
      return []
    }

    const data = await response.json()

    if (!data.foods || data.foods.length === 0) {
      return []
    }

    const normalized: NormalizedFood[] = data.foods.map((food: any) => {
      const nutrients = food.foodNutrients || []
      
      const getNutrient = (name: string) => {
        const nutrient = nutrients.find((n: any) => 
          n.nutrientName?.toLowerCase().includes(name.toLowerCase())
        )
        return nutrient?.value || 0
      }

      return {
        id: crypto.randomUUID(),
        source: 'usda',
        source_id: food.fdcId.toString(),
        name: food.description || 'Unknown',
        nutrition_per_100g: {
          kcal: getNutrient('Energy'),
          protein_g: getNutrient('Protein'),
          carbs_g: getNutrient('Carbohydrate'),
          fat_g: getNutrient('Total lipid'),
          fiber_g: getNutrient('Fiber'),
          sodium_mg: getNutrient('Sodium') * 1000, // Converte g para mg
        },
        servings: [{ label: '100g', grams: 100 }],
      }
    })

    // Salva no cache
    for (const food of normalized) {
      await supabase.from('foods').upsert(food, { onConflict: 'source,source_id' })
    }

    return normalized
  } catch (error) {
    console.error('USDA error:', error)
    return []
  }
}

// ============================================
// USDA FOODDATA CENTRAL - DETAILS BY FDC ID
// ============================================
async function getUSDADetails(fdcId: string, supabase: any): Promise<NormalizedFood | null> {
  try {
    const apiKey = Deno.env.get('USDA_API_KEY')
    if (!apiKey) {
      console.warn('USDA_API_KEY not configured')
      return null
    }

    const response = await fetch(
      `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
    )
    
    if (!response.ok) {
      console.error('USDA API error:', response.status)
      return null
    }

    const food = await response.json()

    const nutrients = food.foodNutrients || []
    
    const getNutrient = (name: string) => {
      const nutrient = nutrients.find((n: any) => 
        n.nutrient?.name?.toLowerCase().includes(name.toLowerCase())
      )
      return nutrient?.amount || 0
    }

    const normalized: NormalizedFood = {
      id: crypto.randomUUID(),
      source: 'usda',
      source_id: food.fdcId.toString(),
      name: food.description || 'Unknown',
      nutrition_per_100g: {
        kcal: getNutrient('Energy'),
        protein_g: getNutrient('Protein'),
        carbs_g: getNutrient('Carbohydrate'),
        fat_g: getNutrient('Total lipid'),
        fiber_g: getNutrient('Fiber'),
        sodium_mg: getNutrient('Sodium') * 1000, // Converte g para mg
      },
      servings: [{ label: '100g', grams: 100 }],
    }

    // Salva no cache
    await supabase.from('foods').upsert(normalized, { onConflict: 'source,source_id' })

    return normalized
  } catch (error) {
    console.error('USDA details error:', error)
    return null
  }
}

// ============================================
// NUTRITIONIX (AUTOCOMPLETE)
// ============================================
async function searchNutritionix(query: string): Promise<NormalizedFood[]> {
  try {
    const appId = Deno.env.get('NUTRITIONIX_APP_ID')
    const appKey = Deno.env.get('NUTRITIONIX_API_KEY')

    if (!appId || !appKey) {
      console.warn('Nutritionix credentials not configured')
      return []
    }

    const response = await fetch(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(query)}`,
      {
        headers: {
          'x-app-id': appId,
          'x-app-key': appKey,
        },
      }
    )
    const data = await response.json()

    const results: NormalizedFood[] = []

    // Common foods
    if (data.common) {
      for (const item of data.common.slice(0, 5)) {
        results.push({
          id: crypto.randomUUID(),
          source: 'nutritionix',
          source_id: item.tag_id || item.food_name,
          name: item.food_name,
          nutrition_per_100g: {
            kcal: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
            fiber_g: 0,
            sodium_mg: 0,
          },
          servings: [{ label: item.serving_unit || '100g', grams: 100 }],
        })
      }
    }

    // Branded foods
    if (data.branded) {
      for (const item of data.branded.slice(0, 5)) {
        results.push({
          id: crypto.randomUUID(),
          source: 'nutritionix',
          source_id: item.nix_item_id || item.food_name,
          name: item.food_name,
          brand: item.brand_name,
          nutrition_per_100g: {
            kcal: 0,
            protein_g: 0,
            carbs_g: 0,
            fat_g: 0,
            fiber_g: 0,
            sodium_mg: 0,
          },
          servings: [{ label: '100g', grams: 100 }],
        })
      }
    }

    return results
  } catch (error) {
    console.error('Nutritionix error:', error)
    return []
  }
}

// ============================================
// CACHE LOCAL (SUPABASE)
// ============================================
async function searchCachedFoods(query: string, supabase: any): Promise<NormalizedFood[]> {
  try {
    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .or(`name.ilike.%${query}%,barcode.eq.${query}`)
      .limit(10)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Cache search error:', error)
    return []
  }
}
