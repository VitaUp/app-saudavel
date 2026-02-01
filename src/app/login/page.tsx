'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Mail, Lock, Eye, EyeOff, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function LoginPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error

        // Verificar se usuário já completou o quiz
        const { data: profile } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', data.user?.id)
          .single()

        if (profile?.onboarding_completed) {
          router.push('/')
        } else {
          router.push('/quiz')
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error

        // Criar perfil inicial
        if (data.user) {
          await supabase.from('profiles').insert({
            user_id: data.user.id,
            onboarding_completed: false,
          })
        }

        toast.success('Conta criada! Redirecionando...')
        router.push('/quiz')
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A1A] to-[#0A0A0A] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] mb-4"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-4xl font-bold text-white mb-2">VitaUp</h1>
          <p className="text-white/60">Transforme sua vida com saúde e bem-estar</p>
        </div>

        {/* Card de Login/Cadastro */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A1A1A] rounded-3xl p-8 shadow-2xl border border-white/5"
        >
          {/* Toggle Login/Cadastro */}
          <div className="flex gap-2 mb-6 p-1 bg-[#0A0A0A] rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Entrar
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] text-white'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleAuth} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#62D8B5] transition-colors"
                />
              </div>
            </div>

            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 bg-[#0A0A0A] border border-white/10 rounded-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#62D8B5] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Botão Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-xl font-bold text-white hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {/* Link Esqueci Senha */}
          {isLogin && (
            <button className="w-full text-center text-sm text-white/50 hover:text-[#62D8B5] transition-colors mt-4">
              Esqueci minha senha
            </button>
          )}
        </motion.div>

        {/* Footer */}
        <p className="text-center text-white/40 text-sm mt-6">
          Ao continuar, você concorda com nossos{' '}
          <button className="text-[#62D8B5] hover:underline">Termos de Uso</button>
        </p>
      </motion.div>
    </div>
  )
}
