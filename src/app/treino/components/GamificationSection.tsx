'use client'

import { motion } from 'framer-motion'
import { Trophy, Flame, TrendingUp, Award, Star, Zap } from 'lucide-react'

interface GamificationData {
  level: number
  xp: number
  daily_streak: number
  total_workouts: number
  badges?: string[]
}

interface GamificationSectionProps {
  gamification: GamificationData | null
}

const BADGES = [
  { id: 'first_workout', name: 'Primeiro Treino', description: 'Completou seu primeiro treino', icon: Star, color: 'from-blue-400 to-cyan-500' },
  { id: 'week_streak', name: '7 Dias Seguidos', description: 'Treinou 7 dias consecutivos', icon: Flame, color: 'from-orange-400 to-red-500' },
  { id: 'first_week', name: 'Primeira Semana', description: 'Completou sua primeira semana', icon: Trophy, color: 'from-yellow-400 to-amber-500' },
  { id: 'level_5', name: 'Nível 5', description: 'Alcançou o nível 5', icon: Zap, color: 'from-purple-400 to-pink-500' },
  { id: 'month_complete', name: 'Mês Completo', description: 'Treinou um mês inteiro', icon: Award, color: 'from-green-400 to-emerald-500' },
]

export function GamificationSection({ gamification }: GamificationSectionProps) {
  if (!gamification) return null

  const xpForNextLevel = gamification.level * 100
  const xpProgress = (gamification.xp % 100) / 100 * 100

  // Medalhas conquistadas (simulação - você pode ajustar baseado nos dados reais)
  const earnedBadges = BADGES.filter((_, index) => {
    if (index === 0) return gamification.total_workouts >= 1
    if (index === 1) return gamification.daily_streak >= 7
    if (index === 2) return gamification.total_workouts >= 7
    if (index === 3) return gamification.level >= 5
    return false
  })

  return (
    <div className="space-y-6">
      {/* Card de Nível e XP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-[#1B3954] to-[#2a4a6a] rounded-3xl p-6 shadow-2xl text-white overflow-hidden relative"
      >
        {/* Padrão decorativo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#7BE7C2]/10 rounded-full blur-3xl" />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-sm text-white/70 mb-1">Seu Nível</div>
              <div className="text-4xl font-bold">Nível {gamification.level}</div>
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-[#7BE7C2] to-[#AEE2FF] flex items-center justify-center"
            >
              <TrendingUp className="w-8 h-8 text-white" />
            </motion.div>
          </div>

          {/* Barra de XP */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Experiência</span>
              <span className="text-sm font-bold text-[#7BE7C2]">
                {gamification.xp % 100} / {xpForNextLevel} XP
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden backdrop-blur-sm">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${xpProgress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] rounded-full relative"
              >
                <div className="absolute inset-0 bg-white/20 animate-pulse" />
              </motion.div>
            </div>
            <p className="text-xs text-white/60 mt-2">
              {xpForNextLevel - (gamification.xp % 100)} XP para o próximo nível
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B6B] to-[#FF8E53] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gamification.daily_streak}</div>
                  <div className="text-xs text-white/70">dias seguidos</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{gamification.total_workouts}</div>
                  <div className="text-xs text-white/70">treinos totais</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Medalhas */}
      <div className="bg-white rounded-3xl p-6 shadow-lg border-2 border-gray-100">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-[#1B3954]">Suas Conquistas</h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {BADGES.map((badge, index) => {
            const Icon = badge.icon
            const isEarned = earnedBadges.some(b => b.id === badge.id)

            return (
              <motion.div
                key={badge.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: isEarned ? 1.05 : 1 }}
                className={`
                  relative rounded-2xl p-4 text-center transition-all duration-300
                  ${isEarned 
                    ? `bg-gradient-to-br ${badge.color} shadow-lg cursor-pointer` 
                    : 'bg-gray-100 opacity-50 cursor-not-allowed'
                  }
                `}
              >
                {/* Ícone */}
                <div className={`
                  w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center
                  ${isEarned ? 'bg-white/20 backdrop-blur-sm' : 'bg-gray-200'}
                `}>
                  <Icon className={`w-8 h-8 ${isEarned ? 'text-white' : 'text-gray-400'}`} />
                </div>

                {/* Nome */}
                <h4 className={`text-sm font-bold mb-1 ${isEarned ? 'text-white' : 'text-gray-500'}`}>
                  {badge.name}
                </h4>

                {/* Descrição (tooltip) */}
                {isEarned && (
                  <div className="absolute inset-x-0 top-full mt-2 opacity-0 hover:opacity-100 transition-opacity duration-300 z-10">
                    <div className="bg-[#1B3954] text-white text-xs p-2 rounded-xl shadow-xl">
                      {badge.description}
                    </div>
                  </div>
                )}

                {/* Badge de "Bloqueado" */}
                {!isEarned && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">🔒</span>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Streak especial */}
        {gamification.daily_streak >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-r from-[#FF6B6B]/20 to-[#FF8E53]/20 rounded-2xl p-4 border-2 border-[#FF6B6B]/30"
          >
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Flame className="w-8 h-8 text-[#FF6B6B]" />
              </motion.div>
              <div>
                <h4 className="font-bold text-[#1B3954]">
                  🔥 {gamification.daily_streak} dias seguidos treinando!
                </h4>
                <p className="text-sm text-gray-600">Continue assim para desbloquear mais conquistas!</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
