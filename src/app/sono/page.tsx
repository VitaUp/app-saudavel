'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft,
  Moon,
  Sun,
  Heart,
  TrendingUp,
  Clock,
  Zap,
  Home,
  TrendingUp as TrendingUpIcon,
  Plus,
  Utensils,
  BedDouble
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { supabase, isSupabaseConfigured } from '@/lib/supabase-client'

interface SleepData {
  date: string
  total_minutes: number
  light_sleep_minutes: number
  deep_sleep_minutes: number
  rem_sleep_minutes: number
  awake_count: number
  sleep_time: string
  wake_time: string
  quality_score: number
  efficiency_percent: number
  heart_rate_avg?: number
}

export default function SonoPage() {
  const router = useRouter()
  const [sleepData, setSleepData] = useState<SleepData>({
    date: new Date().toISOString().split('T')[0],
    total_minutes: 450, // 7h30min
    light_sleep_minutes: 180,
    deep_sleep_minutes: 150,
    rem_sleep_minutes: 120,
    awake_count: 2,
    sleep_time: '23:00',
    wake_time: '06:30',
    quality_score: 82,
    efficiency_percent: 94,
    heart_rate_avg: 58
  })

  const goalMinutes = 480 // 8 horas
  const hoursSlept = Math.floor(sleepData.total_minutes / 60)
  const minutesSlept = sleepData.total_minutes % 60
  const progressPercent = (sleepData.total_minutes / goalMinutes) * 100

  // Mensagens do CoachUp
  const coachMessages = [
    "E aí, campeão! Tenta dormir 20 min mais cedo hoje.",
    "Campeã, seu sono profundo foi ótimo, mantém assim!",
    "Boa! Você está quase na meta. Só mais 30 min hoje.",
    "Seu sono REM tá show! Continue assim, parceiro.",
    "Que tal relaxar 15 min antes de dormir? Vai ajudar!"
  ]

  const randomMessage = coachMessages[Math.floor(Math.random() * coachMessages.length)]

  // Carregar dados do sono do Supabase
  useEffect(() => {
    loadSleepData()
  }, [])

  const loadSleepData = async () => {
    if (!isSupabaseConfigured()) {
      console.log('Supabase não configurado - usando dados de exemplo')
      return
    }

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date().toISOString().split('T')[0]
      
      const { data: sleepLogs } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .single()

      if (sleepLogs) {
        setSleepData({
          date: sleepLogs.date,
          total_minutes: sleepLogs.duration_minutes || 450,
          light_sleep_minutes: sleepLogs.light_sleep_minutes || 180,
          deep_sleep_minutes: sleepLogs.deep_sleep_minutes || 150,
          rem_sleep_minutes: sleepLogs.rem_sleep_minutes || 120,
          awake_count: sleepLogs.awake_count || 2,
          sleep_time: sleepLogs.sleep_time || '23:00',
          wake_time: sleepLogs.wake_time || '06:30',
          quality_score: sleepLogs.quality_score || 82,
          efficiency_percent: sleepLogs.efficiency_percent || 94,
          heart_rate_avg: sleepLogs.heart_rate_avg
        })
      }
    } catch (error) {
      console.error('Erro ao carregar dados do sono:', error)
    }
  }

  // Gerar dados do gráfico de fases
  const generateSleepPhases = () => {
    const phases = []
    const totalBars = 24 // 8 horas * 3 barras por hora
    
    for (let i = 0; i < totalBars; i++) {
      const rand = Math.random()
      let phase: 'awake' | 'light' | 'deep' | 'rem'
      
      if (rand < 0.05) phase = 'awake'
      else if (rand < 0.45) phase = 'light'
      else if (rand < 0.75) phase = 'deep'
      else phase = 'rem'
      
      phases.push(phase)
    }
    
    return phases
  }

  const sleepPhases = generateSleepPhases()

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'awake': return 'bg-red-500'
      case 'light': return 'bg-cyan-400'
      case 'deep': return 'bg-blue-600'
      case 'rem': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  const getPhaseHeight = (phase: string) => {
    switch (phase) {
      case 'awake': return 'h-2'
      case 'light': return 'h-8'
      case 'deep': return 'h-16'
      case 'rem': return 'h-12'
      default: return 'h-4'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0A1F] via-[#0F0F2A] to-[#0A0A1F] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A1F]/95 backdrop-blur-sm border-b border-cyan-500/10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/')}
            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <h1 className="text-xl font-bold">Sono</h1>
          
          <div className="w-10"></div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <div className="max-w-md mx-auto px-4 pt-20 space-y-6">
        
        {/* Círculo Principal - Horas Dormidas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Efeito Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
          
          <div className="relative bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F2A]/80 backdrop-blur-sm rounded-3xl p-8 border border-cyan-500/20 shadow-2xl">
            {/* Círculo de Progresso */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative w-64 h-64">
                {/* Círculo de fundo */}
                <svg className="absolute inset-0 w-full h-full -rotate-90">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="rgba(34, 211, 238, 0.1)"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    stroke="url(#gradient-sleep)"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray="753.98"
                    strokeDashoffset={753.98 - (753.98 * Math.min(progressPercent, 100)) / 100}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]"
                  />
                  <defs>
                    <linearGradient id="gradient-sleep" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22D3EE" />
                      <stop offset="50%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Texto Central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {hoursSlept}
                    </span>
                    <span className="text-3xl font-semibold text-cyan-400">h</span>
                    <span className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {minutesSlept}
                    </span>
                    <span className="text-2xl font-semibold text-cyan-400">m</span>
                  </div>
                  <p className="text-sm text-white/60 uppercase tracking-wide mb-3">Última Noite</p>
                  
                  {/* Meta e Qualidade */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Moon className="w-4 h-4 text-cyan-400" />
                      <span className="text-white/70">Meta: 8h</span>
                    </div>
                    <div className="w-px h-4 bg-white/20"></div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 font-semibold">{sleepData.quality_score}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Grid de Métricas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 gap-4"
        >
          {/* Sono Leve */}
          <div className="bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 backdrop-blur-sm rounded-2xl p-4 border border-cyan-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
              <span className="text-xs text-white/60 uppercase tracking-wide">Sono Leve</span>
            </div>
            <p className="text-2xl font-bold text-cyan-400">
              {Math.floor(sleepData.light_sleep_minutes / 60)}h {sleepData.light_sleep_minutes % 60}m
            </p>
          </div>

          {/* Sono Profundo */}
          <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/5 backdrop-blur-sm rounded-2xl p-4 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]"></div>
              <span className="text-xs text-white/60 uppercase tracking-wide">Sono Profundo</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">
              {Math.floor(sleepData.deep_sleep_minutes / 60)}h {sleepData.deep_sleep_minutes % 60}m
            </p>
          </div>

          {/* Sono REM */}
          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 backdrop-blur-sm rounded-2xl p-4 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
              <span className="text-xs text-white/60 uppercase tracking-wide">Sono REM</span>
            </div>
            <p className="text-2xl font-bold text-purple-400">
              {Math.floor(sleepData.rem_sleep_minutes / 60)}h {sleepData.rem_sleep_minutes % 60}m
            </p>
          </div>

          {/* Eficiência */}
          <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm rounded-2xl p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-xs text-white/60 uppercase tracking-wide">Eficiência</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{sleepData.efficiency_percent}%</p>
          </div>
        </motion.div>

        {/* Horários e Interrupções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F2A]/80 backdrop-blur-sm rounded-2xl p-5 border border-cyan-500/10"
        >
          <div className="grid grid-cols-3 gap-4">
            {/* Horário Dormiu */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Moon className="w-4 h-4 text-cyan-400" />
                <span className="text-xs text-white/60">Dormiu</span>
              </div>
              <p className="text-xl font-bold text-cyan-400">{sleepData.sleep_time}</p>
            </div>

            {/* Horário Acordou */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Sun className="w-4 h-4 text-orange-400" />
                <span className="text-xs text-white/60">Acordou</span>
              </div>
              <p className="text-xl font-bold text-orange-400">{sleepData.wake_time}</p>
            </div>

            {/* Vezes Acordou */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-2">
                <Clock className="w-4 h-4 text-red-400" />
                <span className="text-xs text-white/60">Acordou</span>
              </div>
              <p className="text-xl font-bold text-red-400">{sleepData.awake_count}x</p>
            </div>
          </div>

          {/* Batimentos (se disponível) */}
          {sleepData.heart_rate_avg && (
            <div className="mt-4 pt-4 border-t border-white/10 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="w-4 h-4 text-pink-400" />
                <span className="text-xs text-white/60">Batimentos Médios</span>
              </div>
              <p className="text-2xl font-bold text-pink-400">{sleepData.heart_rate_avg} bpm</p>
            </div>
          )}
        </motion.div>

        {/* Gráfico de Fases do Sono */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-[#1A1A3A]/80 to-[#0F0F2A]/80 backdrop-blur-sm rounded-2xl p-5 border border-cyan-500/10"
        >
          <h3 className="text-sm font-semibold text-white/80 mb-4 uppercase tracking-wide">
            Timeline da Noite
          </h3>

          {/* Legenda */}
          <div className="flex items-center justify-between mb-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-white/60">Leve</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-white/60">Profundo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-500"></div>
              <span className="text-white/60">REM</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-white/60">Acordado</span>
            </div>
          </div>

          {/* Gráfico de Barras */}
          <div className="flex items-end justify-between gap-1 h-24">
            {sleepPhases.map((phase, index) => (
              <div
                key={index}
                className={`flex-1 rounded-t-sm ${getPhaseColor(phase)} ${getPhaseHeight(phase)} transition-all duration-300 hover:opacity-80`}
                style={{
                  boxShadow: phase === 'deep' ? '0 0 8px rgba(59,130,246,0.4)' : 
                             phase === 'rem' ? '0 0 8px rgba(139,92,246,0.4)' :
                             phase === 'light' ? '0 0 8px rgba(34,211,238,0.4)' : 'none'
                }}
              ></div>
            ))}
          </div>

          {/* Horários */}
          <div className="flex items-center justify-between mt-3 text-xs text-white/40">
            <span>23:00</span>
            <span>01:00</span>
            <span>03:00</span>
            <span>05:00</span>
            <span>06:30</span>
          </div>
        </motion.div>

        {/* CoachUp Sono */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#62D8B5]/10 to-[#AEE2FF]/10 backdrop-blur-sm rounded-2xl p-5 border border-[#62D8B5]/20"
        >
          <div className="flex items-start gap-3">
            {/* Avatar CoachUp */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center flex-shrink-0 shadow-lg">
              <span className="text-2xl">💪</span>
            </div>

            {/* Mensagem */}
            <div className="flex-1">
              <h4 className="text-sm font-bold text-[#62D8B5] mb-2">CoachUp Sono</h4>
              <p className="text-sm text-white/80 leading-relaxed">
                {randomMessage}
              </p>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A0A1F]/95 backdrop-blur-sm border-t border-cyan-500/10">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button 
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Diário</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
              <TrendingUpIcon className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button className="relative -mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors">
              <Utensils className="w-6 h-6" />
              <span className="text-xs font-medium">Dietas</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-cyan-400">
              <BedDouble className="w-6 h-6" />
              <span className="text-xs font-medium">Sono</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
