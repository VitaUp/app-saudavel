'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, 
  Apple, 
  Dumbbell, 
  Moon, 
  MessageCircle, 
  User,
  ArrowLeft,
  Sparkles,
  Play,
  Trophy,
  Flame,
  Target,
  TrendingUp,
  Award,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { generateWorkoutPlan } from '@/lib/openai'
import type { Workout, WorkoutLog, Gamification } from '@/lib/supabase-client'

// Quiz de 24 passos - mesmas perguntas do BetterMe
const QUIZ_QUESTIONS = [
  { id: 1, question: 'Qual é o seu objetivo principal?', options: ['Perder peso', 'Ganhar massa muscular', 'Melhorar condicionamento', 'Manter saúde'] },
  { id: 2, question: 'Qual é o seu sexo?', options: ['Masculino', 'Feminino', 'Outro', 'Prefiro não dizer'] },
  { id: 3, question: 'Qual é a sua idade?', type: 'number' },
  { id: 4, question: 'Qual é o seu peso atual? (kg)', type: 'number' },
  { id: 5, question: 'Qual é a sua altura? (cm)', type: 'number' },
  { id: 6, question: 'Qual é o seu nível de atividade física?', options: ['Sedentário', 'Levemente ativo', 'Moderadamente ativo', 'Muito ativo', 'Extremamente ativo'] },
  { id: 7, question: 'Quantas vezes por semana você pode treinar?', options: ['1-2 vezes', '3-4 vezes', '5-6 vezes', 'Todos os dias'] },
  { id: 8, question: 'Quanto tempo você tem por treino?', options: ['15-30 min', '30-45 min', '45-60 min', 'Mais de 60 min'] },
  { id: 9, question: 'Você tem alguma lesão ou limitação física?', type: 'text' },
  { id: 10, question: 'Qual é o seu tipo de treino preferido?', options: ['Musculação', 'Cardio', 'HIIT', 'Yoga', 'Funcional', 'Misto'] },
  { id: 11, question: 'Você tem acesso a academia?', options: ['Sim', 'Não', 'Às vezes'] },
  { id: 12, question: 'Equipamentos disponíveis?', options: ['Academia completa', 'Halteres em casa', 'Peso corporal apenas', 'Elásticos/bandas'] },
  { id: 13, question: 'Qual é o seu nível de experiência?', options: ['Iniciante', 'Intermediário', 'Avançado', 'Atleta'] },
  { id: 14, question: 'Você já treinou com personal trainer?', options: ['Sim', 'Não', 'Atualmente treino'] },
  { id: 15, question: 'Qual parte do corpo você quer focar mais?', options: ['Pernas', 'Braços', 'Abdômen', 'Costas', 'Peito', 'Corpo todo'] },
  { id: 16, question: 'Você tem alguma condição de saúde?', type: 'text' },
  { id: 17, question: 'Qual é o seu peso ideal? (kg)', type: 'number' },
  { id: 18, question: 'Em quanto tempo quer atingir seu objetivo?', options: ['1-3 meses', '3-6 meses', '6-12 meses', 'Mais de 1 ano'] },
  { id: 19, question: 'Você faz dieta atualmente?', options: ['Sim', 'Não', 'Às vezes'] },
  { id: 20, question: 'Qual é o seu nível de estresse?', options: ['Baixo', 'Médio', 'Alto', 'Muito alto'] },
  { id: 21, question: 'Quantas horas você dorme por noite?', options: ['Menos de 5h', '5-6h', '6-7h', '7-8h', 'Mais de 8h'] },
  { id: 22, question: 'Você toma suplementos?', options: ['Sim', 'Não', 'Às vezes'] },
  { id: 23, question: 'Qual é a sua motivação principal?', type: 'text' },
  { id: 24, question: 'Como você prefere ser chamado?', type: 'text' }
]

export default function TreinoPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('treino')
  const [showQuiz, setShowQuiz] = useState(false)
  const [quizStep, setQuizStep] = useState(1)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, any>>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  
  // Estados dos dados
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([])
  const [gamification, setGamification] = useState<Gamification | null>(null)
  const [todayWorkout, setTodayWorkout] = useState<Workout | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      await checkQuizCompleted(user.id)
      await loadData(user.id)
    }
  }

  const checkQuizCompleted = async (uid: string) => {
    // Verifica se quiz foi completado em settings
    const { data: settings } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', uid)
      .single()

    // Se não tem settings ou não completou quiz, mostra quiz
    if (!settings) {
      setShowQuiz(true)
    }
  }

  const loadData = async (uid: string) => {
    // Carrega workouts
    const { data: workoutsData } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', uid)
      .order('created_at', { ascending: false })

    if (workoutsData) {
      setWorkouts(workoutsData)
      // Define treino do dia (primeiro da lista)
      if (workoutsData.length > 0) {
        setTodayWorkout(workoutsData[0])
      }
    }

    // Carrega logs de treino
    const { data: logsData } = await supabase
      .from('workout_logs')
      .select('*')
      .eq('user_id', uid)
      .order('date', { ascending: false })
      .limit(7)

    if (logsData) setWorkoutLogs(logsData)

    // Carrega gamificação
    const { data: gamData } = await supabase
      .from('gamification')
      .select('*')
      .eq('user_id', uid)
      .single()

    if (gamData) setGamification(gamData)
  }

  const handleQuizAnswer = (answer: any) => {
    setQuizAnswers({ ...quizAnswers, [quizStep]: answer })
    
    if (quizStep < 24) {
      setQuizStep(quizStep + 1)
    } else {
      completeQuiz()
    }
  }

  const completeQuiz = async () => {
    if (!userId) return

    setIsGenerating(true)

    try {
      // Salva quiz em settings (usando campo existente ou criando registro)
      await supabase
        .from('settings')
        .upsert({
          user_id: userId,
          updated_at: new Date().toISOString()
        })

      // Gera treino com IA
      const workoutPlan = await generateWorkoutPlan(quizAnswers)

      // Salva treinos no Supabase
      for (const dia of workoutPlan.semana) {
        await supabase
          .from('workouts')
          .insert({
            user_id: userId,
            name: dia.treino.nome,
            description: `Treino de ${dia.dia}`,
            type: dia.treino.tipo,
            difficulty: workoutPlan.nivel,
            duration_minutes: dia.treino.duracao_minutos,
            exercises: dia.treino.exercicios
          })
      }

      // Inicializa gamificação se não existir
      const { data: existingGam } = await supabase
        .from('gamification')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (!existingGam) {
        await supabase
          .from('gamification')
          .insert({
            user_id: userId,
            xp: 0,
            level: 1,
            vita_points: 0,
            badges: [],
            daily_streak: 0,
            total_workouts: 0
          })
      }

      setShowQuiz(false)
      await loadData(userId)
    } catch (error) {
      console.error('Erro ao completar quiz:', error)
      alert('Erro ao gerar treino. Verifique se a variável OPENAI_API_KEY está configurada.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateNewWorkout = async () => {
    if (!userId) return

    setIsGenerating(true)

    try {
      const workoutPlan = await generateWorkoutPlan(quizAnswers)

      for (const dia of workoutPlan.semana) {
        await supabase
          .from('workouts')
          .insert({
            user_id: userId,
            name: dia.treino.nome,
            description: `Treino de ${dia.dia}`,
            type: dia.treino.tipo,
            difficulty: workoutPlan.nivel,
            duration_minutes: dia.treino.duracao_minutos,
            exercises: dia.treino.exercicios
          })
      }

      await loadData(userId)
      alert('Novo treino gerado com sucesso!')
    } catch (error) {
      console.error('Erro ao gerar treino:', error)
      alert('Erro ao gerar treino. Verifique se a variável OPENAI_API_KEY está configurada.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleStartWorkout = async () => {
    if (!userId || !todayWorkout) return

    // Registra início do treino
    const { data } = await supabase
      .from('workout_logs')
      .insert({
        user_id: userId,
        workout_id: todayWorkout.id,
        date: new Date().toISOString().split('T')[0],
        duration_minutes: todayWorkout.duration_minutes || 0,
        calories_burned: 0,
        exercises_completed: []
      })
      .select()
      .single()

    if (data) {
      // Atualiza gamificação
      if (gamification) {
        await supabase
          .from('gamification')
          .update({
            xp: (gamification.xp || 0) + 50,
            total_workouts: (gamification.total_workouts || 0) + 1,
            daily_streak: (gamification.daily_streak || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId)
      }

      alert('Treino iniciado! Boa sorte! 💪')
      await loadData(userId)
    }
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (tab === 'home') router.push('/home')
    if (tab === 'dieta') router.push('/dieta')
    if (tab === 'sono') router.push('/sono')
  }

  const currentQuestion = QUIZ_QUESTIONS[quizStep - 1]

  // Se está no quiz
  if (showQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-2xl"
        >
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-white/60">Passo {quizStep} de 24</span>
              <span className="text-sm font-bold text-[#62D8B5]">{Math.round((quizStep / 24) * 100)}%</span>
            </div>
            <Progress value={(quizStep / 24) * 100} className="h-2 bg-white/10" />
          </div>

          {/* Question */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold mb-8 text-center">{currentQuestion.question}</h2>

            {currentQuestion.type === 'text' || currentQuestion.type === 'number' ? (
              <div className="space-y-4">
                <input
                  type={currentQuestion.type}
                  className="w-full bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-[#62D8B5]"
                  placeholder="Digite sua resposta..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleQuizAnswer((e.target as HTMLInputElement).value)
                    }
                  }}
                />
                <Button
                  onClick={() => {
                    const input = document.querySelector('input') as HTMLInputElement
                    handleQuizAnswer(input.value)
                  }}
                  className="w-full bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-[#0A0A0A] font-bold py-6 rounded-2xl"
                >
                  Continuar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleQuizAnswer(option)}
                    variant="outline"
                    className="h-16 border-2 border-white/20 hover:border-[#62D8B5] hover:bg-[#62D8B5]/10 text-white rounded-2xl transition-all duration-300"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {isGenerating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-8 text-center"
            >
              <div className="inline-flex items-center gap-3 bg-[#62D8B5]/20 px-6 py-3 rounded-full border border-[#62D8B5]/40">
                <Sparkles className="w-5 h-5 text-[#62D8B5] animate-pulse" />
                <span className="text-[#62D8B5] font-semibold">Gerando seu treino personalizado...</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    )
  }

  // Tela principal de treino
  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/home')}
            className="text-[#0A0A0A] hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Treinos</h1>
          <Button
            size="icon"
            onClick={handleGenerateNewWorkout}
            disabled={isGenerating}
            className="bg-white/20 hover:bg-white/30 text-[#0A0A0A] rounded-full border-2 border-white/40"
          >
            <Sparkles className="w-5 h-5" />
          </Button>
        </div>

        {/* Gamificação */}
        {gamification && (
          <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-[#0A0A0A]/70 mb-1">Nível {gamification.level}</div>
                <div className="text-3xl font-bold text-[#0A0A0A]">{gamification.xp} XP</div>
              </div>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-2">
                    <Flame className="w-8 h-8 text-[#FF6B6B]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0A0A]">{gamification.daily_streak}</div>
                  <div className="text-xs text-[#0A0A0A]/70">dias</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center mb-2">
                    <Trophy className="w-8 h-8 text-[#FFD700]" />
                  </div>
                  <div className="text-2xl font-bold text-[#0A0A0A]">{gamification.total_workouts}</div>
                  <div className="text-xs text-[#0A0A0A]/70">treinos</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Treino do Dia */}
        {todayWorkout && (
          <div>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Treino do Dia</h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-[#AEE2FF]/10 to-[#62D8B5]/10 rounded-3xl p-6 border-2 border-[#62D8B5]/30"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-[#0A0A0A] mb-2">{todayWorkout.name}</h3>
                  <p className="text-[#0A0A0A]/70">{todayWorkout.description}</p>
                </div>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] flex items-center justify-center">
                  <Dumbbell className="w-8 h-8 text-white" />
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <div className="flex items-center gap-2 text-sm text-[#0A0A0A]/70">
                  <Target className="w-4 h-4" />
                  <span>{todayWorkout.duration_minutes} min</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#0A0A0A]/70">
                  <Zap className="w-4 h-4" />
                  <span>{todayWorkout.type}</span>
                </div>
              </div>

              <Button
                onClick={handleStartWorkout}
                className="w-full bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-white font-bold py-6 rounded-2xl"
              >
                <Play className="w-5 h-5 mr-2" />
                Iniciar Treino
              </Button>
            </motion.div>
          </div>
        )}

        {/* Categorias */}
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Categorias</h2>
          <div className="grid grid-cols-2 gap-4">
            {['Hipertrofia', 'Emagrecimento', 'Funcional', 'Yoga', 'Core', 'Mobilidade', 'Aeróbico', 'HIIT'].map((cat, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2 border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 rounded-2xl transition-all duration-300"
              >
                <Dumbbell className="w-6 h-6 text-[#62D8B5]" />
                <span className="text-sm font-semibold text-[#0A0A0A]">{cat}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Progresso Semanal */}
        {workoutLogs.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Seu Progresso</h2>
            <div className="bg-white rounded-2xl p-6 border-2 border-[#0A0A0A]/5 shadow-sm">
              <div className="flex items-end gap-2 h-40 mb-4">
                {workoutLogs.map((log, index) => (
                  <div
                    key={index}
                    className="flex-1 bg-gradient-to-t from-[#62D8B5] to-[#AEE2FF] rounded-t-lg"
                    style={{ height: `${(log.duration_minutes || 0) / 60 * 100}%` }}
                  />
                ))}
              </div>
              <div className="text-center text-sm text-[#0A0A0A]/60">Últimos 7 dias</div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0A0A]/5 px-6 py-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <button
            onClick={() => handleTabChange('home')}
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
            onClick={() => handleTabChange('treino')}
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
