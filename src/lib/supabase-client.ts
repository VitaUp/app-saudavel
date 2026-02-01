/**
 * Cliente Supabase
 * Usa APENAS as tabelas existentes - NUNCA cria, altera ou exclui schemas
 */

import { createClient } from '@supabase/supabase-js'

// Valores padrão para evitar erros se env vars não estiverem configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types baseados nas tabelas existentes
export interface Profile {
  id: string
  email: string
  full_name?: string
  preferred_name?: string
  age?: number
  weight?: number
  height?: number
  goal?: string
  activity_level?: string
  diet_style?: string
  restrictions?: string[]
  pathologies?: string[]
  language?: string
  plan_type?: string
  is_special_account?: boolean
  special_category?: string
  avatar_url?: string
  created_at?: string
  updated_at?: string
  user_id?: string
}

export interface Settings {
  id: string
  user_id?: string
  preferred_language?: string
  preferred_name?: string
  theme?: string
  notif_workout?: boolean
  notif_meals?: boolean
  notif_sleep?: boolean
  notif_habits?: boolean
  notif_chat?: boolean
  apple_health_enabled?: boolean
  google_fit_enabled?: boolean
  smartwatch_enabled?: boolean
  share_activity?: boolean
  share_level?: boolean
  last_login?: string
  created_at?: string
  updated_at?: string
}

export interface Workout {
  id: string
  user_id: string
  name: string
  description?: string
  type?: string
  difficulty?: string
  duration_minutes?: number
  exercises?: any // jsonb
  created_at?: string
}

export interface WorkoutLog {
  id: string
  user_id: string
  workout_id?: string
  date: string
  duration_minutes?: number
  calories_burned?: number
  exercises_completed?: any // jsonb
  notes?: string
  created_at?: string
}

export interface Gamification {
  id: string
  user_id: string
  xp?: number
  level?: number
  vita_points?: number
  badges?: any[] // jsonb
  daily_streak?: number
  total_workouts?: number
  total_meals_logged?: number
  total_sleep_logs?: number
  created_at?: string
  updated_at?: string
}

export interface NutritionLog {
  id: string
  user_id: string
  meal_type?: string
  calories?: number
  protein_g?: number
  carbs_g?: number
  fats_g?: number
  photo_url?: string
  logged_at?: string
}

export interface MealPhoto {
  id: string
  user_id?: string
  meal_id?: string
  photo_url: string
  ai_food_labels?: any[] // jsonb
  ai_portion_estimate?: any // jsonb
  ai_confidence?: number
  calories_estimated?: number
  protein_estimated?: number
  carbs_estimated?: number
  fat_estimated?: number
  created_at?: string
  updated_at?: string
}

export interface SleepLog {
  id: string
  user_id: string
  date: string
  sleep_time?: string
  wake_time?: string
  total_hours?: number
  light_sleep_minutes?: number
  deep_sleep_minutes?: number
  rem_sleep_minutes?: number
  awake_minutes?: number
  heart_rate_avg?: number
  quality_score?: number
  notes?: string
  created_at?: string
}

export interface Integration {
  id: string
  user_id?: string
  apple_health_connected?: boolean
  apple_health_last_sync?: string
  apple_health_permissions?: any // jsonb
  google_fit_connected?: boolean
  google_fit_last_sync?: string
  google_fit_permissions?: any // jsonb
  smartwatch_connected?: boolean
  smartwatch_type?: string
  smartwatch_last_sync?: string
  oauth_token?: string
  oauth_refresh_token?: string
  token_expires_at?: string
  created_at?: string
  updated_at?: string
}

// Helper para verificar se Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder-key'
}
