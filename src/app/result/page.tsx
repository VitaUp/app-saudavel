'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Apple, Dumbbell, Moon, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ResultPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [quizData, setQuizData] = useState<any>(null)

  useEffect(() => {
    // Carregar dados do quiz
    const data = localStorage.getItem('vitaup_quiz_data')
    if (data) {
      setQuizData(JSON.parse(data))
    }

    // Simular processamento da IA
    setTimeout(() => {
      setLoading(false)
    }, 3000)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mb-8 rounded-3xl bg-gradient-to-br from-[#3BAEA0] to-[#1E90FF] flex items-center justify-center shadow-2xl"
        >
          <Sparkles className="w-12 h-12 text-white" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 text-center"
        >
          A IA CoachUp está preparando<br />seu plano personalizado...
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex gap-2 mt-8"
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}
        </motion.div>
      </div>
    )
  }

  const calculateBMI = () => {
    if (!quizData?.weight || !quizData?.height) return 0
    const heightInMeters = parseInt(quizData.height) / 100
    return (parseInt(quizData.weight) / (heightInMeters * heightInMeters)).toFixed(1)
  }

  const calculateCalories = () => {
    if (!quizData?.weight || !quizData?.age || !quizData?.sex) return 2000
    
    let bmr = 0
    const weight = parseInt(quizData.weight)
    const height = parseInt(quizData.height)
    const age = parseInt(quizData.age)

    // Fórmula de Harris-Benedict
    if (quizData.sex === 'Masculino') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    }

    // Ajustar pelo nível de atividade
    const activityMultiplier = {
      'Sedentário (sentado)': 1.2,
      'Levemente ativo': 1.375,
      'Moderadamente ativo': 1.55,
      'Muito ativo': 1.725
    }[quizData.dailyRoutine] || 1.2

    let calories = bmr * activityMultiplier

    // Ajustar pelo objetivo
    if (quizData.goal === 'Emagrecer') {
      calories -= 500
    } else if (quizData.goal === 'Ganhar massa muscular') {
      calories += 300
    }

    return Math.round(calories)
  }

  const bmi = calculateBMI()
  const dailyCalories = calculateCalories()
  const protein = Math.round(parseInt(quizData?.weight || 70) * 2)
  const carbs = Math.round(dailyCalories * 0.45 / 4)
  const fats = Math.round(dailyCalories * 0.25 / 9)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-[#3BAEA0] to-[#1E90FF] flex items-center justify-center shadow-2xl">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Seu plano está pronto, {quizData?.name}! 🎉
          </h1>
          <p className="text-lg text-gray-600">
            Preparamos um plano personalizado baseado nas suas respostas
          </p>
        </motion.div>

        {/* Cards */}
        <div className="space-y-6 mb-12">
          {/* Nutrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3BAEA0] to-[#2D9B8F] flex items-center justify-center">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plano Nutricional</h3>
                <p className="text-sm text-gray-600">Personalizado para {quizData?.goal?.toLowerCase()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{dailyCalories}</div>
                <div className="text-sm text-gray-600">Calorias/dia</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{bmi}</div>
                <div className="text-sm text-gray-600">IMC</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600 mb-2">Macros diários:</div>
              <div className="flex gap-4 text-sm">
                <span className="text-gray-900"><strong>{protein}g</strong> proteína</span>
                <span className="text-gray-900"><strong>{carbs}g</strong> carboidratos</span>
                <span className="text-gray-900"><strong>{fats}g</strong> gorduras</span>
              </div>
            </div>
          </motion.div>

          {/* Treino */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#1E80EF] flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Plano de Treino</h3>
                <p className="text-sm text-gray-600">Nível {quizData?.fitnessLevel?.toLowerCase()}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-gray-900 font-medium">Frequência</span>
                <span className="text-gray-600">{quizData?.trainingTime}</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                <span className="text-gray-900 font-medium">Foco</span>
                <span className="text-gray-600">{quizData?.goal}</span>
              </div>
            </div>
          </motion.div>

          {/* Sono */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#7B61FF] to-[#9B7FFF] flex items-center justify-center">
                <Moon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Rotina de Sono</h3>
                <p className="text-sm text-gray-600">Otimizada para seu descanso</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{quizData?.sleepTime || '22:00'}</div>
                <div className="text-sm text-gray-600">Hora de dormir</div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="text-2xl font-bold text-gray-900">{quizData?.wakeTime || '06:00'}</div>
                <div className="text-sm text-gray-600">Hora de acordar</div>
              </div>
            </div>
          </motion.div>

          {/* Próximos Passos */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 text-white"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6" />
              <h3 className="text-xl font-bold">Próximos Passos</h3>
            </div>
            <ul className="space-y-3 text-sm text-white/90">
              <li className="flex items-start gap-2">
                <span className="text-[#3BAEA0] mt-0.5">✓</span>
                <span>Comece registrando sua primeira refeição</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#1E90FF] mt-0.5">✓</span>
                <span>Faça seu primeiro treino personalizado</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#7B61FF] mt-0.5">✓</span>
                <span>Configure o monitoramento de sono</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#F4C430] mt-0.5">✓</span>
                <span>Ganhe XP e suba de nível!</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={() => router.push('/upgrade')}
            size="lg"
            className="w-full h-14 bg-gray-900 hover:bg-gray-800 text-white font-medium text-base rounded-full shadow-lg"
          >
            Continuar
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
