'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  ChevronDown, 
  User, 
  MessageCircle, 
  Coffee, 
  Sun, 
  Moon, 
  Apple as AppleIcon,
  Droplet,
  Clock,
  Dumbbell,
  Carrot,
  Cherry,
  MoreVertical,
  Home,
  TrendingUp,
  Utensils,
  BedDouble,
  Crown
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'
import { NormalizedFood } from '@/lib/vitaup-api'
import AddFoodModal from '@/components/AddFoodModal'
import AddExerciseModal from '@/components/AddExerciseModal'

interface DailyData {
  date: string
  calories_consumed: number
  calories_burned: number
  protein_g: number
  carbs_g: number
  fat_g: number
  water_ml: number
  vegetables_count: number
  fruits_count: number
  meals: Array<{
    type: string
    foods: Array<{
      name: string
      calories: number
      protein_g: number
      carbs_g: number
      fat_g: number
    }>
  }>
  exercises: Array<{
    name: string
    duration: number
    calories: number
  }>
}

export default function HomePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [dailyData, setDailyData] = useState<DailyData>({
    date: new Date().toISOString().split('T')[0],
    calories_consumed: 0,
    calories_burned: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
    water_ml: 0,
    vegetables_count: 0,
    fruits_count: 0,
    meals: [],
    exercises: []
  })

  const [isAddFoodModalOpen, setIsAddFoodModalOpen] = useState(false)
  const [selectedMealType, setSelectedMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast')
  const [isAddExerciseModalOpen, setIsAddExerciseModalOpen] = useState(false)

  // Metas diárias (serão carregadas do banco)
  const [dailyGoals, setDailyGoals] = useState({
    calories: 1630,
    protein_g: 82,
    carbs_g: 204,
    fat_g: 54,
    water_ml: 2000
  })

  const waterGlasses = Math.floor(dailyData.water_ml / 250)
  const maxWaterGlasses = 8

  // Verificar autenticação e carregar dados
  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase não configurado')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      // Verificar se completou onboarding
      const { data: profile } = await supabase
        .from('profiles')
        .select('onboarding_completed')
        .eq('user_id', user.id)
        .single()

      if (!profile?.onboarding_completed) {
        router.push('/quiz')
        return
      }

      // Carregar metas do usuário
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (settings) {
        setDailyGoals({
          calories: settings.daily_calories || 1630,
          protein_g: settings.daily_protein_g || 82,
          carbs_g: settings.daily_carbs_g || 204,
          fat_g: settings.daily_fat_g || 54,
          water_ml: settings.daily_water_ml || 2000
        })
      }

      await loadDailyData(user.id)
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error)
    }
  }

  const loadDailyData = async (uid: string) => {
    const today = new Date().toISOString().split('T')[0]

    try {
      // Carregar logs de nutrição do dia
      const { data: nutritionLogs } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', uid)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)

      // Carregar logs de exercícios do dia
      const { data: workoutLogs } = await supabase
        .from('workout_logs')
        .select('*')
        .eq('user_id', uid)
        .eq('date', today)

      if (nutritionLogs && nutritionLogs.length > 0) {
        const totalCalories = nutritionLogs.reduce((sum, log) => sum + (log.calories || 0), 0)
        const totalProtein = nutritionLogs.reduce((sum, log) => sum + (log.protein_g || 0), 0)
        const totalCarbs = nutritionLogs.reduce((sum, log) => sum + (log.carbs_g || 0), 0)
        const totalFat = nutritionLogs.reduce((sum, log) => sum + (log.fats_g || 0), 0)

        setDailyData(prev => ({
          ...prev,
          calories_consumed: totalCalories,
          protein_g: totalProtein,
          carbs_g: totalCarbs,
          fat_g: totalFat
        }))
      }

      if (workoutLogs && workoutLogs.length > 0) {
        const totalBurned = workoutLogs.reduce((sum, log) => sum + (log.calories_burned || 0), 0)
        setDailyData(prev => ({
          ...prev,
          calories_burned: totalBurned,
          exercises: workoutLogs.map(log => ({
            name: log.workout_id || 'Exercício',
            duration: log.duration_minutes || 0,
            calories: log.calories_burned || 0
          }))
        }))
      }
    } catch (error) {
      console.error('Erro ao carregar dados diários:', error)
    }
  }

  const addWaterGlass = async () => {
    if (waterGlasses < maxWaterGlasses) {
      const newWaterMl = dailyData.water_ml + 250
      setDailyData(prev => ({ ...prev, water_ml: newWaterMl }))
    }
  }

  const handleAddFood = async (food: NormalizedFood, servingGrams: number, mealType: string) => {
    const multiplier = servingGrams / 100
    const calories = Math.round(food.nutrition_per_100g.kcal * multiplier)
    const protein = Math.round(food.nutrition_per_100g.protein_g * multiplier)
    const carbs = Math.round(food.nutrition_per_100g.carbs_g * multiplier)
    const fat = Math.round(food.nutrition_per_100g.fat_g * multiplier)

    // Atualizar estado local
    setDailyData(prev => ({
      ...prev,
      calories_consumed: prev.calories_consumed + calories,
      protein_g: prev.protein_g + protein,
      carbs_g: prev.carbs_g + carbs,
      fat_g: prev.fat_g + fat
    }))

    // Salvar no Supabase
    if (userId && isSupabaseConfigured()) {
      try {
        await supabase.from('nutrition_logs').insert({
          user_id: userId,
          meal_type: mealType,
          calories,
          protein_g: protein,
          carbs_g: carbs,
          fats_g: fat,
          logged_at: new Date().toISOString()
        })
      } catch (error) {
        console.error('Erro ao salvar alimento:', error)
      }
    }
  }

  const handleAddExercise = async (exercise: { name: string; duration: number; calories: number }) => {
    // Atualizar estado local
    setDailyData(prev => ({
      ...prev,
      calories_burned: prev.calories_burned + exercise.calories,
      exercises: [...prev.exercises, exercise]
    }))

    // Salvar no Supabase
    if (userId && isSupabaseConfigured()) {
      try {
        await supabase.from('workout_logs').insert({
          user_id: userId,
          date: new Date().toISOString().split('T')[0],
          duration_minutes: exercise.duration,
          calories_burned: exercise.calories,
          exercises_completed: { name: exercise.name }
        })
      } catch (error) {
        console.error('Erro ao salvar exercício:', error)
      }
    }
  }

  const openAddFoodModal = (mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack') => {
    setSelectedMealType(mealType)
    setIsAddFoodModalOpen(true)
  }

  const caloriesRemaining = dailyGoals.calories - dailyData.calories_consumed + dailyData.calories_burned
  const proteinProgress = (dailyData.protein_g / dailyGoals.protein_g) * 100
  const carbsProgress = (dailyData.carbs_g / dailyGoals.carbs_g) * 100
  const fatProgress = (dailyData.fat_g / dailyGoals.fat_g) * 100
  const caloriesProgress = dailyData.calories_consumed > 0 ? (dailyData.calories_consumed / dailyGoals.calories) * 100 : 0

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Header Fixo */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          {/* Botão Upgrade */}
          <button 
            onClick={() => router.push('/upgrade')}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full text-sm font-semibold text-white flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <Crown className="w-4 h-4" />
            Upgrade
          </button>

          {/* Logo Central */}
          <div className="absolute left-1/2 -translate-x-1/2">
            <h1 className="text-xl font-bold">VitaUp</h1>
          </div>

          {/* Ícones Direita */}
          <div className="flex items-center gap-3">
            <button className="relative">
              <MessageCircle className="w-6 h-6 text-[#62D8B5]" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#62D8B5] rounded-full"></span>
            </button>
            <button 
              onClick={() => router.push('/perfil')}
              className="w-8 h-8 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center"
            >
              <User className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal - Scroll Vertical */}
      <div className="max-w-md mx-auto px-4 pt-20 space-y-4">
        
        {/* Card Principal - Calorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#62D8B5]/20 to-[#AEE2FF]/20 rounded-3xl p-6 shadow-lg"
        >
          {/* Círculo de Progresso */}
          <div className="relative flex items-center justify-center mb-6">
            {/* Texto Esquerda - Consumidas */}
            <div className="absolute left-0 text-center">
              <p className="text-3xl font-bold">{dailyData.calories_consumed}</p>
              <p className="text-xs text-white/60 uppercase">Consumidas</p>
            </div>

            {/* Círculo Central */}
            <div className="relative w-48 h-48 flex items-center justify-center">
              {/* Círculo de fundo */}
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="88"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray="552.92"
                  strokeDashoffset={552.92 - (552.92 * Math.min(caloriesProgress, 100)) / 100}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#62D8B5" />
                    <stop offset="100%" stopColor="#AEE2FF" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Texto Central */}
              <div className="text-center z-10">
                <p className="text-5xl font-bold">{caloriesRemaining}</p>
                <p className="text-sm text-white/70 uppercase tracking-wide">Kcal Restantes</p>
              </div>
            </div>

            {/* Texto Direita - Queimadas */}
            <div className="absolute right-0 text-center">
              <p className="text-3xl font-bold">{dailyData.calories_burned}</p>
              <p className="text-xs text-white/60 uppercase">Queimadas</p>
            </div>
          </div>

          {/* Botão Ver Estatísticas */}
          <button 
            onClick={() => router.push('/progresso')}
            className="w-full py-3 bg-white/10 hover:bg-white/15 rounded-2xl flex items-center justify-center gap-2 transition-all"
          >
            <span className="text-sm font-medium">VER ESTATÍSTICAS</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Card Macronutrientes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A1A1A] rounded-3xl p-6 shadow-lg"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Carboidratos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">Carboidratos</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(carbsProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium">{dailyData.carbs_g} / {dailyGoals.carbs_g} g</p>
            </div>

            {/* Proteínas */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">Proteínas</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(proteinProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium">{dailyData.protein_g} / {dailyGoals.protein_g} g</p>
            </div>

            {/* Gordura */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-white/60">Gordura</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-gradient-to-r from-red-400 to-pink-400 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(fatProgress, 100)}%` }}
                ></div>
              </div>
              <p className="text-sm font-medium">{dailyData.fat_g} / {dailyGoals.fat_g} g</p>
            </div>
          </div>
        </motion.div>

        {/* Cards de Refeições */}
        {[
          { icon: Coffee, name: 'Café da manhã', kcal: '300 – 400', type: 'breakfast' as const },
          { icon: Sun, name: 'Almoço', kcal: '500 – 600', type: 'lunch' as const },
          { icon: Moon, name: 'Jantar', kcal: '400 – 500', type: 'dinner' as const },
          { icon: AppleIcon, name: 'Lanche', kcal: '150 – 200', type: 'snack' as const }
        ].map((meal, index) => (
          <motion.div
            key={meal.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.05 }}
            className="bg-[#1A1A1A] rounded-3xl p-5 shadow-lg flex items-center justify-between hover:bg-[#222] transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center">
                <meal.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-base">{meal.name}</h3>
                <p className="text-sm text-white/50">Recomendado: {meal.kcal} kcal</p>
              </div>
            </div>
            <button 
              onClick={() => openAddFoodModal(meal.type)}
              className="w-10 h-10 rounded-full bg-[#62D8B5] flex items-center justify-center hover:scale-110 transition-transform"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </motion.div>
        ))}

        {/* Card Água */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A1A1A] rounded-3xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-base">Água ({(dailyData.water_ml / 1000).toFixed(2)} L)</h3>
            <button className="text-white/50 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Primeiro copo com botão + */}
            <button
              onClick={addWaterGlass}
              className="relative w-12 h-16 rounded-xl bg-gradient-to-b from-[#62D8B5]/20 to-[#62D8B5]/40 border-2 border-[#62D8B5] flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5 text-[#62D8B5]" />
            </button>

            {/* Copos de progresso */}
            {Array.from({ length: maxWaterGlasses - 1 }).map((_, index) => (
              <div
                key={index}
                className={`w-10 h-16 rounded-xl border-2 transition-all ${
                  index < waterGlasses - 1
                    ? 'bg-gradient-to-b from-[#62D8B5]/40 to-[#62D8B5]/60 border-[#62D8B5]'
                    : 'bg-white/5 border-white/20'
                }`}
              >
                {index < waterGlasses - 1 && (
                  <div className="w-full h-full flex items-center justify-center">
                    <Droplet className="w-4 h-4 text-[#62D8B5]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Card Jejum Intermitente */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-3xl p-6 shadow-lg"
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Ícone com anel de progresso */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="url(#gradient-fasting)"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray="175.93"
                  strokeDashoffset="87.96"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient-fasting" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-400" />
              </div>
            </div>

            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">Quer começar o Jejum intermitente?</h3>
              <p className="text-sm text-white/60 leading-relaxed">
                Descubra os benefícios do jejum intermitente para sua saúde e bem-estar.
              </p>
            </div>
          </div>

          <button className="w-full py-3 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-2xl font-semibold hover:shadow-lg transition-all">
            EXPLORE AGORA
          </button>
        </motion.div>

        {/* Card Exercícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A1A1A] rounded-3xl p-5 shadow-lg flex items-center justify-between hover:bg-[#222] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-base">Exercícios</h3>
              <p className="text-sm text-white/50">Meta diária: 30 min</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddExerciseModalOpen(true)}
            className="w-10 h-10 rounded-full bg-[#62D8B5] flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Plus className="w-5 h-5 text-white" />
          </button>
        </motion.div>

        {/* Card Monitor de Vegetais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-[#1A1A1A] rounded-3xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Monitor de vegetais</h3>
            <button className="text-white/50 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index === dailyData.vegetables_count) {
                    setDailyData(prev => ({ ...prev, vegetables_count: prev.vegetables_count + 1 }))
                  }
                }}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  index < dailyData.vegetables_count
                    ? 'bg-green-500/20 border-green-500'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <Carrot className={`w-6 h-6 ${index < dailyData.vegetables_count ? 'text-green-500' : 'text-white/30'}`} />
              </button>
            ))}
          </div>
        </motion.div>

        {/* Card Monitor de Frutas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="bg-[#1A1A1A] rounded-3xl p-5 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-base">Monitor de frutas</h3>
            <button className="text-white/50 hover:text-white transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index === dailyData.fruits_count) {
                    setDailyData(prev => ({ ...prev, fruits_count: prev.fruits_count + 1 }))
                  }
                }}
                className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                  index < dailyData.fruits_count
                    ? 'bg-red-500/20 border-red-500'
                    : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <Cherry className={`w-6 h-6 ${index < dailyData.fruits_count ? 'text-red-500' : 'text-white/30'}`} />
              </button>
            ))}
          </div>
        </motion.div>

      </div>

      {/* Bottom Navigation Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-white/5">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button className="flex flex-col items-center gap-1 text-[#62D8B5]">
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Diário</span>
            </button>

            <button 
              onClick={() => router.push('/progresso')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            {/* Botão Central Destacado */}
            <button className="relative -mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button 
              onClick={() => router.push('/dietas')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <Utensils className="w-6 h-6" />
              <span className="text-xs font-medium">Dietas</span>
            </button>

            <button 
              onClick={() => router.push('/sono')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <BedDouble className="w-6 h-6" />
              <span className="text-xs font-medium">Sono</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <AddFoodModal
        isOpen={isAddFoodModalOpen}
        onClose={() => setIsAddFoodModalOpen(false)}
        mealType={selectedMealType}
        onAddFood={handleAddFood}
      />

      <AddExerciseModal
        isOpen={isAddExerciseModalOpen}
        onClose={() => setIsAddExerciseModalOpen(false)}
        onAddExercise={handleAddExercise}
      />
    </div>
  )
}
