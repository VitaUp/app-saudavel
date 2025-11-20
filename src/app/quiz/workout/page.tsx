'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft, Dumbbell, Home, Clock, Calendar, Zap, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface WorkoutQuizData {
  motivation: string
  bodyAreas: string[]
  location: string
  equipment: string[]
  minutesPerDay: string
  daysPerWeek: string
  experience: string
  intensity: string
  workoutType: string
  injuries: string[]
}

const workoutQuestions = [
  {
    id: 'motivation',
    title: 'O que te motiva a treinar?',
    subtitle: 'Escolha sua principal motivação',
    icon: Target,
    type: 'select',
    options: [
      { value: 'lose_weight', label: 'Perder peso', emoji: '⚖️' },
      { value: 'gain_muscle', label: 'Ganhar músculos', emoji: '💪' },
      { value: 'get_stronger', label: 'Ficar mais forte', emoji: '🔥' },
      { value: 'improve_health', label: 'Melhorar saúde', emoji: '❤️' },
      { value: 'feel_better', label: 'Me sentir melhor', emoji: '😊' },
    ],
  },
  {
    id: 'bodyAreas',
    title: 'Quais áreas você quer focar?',
    subtitle: 'Selecione todas que se aplicam',
    icon: Dumbbell,
    type: 'multiselect',
    options: [
      { value: 'full_body', label: 'Corpo todo', emoji: '🧍' },
      { value: 'abs', label: 'Abdômen', emoji: '🔲' },
      { value: 'arms', label: 'Braços', emoji: '💪' },
      { value: 'chest', label: 'Peito', emoji: '🫁' },
      { value: 'back', label: 'Costas', emoji: '🔙' },
      { value: 'legs', label: 'Pernas', emoji: '🦵' },
      { value: 'glutes', label: 'Glúteos', emoji: '🍑' },
    ],
  },
  {
    id: 'location',
    title: 'Onde você vai treinar?',
    icon: Home,
    type: 'select',
    options: [
      { value: 'home', label: 'Em casa', emoji: '🏠' },
      { value: 'gym', label: 'Na academia', emoji: '🏋️' },
      { value: 'both', label: 'Ambos', emoji: '🔄' },
    ],
  },
  {
    id: 'equipment',
    title: 'Quais equipamentos você tem?',
    subtitle: 'Selecione todos disponíveis',
    type: 'multiselect',
    options: [
      { value: 'none', label: 'Nenhum (peso corporal)' },
      { value: 'dumbbells', label: 'Halteres' },
      { value: 'resistance_bands', label: 'Faixas elásticas' },
      { value: 'pull_up_bar', label: 'Barra fixa' },
      { value: 'bench', label: 'Banco' },
      { value: 'full_gym', label: 'Academia completa' },
    ],
  },
  {
    id: 'minutesPerDay',
    title: 'Quanto tempo por treino?',
    icon: Clock,
    type: 'select',
    options: [
      { value: '15', label: '15 minutos', emoji: '⚡' },
      { value: '30', label: '30 minutos', emoji: '⏱️' },
      { value: '45', label: '45 minutos', emoji: '⏰' },
      { value: '60', label: '60 minutos', emoji: '🕐' },
      { value: '60+', label: 'Mais de 60 minutos', emoji: '⏳' },
    ],
  },
  {
    id: 'daysPerWeek',
    title: 'Quantos dias por semana?',
    icon: Calendar,
    type: 'select',
    options: [
      { value: '2', label: '2 dias', emoji: '📅' },
      { value: '3', label: '3 dias', emoji: '📅' },
      { value: '4', label: '4 dias', emoji: '📅' },
      { value: '5', label: '5 dias', emoji: '📅' },
      { value: '6', label: '6 dias', emoji: '📅' },
      { value: '7', label: 'Todos os dias', emoji: '🔥' },
    ],
  },
  {
    id: 'experience',
    title: 'Qual sua experiência com treinos?',
    type: 'select',
    options: [
      { value: 'beginner', label: 'Iniciante', emoji: '🌱', desc: 'Nunca treinei ou parei há muito tempo' },
      { value: 'intermediate', label: 'Intermediário', emoji: '💪', desc: 'Treino há alguns meses' },
      { value: 'advanced', label: 'Avançado', emoji: '🔥', desc: 'Treino regularmente há anos' },
    ],
  },
  {
    id: 'intensity',
    title: 'Qual intensidade você prefere?',
    icon: Zap,
    type: 'select',
    options: [
      { value: 'light', label: 'Leve', emoji: '🌤️', desc: 'Quero começar devagar' },
      { value: 'moderate', label: 'Moderada', emoji: '⚡', desc: 'Um desafio equilibrado' },
      { value: 'intense', label: 'Intensa', emoji: '🔥', desc: 'Quero me desafiar ao máximo' },
    ],
  },
  {
    id: 'workoutType',
    title: 'Que tipo de treino você prefere?',
    type: 'select',
    options: [
      { value: 'strength', label: 'Força', emoji: '💪', desc: 'Foco em músculos e força' },
      { value: 'cardio', label: 'Cardio', emoji: '🏃', desc: 'Foco em resistência' },
      { value: 'hiit', label: 'HIIT', emoji: '⚡', desc: 'Alta intensidade intervalada' },
      { value: 'mixed', label: 'Misto', emoji: '🔄', desc: 'Combinação de tudo' },
    ],
  },
  {
    id: 'injuries',
    title: 'Você tem alguma lesão ou limitação?',
    subtitle: 'Vamos adaptar os exercícios para você',
    type: 'multiselect',
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'knee', label: 'Joelho' },
      { value: 'back', label: 'Costas' },
      { value: 'shoulder', label: 'Ombro' },
      { value: 'wrist', label: 'Pulso' },
      { value: 'other', label: 'Outra' },
    ],
  },
]

export default function WorkoutQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Partial<WorkoutQuizData>>({})
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([])
  const router = useRouter()

  const currentQuestion = workoutQuestions[currentStep]
  const progress = ((currentStep + 1) / workoutQuestions.length) * 100

  const handleNext = () => {
    if (currentQuestion.type === 'multiselect') {
      setData({ ...data, [currentQuestion.id]: selectedMultiple })
      setSelectedMultiple([])
    }

    if (currentStep < workoutQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Salvar dados e ir para Home
      console.log('Quiz 2 completo:', data)
      router.push('/home')
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (value: string) => {
    setData({ ...data, [currentQuestion.id]: value })
  }

  const handleMultiSelect = (value: string) => {
    if (value === 'none' || value === 'full_body') {
      setSelectedMultiple([value])
    } else {
      const filtered = selectedMultiple.filter((v) => v !== 'none' && v !== 'full_body')
      if (selectedMultiple.includes(value)) {
        setSelectedMultiple(filtered.filter((v) => v !== value))
      } else {
        setSelectedMultiple([...filtered, value])
      }
    }
  }

  const canProceed = () => {
    if (currentQuestion.type === 'multiselect') {
      return selectedMultiple.length > 0
    }
    return data[currentQuestion.id as keyof WorkoutQuizData]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E90FF]/10 via-white to-[#FF6A3D]/10 flex flex-col">
      {/* Header */}
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <span className="text-sm text-[#3B3B3B] font-medium">
              {currentStep + 1} de {workoutQuestions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-[#F7F7F7]" />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Ícone e Título */}
              <div className="text-center space-y-4">
                {currentQuestion.icon && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#1E90FF] to-[#FF6A3D] rounded-2xl"
                  >
                    <currentQuestion.icon className="w-8 h-8 text-white" />
                  </motion.div>
                )}
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D0D]">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-lg text-[#3B3B3B]">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Opções */}
              <div className="space-y-3">
                {currentQuestion.type === 'select' ? (
                  <div className="grid grid-cols-1 gap-3">
                    {currentQuestion.options?.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleInputChange(option.value)}
                        className={`p-6 rounded-2xl border-2 transition-all text-left ${
                          data[currentQuestion.id as keyof WorkoutQuizData] === option.value
                            ? 'border-[#1E90FF] bg-[#1E90FF]/5 shadow-lg'
                            : 'border-[#F7F7F7] hover:border-[#1E90FF]/50 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-4xl">{option.emoji}</div>
                          <div className="flex-1">
                            <div className="text-lg font-semibold text-[#0D0D0D]">
                              {option.label}
                            </div>
                            {option.desc && (
                              <div className="text-sm text-[#3B3B3B] mt-1">
                                {option.desc}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'multiselect' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {currentQuestion.options?.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMultiSelect(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMultiple.includes(option.value)
                            ? 'border-[#1E90FF] bg-[#1E90FF]/5'
                            : 'border-[#F7F7F7] hover:border-[#1E90FF]/50 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-2">{option.emoji}</div>
                        <div className="text-sm font-medium text-[#0D0D0D]">
                          {option.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Botão inferior */}
      <div className="p-4 sm:p-6">
        <div className="max-w-3xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-14 bg-gradient-to-r from-[#1E90FF] to-[#FF6A3D] hover:from-[#1E80EF] hover:to-[#FF5A2D] text-white font-semibold rounded-xl shadow-lg text-lg"
          >
            {currentStep === workoutQuestions.length - 1 ? 'Começar minha jornada' : 'Continuar'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
