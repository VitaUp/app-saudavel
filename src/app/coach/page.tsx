'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home as HomeIcon, 
  Apple, 
  Dumbbell, 
  Moon, 
  MessageCircle, 
  User,
  Send,
  Sparkles,
  Lock,
  Crown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
}

export default function CoachPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('coach')
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isPremium, setIsPremium] = useState(false)
  const [dailyMessagesUsed, setDailyMessagesUsed] = useState(0)
  const [gender, setGender] = useState<'masculino' | 'feminino' | 'neutro'>('neutro')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar dados do quiz para determinar gênero
    const data = localStorage.getItem('vitaup_quiz_data')
    if (data) {
      const quizData = JSON.parse(data)
      setGender(quizData.gender || 'neutro')
    }

    // Carregar status premium
    const premiumStatus = localStorage.getItem('vitaup_premium')
    setIsPremium(premiumStatus === 'true')

    // Carregar mensagens do dia
    const messagesCount = localStorage.getItem('vitaup_daily_messages')
    setDailyMessagesUsed(messagesCount ? parseInt(messagesCount) : 0)

    // Mensagem inicial do CoachUp
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'ai',
        content: getGreetingMessage(),
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'ai',
        content: getMotivationalMessage(),
        timestamp: new Date()
      }
    ]
    setMessages(initialMessages)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const getGreetingMessage = () => {
    const hour = new Date().getHours()
    const greetings = {
      masculino: {
        morning: 'E aí, campeão! Bom dia! Pronto pra arrasar hoje?',
        afternoon: 'E aí, campeão! Boa tarde! Bora manter o ritmo!',
        evening: 'E aí, campeão! Boa noite! Como foi o dia?'
      },
      feminino: {
        morning: 'E aí, campeã! Bom dia! Pronta pra arrasar hoje?',
        afternoon: 'E aí, campeã! Boa tarde! Bora manter o ritmo!',
        evening: 'E aí, campeã! Boa noite! Como foi o dia?'
      },
      neutro: {
        morning: 'E aí! Bom dia! Pronto pra arrasar hoje?',
        afternoon: 'E aí! Boa tarde! Bora manter o ritmo!',
        evening: 'E aí! Boa noite! Como foi o dia?'
      }
    }

    if (hour < 12) return greetings[gender].morning
    if (hour < 18) return greetings[gender].afternoon
    return greetings[gender].evening
  }

  const getMotivationalMessage = () => {
    const messages = {
      masculino: [
        'Campeão, você está indo muito bem! Mantém o foco!',
        'Arrasou no treino! Orgulho de você!',
        'Fica leve hoje, você merece.',
        'Orgulho de você se cuidando, bora pra mais um dia?',
        'Tá indo muito bem! Continue assim!'
      ],
      feminino: [
        'Campeã, você está indo muito bem! Mantém o foco!',
        'Arrasou no treino! Orgulho de você!',
        'Fica leve hoje, você merece.',
        'Orgulho de você se cuidando, bora pra mais um dia?',
        'Tá indo muito bem! Continue assim!'
      ],
      neutro: [
        'Você está indo muito bem! Mantém o foco!',
        'Arrasou no treino! Orgulho de você!',
        'Fica leve hoje, você merece.',
        'Orgulho de você se cuidando, bora pra mais um dia?',
        'Tá indo muito bem! Continue assim!'
      ]
    }

    const genderMessages = messages[gender]
    return genderMessages[Math.floor(Math.random() * genderMessages.length)]
  }

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase()
    
    // Respostas contextuais baseadas em palavras-chave
    if (lowerMessage.includes('treino') || lowerMessage.includes('exercício')) {
      return gender === 'masculino' 
        ? 'Campeão, que tal um treino de força hoje? Lembra de aquecer bem antes!'
        : gender === 'feminino'
        ? 'Campeã, que tal um treino de força hoje? Lembra de aquecer bem antes!'
        : 'Que tal um treino de força hoje? Lembra de aquecer bem antes!'
    }
    
    if (lowerMessage.includes('dieta') || lowerMessage.includes('comida') || lowerMessage.includes('comer')) {
      return 'Fica de olho nas proteínas! Tenta incluir mais verduras no almoço. Você consegue!'
    }
    
    if (lowerMessage.includes('sono') || lowerMessage.includes('dormir') || lowerMessage.includes('cansad')) {
      return 'Sono é fundamental! Tenta dormir 20 min mais cedo hoje. Seu corpo agradece!'
    }
    
    if (lowerMessage.includes('água') || lowerMessage.includes('hidrat')) {
      return 'Hidratação é vida! Bora beber mais água ao longo do dia. Meta: 2L!'
    }
    
    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu')) {
      return gender === 'masculino'
        ? 'Por nada, campeão! Estou aqui pra te ajudar sempre!'
        : gender === 'feminino'
        ? 'Por nada, campeã! Estou aqui pra te ajudar sempre!'
        : 'Por nada! Estou aqui pra te ajudar sempre!'
    }

    // Resposta padrão motivacional
    const defaultResponses = {
      masculino: [
        'Campeão, você está no caminho certo! Continue assim!',
        'Orgulho de você se cuidando! Bora pra cima!',
        'Tá mandando bem! Mantém o foco!'
      ],
      feminino: [
        'Campeã, você está no caminho certo! Continue assim!',
        'Orgulho de você se cuidando! Bora pra cima!',
        'Tá mandando bem! Mantém o foco!'
      ],
      neutro: [
        'Você está no caminho certo! Continue assim!',
        'Orgulho de você se cuidando! Bora pra cima!',
        'Tá mandando bem! Mantém o foco!'
      ]
    }

    const responses = defaultResponses[gender]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    // Verificar limite de mensagens no plano Free
    if (!isPremium && dailyMessagesUsed >= 1) {
      const limitMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: '🔒 Você atingiu o limite de mensagens do plano Free (1 por dia). Faça upgrade para VitaUp+ e tenha chat ilimitado!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, limitMessage])
      return
    }

    // Adicionar mensagem do usuário
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')

    // Simular resposta da IA após 1 segundo
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])

      // Atualizar contador de mensagens
      if (!isPremium) {
        const newCount = dailyMessagesUsed + 1
        setDailyMessagesUsed(newCount)
        localStorage.setItem('vitaup_daily_messages', newCount.toString())
      }
    }, 1000)
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (tab === 'home') router.push('/home')
    if (tab === 'dieta') router.push('/dieta')
    if (tab === 'sono') router.push('/sono')
    if (tab === 'perfil') router.push('/perfil')
  }

  const canSendMessage = isPremium || dailyMessagesUsed < 1

  return (
    <div className="min-h-screen bg-white pb-24 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] text-[#0A0A0A] p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CoachUp IA</h1>
              <p className="text-sm text-[#0A0A0A]/70">
                {isPremium ? 'Chat Ilimitado 👑' : `${1 - dailyMessagesUsed} mensagem restante`}
              </p>
            </div>
          </div>
          {!isPremium && (
            <Button
              size="sm"
              className="bg-gradient-to-r from-[#FFD700] to-[#FFA500] hover:opacity-90 text-[#0A0A0A] font-semibold rounded-full transition-all duration-300"
            >
              <Crown className="w-4 h-4 mr-1" />
              Upgrade
            </Button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-3xl p-4 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] text-[#0A0A0A]'
                    : 'bg-white border-2 border-[#0A0A0A]/5 text-[#0A0A0A]'
                }`}
              >
                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#62D8B5]" />
                    <span className="text-xs font-semibold text-[#62D8B5]">CoachUp</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Recomendações Rápidas */}
      <div className="px-6 pb-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (canSendMessage) {
                setInputMessage('Como está meu progresso?')
                setTimeout(() => handleSendMessage(), 100)
              }
            }}
            className="rounded-full border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 whitespace-nowrap"
          >
            📊 Meu progresso
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (canSendMessage) {
                setInputMessage('Dicas de treino')
                setTimeout(() => handleSendMessage(), 100)
              }
            }}
            className="rounded-full border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 whitespace-nowrap"
          >
            💪 Dicas de treino
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (canSendMessage) {
                setInputMessage('Receitas saudáveis')
                setTimeout(() => handleSendMessage(), 100)
              }
            }}
            className="rounded-full border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 whitespace-nowrap"
          >
            🥗 Receitas
          </Button>
        </div>
      </div>

      {/* Input Area */}
      <div className="px-6 pb-6">
        <div className="flex gap-3 items-center">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={canSendMessage ? "Digite sua mensagem..." : "Limite atingido - Faça upgrade"}
              disabled={!canSendMessage}
              className="h-14 rounded-full border-2 border-[#0A0A0A]/10 focus:border-[#62D8B5] pr-4 pl-6 text-[#0A0A0A] placeholder:text-[#0A0A0A]/40"
            />
            {!canSendMessage && (
              <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0A0A0A]/40" />
            )}
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!canSendMessage || !inputMessage.trim()}
            className="h-14 w-14 rounded-full bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 disabled:opacity-40 transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
          >
            <Send className="w-5 h-5 text-white" />
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0A0A]/5 px-6 py-4 safe-area-bottom">
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
