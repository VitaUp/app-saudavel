'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, TrendingUp, Utensils, User, Plus, 
  ChevronRight, Crown, LogOut, Bell, Globe, 
  Moon, Shield, HelpCircle, Mail, Target,
  Activity, Scale
} from 'lucide-react'
import { supabase } from '@/lib/supabase-client'
import { toast } from 'sonner'

export default function PerfilPage() {
  const router = useRouter()
  const [userId, setUserId] = useState<string | null>(null)
  const [profile, setProfile] = useState<any>(null)
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUserId(user.id)

    // Carregar perfil
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileData) {
      setProfile(profileData)
    }

    // Carregar configurações
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (settingsData) {
      setSettings(settingsData)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    toast.success('Logout realizado')
    router.push('/login')
  }

  const handleUpgrade = () => {
    window.open('https://buy.stripe.com/test_dRmfZiggT3BO3MVc0effy00', '_blank')
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white pb-24">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">Perfil</h1>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto px-4 pt-20 space-y-6">
        {/* Card do Usuário */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#62D8B5]/20 to-[#AEE2FF]/20 rounded-3xl p-6 text-center"
        >
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {profile?.full_name || 'Usuário VitaUp'}
          </h2>
          <p className="text-white/60 mb-4">Plano Gratuito</p>
          <button
            onClick={handleUpgrade}
            className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full font-semibold flex items-center gap-2 mx-auto hover:shadow-lg transition-all"
          >
            <Crown className="w-5 h-5" />
            Fazer Upgrade
          </button>
        </motion.div>

        {/* Dados do Perfil */}
        <div>
          <h3 className="text-lg font-semibold mb-3 px-2">Seus Dados</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-[#62D8B5]" />
                <div className="text-left">
                  <p className="font-medium">Peso</p>
                  <p className="text-sm text-white/60">{profile?.weight || 70} kg</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-[#62D8B5]" />
                <div className="text-left">
                  <p className="font-medium">Altura</p>
                  <p className="text-sm text-white/60">{profile?.height || 170} cm</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-[#62D8B5]" />
                <div className="text-left">
                  <p className="font-medium">Objetivo</p>
                  <p className="text-sm text-white/60 capitalize">
                    {profile?.goal === 'lose' ? 'Emagrecer' : profile?.goal === 'gain' ? 'Ganhar massa' : 'Manter peso'}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
          </div>
        </div>

        {/* Metas */}
        <div>
          <h3 className="text-lg font-semibold mb-3 px-2">Metas Diárias</h3>
          <div className="bg-[#1A1A1A] rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-white/70">Calorias</span>
              <span className="font-semibold">{settings?.daily_calories || 1630} kcal</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Proteínas</span>
              <span className="font-semibold">{settings?.daily_protein_g || 82}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Carboidratos</span>
              <span className="font-semibold">{settings?.daily_carbs_g || 204}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Gorduras</span>
              <span className="font-semibold">{settings?.daily_fat_g || 54}g</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/70">Água</span>
              <span className="font-semibold">{(settings?.daily_water_ml || 2000) / 1000}L</span>
            </div>
          </div>
        </div>

        {/* Configurações */}
        <div>
          <h3 className="text-lg font-semibold mb-3 px-2">Configurações</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-white/60" />
                <span>Notificações</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-white/60" />
                <span>Idioma</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Português</span>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-white/60" />
                <span>Modo escuro</span>
              </div>
              <div className="w-12 h-6 bg-[#62D8B5] rounded-full relative">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-white/60" />
                <span>Privacidade</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
          </div>
        </div>

        {/* Suporte */}
        <div>
          <h3 className="text-lg font-semibold mb-3 px-2">Suporte</h3>
          <div className="bg-[#1A1A1A] rounded-2xl overflow-hidden">
            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors border-b border-white/5">
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-white/60" />
                <span>Central de Ajuda</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>

            <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-white/60" />
                <span>Contato</span>
              </div>
              <ChevronRight className="w-5 h-5 text-white/30" />
            </button>
          </div>
        </div>

        {/* Botão Logout */}
        <button
          onClick={handleLogout}
          className="w-full py-4 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl font-semibold text-red-400 flex items-center justify-center gap-2 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sair da conta
        </button>

        {/* Versão */}
        <p className="text-center text-white/40 text-sm pb-4">
          VitaUp v1.0.0
        </p>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1A1A1A] border-t border-white/5">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-around">
            <button
              onClick={() => router.push('/')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Diário</span>
            </button>

            <button
              onClick={() => router.push('/progresso')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <TrendingUp className="w-6 h-6" />
              <span className="text-xs font-medium">Progresso</span>
            </button>

            <button className="relative -mt-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#62D8B5] to-[#AEE2FF] flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-white" />
              </div>
            </button>

            <button
              onClick={() => router.push('/dietas')}
              className="flex flex-col items-center gap-1 text-white/50 hover:text-white transition-colors"
            >
              <Utensils className="w-6 h-6" />
              <span className="text-xs font-medium">Dietas</span>
            </button>

            <button className="flex flex-col items-center gap-1 text-[#62D8B5]">
              <User className="w-6 h-6" />
              <span className="text-xs font-medium">Perfil</span>
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
