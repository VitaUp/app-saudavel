'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Flame, Clock, Award } from 'lucide-react'
import { useState } from 'react'

interface WorkoutLog {
  id: string
  date: string
  duration_minutes: number
  calories_burned: number
  workout_id?: string
}

interface ProgressSectionProps {
  workoutLogs: WorkoutLog[]
}

export function ProgressSection({ workoutLogs }: ProgressSectionProps) {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null)

  // Preparar dados da semana (últimos 7 dias)
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const today = new Date()
  const weekData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    
    const log = workoutLogs.find(l => l.date === dateStr)
    
    return {
      day: weekDays[date.getDay()],
      date: dateStr,
      duration: log?.duration_minutes || 0,
      calories: log?.calories_burned || 0,
      hasWorkout: !!log
    }
  })

  const maxDuration = Math.max(...weekData.map(d => d.duration), 60)
  const daysWorked = weekData.filter(d => d.hasWorkout).length

  // Mensagem de consistência
  const getConsistencyMessage = () => {
    if (daysWorked === 0) return "Comece sua jornada hoje! 💪"
    if (daysWorked === 1) return "Ótimo começo! Continue assim! 🎯"
    if (daysWorked <= 3) return `Você treinou ${daysWorked} dias nesta semana. Continue firme! 🔥`
    if (daysWorked <= 5) return `Você treinou ${daysWorked} dias nesta semana. Excelente consistência! 🌟`
    return `Você treinou ${daysWorked} dias nesta semana. Incrível! Você é imparável! 🏆`
  }

  // Melhores treinos da semana
  const bestWorkouts = workoutLogs
    .sort((a, b) => (b.calories_burned || 0) - (a.calories_burned || 0))
    .slice(0, 3)

  return (
    <div className="space-y-6">
      {/* Gráfico Semanal */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7BE7C2] to-[#AEE2FF] flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1B3954]">Seu Progresso</h3>
        </div>

        {/* Gráfico de barras */}
        <div className="relative h-48 mb-4">
          <div className="absolute inset-0 flex items-end justify-around gap-2">
            {weekData.map((day, index) => {
              const heightPercent = maxDuration > 0 ? (day.duration / maxDuration) * 100 : 0
              const isHovered = hoveredDay === index

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  {/* Barra */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
                    onMouseEnter={() => setHoveredDay(index)}
                    onMouseLeave={() => setHoveredDay(null)}
                    className={`
                      w-full rounded-t-xl transition-all duration-300 cursor-pointer relative
                      ${day.hasWorkout 
                        ? 'bg-gradient-to-t from-[#7BE7C2] to-[#AEE2FF] shadow-lg' 
                        : 'bg-gray-200'
                      }
                      ${isHovered ? 'opacity-100 scale-105' : 'opacity-90'}
                    `}
                    style={{ minHeight: day.hasWorkout ? '8px' : '4px' }}
                  >
                    {/* Tooltip */}
                    {isHovered && day.hasWorkout && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-[#1B3954] text-white px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shadow-xl z-10"
                      >
                        <div>{day.day}</div>
                        <div>{day.duration} min</div>
                        <div>{day.calories} kcal</div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-[#1B3954]" />
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Label do dia */}
                  <span className={`text-xs font-semibold ${day.hasWorkout ? 'text-[#1B3954]' : 'text-gray-400'}`}>
                    {day.day}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Mensagem de consistência */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-r from-[#AEE2FF]/20 to-[#7BE7C2]/20 rounded-2xl p-4 text-center"
        >
          <p className="text-[#1B3954] font-semibold">
            {getConsistencyMessage()}
          </p>
        </motion.div>
      </div>

      {/* Melhores Treinos da Semana */}
      {bestWorkouts.length > 0 && (
        <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-[#1B3954]">Melhores Treinos</h3>
          </div>

          <div className="space-y-3">
            {bestWorkouts.map((workout, index) => (
              <motion.div
                key={workout.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-gradient-to-r from-[#AEE2FF]/10 to-[#7BE7C2]/10 rounded-2xl p-4 border border-[#7BE7C2]/30 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Medalha */}
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm
                      ${index === 0 ? 'bg-gradient-to-br from-[#FFD700] to-[#FFA500]' : ''}
                      ${index === 1 ? 'bg-gradient-to-br from-[#C0C0C0] to-[#A8A8A8]' : ''}
                      ${index === 2 ? 'bg-gradient-to-br from-[#CD7F32] to-[#B87333]' : ''}
                    `}>
                      {index + 1}º
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-[#1B3954]" />
                        <span className="font-semibold text-[#1B3954]">
                          {workout.duration_minutes} minutos
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-[#FF6B6B]" />
                        <span className="text-sm text-gray-600">
                          {workout.calories_burned} kcal queimadas
                        </span>
                      </div>
                    </div>
                  </div>

                  {index === 0 && (
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Award className="w-6 h-6 text-[#FFD700]" />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
