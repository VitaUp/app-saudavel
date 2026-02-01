'use client'

import { motion } from 'framer-motion'
import { Play, Clock, Flame, Dumbbell, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TodayWorkoutCardProps {
  workout: {
    name: string
    description: string
    duration_minutes: number
    type: string
    exercises?: any[]
  } | null
  onStartWorkout: () => void
  onGenerateWorkout: () => void
}

export function TodayWorkoutCard({ workout, onStartWorkout, onGenerateWorkout }: TodayWorkoutCardProps) {
  if (!workout) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#AEE2FF] via-[#7BE7C2] to-[#AEE2FF] p-8 shadow-2xl"
      >
        {/* Padrão de fundo decorativo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-32 h-32 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-white blur-3xl" />
        </div>

        <div className="relative z-10 text-center">
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
            className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h3 className="text-2xl font-bold text-white mb-3">
            Nenhum treino gerado ainda
          </h3>
          <p className="text-white/90 mb-6 max-w-md mx-auto">
            Clique no botão abaixo para criar seu treino personalizado com inteligência artificial
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onGenerateWorkout}
              className="bg-white hover:bg-white/90 text-[#1B3954] font-bold px-8 py-6 rounded-full shadow-xl text-lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Criar Treino com IA
            </Button>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  const estimatedCalories = Math.round(workout.duration_minutes * 6.5)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-white shadow-xl border-2 border-gray-100"
    >
      {/* Imagem ilustrativa de fundo */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#AEE2FF]/20 via-transparent to-[#7BE7C2]/20" />
      
      {/* Padrão decorativo */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#7BE7C2]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-[#AEE2FF]/10 to-transparent rounded-full blur-3xl" />

      <div className="relative z-10 p-6 sm:p-8">
        {/* Badge de destaque */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg"
        >
          <Dumbbell className="w-4 h-4" />
          Treino de Hoje
        </motion.div>

        {/* Conteúdo principal */}
        <div className="mb-6">
          <h3 className="text-3xl font-bold text-[#1B3954] mb-2">
            {workout.name}
          </h3>
          <p className="text-gray-600 text-lg">
            {workout.description}
          </p>
        </div>

        {/* Estatísticas */}
        <div className="flex flex-wrap gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-[#AEE2FF]/20 px-4 py-3 rounded-2xl"
          >
            <Clock className="w-5 h-5 text-[#1B3954]" />
            <div>
              <div className="text-xs text-gray-600">Duração</div>
              <div className="text-lg font-bold text-[#1B3954]">{workout.duration_minutes} min</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-[#7BE7C2]/20 px-4 py-3 rounded-2xl"
          >
            <Flame className="w-5 h-5 text-[#FF6B6B]" />
            <div>
              <div className="text-xs text-gray-600">Calorias</div>
              <div className="text-lg font-bold text-[#1B3954]">~{estimatedCalories} kcal</div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 bg-[#1B3954]/10 px-4 py-3 rounded-2xl"
          >
            <Dumbbell className="w-5 h-5 text-[#1B3954]" />
            <div>
              <div className="text-xs text-gray-600">Tipo</div>
              <div className="text-lg font-bold text-[#1B3954]">{workout.type}</div>
            </div>
          </motion.div>
        </div>

        {/* Botão de ação */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={onStartWorkout}
            className="w-full bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] hover:opacity-90 text-white font-bold py-6 rounded-2xl text-lg shadow-xl transition-all duration-300"
          >
            <Play className="w-6 h-6 mr-2" />
            Iniciar Treino
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
