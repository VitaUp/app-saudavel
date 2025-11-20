'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Send, Mic, Paperclip, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

interface Message {
  id: string
  content: string
  sender: 'user' | 'coach'
  timestamp: Date
}

const coachesData = {
  coachup: {
    name: 'CoachUp',
    role: 'Seu coach motivacional',
    avatar: '🧠',
    color: 'from-[#1E90FF] to-[#7B61FF]',
    initialMessages: [
      'Olá! Sou o CoachUp, seu coach motivacional! 💪',
      'Estou aqui para te ajudar com treinos, sono, hábitos e motivação!',
      'Como posso te ajudar hoje?',
    ],
  },
  nutricarol: {
    name: 'Nutri Carol',
    role: 'Sua nutricionista',
    avatar: '🥦',
    color: 'from-[#3BAEA0] to-[#2D9B8F]',
    initialMessages: [
      'Oi! Sou a Nutri Carol! 💚',
      'Vou te ajudar com sua alimentação de forma acolhedora e sem julgamentos.',
      'Como está sua alimentação hoje?',
    ],
  },
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const coachId = params.id as 'coachup' | 'nutricarol'
  const coach = coachesData[coachId]

  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Carregar mensagens iniciais
    const initialMessages: Message[] = coach.initialMessages.map((content, index) => ({
      id: `initial-${index}`,
      content,
      sender: 'coach',
      timestamp: new Date(Date.now() - (coach.initialMessages.length - index) * 1000),
    }))
    setMessages(initialMessages)
  }, [coachId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSend = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    // Simular resposta do coach
    setTimeout(() => {
      let response = ''

      // Lógica de redirecionamento do CoachUp
      if (coachId === 'coachup') {
        const dietKeywords = ['dieta', 'comida', 'calorias', 'alimentação', 'refeição', 'macros', 'proteína']
        const hasDietKeyword = dietKeywords.some(keyword => 
          inputValue.toLowerCase().includes(keyword)
        )

        if (hasDietKeyword) {
          response = 'Isso é com a Nutri Carol 🥦💚 Vou te levar pra ela.'
          
          const coachMessage: Message = {
            id: (Date.now() + 1).toString(),
            content: response,
            sender: 'coach',
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, coachMessage])
          setIsTyping(false)

          // Redirecionar após 2 segundos
          setTimeout(() => {
            router.push('/chat/nutricarol')
          }, 2000)
          return
        }

        // Respostas do CoachUp
        const responses = [
          'Bora lá! Você consegue! 💪',
          'Isso aí! Foco e determinação! 🔥',
          'Que orgulho! Continue assim! 🌟',
          'Você está no caminho certo! 🎯',
          'Vamos com tudo! 🚀',
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      } else {
        // Respostas da Nutri Carol
        const responses = [
          'Que legal! Continue assim! 💚',
          'Você está indo muito bem! 🥦',
          'Ótima escolha! Parabéns! ✨',
          'Isso mesmo! Estou orgulhosa! 🌟',
          'Continue nesse caminho! 💪',
        ]
        response = responses[Math.floor(Math.random() * responses.length)]
      }

      const coachMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'coach',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, coachMessage])
      setIsTyping(false)
    }, 1500)
  }

  if (!coach) {
    return <div>Coach não encontrado</div>
  }

  return (
    <div className="h-screen flex flex-col bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#F7F7F7] px-4 py-3 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/chat">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className={`w-10 h-10 bg-gradient-to-br ${coach.color} rounded-full flex items-center justify-center text-xl`}>
              {coach.avatar}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-[#0D0D0D]">{coach.name}</h2>
              <p className="text-xs text-[#3B3B3B]">{coach.role}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF8A5D] text-white'
                      : 'bg-white text-[#0D0D0D] shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-[#3B3B3B]'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start mb-4"
            >
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex gap-1">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                    className="w-2 h-2 bg-[#3B3B3B] rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                    className="w-2 h-2 bg-[#3B3B3B] rounded-full"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                    className="w-2 h-2 bg-[#3B3B3B] rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-[#F7F7F7] px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
            <Paperclip className="w-5 h-5 text-[#3B3B3B]" />
          </Button>

          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Digite sua mensagem..."
            className="flex-1 h-12 rounded-full border-2 border-[#F7F7F7] focus:border-[#FF6A3D]"
          />

          {inputValue.trim() ? (
            <Button
              onClick={handleSend}
              size="icon"
              className="rounded-full bg-gradient-to-r from-[#FF6A3D] to-[#FF8A5D] hover:from-[#FF5A2D] hover:to-[#FF7A4D] flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0">
              <Mic className="w-5 h-5 text-[#3B3B3B]" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
