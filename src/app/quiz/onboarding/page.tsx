'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface QuizData {
  preferredName: string
  age: string
  weight: string
  height: string
  goal: string
  bodyFeeling: string
  dailyImpact: string
  activityLevel: string
  restrictions: string[]
  dietStyle: string
  workoutTime: string
  sleepTime: string
  hasSmartwatch: string
  language: string
  conditions: string[]
}

const questions = [
  {
    id: 'preferredName',
    title: 'Como você prefere ser chamado?',
    subtitle: 'Vamos usar esse nome em todo o app',
    type: 'text',
    placeholder: 'Ex: João, Maria...',
  },
  {
    id: 'age',
    title: 'Qual é a sua idade?',
    type: 'number',
    placeholder: 'Ex: 25',
  },
  {
    id: 'weight',
    title: 'Qual é o seu peso atual?',
    subtitle: 'Em quilogramas',
    type: 'number',
    placeholder: 'Ex: 70',
  },
  {
    id: 'height',
    title: 'Qual é a sua altura?',
    subtitle: 'Em centímetros',
    type: 'number',
    placeholder: 'Ex: 175',
  },
  {
    id: 'goal',
    title: 'Qual é o seu objetivo principal?',
    type: 'select',
    options: [
      { value: 'lose_weight', label: 'Perder peso', emoji: '⚖️' },
      { value: 'gain_muscle', label: 'Ganhar massa muscular', emoji: '💪' },
      { value: 'maintain', label: 'Manter o peso', emoji: '✨' },
      { value: 'improve_health', label: 'Melhorar saúde geral', emoji: '❤️' },
    ],
  },
  {
    id: 'bodyFeeling',
    title: 'Como você se sente com seu corpo hoje?',
    type: 'select',
    options: [
      { value: 'very_satisfied', label: 'Muito satisfeito', emoji: '😊' },
      { value: 'satisfied', label: 'Satisfeito', emoji: '🙂' },
      { value: 'neutral', label: 'Neutro', emoji: '😐' },
      { value: 'unsatisfied', label: 'Insatisfeito', emoji: '😕' },
      { value: 'very_unsatisfied', label: 'Muito insatisfeito', emoji: '😞' },
    ],
  },
  {
    id: 'dailyImpact',
    title: 'Como isso afeta seu dia a dia?',
    type: 'select',
    options: [
      { value: 'no_impact', label: 'Não afeta', emoji: '✅' },
      { value: 'little_impact', label: 'Afeta pouco', emoji: '🤏' },
      { value: 'moderate_impact', label: 'Afeta moderadamente', emoji: '⚠️' },
      { value: 'high_impact', label: 'Afeta muito', emoji: '🔴' },
    ],
  },
  {
    id: 'activityLevel',
    title: 'Qual é o seu nível de atividade física?',
    type: 'select',
    options: [
      { value: 'sedentary', label: 'Sedentário', emoji: '🛋️' },
      { value: 'light', label: 'Leve (1-2x/semana)', emoji: '🚶' },
      { value: 'moderate', label: 'Moderado (3-4x/semana)', emoji: '🏃' },
      { value: 'active', label: 'Ativo (5-6x/semana)', emoji: '💪' },
      { value: 'very_active', label: 'Muito ativo (todos os dias)', emoji: '🔥' },
    ],
  },
  {
    id: 'restrictions',
    title: 'Você tem alguma restrição alimentar?',
    subtitle: 'Selecione todas que se aplicam',
    type: 'multiselect',
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'vegetarian', label: 'Vegetariano' },
      { value: 'vegan', label: 'Vegano' },
      { value: 'lactose', label: 'Intolerância à lactose' },
      { value: 'gluten', label: 'Intolerância ao glúten' },
      { value: 'diabetes', label: 'Diabetes' },
    ],
  },
  {
    id: 'dietStyle',
    title: 'Qual estilo de dieta você prefere?',
    type: 'select',
    options: [
      { value: 'balanced', label: 'Balanceada', emoji: '⚖️' },
      { value: 'low_carb', label: 'Low Carb', emoji: '🥩' },
      { value: 'mediterranean', label: 'Mediterrânea', emoji: '🫒' },
      { value: 'flexible', label: 'Flexível', emoji: '🌈' },
    ],
  },
  {
    id: 'workoutTime',
    title: 'Qual o melhor horário para treinar?',
    type: 'select',
    options: [
      { value: 'morning', label: 'Manhã (6h-12h)', emoji: '🌅' },
      { value: 'afternoon', label: 'Tarde (12h-18h)', emoji: '☀️' },
      { value: 'evening', label: 'Noite (18h-22h)', emoji: '🌙' },
      { value: 'flexible', label: 'Flexível', emoji: '⏰' },
    ],
  },
  {
    id: 'sleepTime',
    title: 'Quantas horas você costuma dormir?',
    type: 'select',
    options: [
      { value: 'less_5', label: 'Menos de 5 horas', emoji: '😴' },
      { value: '5_6', label: '5-6 horas', emoji: '😪' },
      { value: '7_8', label: '7-8 horas', emoji: '😊' },
      { value: 'more_8', label: 'Mais de 8 horas', emoji: '😌' },
    ],
  },
  {
    id: 'hasSmartwatch',
    title: 'Você usa smartwatch?',
    subtitle: 'Para sincronizar dados de treino e sono',
    type: 'select',
    options: [
      { value: 'apple_watch', label: 'Apple Watch', emoji: '⌚' },
      { value: 'wear_os', label: 'WearOS / Galaxy Watch', emoji: '⌚' },
      { value: 'other', label: 'Outro', emoji: '⌚' },
      { value: 'none', label: 'Não uso', emoji: '❌' },
    ],
  },
  {
    id: 'language',
    title: 'Qual idioma você prefere?',
    type: 'select',
    options: [
      { value: 'pt-BR', label: 'Português (Brasil)', emoji: '🇧🇷' },
      { value: 'en', label: 'English', emoji: '🇺🇸' },
      { value: 'es', label: 'Español', emoji: '🇪🇸' },
    ],
  },
  {
    id: 'conditions',
    title: 'Você tem alguma condição de saúde?',
    subtitle: 'Isso nos ajuda a personalizar melhor',
    type: 'multiselect',
    options: [
      { value: 'none', label: 'Nenhuma' },
      { value: 'hypertension', label: 'Hipertensão' },
      { value: 'diabetes', label: 'Diabetes' },
      { value: 'heart', label: 'Problemas cardíacos' },
      { value: 'thyroid', label: 'Problemas de tireoide' },
      { value: 'other', label: 'Outra' },
    ],
  },
]

export default function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<Partial<QuizData>>({})
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>([])
  const router = useRouter()

  const currentQuestion = questions[currentStep]
  const progress = ((currentStep + 1) / questions.length) * 100

  const handleNext = () => {
    if (currentQuestion.type === 'multiselect') {
      setData({ ...data, [currentQuestion.id]: selectedMultiple })
      setSelectedMultiple([])
    }

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Salvar dados e ir para Quiz 2
      console.log('Quiz 1 completo:', data)
      router.push('/quiz/workout')
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
    if (value === 'none') {
      setSelectedMultiple(['none'])
    } else {
      const filtered = selectedMultiple.filter((v) => v !== 'none')
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
    return data[currentQuestion.id as keyof QuizData]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7F7F7] to-white flex flex-col">
      {/* Header com progresso */}
      <div className="p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
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
              {currentStep + 1} de {questions.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Título */}
              <div className="text-center space-y-2">
                <h2 className="text-3xl sm:text-4xl font-bold text-[#0D0D0D]">
                  {currentQuestion.title}
                </h2>
                {currentQuestion.subtitle && (
                  <p className="text-lg text-[#3B3B3B]">
                    {currentQuestion.subtitle}
                  </p>
                )}
              </div>

              {/* Input */}
              <div className="space-y-4">
                {currentQuestion.type === 'text' || currentQuestion.type === 'number' ? (
                  <Input
                    type={currentQuestion.type}
                    value={data[currentQuestion.id as keyof QuizData] || ''}
                    onChange={(e) => handleInputChange(e.target.value)}
                    placeholder={currentQuestion.placeholder}
                    className="h-14 text-lg text-center border-2 border-[#F7F7F7] focus:border-[#FF6A3D]"
                  />
                ) : currentQuestion.type === 'select' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleInputChange(option.value)}
                        className={`p-6 rounded-2xl border-2 transition-all ${
                          data[currentQuestion.id as keyof QuizData] === option.value
                            ? 'border-[#FF6A3D] bg-[#FF6A3D]/5'
                            : 'border-[#F7F7F7] hover:border-[#FF6A3D]/50'
                        }`}
                      >
                        <div className="text-4xl mb-2">{option.emoji}</div>
                        <div className="text-base font-medium text-[#0D0D0D]">
                          {option.label}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : currentQuestion.type === 'multiselect' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentQuestion.options?.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMultiSelect(option.value)}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          selectedMultiple.includes(option.value)
                            ? 'border-[#FF6A3D] bg-[#FF6A3D]/5'
                            : 'border-[#F7F7F7] hover:border-[#FF6A3D]/50'
                        }`}
                      >
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
        <div className="max-w-2xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full h-14 bg-gradient-to-r from-[#FF6A3D] to-[#FF8A5D] hover:from-[#FF5A2D] hover:to-[#FF7A4D] text-white font-semibold rounded-xl shadow-lg text-lg"
          >
            {currentStep === questions.length - 1 ? 'Finalizar' : 'Continuar'}
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
