'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Sparkles, Apple, Dumbbell, Moon, Trophy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { rounded, animations } from '@/lib/design-system'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)

  const steps = [
    {
      icon: Sparkles,
      title: 'Bem-vindo ao VitaUp!',
      description: 'Seu app completo de saúde e bem-estar com inteligência artificial',
      color: 'from-[#AEE2FF] to-[#62D8B5]'
    },
    {
      icon: Apple,
      title: 'Nutrição Inteligente',
      description: 'Tire foto das refeições e receba análise completa de calorias e macros',
      color: 'from-[#62D8B5] to-[#AEE2FF]'
    },
    {
      icon: Dumbbell,
      title: 'Treinos Personalizados',
      description: 'Planos adaptados ao seu nível e objetivos com acompanhamento em tempo real',
      color: 'from-[#AEE2FF] to-[#62D8B5]'
    },
    {
      icon: Moon,
      title: 'Análise de Sono',
      description: 'Monitore suas fases de sono e melhore sua qualidade de descanso',
      color: 'from-[#62D8B5] to-[#AEE2FF]'
    },
    {
      icon: Trophy,
      title: 'Gamificação',
      description: 'Ganhe XP, medalhas e conquiste seus objetivos de forma divertida',
      color: 'from-[#AEE2FF] to-[#62D8B5]'
    }
  ]

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      router.push('/quiz')
    }
  }

  const handleSkip = () => {
    router.push('/quiz')
  }

  const currentStepData = steps[currentStep]
  const Icon = currentStepData.icon

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Skip Button */}
      <div className="absolute top-6 right-6 z-10">
        <Button
          variant="ghost"
          onClick={handleSkip}
          className="text-[#0A0A0A]/70 hover:text-[#0A0A0A] hover:bg-[#AEE2FF]/10 rounded-full transition-all duration-300"
        >
          Pular
        </Button>
      </div>

      {/* Progress Dots */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'w-8 bg-[#62D8B5]'
                : index < currentStep
                ? 'w-2 bg-[#AEE2FF]'
                : 'w-2 bg-[#0A0A0A]/10'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-8 py-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="max-w-md w-full text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className={`w-28 h-28 mx-auto mb-12 rounded-3xl bg-gradient-to-br ${currentStepData.color} flex items-center justify-center shadow-2xl`}
            >
              <Icon className="w-14 h-14 text-white" />
            </motion.div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0A0A0A] mb-6 leading-tight">
              {currentStepData.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-[#0A0A0A]/70 leading-relaxed">
              {currentStepData.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Button */}
      <div className="p-8 pb-10">
        <Button
          onClick={handleNext}
          size="lg"
          className="w-full h-16 bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-[#0A0A0A] font-semibold text-base rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95"
        >
          {currentStep < steps.length - 1 ? 'Continuar' : 'Começar'}
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}
