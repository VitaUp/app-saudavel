'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Check, Clock, Dumbbell, Flame, Trophy, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import confetti from 'canvas-confetti'

interface Exercise {
  nome: string
  series: number
  repeticoes: string
  descanso?: string
}

interface WorkoutModalProps {
  isOpen: boolean
  onClose: () => void
  workout: {
    name: string
    duration_minutes: number
    exercises?: Exercise[]
  } | null
  onComplete: () => void
}

export function WorkoutModal({ isOpen, onClose, workout, onComplete }: WorkoutModalProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [isWorkoutComplete, setIsWorkoutComplete] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTimerRunning && !isWorkoutComplete) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isTimerRunning, isWorkoutComplete])

  // Reset ao abrir
  useEffect(() => {
    if (isOpen) {
      setCurrentExerciseIndex(0)
      setIsWorkoutComplete(false)
      setElapsedTime(0)
      setIsTimerRunning(true)
    }
  }, [isOpen])

  if (!workout) return null

  const exercises = workout.exercises || []
  const currentExercise = exercises[currentExerciseIndex]
  const progress = ((currentExerciseIndex + 1) / exercises.length) * 100

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1)
    } else {
      handleCompleteWorkout()
    }
  }

  const handleCompleteWorkout = () => {
    setIsWorkoutComplete(true)
    setIsTimerRunning(false)
    
    // Animação de confete
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
    
    setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      })
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      })
    }, 250)
  }

  const estimatedCalories = Math.round(workout.duration_minutes * 6.5)
  const earnedXP = 50 + Math.round(elapsedTime / 60) * 5

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          >
            {!isWorkoutComplete ? (
              <>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-br from-[#AEE2FF] to-[#7BE7C2] p-6 rounded-t-3xl">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-white">{workout.name}</h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onClose}
                      className="text-white hover:bg-white/20 rounded-full"
                    >
                      <X className="w-6 h-6" />
                    </Button>
                  </div>

                  {/* Timer e Progresso */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        <span className="text-lg font-bold">{formatTime(elapsedTime)}</span>
                      </div>
                      <div className="text-sm">
                        Exercício {currentExerciseIndex + 1} de {exercises.length}
                      </div>
                    </div>

                    {/* Barra de progresso */}
                    <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                        className="h-full bg-white rounded-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Exercício Atual */}
                <div className="p-6 space-y-6">
                  {currentExercise && (
                    <motion.div
                      key={currentExerciseIndex}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="space-y-6"
                    >
                      {/* Ilustração do exercício */}
                      <div className="relative h-64 bg-gradient-to-br from-[#AEE2FF]/20 to-[#7BE7C2]/20 rounded-3xl flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#7BE7C2]/10 to-transparent" />
                        <Dumbbell className="w-32 h-32 text-[#7BE7C2] opacity-50" />
                      </div>

                      {/* Informações do exercício */}
                      <div className="space-y-4">
                        <h3 className="text-3xl font-bold text-[#1B3954]">
                          {currentExercise.nome}
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#AEE2FF]/20 rounded-2xl p-4">
                            <div className="text-sm text-gray-600 mb-1">Séries</div>
                            <div className="text-2xl font-bold text-[#1B3954]">
                              {currentExercise.series}x
                            </div>
                          </div>

                          <div className="bg-[#7BE7C2]/20 rounded-2xl p-4">
                            <div className="text-sm text-gray-600 mb-1">Repetições</div>
                            <div className="text-2xl font-bold text-[#1B3954]">
                              {currentExercise.repeticoes}
                            </div>
                          </div>
                        </div>

                        {currentExercise.descanso && (
                          <div className="bg-gray-100 rounded-2xl p-4">
                            <div className="text-sm text-gray-600 mb-1">Descanso</div>
                            <div className="text-lg font-semibold text-[#1B3954]">
                              {currentExercise.descanso}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {/* Botão de próximo */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      onClick={handleNextExercise}
                      className="w-full bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] hover:opacity-90 text-white font-bold py-6 rounded-2xl text-lg"
                    >
                      {currentExerciseIndex < exercises.length - 1 ? (
                        <>
                          <Check className="w-6 h-6 mr-2" />
                          Próximo Exercício
                        </>
                      ) : (
                        <>
                          <Trophy className="w-6 h-6 mr-2" />
                          Concluir Treino
                        </>
                      )}
                    </Button>
                  </motion.div>
                </div>
              </>
            ) : (
              /* Tela de Conclusão */
              <div className="p-8 text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-[#7BE7C2] to-[#AEE2FF] flex items-center justify-center"
                >
                  <Trophy className="w-16 h-16 text-white" />
                </motion.div>

                <div>
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold text-[#1B3954] mb-3"
                  >
                    Incrível! 🎉
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-xl text-gray-600"
                  >
                    Você concluiu seu treino de hoje!
                  </motion.p>
                </div>

                {/* Estatísticas */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-3 gap-4"
                >
                  <div className="bg-gradient-to-br from-[#AEE2FF]/20 to-[#7BE7C2]/20 rounded-2xl p-4">
                    <Clock className="w-8 h-8 text-[#1B3954] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#1B3954]">{formatTime(elapsedTime)}</div>
                    <div className="text-xs text-gray-600">Tempo</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#FF6B6B]/20 to-[#FF8E53]/20 rounded-2xl p-4">
                    <Flame className="w-8 h-8 text-[#FF6B6B] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#1B3954]">~{estimatedCalories}</div>
                    <div className="text-xs text-gray-600">kcal</div>
                  </div>

                  <div className="bg-gradient-to-br from-[#FFD700]/20 to-[#FFA500]/20 rounded-2xl p-4">
                    <Sparkles className="w-8 h-8 text-[#FFD700] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#1B3954]">+{earnedXP}</div>
                    <div className="text-xs text-gray-600">XP</div>
                  </div>
                </motion.div>

                {/* Mensagem motivacional */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-[#7BE7C2]/20 to-[#AEE2FF]/20 rounded-2xl p-6 border-2 border-[#7BE7C2]/30"
                >
                  <p className="text-lg font-semibold text-[#1B3954]">
                    "Cada treino é um passo mais perto do seu objetivo! 💪🔥"
                  </p>
                </motion.div>

                {/* Botão de fechar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={() => {
                      onComplete()
                      onClose()
                    }}
                    className="w-full bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] hover:opacity-90 text-white font-bold py-6 rounded-2xl text-lg"
                  >
                    Finalizar
                  </Button>
                </motion.div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
