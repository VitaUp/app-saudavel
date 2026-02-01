'use client'

import { motion } from 'framer-motion'
import { Dumbbell, Heart, Zap, Wind, Target, Activity, TrendingUp, Flame } from 'lucide-react'
import { useState } from 'react'

const CATEGORIES = [
  { name: 'Hipertrofia', icon: Dumbbell, color: 'from-purple-400 to-purple-600' },
  { name: 'Emagrecimento', icon: Flame, color: 'from-orange-400 to-red-500' },
  { name: 'Funcional', icon: Activity, color: 'from-blue-400 to-cyan-500' },
  { name: 'Yoga', icon: Heart, color: 'from-pink-400 to-rose-500' },
  { name: 'Core', icon: Target, color: 'from-yellow-400 to-amber-500' },
  { name: 'Mobilidade', icon: Wind, color: 'from-teal-400 to-emerald-500' },
  { name: 'Aeróbico', icon: TrendingUp, color: 'from-green-400 to-lime-500' },
  { name: 'HIIT', icon: Zap, color: 'from-red-400 to-orange-500' },
]

export function CategoryCarousel() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="space-y-4">
      {/* Carrossel horizontal */}
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 pb-2">
          {CATEGORIES.map((category, index) => {
            const Icon = category.icon
            const isSelected = selectedCategory === category.name

            return (
              <motion.button
                key={category.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(isSelected ? null : category.name)}
                className={`
                  flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-sm
                  transition-all duration-300 shadow-md
                  ${isSelected 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg scale-105` 
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#7BE7C2]'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {category.name}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Lista de treinos da categoria selecionada */}
      {selectedCategory && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-gradient-to-br from-[#AEE2FF]/10 to-[#7BE7C2]/10 rounded-3xl p-6 border-2 border-[#7BE7C2]/30"
        >
          <h3 className="text-lg font-bold text-[#1B3954] mb-4">
            Treinos de {selectedCategory}
          </h3>
          
          <div className="space-y-3">
            {[1, 2, 3].map((item) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: item * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer transition-all duration-300 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${CATEGORIES.find(c => c.name === selectedCategory)?.color} flex items-center justify-center`}>
                      <Dumbbell className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#1B3954]">
                        {selectedCategory} - Treino {item}
                      </h4>
                      <p className="text-sm text-gray-600">30-45 min • Intermediário</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#7BE7C2]">~250 kcal</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
