'use client'

import { useState } from 'react'
import { vitaupAPI, type CoachResponse } from '@/lib/vitaup-api'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { MessageCircle, Send, Loader2, Sparkles } from 'lucide-react'

export default function CoachUpExample() {
  const [message, setMessage] = useState('')
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'coach'; content: string; actions?: any[] }>>([])
  const [loading, setLoading] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return

    const userMessage = message
    setMessage('')
    setConversation(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    try {
      const response = await vitaupAPI.sendCoachMessage({
        date: new Date().toISOString().split('T')[0],
        user_message: userMessage,
        daily_summary: {
          nutrition: { kcal: 1800, protein: 120, carbs: 180, fat: 60 },
          water: { ml: 1500, target: 2000 },
          sleep: { hours: 7, quality: 80 },
          movement: { steps: 8500, active_minutes: 45 },
        },
        settings: {
          tone: 'acolhedor',
          goal: 'constancia',
        },
      })

      setConversation(prev => [...prev, {
        role: 'coach',
        content: response.reply,
        actions: response.actions,
      }])
    } catch (error: any) {
      setConversation(prev => [...prev, {
        role: 'coach',
        content: `Erro: ${error.message}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] p-6 border-b border-[#62D8B5]/20">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">CoachUp</h1>
              <p className="text-sm text-white/60">Seu coach de saúde e bem-estar</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {conversation.length === 0 && (
            <div className="text-center py-12">
              <Sparkles className="w-12 h-12 text-[#62D8B5] mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Olá! Sou o CoachUp</h2>
              <p className="text-white/60">
                Conte como foi seu dia, suas dificuldades ou conquistas.<br />
                Estou aqui para te ajudar com leveza e sem julgamentos.
              </p>
            </div>
          )}

          {conversation.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === 'user'
                    ? 'bg-[#62D8B5] text-white'
                    : 'bg-white/10 text-white'
                }`}
              >
                <p className="leading-relaxed">{msg.content}</p>

                {/* Actions sugeridas pelo coach */}
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {msg.actions.map((action, i) => (
                      <div
                        key={i}
                        className="bg-white/10 rounded-lg p-3 border border-white/20"
                      >
                        <div className="font-semibold text-sm mb-1">{action.title}</div>
                        {action.items && (
                          <ul className="text-sm text-white/80 space-y-1">
                            {action.items.map((item: string, j: number) => (
                              <li key={j}>• {item}</li>
                            ))}
                          </ul>
                        )}
                        {action.target_ml && (
                          <p className="text-sm text-white/80">Meta: {action.target_ml}ml</p>
                        )}
                        {action.duration_minutes && (
                          <p className="text-sm text-white/80">Duração: {action.duration_minutes} min</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white/10 rounded-2xl p-4">
                <Loader2 className="w-5 h-5 animate-spin text-[#62D8B5]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-[#0A0A0A] border-t border-white/10 p-6">
        <div className="max-w-2xl mx-auto flex gap-2">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="bg-white/10 border-white/20 text-white resize-none"
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className="bg-[#62D8B5] hover:bg-[#62D8B5]/90 h-auto"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}
