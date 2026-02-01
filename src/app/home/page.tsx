'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Home as HomeIcon, 
  Apple, 
  Dumbbell, 
  Moon, 
  MessageCircle, 
  User,
  Plus,
  Droplet,
  CheckCircle2,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  Bell
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('home')
  const [quizData, setQuizData] = useState<any>(null)
  const [greeting, setGreeting] = useState('')
  const [motivationalMessage, setMotivationalMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    
    // Carregar dados do quiz
    const data = localStorage.getItem('vitaup_quiz_data')
    if (data) {
      setQuizData(JSON.parse(data))
    }

    // Definir saudação baseada na hora
    const hour = new Date().getHours()
    if (hour < 12) {
      setGreeting('Bom dia')
    } else if (hour < 18) {
      setGreeting('Boa tarde')
    } else {
      setGreeting('Boa noite')
    }

    // Definir mensagem motivacional aleatória
    const motivationalMessages = [
      'Bora começar leve e terminar forte!',
      'Você consegue! Vamos com tudo hoje!',
      'Cada passo conta! Continue assim!',
      'Tá indo muito bem! Mantém o foco!',
      'Hoje é dia de superar limites!'
    ]
    const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    setMotivationalMessage(randomMessage)
  }, [])

  const userName = quizData?.name || 'Campeão'
  const userLevel = 5
  const userXP = 450
  const nextLevelXP = 600

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (tab === 'dieta') router.push('/dieta')
    if (tab === 'sono') router.push('/sono')
    if (tab === 'coach') router.push('/coach')
    if (tab === 'perfil') router.push('/perfil')
  }

  // Dados de exemplo
  const caloriesConsumed = 1450
  const caloriesGoal = 2000
  const caloriesProgress = (caloriesConsumed / caloriesGoal) * 100

  const sleepHours = 7.5
  const sleepGoal = 8
  const sleepProgress = (sleepHours / sleepGoal) * 100

  // Evitar hydration mismatch - renderizar conteúdo estático primeiro
  if (!mounted) {
    return (
      <div className="min-h-screen bg-white pb-24">
        <div className="bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] text-[#0A0A0A] p-8 rounded-b-3xl shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Carregando...
              </h1>
              <p className="text-[#0A0A0A]/70 text-sm">
                Preparando seu dia...
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header com Saudação CoachUp */}
      <div className="bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] text-[#0A0A0A] p-8 rounded-b-3xl shadow-lg">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">
              {greeting}, {userName}! 👋
            </h1>
            <p className="text-[#0A0A0A]/70 text-sm">
              {motivationalMessage}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-[#0A0A0A] hover:bg-white/20 rounded-full transition-all duration-300"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </div>

        {/* Gamificação */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center text-3xl shadow-lg">
              🏆
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-semibold text-[#0A0A0A]">Nível {userLevel}</span>
                <span className="text-xs text-[#0A0A0A]/70">{userXP}/{nextLevelXP} XP</span>
              </div>
              <Progress value={(userXP / nextLevelXP) * 100} className="h-2.5 bg-white/30" />
            </div>
          </div>
          <div className="text-sm text-[#0A0A0A]/80">
            <strong>Missão do dia:</strong> Complete 1 treino e registre 3 refeições
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Cards Principais */}
        <div className="grid grid-cols-1 gap-6">
          {/* Nutrição */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#0A0A0A]/5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center">
                  <Apple className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A0A]">Nutrição</h3>
                  <p className="text-sm text-[#0A0A0A]/60">{caloriesConsumed} / {caloriesGoal} kcal</p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#62D8B5] hover:bg-[#62D8B5]/90 text-white rounded-full h-10 w-10 p-0 transition-all duration-300 hover:scale-110"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <Progress value={caloriesProgress} className="h-3 bg-[#0A0A0A]/5 rounded-full" />
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-[#0A0A0A]/60">Restam {caloriesGoal - caloriesConsumed} kcal</span>
              <span className="text-[#62D8B5] font-semibold">{Math.round(caloriesProgress)}%</span>
            </div>
          </motion.div>

          {/* Treino */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#0A0A0A]/5"
          >
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] flex items-center justify-center">
                  <Dumbbell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0A0A0A]">Treino do Dia</h3>
                  <p className="text-sm text-[#0A0A0A]/60">Treino de Pernas</p>
                </div>
              </div>
            </div>
            <Button
              className="w-full h-14 bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-[#0A0A0A] font-semibold rounded-full transition-all duration-300 hover:scale-105"
            >
              Iniciar Treino
            </Button>
          </motion.div>

          {/* Sono */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-6 shadow-lg border-2 border-[#0A0A0A]/5"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center">
                <Moon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#0A0A0A]">Sono</h3>
                <p className="text-sm text-[#0A0A0A]/60">{sleepHours}h / {sleepGoal}h</p>
              </div>
            </div>
            <div className="relative w-28 h-28 mx-auto">
              <svg className="w-28 h-28 transform -rotate-90">
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="#0A0A0A"
                  strokeOpacity="0.05"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="56"
                  cy="56"
                  r="48"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 48}`}
                  strokeDashoffset={`${2 * Math.PI * 48 * (1 - sleepProgress / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#AEE2FF" />
                    <stop offset="100%" stopColor="#62D8B5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-[#0A0A0A]">{Math.round(sleepProgress)}%</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Ações Rápidas */}
        <div>
          <h3 className="text-xl font-bold text-[#0A0A0A] mb-5">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 rounded-2xl transition-all duration-300"
            >
              <Apple className="w-7 h-7 text-[#62D8B5]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Refeição</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-[#0A0A0A]/10 hover:border-[#AEE2FF] hover:bg-[#AEE2FF]/5 rounded-2xl transition-all duration-300"
            >
              <Droplet className="w-7 h-7 text-[#AEE2FF]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Água</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 rounded-2xl transition-all duration-300"
            >
              <CheckCircle2 className="w-7 h-7 text-[#62D8B5]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Treino</span>
            </Button>
            
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-[#0A0A0A]/10 hover:border-[#AEE2FF] hover:bg-[#AEE2FF]/5 rounded-2xl transition-all duration-300"
            >
              <div className="flex gap-1">
                <Smile className="w-6 h-6 text-[#62D8B5]" />
                <Meh className="w-6 h-6 text-[#0A0A0A]/30" />
                <Frown className="w-6 h-6 text-[#0A0A0A]/30" />
              </div>
              <span className="text-sm font-semibold text-[#0A0A0A]">Humor</span>
            </Button>
          </div>
        </div>

        {/* Linha do Dia */}
        <div>
          <h3 className="text-xl font-bold text-[#0A0A0A] mb-5">Linha do Dia</h3>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#AEE2FF]/20 flex items-center justify-center flex-shrink-0">
                <Dumbbell className="w-6 h-6 text-[#AEE2FF]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0A0A0A]">Treino de Pernas</div>
                <div className="text-sm text-[#0A0A0A]/60">08:00 - 45 minutos</div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#0A0A0A]/20" />
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#62D8B5]/20 flex items-center justify-center flex-shrink-0">
                <Apple className="w-6 h-6 text-[#62D8B5]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0A0A0A]">Almoço</div>
                <div className="text-sm text-[#0A0A0A]/60">12:00 - 600 kcal</div>
              </div>
              <CheckCircle2 className="w-6 h-6 text-[#0A0A0A]/20" />
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#AEE2FF]/20 flex items-center justify-center flex-shrink-0">
                <Moon className="w-6 h-6 text-[#AEE2FF]" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0A0A0A]">Hora de dormir</div>
                <div className="text-sm text-[#0A0A0A]/60">22:00 - 8h de sono</div>
              </div>
              <Bell className="w-6 h-6 text-[#AEE2FF]" />
            </div>

            <div className="bg-gradient-to-br from-[#AEE2FF]/10 to-[#62D8B5]/10 rounded-2xl p-5 border-2 border-[#62D8B5]/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#62D8B5] flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[#0A0A0A]">Alerta da IA</div>
                <div className="text-sm text-[#0A0A0A]/70">Você está 200 kcal abaixo da meta!</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0A0A]/5 px-6 py-4 safe-area-bottom">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'home' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => handleTabChange('dieta')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'dieta' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Apple className="w-6 h-6" />
            <span className="text-xs font-semibold">Dieta</span>
          </button>

          <button
            onClick={() => setCurrentTab('treino')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'treino' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-semibold">Treino</span>
          </button>

          <button
            onClick={() => handleTabChange('sono')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'sono' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-xs font-semibold">Sono</span>
          </button>

          <button
            onClick={() => handleTabChange('coach')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'coach' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-semibold">Coach</span>
          </button>

          <button
            onClick={() => handleTabChange('perfil')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'perfil' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-semibold">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
