'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Send, Mic, Paperclip } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const coaches = [
  {
    id: 'coachup',
    name: 'CoachUp',
    role: 'Seu coach motivacional',
    avatar: '🧠',
    color: 'from-[#1E90FF] to-[#7B61FF]',
    lastMessage: 'Bora treinar hoje! 💪',
    unread: 2,
  },
  {
    id: 'nutricarol',
    name: 'Nutri Carol',
    role: 'Sua nutricionista',
    avatar: '🥦',
    color: 'from-[#3BAEA0] to-[#2D9B8F]',
    lastMessage: 'Como foi o café da manhã?',
    unread: 0,
  },
]

export default function ChatListPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F7F7F7]">
      {/* Header */}
      <div className="bg-white border-b border-[#F7F7F7] px-4 py-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <Link href="/home">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#0D0D0D]">Conversas</h1>
              <p className="text-sm text-[#3B3B3B]">Seus coaches</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat List */}
      <div className="max-w-4xl mx-auto p-4 space-y-3">
        {coaches.map((coach, index) => (
          <motion.button
            key={coach.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => router.push(`/chat/${coach.id}`)}
            className="w-full bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all text-left"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className={`w-14 h-14 bg-gradient-to-br ${coach.color} rounded-full flex items-center justify-center text-2xl flex-shrink-0`}>
                {coach.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-[#0D0D0D]">{coach.name}</h3>
                  {coach.unread > 0 && (
                    <div className="w-6 h-6 bg-[#FF6A3D] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">
                        {coach.unread}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-[#3B3B3B] mb-1">{coach.role}</p>
                <p className="text-sm text-[#3B3B3B] truncate">
                  {coach.lastMessage}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Info Card */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="bg-gradient-to-r from-[#FF6A3D]/10 to-[#7B61FF]/10 rounded-2xl p-4 border border-[#FF6A3D]/20">
          <p className="text-sm text-[#0D0D0D]">
            <span className="font-semibold">💡 Dica:</span> O CoachUp cuida de treino, sono e motivação. A Nutri Carol cuida da sua alimentação!
          </p>
        </div>
      </div>
    </div>
  )
}
