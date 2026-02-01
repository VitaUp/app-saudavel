/**
 * Dados de exemplo para desenvolvimento e testes
 * Estes dados podem ser inseridos no Supabase para testar o app
 */

export const SAMPLE_USER_ID = '550e8400-e29b-41d4-a716-446655440000'

export const SAMPLE_GAMIFICATION = {
  user_id: SAMPLE_USER_ID,
  xp: 150,
  level: 2,
  vita_points: 300,
  badges: ['first_workout', 'week_streak'],
  daily_streak: 5,
  total_workouts: 12,
  total_meals_logged: 8,
  total_sleep_logs: 6
}

export const SAMPLE_WORKOUTS = [
  {
    user_id: SAMPLE_USER_ID,
    name: 'Treino de Peito e Tríceps',
    description: 'Treino focado em membros superiores',
    type: 'Hipertrofia',
    difficulty: 'Intermediário',
    duration_minutes: 45,
    exercises: [
      { nome: 'Supino Reto', series: 4, repeticoes: '10-12', descanso_segundos: 90 },
      { nome: 'Supino Inclinado', series: 3, repeticoes: '10-12', descanso_segundos: 90 },
      { nome: 'Crucifixo', series: 3, repeticoes: '12-15', descanso_segundos: 60 },
      { nome: 'Tríceps Testa', series: 3, repeticoes: '10-12', descanso_segundos: 60 },
      { nome: 'Tríceps Corda', series: 3, repeticoes: '12-15', descanso_segundos: 60 }
    ]
  },
  {
    user_id: SAMPLE_USER_ID,
    name: 'Treino de Costas e Bíceps',
    description: 'Treino focado em puxadas',
    type: 'Hipertrofia',
    difficulty: 'Intermediário',
    duration_minutes: 50,
    exercises: [
      { nome: 'Barra Fixa', series: 4, repeticoes: '8-10', descanso_segundos: 90 },
      { nome: 'Remada Curvada', series: 4, repeticoes: '10-12', descanso_segundos: 90 },
      { nome: 'Puxada Frontal', series: 3, repeticoes: '10-12', descanso_segundos: 60 },
      { nome: 'Rosca Direta', series: 3, repeticoes: '10-12', descanso_segundos: 60 },
      { nome: 'Rosca Martelo', series: 3, repeticoes: '12-15', descanso_segundos: 60 }
    ]
  },
  {
    user_id: SAMPLE_USER_ID,
    name: 'Treino de Pernas',
    description: 'Treino completo de membros inferiores',
    type: 'Hipertrofia',
    difficulty: 'Intermediário',
    duration_minutes: 55,
    exercises: [
      { nome: 'Agachamento Livre', series: 4, repeticoes: '8-10', descanso_segundos: 120 },
      { nome: 'Leg Press 45°', series: 4, repeticoes: '10-12', descanso_segundos: 90 },
      { nome: 'Cadeira Extensora', series: 3, repeticoes: '12-15', descanso_segundos: 60 },
      { nome: 'Mesa Flexora', series: 3, repeticoes: '12-15', descanso_segundos: 60 },
      { nome: 'Panturrilha em Pé', series: 4, repeticoes: '15-20', descanso_segundos: 45 }
    ]
  },
  {
    user_id: SAMPLE_USER_ID,
    name: 'HIIT Cardio',
    description: 'Treino intervalado de alta intensidade',
    type: 'HIIT',
    difficulty: 'Avançado',
    duration_minutes: 30,
    exercises: [
      { nome: 'Burpees', series: 4, repeticoes: '30 segundos', descanso_segundos: 30 },
      { nome: 'Mountain Climbers', series: 4, repeticoes: '30 segundos', descanso_segundos: 30 },
      { nome: 'Jump Squats', series: 4, repeticoes: '30 segundos', descanso_segundos: 30 },
      { nome: 'High Knees', series: 4, repeticoes: '30 segundos', descanso_segundos: 30 },
      { nome: 'Plank Jacks', series: 4, repeticoes: '30 segundos', descanso_segundos: 30 }
    ]
  }
]

export const SAMPLE_WORKOUT_LOGS = [
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 45,
    calories_burned: 290,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 50,
    calories_burned: 325,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 40,
    calories_burned: 260,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 55,
    calories_burned: 360,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 45,
    calories_burned: 290,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    duration_minutes: 50,
    calories_burned: 325,
    exercises_completed: []
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date().toISOString().split('T')[0],
    duration_minutes: 48,
    calories_burned: 310,
    exercises_completed: []
  }
]

export const SAMPLE_SLEEP_LOGS = [
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleep_time: '23:00:00',
    wake_time: '07:00:00',
    total_hours: 8,
    light_sleep_minutes: 240,
    deep_sleep_minutes: 120,
    rem_sleep_minutes: 120,
    awake_minutes: 0,
    heart_rate_avg: 58,
    quality_score: 85
  },
  {
    user_id: SAMPLE_USER_ID,
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    sleep_time: '23:30:00',
    wake_time: '07:30:00',
    total_hours: 8,
    light_sleep_minutes: 250,
    deep_sleep_minutes: 110,
    rem_sleep_minutes: 120,
    awake_minutes: 0,
    heart_rate_avg: 60,
    quality_score: 82
  }
]

export const SAMPLE_NUTRITION_LOGS = [
  {
    user_id: SAMPLE_USER_ID,
    meal_type: 'Café da manhã',
    calories: 450,
    protein_g: 25,
    carbs_g: 50,
    fats_g: 15,
    logged_at: new Date().toISOString()
  },
  {
    user_id: SAMPLE_USER_ID,
    meal_type: 'Almoço',
    calories: 650,
    protein_g: 45,
    carbs_g: 70,
    fats_g: 20,
    logged_at: new Date().toISOString()
  }
]
