'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Utensils, BedDouble, User, Plus, ChevronRight, Apple, Beef, Salad, Cookie } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'

export default function DietasPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [settings, setSettings] = useState({
    daily_calories: 1630,
    daily_protein_g: 82,
    daily_carbs_g: 204,
    daily_fat_g: 54,
  })

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)

    // Carregar configurações
    const { data: userSettings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (userSettings) {
      setSettings({
        daily_calories: userSettings.daily_calories || 1630,
        daily_protein_g: userSettings.daily_protein_g || 82,
        daily_carbs_g: userSettings.daily_carbs_g || 204,
        daily_fat_g: userSettings.daily_fat_g || 54,
      })
    }
  }

  const mealRecommendations = [
    {
      type: 'Café da manhã',
      icon: Apple,
      calories: '300-400 kcal',
      suggestions: [
        'Omelete com vegetais',
        'Aveia com frutas',
        'Pão integral com queijo',
      ],
    },
    {
      type: 'Almoço',
      icon: Beef,
      calories: '500-600 kcal',
      suggestions: [
        'Frango grelhado com arroz integral',
        'Peixe com batata doce',
        'Carne magra com salada',
      ],
    },
    {
      type: 'Jantar',
      icon: Salad,
      calories: '400-500 kcal',
      suggestions: [
        'Sopa de legumes',
        'Salada completa com proteína',
        'Wrap integral com frango',
      ],
    },
    {
      type: 'Lanche',
      icon: Cookie,
      calories: '150-200 kcal',
      suggestions: [
        'Iogurte com granola',
        'Frutas com pasta de amendoim',
        'Mix de castanhas',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Dietas</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto px-4 pt-20 space-y-6">
        {/* Card Metas Diárias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#62D8B5]/20 to-[#AEE2FF]/20 rounded-3xl p-6"
        >
          <h2 className="text-xl font-bold mb-4">Suas Metas Diárias</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <p className="text-white/60 text-sm mb-1">Calorias</p>
              <p className="text-2xl font-bold">{settings.daily_calories}</p>
              <p className="text-white/40 text-xs">kcal</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <p className="text-white/60 text-sm mb-1">Proteínas</p>
              <p className="text-2xl font-bold">{settings.daily_protein_g}</p>
              <p className="text-white/40 text-xs">gramas</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <p className="text-white/60 text-sm mb-1">Carboidratos</p>
              <p className="text-2xl font-bold">{settings.daily_carbs_g}</p>
              <p className="text-white/40 text-xs">gramas</p>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-4">
              <p className="text-white/60 text-sm mb-1">Gorduras</p>
              <p className="text-2xl font-bold">{settings.daily_fat_g}</p>
              <p className="text-white/40 text-xs">gramas</p>
            </div>
          </div>
        </motion.div>

        {/* Recomendações por Refeição */}
        <div>
          <h2 className="text-xl font-bold mb-4">Recomendações por Refeição</h2>
          <div className="space-y-3">
            {mealRecommendations.map((meal, index) => (
              <motion.div
                key={meal.type}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#1A1A1A] rounded-2xl p-5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center">
                    <meal.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{meal.type}</h3>
                    <p className="text-sm text-white/50">{meal.calories}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/30" />
                </div>
                <div className="space-y-2">
                  {meal.suggestions.map((suggestion) => (
                    <div
                      key={suggestion}
                      className="text-sm text-white/70 pl-4 border-l-2 border-[#62D8B5]/30"
                    >
                      • {suggestion}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preferências Alimentares */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A1A1A] rounded-2xl p-5"
        >
          <h3 className="font-semibold mb-3">Preferências Alimentares</h3>
          <div className="space-y-2">
            <button className="w-full text-left py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-between">
              <span>Restrições alimentares</span>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
            <button className="w-full text-left py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-between">
              <span>Alimentos favoritos</span>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
            <button className="w-full text-left py-3 px-4 bg-white/5 hover:bg-white/10 rounded-xl transition-colors flex items-center justify-between">
              <span>Alimentos a evitar</span>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-white/5">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Diário</span>
            </button>

            <button
              onClick={() => router.push('/progresso')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button className="relative -mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button className="flex flex-col items-center gap-1 text-[#62D8B5]">
              <Utensils className="w-6 h-6" />
              <span className="text-xs font-medium">Dietas</span>
            </button>

            <button
              onClick={() => router.push('/perfil')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
