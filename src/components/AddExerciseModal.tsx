'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Dumbbell } from 'lucide-react'

interface AddExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onAddExercise: (exercise: { name: string; duration: number; calories: number }) => void
}

export default function AddExerciseModal({ isOpen, onClose, onAddExercise }: AddExerciseModalProps) {
  const [exerciseName, setExerciseName] = useState('')
  const [duration, setDuration] = useState(30)
  const [selectedType, setSelectedType] = useState<string>('')

  const exerciseTypes = [
    { name: 'Caminhada', calories: 4, icon: '🚶' },
    { name: 'Corrida', calories: 10, icon: '🏃' },
    { name: 'Ciclismo', calories: 8, icon: '🚴' },
    { name: 'Natação', calories: 9, icon: '🏊' },
    { name: 'Musculação', calories: 6, icon: '💪' },
    { name: 'Yoga', calories: 3, icon: '🧘' },
    { name: 'Dança', calories: 7, icon: '💃' },
    { name: 'Futebol', calories: 9, icon: '⚽' },
  ]

  const handleAddExercise = () => {
    const exercise = exerciseTypes.find(e => e.name === selectedType)
    if (exercise && duration > 0) {
      const totalCalories = Math.round(exercise.calories * duration)
      onAddExercise({
        name: exercise.name,
        duration,
        calories: totalCalories
      })
      onClose()
      // Reset
      setSelectedType('')
      setDuration(30)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-[#1A1A1A] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-6 h-6 text-[#62D8B5]" />
                Adicionar Exercício
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <label className="block text-sm text-white/60 mb-3">
                  Tipo de Exercício
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {exerciseTypes.map((exercise) => (
                    <button
                      key={exercise.name}
                      onClick={() => setSelectedType(exercise.name)}
                      className={`p-4 rounded-2xl border-2 transition-all ${
                        selectedType === exercise.name
                          ? 'bg-[#62D8B5]/20 border-[#62D8B5]'
                          : 'bg-white/5 border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="text-3xl mb-2">{exercise.icon}</div>
                      <p className="font-semibold text-white text-sm">{exercise.name}</p>
                      <p className="text-xs text-white/60 mt-1">
                        ~{exercise.calories} kcal/min
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm text-white/60 mb-2">
                      Duração (minutos)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      min="1"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#62D8B5] transition-colors"
                    />
                  </div>

                  <div className="p-4 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl border border-orange-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/60 mb-1">Calorias Estimadas</p>
                        <p className="text-3xl font-bold text-white">
                          {Math.round(
                            (exerciseTypes.find(e => e.name === selectedType)?.calories || 0) * duration
                          )}
                        </p>
                      </div>
                      <div className="text-5xl">🔥</div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Footer */}
            {selectedType && (
              <div className="p-6 border-t border-white/10 bg-[#0A0A0A]">
                <button
                  onClick={handleAddExercise}
                  disabled={!selectedType || duration <= 0}
                  className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-2xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Exercício
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
