'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

type QuizData = {
  goal: string
  gender: string
  age: number
  height: number
  weight: number
  targetWeight: number
  activityLevel: string
}

const GOALS = [
  { id: 'lose', label: 'Emagrecer', emoji: '🔥' },
  { id: 'maintain', label: 'Manter peso', emoji: '⚖️' },
  { id: 'gain', label: 'Ganhar massa', emoji: '💪' },
]

const GENDERS = [
  { id: 'male', label: 'Masculino', emoji: '👨' },
  { id: 'female', label: 'Feminino', emoji: '👩' },
  { id: 'other', label: 'Outro', emoji: '🧑' },
]

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
  { id: 'light', label: 'Leve', desc: '1-3 dias por semana' },
  { id: 'moderate', label: 'Moderado', desc: '3-5 dias por semana' },
  { id: 'active', label: 'Ativo', desc: '6-7 dias por semana' },
  { id: 'very_active', label: 'Muito Ativo', desc: 'Exercício intenso diário' },
]

export default function QuizPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [userId, setUserId] = useState<string | null>(null)
  const [quizData, setQuizData] = useState<QuizData>({
    goal: '',
    gender: '',
    age: 25,
    height: 170,
    weight: 70,
    targetWeight: 65,
    activityLevel: '',
  })

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)
  }

  const calculateCalories = () => {
    const { gender, age, height, weight, goal, activityLevel } = quizData
    
    // Fórmula de Harris-Benedict
    let bmr = 0
    if (gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    // Multiplicador de atividade
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    }

    let tdee = bmr * (activityMultipliers[activityLevel] || 1.2)

    // Ajuste baseado no objetivo
    if (goal === 'lose') {
      tdee -= 500 // Déficit de 500 kcal
    } else if (goal === 'gain') {
      tdee += 300 // Superávit de 300 kcal
    }

    return Math.round(tdee)
  }

  const calculateMacros = (calories: number) => {
    const { goal } = quizData
    
    let proteinPercent = 0.30
    let carbsPercent = 0.40
    let fatPercent = 0.30

    if (goal === 'gain') {
      proteinPercent = 0.35
      carbsPercent = 0.45
      fatPercent = 0.20
    } else if (goal === 'lose') {
      proteinPercent = 0.35
      carbsPercent = 0.30
      fatPercent = 0.35
    }

    return {
      protein_g: Math.round((calories * proteinPercent) / 4),
      carbs_g: Math.round((calories * carbsPercent) / 4),
      fat_g: Math.round((calories * fatPercent) / 9),
    }
  }

  const handleFinish = async () => {
    if (!userId) return

    try {
      const dailyCalories = calculateCalories()
      const macros = calculateMacros(dailyCalories)

      // Salvar no perfil
      await supabase.from('profiles').upsert({
        user_id: userId,
        age: quizData.age,
        weight: quizData.weight,
        height: quizData.height,
        goal: quizData.goal,
        onboarding_completed: true,
      })

      // Salvar configurações
      await supabase.from('settings').upsert({
        user_id: userId,
        daily_calories: dailyCalories,
        daily_protein_g: macros.protein_g,
        daily_carbs_g: macros.carbs_g,
        daily_fat_g: macros.fat_g,
        daily_water_ml: 2000,
        activity_level: quizData.activityLevel,
        target_weight: quizData.targetWeight,
      })

      toast.success('Perfil configurado com sucesso!')
      router.push('/upgrade')
    } catch (error) {
      console.error('Erro ao salvar quiz:', error)
      toast.error('Erro ao salvar dados')
    }
  }

  const nextStep = () => {
    if (step < 7) {
      setStep(step + 1)
    } else {
      handleFinish()
    }
  }

  const prevStep = () => {
    if (step > 0) setStep(step - 1)
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é o seu objetivo?</h2>
            <p className="text-white/60 mb-6">Escolha o que melhor descreve sua meta</p>
            <div className="grid gap-3">
              {GOALS.map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => {
                    setQuizData({ ...quizData, goal: goal.id })
                    setTimeout(nextStep, 300)
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    quizData.goal === goal.id
                      ? 'border-[#62D8B5] bg-[#62D8B5]/10'
                      : 'border-white/10 bg-[#1A1A1A] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{goal.emoji}</span>
                    <span className="text-xl font-semibold text-white">{goal.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é o seu sexo?</h2>
            <p className="text-white/60 mb-6">Isso nos ajuda a calcular suas necessidades</p>
            <div className="grid gap-3">
              {GENDERS.map((gender) => (
                <button
                  key={gender.id}
                  onClick={() => {
                    setQuizData({ ...quizData, gender: gender.id })
                    setTimeout(nextStep, 300)
                  }}
                  className={`p-6 rounded-2xl border-2 transition-all text-left ${
                    quizData.gender === gender.id
                      ? 'border-[#62D8B5] bg-[#62D8B5]/10'
                      : 'border-white/10 bg-[#1A1A1A] hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{gender.emoji}</span>
                    <span className="text-xl font-semibold text-white">{gender.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é a sua idade?</h2>
            <p className="text-white/60 mb-6">Selecione sua faixa etária</p>
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-[#62D8B5]">{quizData.age}</span>
                <span className="text-2xl text-white/60 ml-2">anos</span>
              </div>
              <input
                type="range"
                min="15"
                max="80"
                value={quizData.age}
                onChange={(e) => setQuizData({ ...quizData, age: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62D8B5]"
              />
              <div className="flex justify-between text-white/40 text-sm mt-2">
                <span>15</span>
                <span>80</span>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é a sua altura?</h2>
            <p className="text-white/60 mb-6">Em centímetros</p>
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-[#62D8B5]">{quizData.height}</span>
                <span className="text-2xl text-white/60 ml-2">cm</span>
              </div>
              <input
                type="range"
                min="140"
                max="220"
                value={quizData.height}
                onChange={(e) => setQuizData({ ...quizData, height: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62D8B5]"
              />
              <div className="flex justify-between text-white/40 text-sm mt-2">
                <span>140 cm</span>
                <span>220 cm</span>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é o seu peso atual?</h2>
            <p className="text-white/60 mb-6">Em quilogramas</p>
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-[#62D8B5]">{quizData.weight}</span>
                <span className="text-2xl text-white/60 ml-2">kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={quizData.weight}
                onChange={(e) => setQuizData({ ...quizData, weight: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62D8B5]"
              />
              <div className="flex justify-between text-white/40 text-sm mt-2">
                <span>40 kg</span>
                <span>200 kg</span>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Qual é o seu peso ideal?</h2>
            <p className="text-white/60 mb-6">Meta de peso em quilogramas</p>
            <div className="bg-[#1A1A1A] rounded-2xl p-8">
              <div className="text-center mb-6">
                <span className="text-6xl font-bold text-[#62D8B5]">{quizData.targetWeight}</span>
                <span className="text-2xl text-white/60 ml-2">kg</span>
              </div>
              <input
                type="range"
                min="40"
                max="200"
                value={quizData.targetWeight}
                onChange={(e) => setQuizData({ ...quizData, targetWeight: parseInt(e.target.value) })}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#62D8B5]"
              />
              <div className="flex justify-between text-white/40 text-sm mt-2">
                <span>40 kg</span>
                <span>200 kg</span>
              </div>
            </div>
            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg transition-all"
            >
              Continuar
            </button>
          </div>
        )

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white mb-2">Nível de atividade física</h2>
            <p className="text-white/60 mb-6">Com que frequência você se exercita?</p>
            <div className="grid gap-3">
              {ACTIVITY_LEVELS.map((level) => (
                <button
                  key={level.id}
                  onClick={() => {
                    setQuizData({ ...quizData, activityLevel: level.id })
                    setTimeout(nextStep, 300)
                  }}
                  className={`p-5 rounded-2xl border-2 transition-all text-left ${
                    quizData.activityLevel === level.id
                      ? 'border-[#62D8B5] bg-[#62D8B5]/10'
                      : 'border-white/10 bg-[#1A1A1A] hover:border-white/30'
                  }`}
                >
                  <div className="font-semibold text-white text-lg mb-1">{level.label}</div>
                  <div className="text-white/50 text-sm">{level.desc}</div>
                </button>
              ))}
            </div>
          </div>
        )

      case 7:
        const weightDiff = quizData.weight - quizData.targetWeight
        const weeksToGoal = Math.abs(Math.round(weightDiff / 0.5)) // 0.5kg por semana
        
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-2">Seu plano personalizado</h2>
            <p className="text-white/60 mb-6">Baseado nas suas respostas</p>
            
            {/* Gráfico de Progresso */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6">
              <div className="flex items-end justify-between h-40 mb-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-32 bg-gradient-to-t from-[#62D8B5] to-[#AEE2FF] rounded-t-xl"></div>
                  <span className="text-sm text-white/60">Atual</span>
                  <span className="font-bold text-white">{quizData.weight}kg</span>
                </div>
                
                <div className="flex-1 mx-4 border-t-2 border-dashed border-white/20 relative top-8">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#1A1A1A] px-3 py-1 rounded-full text-xs text-white/60">
                    {weeksToGoal} semanas
                  </div>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <div className="w-16 h-24 bg-gradient-to-t from-yellow-500 to-orange-500 rounded-t-xl"></div>
                  <span className="text-sm text-white/60">Meta</span>
                  <span className="font-bold text-white">{quizData.targetWeight}kg</span>
                </div>
              </div>
            </div>

            {/* Resumo */}
            <div className="bg-[#1A1A1A] rounded-2xl p-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-white/60">Calorias diárias</span>
                <span className="font-bold text-white">{calculateCalories()} kcal</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Proteínas</span>
                <span className="font-bold text-white">{calculateMacros(calculateCalories()).protein_g}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Carboidratos</span>
                <span className="font-bold text-white">{calculateMacros(calculateCalories()).carbs_g}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Gorduras</span>
                <span className="font-bold text-white">{calculateMacros(calculateCalories()).fat_g}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60">Água diária</span>
                <span className="font-bold text-white">2L</span>
              </div>
            </div>

            <button
              onClick={nextStep}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Finalizar
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-4">
      <div className="max-w-md mx-auto pt-8 pb-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {step > 0 && (
            <button
              onClick={prevStep}
              className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
          )}
          
          <div className="flex-1 mx-4">
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / 8) * 100}%` }}
                className="h-full bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF]"
              />
            </div>
            <p className="text-center text-white/60 text-sm mt-2">
              {step + 1} de 8
            </p>
          </div>

          <div className="w-10" />
        </div>

        {/* Conteúdo */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
