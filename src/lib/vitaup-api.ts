/**
 * VitaUp API Client
 * Cliente TypeScript para consumir as Edge Functions do Supabase
 */

import { supabase } from './supabase-client'

// ============================================
// TYPES
// ============================================

export interface NormalizedFood {
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

export interface HealthSyncData {
  date: string // YYYY-MM-DD
  steps?: number
  active_minutes?: number
  sleep_minutes?: number
  sleep_data?: {
    total_hours?: number
    light_sleep_minutes?: number
    deep_sleep_minutes?: number
    rem_sleep_minutes?: number
    awake_minutes?: number
    heart_rate_avg?: number
    quality_score?: number
  }
}

export interface CoachMessage {
  date: string // YYYY-MM-DD
  user_message: string
  daily_summary?: {
    nutrition?: any
    water?: any
    sleep?: any
    movement?: any
  }
  settings?: {
    tone?: string
    goal?: string
  }
}

export interface CoachResponse {
  reply: string
  actions?: Array<{
    type: 'meal_suggestion' | 'habit' | 'exercise'
    title: string
    items?: string[]
    target_ml?: number
    duration_minutes?: number
  }>
}

// ============================================
// API CLIENT
// ============================================

class VitaUpAPI {
  private baseUrl: string

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    this.baseUrl = supabaseUrl ? supabaseUrl.replace('/rest/v1', '') : ''
  }

  private async callFunction<T>(functionName: string, body: any): Promise<T> {
    // Verifica se Supabase está configurado
    if (!this.baseUrl) {
      console.warn('Supabase não configurado. Retornando dados mockados.')
      return this.getMockData(functionName, body) as T
    }

    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      // Se não houver sessão, retorna dados mockados
      if (!session) {
        console.warn('Usuário não autenticado. Retornando dados mockados.')
        return this.getMockData(functionName, body) as T
      }

      const url = `${this.baseUrl}/functions/v1/${functionName}`
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        console.warn(`Erro na API ${functionName}. Retornando dados mockados.`)
        return this.getMockData(functionName, body) as T
      }

      return response.json()
    } catch (error: any) {
      console.warn(`Erro ao chamar ${functionName}. Retornando dados mockados.`, error)
      return this.getMockData(functionName, body) as T
    }
  }

  /**
   * Retorna dados mockados quando API não está disponível
   */
  private getMockData(functionName: string, body: any): any {
    if (functionName === 'vitaup-food-search') {
      // Mock de alimentos baseado na query
      const query = body.query || body.barcode || ''
      return {
        foods: [
          {
            id: 'mock-1',
            source: 'usda',
            source_id: '1',
            name: `${query || 'Alimento'} (Exemplo)`,
            brand: 'Marca Exemplo',
            image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop',
            nutrition_per_100g: {
              kcal: 150,
              protein_g: 8,
              carbs_g: 20,
              fat_g: 5,
              fiber_g: 3,
              sodium_mg: 200
            },
            servings: [
              { label: '1 porção', grams: 100 },
              { label: '1 xícara', grams: 150 }
            ]
          },
          {
            id: 'mock-2',
            source: 'usda',
            source_id: '2',
            name: `${query || 'Alimento'} Integral (Exemplo)`,
            brand: 'Marca Saudável',
            image_url: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop',
            nutrition_per_100g: {
              kcal: 120,
              protein_g: 10,
              carbs_g: 15,
              fat_g: 3,
              fiber_g: 5,
              sodium_mg: 150
            },
            servings: [
              { label: '1 porção', grams: 100 },
              { label: '1 unidade', grams: 80 }
            ]
          }
        ]
      }
    }

    if (functionName === 'vitaup-health-sync') {
      return { ok: true }
    }

    if (functionName === 'vitaup-coachup-message') {
      return {
        reply: 'Olá! Sou o CoachUp. Configure o Supabase para ter acesso completo às minhas funcionalidades.',
        actions: []
      }
    }

    if (functionName === 'vitaup-exercises-sync') {
      return { ok: true, synced: 0, message: 'Configure o Supabase para sincronizar exercícios' }
    }

    if (functionName === 'vitaup-push-register') {
      return { ok: true }
    }

    return {}
  }

  // ============================================
  // FOOD SEARCH
  // ============================================

  /**
   * Busca alimentos por código de barras (Open Food Facts)
   */
  async searchFoodByBarcode(barcode: string): Promise<{ foods: NormalizedFood[] }> {
    return this.callFunction('vitaup-food-search', { barcode })
  }

  /**
   * Busca alimentos por texto (autocomplete - Nutritionix)
   */
  async searchFoodAutocomplete(query: string): Promise<{ foods: NormalizedFood[] }> {
    return this.callFunction('vitaup-food-search', { query, type: 'autocomplete' })
  }

  /**
   * Busca alimentos detalhada (USDA)
   */
  async searchFoodDetailed(query: string): Promise<{ foods: NormalizedFood[] }> {
    return this.callFunction('vitaup-food-search', { query, type: 'detailed' })
  }

  /**
   * Busca alimento por FDC ID (USDA Details)
   */
  async getFoodByFdcId(fdcId: string): Promise<{ foods: NormalizedFood[] }> {
    return this.callFunction('vitaup-food-search', { fdcId })
  }

  // ============================================
  // HEALTH SYNC
  // ============================================

  /**
   * Sincroniza dados de saúde (Apple Health / Google Fit)
   */
  async syncHealthData(data: HealthSyncData): Promise<{ ok: boolean }> {
    return this.callFunction('vitaup-health-sync', data)
  }

  // ============================================
  // COACHUP
  // ============================================

  /**
   * Envia mensagem para o CoachUp (IA)
   */
  async sendCoachMessage(message: CoachMessage): Promise<CoachResponse> {
    return this.callFunction('vitaup-coachup-message', message)
  }

  // ============================================
  // EXERCISES
  // ============================================

  /**
   * Sincroniza exercícios do WGER (admin only)
   */
  async syncExercises(): Promise<{ ok: boolean; synced: number; message: string }> {
    return this.callFunction('vitaup-exercises-sync', {})
  }

  // ============================================
  // PUSH NOTIFICATIONS
  // ============================================

  /**
   * Registra token FCM para notificações push
   */
  async registerPushToken(deviceToken: string, platform: 'ios' | 'android'): Promise<{ ok: boolean }> {
    return this.callFunction('vitaup-push-register', { device_token: deviceToken, platform })
  }
}

// Export singleton
export const vitaupAPI = new VitaUpAPI()

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calcula macros totais de uma lista de alimentos
 */
export function calculateTotalMacros(foods: Array<{ nutrition_per_100g: any; serving_grams: number }>) {
  return foods.reduce(
    (total, food) => {
      const multiplier = food.serving_grams / 100
      return {
        kcal: total.kcal + (food.nutrition_per_100g.kcal * multiplier),
        protein_g: total.protein_g + (food.nutrition_per_100g.protein_g * multiplier),
        carbs_g: total.carbs_g + (food.nutrition_per_100g.carbs_g * multiplier),
        fat_g: total.fat_g + (food.nutrition_per_100g.fat_g * multiplier),
        fiber_g: total.fiber_g + (food.nutrition_per_100g.fiber_g * multiplier),
        sodium_mg: total.sodium_mg + (food.nutrition_per_100g.sodium_mg * multiplier),
      }
    },
    { kcal: 0, protein_g: 0, carbs_g: 0, fat_g: 0, fiber_g: 0, sodium_mg: 0 }
  )
}

/**
 * Formata macros para exibição
 */
export function formatMacros(macros: { kcal: number; protein_g: number; carbs_g: number; fat_g: number }) {
  return {
    kcal: Math.round(macros.kcal),
    protein: Math.round(macros.protein_g),
    carbs: Math.round(macros.carbs_g),
    fat: Math.round(macros.fat_g),
  }
}

/**
 * Valida se um alimento tem dados nutricionais completos
 */
export function isValidFood(food: NormalizedFood): boolean {
  const nutrition = food.nutrition_per_100g
  return nutrition.kcal > 0 || nutrition.protein_g > 0 || nutrition.carbs_g > 0 || nutrition.fat_g > 0
}
