import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos do banco de dados
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          created_at: string
        }
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string
          preferred_name: string
          age: number
          weight: number
          height: number
          goal: string
          plan_type: 'free' | 'vitaup_plus'
          is_special_account: boolean
          special_category: 'owner' | 'ceo' | 'family' | 'partner' | 'friend' | null
          language: 'pt-BR' | 'en' | 'es'
          created_at: string
          updated_at: string
        }
      }
      workouts: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          duration_minutes: number
          exercises: any[]
          created_at: string
        }
      }
      exercises: {
        Row: {
          id: string
          name: string
          description: string
          video_url: string
          muscle_group: string
          difficulty: string
          equipment: string[]
        }
      }
      workout_logs: {
        Row: {
          id: string
          user_id: string
          workout_id: string
          completed_at: string
          duration_minutes: number
          calories_burned: number
        }
      }
      meals: {
        Row: {
          id: string
          user_id: string
          name: string
          calories: number
          protein: number
          carbs: number
          fat: number
          meal_type: string
          created_at: string
        }
      }
      food_logs: {
        Row: {
          id: string
          user_id: string
          meal_id: string
          logged_at: string
        }
      }
      meal_photos: {
        Row: {
          id: string
          user_id: string
          photo_url: string
          analyzed_data: any
          created_at: string
        }
      }
      sleep_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          total_hours: number
          sleep_time: string
          wake_time: string
          light_sleep: number
          deep_sleep: number
          rem_sleep: number
          awake_time: number
          heart_rate_avg: number
          source: 'apple_health' | 'google_fit'
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          name: string
          frequency: string
          created_at: string
        }
      }
      habit_logs: {
        Row: {
          id: string
          user_id: string
          habit_id: string
          completed_at: string
        }
      }
      gamification: {
        Row: {
          id: string
          user_id: string
          vita_points: number
          xp: number
          level: number
          badges: string[]
          avatar_config: any
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          message: string
          read: boolean
          created_at: string
        }
      }
      settings: {
        Row: {
          id: string
          user_id: string
          notifications_enabled: boolean
          dark_mode: boolean
          language: string
        }
      }
      integrations: {
        Row: {
          id: string
          user_id: string
          apple_health_connected: boolean
          google_fit_connected: boolean
          smartwatch_connected: boolean
        }
      }
    }
  }
}

// Emails especiais
export const SPECIAL_ACCOUNTS = {
  owner: ['matheusantanabr16@gmail.com'],
  ceo: ['murilo.brasil.santana@gmail.com'],
  family: [
    'adelinagbrasil@gmail.com',
    'mila.brasil@gmail.com',
    'aimee.brasil.ribeiro@gmail.com',
    'amandagbrasil@gmail.com',
    'mpbrasil@gmail.com',
    'aline.brasil@gmail.com',
    'carolmourapessoal@gmail.com'
  ],
  partner: [
    'ernanecsantana@gmail.com',
    'isabelle.f.costa.ic@gmail.com',
    'sousagabriel_cm@outlook.com',
    'carol.guimaraes.brasil@gmail.com'
  ],
  friend: ['parkermaster564@gmail.com']
}

export function getSpecialAccountCategory(email: string): { isSpecial: boolean; category: string | null } {
  const normalizedEmail = email.toLowerCase()
  
  for (const [category, emails] of Object.entries(SPECIAL_ACCOUNTS)) {
    if (emails.includes(normalizedEmail)) {
      return { isSpecial: true, category }
    }
  }
  
  return { isSpecial: false, category: null }
}
