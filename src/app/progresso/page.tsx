'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, TrendingUp, Utensils, User, Plus, Calendar, Activity, Flame, Droplet } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function ProgressoPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [weekData, setWeekData] = useState<any[]>([])
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week')

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
    loadProgressData(user.id)
  }

  const loadProgressData = async (uid: string) => {
    // Dados dos últimos 7 dias
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    const mockData = days.map((day, index) => ({
      day,
      calories: 1200 + Math.random() * 600,
      water: 1500 + Math.random() * 1000,
      activity: 20 + Math.random() * 40,
    }))
    setWeekData(mockData)
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Progresso</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto px-4 pt-20 space-y-6">
        {/* Seletor de Período */}
        <div className="flex gap-2 p-1 bg-[#1A1A1A] rounded-2xl">
          <button
            onClick={() => setSelectedPeriod('week')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedPeriod === 'week'
                ? 'bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Semana
          </button>
          <button
            onClick={() => setSelectedPeriod('month')}
            className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
              selectedPeriod === 'month'
                ? 'bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] text-white'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Mês
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl p-4 border border-orange-500/30"
          >
            <Flame className="w-8 h-8 text-orange-400 mb-2" />
            <p className="text-2xl font-bold">9,450</p>
            <p className="text-sm text-white/60">Calorias (semana)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl p-4 border border-blue-500/30"
          >
            <Droplet className="w-8 h-8 text-blue-400 mb-2" />
            <p className="text-2xl font-bold">12.5L</p>
            <p className="text-sm text-white/60">Água (semana)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl p-4 border border-green-500/30"
          >
            <Activity className="w-8 h-8 text-green-400 mb-2" />
            <p className="text-2xl font-bold">180</p>
            <p className="text-sm text-white/60">Min ativos (semana)</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 border border-purple-500/30"
          >
            <Calendar className="w-8 h-8 text-purple-400 mb-2" />
            <p className="text-2xl font-bold">7/7</p>
            <p className="text-sm text-white/60">Dias registrados</p>
          </motion.div>
        </div>

        {/* Gráfico de Calorias */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A1A1A] rounded-3xl p-5"
        >
          <h3 className="font-semibold mb-4">Calorias Diárias</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                }}
              />
              <Line
                type="monotone"
                dataKey="calories"
                stroke="#62D8B5"
                strokeWidth={3}
                dot={{ fill: '#62D8B5', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Água */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A1A1A] rounded-3xl p-5"
        >
          <h3 className="font-semibold mb-4">Consumo de Água (ml)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="water" fill="url(#waterGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="waterGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#62D8B5" />
                  <stop offset="100%" stopColor="#AEE2FF" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Gráfico de Atividade */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1A1A1A] rounded-3xl p-5"
        >
          <h3 className="font-semibold mb-4">Minutos Ativos</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1A1A1A',
                  border: '1px solid #ffffff20',
                  borderRadius: '12px',
                }}
              />
              <Bar dataKey="activity" fill="url(#activityGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EF4444" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
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

            <button className="flex flex-col items-center gap-1 text-[#62D8B5]">
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button className="relative -mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button
              onClick={() => router.push('/dietas')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
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
