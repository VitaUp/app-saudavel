'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Apple, 
  Dumbbell, 
  Moon, 
  CheckCircle2, 
  Trophy, 
  Plus,
  Camera,
  Play,
  TrendingUp,
  MessageCircle,
  Settings,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { getGreeting } from '@/lib/constants'
import Link from 'next/link'

export default function HomePage() {
  const [greeting, setGreeting] = useState('')
  const preferredName = 'João' // Virá do banco de dados

  useEffect(() => {
    setGreeting(getGreeting('pt-BR'))
  }, [])

  // Dados mockados - virão do Supabase
  const dailyCalories = {
    consumed: 1450,
    target: 2000,
    remaining: 550,
  }

  const macros = {
    protein: { current: 85, target: 150 },
    carbs: { current: 180, target: 250 },
    fat: { current: 45, target: 65 },
  }

  const todayWorkout = {
    name: 'Treino de Peito e Tríceps',
    duration: 45,
    exercises: 8,
  }

  const lastNightSleep = {
    hours: 7.5,
    quality: 85,
  }

  const vitaPoints = 1250
  const level = 12
  const xpProgress = 65

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#FF6A3D] to-[#FF8A5D] px-4 pt-12 pb-8 rounded-b-3xl">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {greeting}, {preferredName}! 👋
              </h1>
              <p className="text-white/90">Vamos conquistar o dia!</p>
            </div>
            <div className="flex items-center gap-2">
              <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                  <User className="w-5 h-5 text-white" />
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/20 hover:bg-white/30">
                  <Settings className="w-5 h-5 text-white" />
                </Button>
              </Link>
            </div>
          </div>

          {/* XP Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 border border-white/20"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-[#F4C430]" />
                <span className="text-white font-semibold">Nível {level}</span>
              </div>
              <span className="text-white/90 text-sm">{vitaPoints} VP</span>
            </div>
            <Progress value={xpProgress} className="h-2 bg-white/20" />
            <p className="text-white/80 text-xs mt-2">
              {100 - xpProgress}% para o próximo nível
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-4">
        {/* CoachUp Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-[#1E90FF] to-[#7B61FF] rounded-2xl p-4 mb-6 shadow-lg"
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🧠</span>
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-1">CoachUp diz:</p>
              <p className="text-white/90 text-sm">
                "Bora lá! Você já está 65% mais perto do próximo nível. Que tal começar o treino de hoje? 💪"
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <Link href="/diet/add-meal">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-[#3BAEA0]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Plus className="w-6 h-6 text-[#3BAEA0]" />
              </div>
              <p className="text-xs font-medium text-[#0D0D0D]">Adicionar Refeição</p>
            </motion.button>
          </Link>

          <Link href="/diet/scan">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-[#3BAEA0]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Camera className="w-6 h-6 text-[#3BAEA0]" />
              </div>
              <p className="text-xs font-medium text-[#0D0D0D]">Foto da Refeição</p>
            </motion.button>
          </Link>

          <Link href="/workout/start">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-[#1E90FF]/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                <Play className="w-6 h-6 text-[#1E90FF]" />
              </div>
              <p className="text-xs font-medium text-[#0D0D0D]">Iniciar Treino</p>
            </motion.button>
          </Link>
        </div>

        {/* Diet Card */}
        <Link href="/diet">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#3BAEA0]/10 rounded-xl flex items-center justify-center">
                  <Apple className="w-6 h-6 text-[#3BAEA0]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0D0D0D]">Dieta</h3>
                  <p className="text-sm text-[#3B3B3B]">
                    {dailyCalories.remaining} kcal restantes
                  </p>
                </div>
              </div>
              <TrendingUp className="w-5 h-5 text-[#3BAEA0]" />
            </div>

            {/* Calories Progress */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-[#3B3B3B]">Calorias</span>
                <span className="font-semibold text-[#0D0D0D]">
                  {dailyCalories.consumed} / {dailyCalories.target}
                </span>
              </div>
              <Progress 
                value={(dailyCalories.consumed / dailyCalories.target) * 100} 
                className="h-2 bg-[#F7F7F7]"
              />
            </div>

            {/* Macros */}
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#FF6A3D]">
                  {macros.protein.current}g
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  Proteína
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  de {macros.protein.target}g
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#1E90FF]">
                  {macros.carbs.current}g
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  Carboidratos
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  de {macros.carbs.target}g
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#F4C430]">
                  {macros.fat.current}g
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  Gordura
                </div>
                <div className="text-xs text-[#3B3B3B]">
                  de {macros.fat.target}g
                </div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Workout Card */}
        <Link href="/workout">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#1E90FF]/10 rounded-xl flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-[#1E90FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0D0D0D]">Treino de Hoje</h3>
                  <p className="text-sm text-[#3B3B3B]">{todayWorkout.name}</p>
                </div>
              </div>
              <Play className="w-5 h-5 text-[#1E90FF]" />
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-2xl font-bold text-[#1E90FF]">
                  {todayWorkout.duration} min
                </div>
                <div className="text-xs text-[#3B3B3B]">Duração</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#1E90FF]">
                  {todayWorkout.exercises}
                </div>
                <div className="text-xs text-[#3B3B3B]">Exercícios</div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Sleep Card */}
        <Link href="/sleep">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-[#0A1929] to-[#1E3A5F] rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                  <Moon className="w-6 h-6 text-[#6BB1FF]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Sono</h3>
                  <p className="text-sm text-white/70">Última noite</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div>
                <div className="text-3xl font-bold text-white">
                  {lastNightSleep.hours}h
                </div>
                <div className="text-xs text-white/70">Dormidas</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[#6BB1FF]">
                  {lastNightSleep.quality}%
                </div>
                <div className="text-xs text-white/70">Qualidade</div>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Habits Card */}
        <Link href="/habits">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.01 }}
            className="bg-white rounded-2xl p-6 mb-4 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#F4C430]/10 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-[#F4C430]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#0D0D0D]">Hábitos</h3>
                  <p className="text-sm text-[#3B3B3B]">3 de 5 completos hoje</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-[#F4C430]">60%</div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#F7F7F7] px-4 py-3 safe-area-bottom">
        <div className="max-w-4xl mx-auto flex items-center justify-around">
          <Link href="/home">
            <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
              <div className="w-6 h-6 bg-[#FF6A3D]/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-[#FF6A3D]" />
              </div>
              <span className="text-xs text-[#FF6A3D] font-medium">Início</span>
            </Button>
          </Link>

          <Link href="/diet">
            <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
              <Apple className="w-6 h-6 text-[#3B3B3B]" />
              <span className="text-xs text-[#3B3B3B]">Dieta</span>
            </Button>
          </Link>

          <Link href="/workout">
            <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
              <Dumbbell className="w-6 h-6 text-[#3B3B3B]" />
              <span className="text-xs text-[#3B3B3B]">Treino</span>
            </Button>
          </Link>

          <Link href="/chat">
            <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
              <MessageCircle className="w-6 h-6 text-[#3B3B3B]" />
              <span className="text-xs text-[#3B3B3B]">Chat</span>
            </Button>
          </Link>

          <Link href="/profile">
            <Button variant="ghost" size="icon" className="flex flex-col gap-1 h-auto py-2">
              <User className="w-6 h-6 text-[#3B3B3B]" />
              <span className="text-xs text-[#3B3B3B]">Perfil</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
