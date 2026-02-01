'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crown, Check, Sparkles, Zap, TrendingUp, Heart, Brain, Award } from 'lucide-react'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'CoachUp IA Personalizado',
    desc: 'Assistente inteligente 24/7 para suas dúvidas',
  },
  {
    icon: Zap,
    title: 'Planos de Treino Personalizados',
    desc: 'Treinos adaptados ao seu nível e objetivos',
  },
  {
    icon: TrendingUp,
    title: 'Análise Avançada de Progresso',
    desc: 'Gráficos detalhados e insights sobre sua evolução',
  },
  {
    icon: Heart,
    title: 'Monitoramento de Saúde',
    desc: 'Integração com Apple Health e Google Fit',
  },
  {
    icon: Brain,
    title: 'Análise de Sono Profunda',
    desc: 'Entenda seus padrões de sono e melhore sua qualidade',
  },
  {
    icon: Award,
    title: 'Gamificação Completa',
    desc: 'Conquistas, badges e recompensas por suas metas',
  },
]

export default function UpgradePage() {
  const router = useRouter()

  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/test_dRmfZiggT3BO3MVc0effy00', '_blank')
  }

  const handleContinueFree = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] p-4">
      <div className="max-w-md mx-auto pt-8 pb-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-yellow-500 to-orange-500 mb-4">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">VitaUp Plus</h1>
          <p className="text-white/60 text-lg">Desbloqueie todo o potencial do VitaUp</p>
        </motion.div>

        {/* Preço */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-[#62D8B5]/20 to-[#AEE2FF]/20 rounded-3xl p-8 mb-6 text-center border border-[#62D8B5]/30"
        >
          <div className="flex items-baseline justify-center gap-2 mb-2">
            <span className="text-5xl font-bold text-white">R$ 29,90</span>
            <span className="text-white/60">/mês</span>
          </div>
          <p className="text-white/60">Cancele quando quiser</p>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-3 mb-8"
        >
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.05 }}
              className="bg-[#1A1A1A] rounded-2xl p-4 flex items-start gap-4 border border-white/5"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.desc}</p>
              </div>
              <Check className="w-5 h-5 text-[#62D8B5] flex-shrink-0" />
            </motion.div>
          ))}
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={handleUpgrade}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl font-bold text-white hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
          >
            <Crown className="w-5 h-5" />
            Assinar VitaUp Plus
          </button>

          <button
            onClick={handleContinueFree}
            className="w-full py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-white transition-all"
          >
            Continuar com versão gratuita
          </button>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          Ao assinar, você concorda com nossos{' '}
          <button className="text-[#62D8B5] hover:underline">Termos de Uso</button>
        </p>
      </div>
    </div>
  )
}
