'use client'

import { motion } from 'framer-motion'
import { Sparkles, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TreinoHeaderProps {
  onGenerateWorkout: () => void
  isGenerating: boolean
  gamification: {
    level: number
    xp: number
  } | null
}

export function TreinoHeader({ onGenerateWorkout, isGenerating, gamification }: TreinoHeaderProps) {
  const [showProfileModal, setShowProfileModal] = useState(false)

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Avatar do usuário */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowProfileModal(true)}
              className="relative"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#AEE2FF] to-[#7BE7C2] flex items-center justify-center border-2 border-white shadow-lg">
                <User className="w-6 h-6 text-white" />
              </div>
              {gamification && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#1B3954] text-white text-xs font-bold flex items-center justify-center border-2 border-white">
                  {gamification.level}
                </div>
              )}
            </motion.button>

            {/* Título */}
            <h1 className="text-2xl font-bold text-[#1B3954]">Treinos</h1>

            {/* Botão Gerar Treino */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onGenerateWorkout}
                disabled={isGenerating}
                className="bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] hover:opacity-90 text-white font-semibold rounded-full px-4 py-2 shadow-lg transition-all duration-300"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Gerar com IA</span>
                <span className="sm:hidden">IA</span>
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Mini Modal de Progresso */}
      {showProfileModal && gamification && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowProfileModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
          >
            <div className="text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#AEE2FF] to-[#7BE7C2] flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
                <User className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-[#1B3954] mb-2">Nível {gamification.level}</h2>
              <p className="text-gray-600">Você está evoluindo!</p>
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-[#AEE2FF]/20 to-[#7BE7C2]/20 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-[#1B3954]">XP Total</span>
                  <span className="text-lg font-bold text-[#7BE7C2]">{gamification.xp}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(gamification.xp % 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-[#7BE7C2] to-[#AEE2FF] rounded-full"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {100 - (gamification.xp % 100)} XP para o próximo nível
                </p>
              </div>

              <Button
                onClick={() => setShowProfileModal(false)}
                className="w-full bg-[#1B3954] hover:bg-[#1B3954]/90 text-white rounded-2xl py-3"
              >
                Fechar
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  )
}
