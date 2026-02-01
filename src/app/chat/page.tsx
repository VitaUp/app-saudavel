'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Send, Sparkles } from 'lucide-react';
import BottomNav from '@/components/custom/BottomNav';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    // Mensagem de boas-vindas
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou o CoachUp, seu assistente de saúde personalizado. Como posso te ajudar hoje? 💪',
      timestamp: new Date()
    }]);
  }, [user, router]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simular resposta do CoachUp (aqui você integraria com a API real)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Entendi sua pergunta! Estou aqui para te ajudar com treinos, nutrição e sono. Em breve terei respostas mais personalizadas baseadas nos seus dados. 🎯',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6A3D] to-[#FF8C5A] text-white p-6 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h1 className="text-xl font-bold">CoachUp</h1>
              <p className="text-sm text-white/90">Seu coach pessoal de IA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-[#FF6A3D] text-white'
                    : 'bg-white text-[#0D0D0D] shadow-sm'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-[#FF6A3D]" />
                    <span className="text-xs font-medium text-[#FF6A3D]">CoachUp</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                <p className={`text-xs mt-2 ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte sobre treinos, nutrição ou sono..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#FF6A3D] focus:ring-2 focus:ring-[#FF6A3D]/20 outline-none resize-none transition-all"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-12 h-12 bg-[#FF6A3D] text-white rounded-xl flex items-center justify-center hover:bg-[#FF6A3D]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
