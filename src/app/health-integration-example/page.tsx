'use client'

import { useState, useEffect } from 'react'
import { vitaupAPI } from '@/lib/vitaup-api'
import { supabase } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Apple, Smartphone, Check, Loader2, RefreshCw } from 'lucide-react'

export default function HealthIntegrationExample() {
  const [userId, setUserId] = useState<string | null>(null)
  const [integration, setIntegration] = useState<any>(null)
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      loadIntegration(user.id)
    }
  }

  const loadIntegration = async (uid: string) => {
    const { data } = await supabase
      .from('integrations')
      .select('*')
      .eq('user_id', uid)
      .single()

    if (data) {
      setIntegration(data)
      setLastSync(data.apple_health_last_sync || data.google_fit_last_sync)
    }
  }

  const handleConnectAppleHealth = async () => {
    if (!userId) return

    try {
      // Em produção, aqui você chamaria a API nativa do HealthKit
      // Para este exemplo, vamos simular a conexão
      
      await supabase
        .from('integrations')
        .upsert({
          user_id: userId,
          apple_health_connected: true,
          apple_health_permissions: {
            sleep: true,
            heart_rate: true,
            steps: true,
            active_energy: true,
          },
          updated_at: new Date().toISOString(),
        })

      alert('Apple Health conectado com sucesso!')
      await loadIntegration(userId)
    } catch (error) {
      console.error('Erro ao conectar Apple Health:', error)
      alert('Erro ao conectar Apple Health')
    }
  }

  const handleConnectGoogleFit = async () => {
    if (!userId) return

    try {
      // Em produção, aqui você chamaria a API do Google Fit
      // Para este exemplo, vamos simular a conexão
      
      await supabase
        .from('integrations')
        .upsert({
          user_id: userId,
          google_fit_connected: true,
          google_fit_permissions: {
            sleep: true,
            heart_rate: true,
            steps: true,
            activity: true,
          },
          updated_at: new Date().toISOString(),
        })

      alert('Google Fit conectado com sucesso!')
      await loadIntegration(userId)
    } catch (error) {
      console.error('Erro ao conectar Google Fit:', error)
      alert('Erro ao conectar Google Fit')
    }
  }

  const handleSyncData = async () => {
    if (!userId) return

    setSyncing(true)

    try {
      // Simula dados que viriam do HealthKit/Google Fit
      const mockHealthData = {
        date: new Date().toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 5000) + 5000,
        active_minutes: Math.floor(Math.random() * 30) + 30,
        sleep_data: {
          total_hours: 7 + Math.random() * 2,
          light_sleep_minutes: 180 + Math.floor(Math.random() * 60),
          deep_sleep_minutes: 90 + Math.floor(Math.random() * 60),
          rem_sleep_minutes: 90 + Math.floor(Math.random() * 60),
          awake_minutes: Math.floor(Math.random() * 30),
          heart_rate_avg: 55 + Math.floor(Math.random() * 15),
          quality_score: 70 + Math.floor(Math.random() * 30),
        },
      }

      // Envia para Edge Function
      await vitaupAPI.syncHealthData(mockHealthData)

      alert('Dados sincronizados com sucesso!')
      setLastSync(new Date().toISOString())
      await loadIntegration(userId)
    } catch (error: any) {
      console.error('Erro ao sincronizar dados:', error)
      alert(`Erro ao sincronizar: ${error.message}`)
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Integrações de Saúde</h1>
          <p className="text-white/60">
            Conecte seu dispositivo para sincronizar dados automaticamente
          </p>
        </div>

        {/* Apple Health */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white flex items-center justify-center">
                <Apple className="w-10 h-10 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Apple Health</h3>
                <p className="text-sm text-white/60">iPhone & Apple Watch</p>
              </div>
            </div>
            {integration?.apple_health_connected ? (
              <Check className="w-8 h-8 text-[#62D8B5]" />
            ) : (
              <Button
                onClick={handleConnectAppleHealth}
                className="bg-[#62D8B5] hover:bg-[#62D8B5]/90"
              >
                Conectar
              </Button>
            )}
          </div>

          {integration?.apple_health_connected && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Sono</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Frequência cardíaca</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Passos</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Energia ativa</span>
              </div>
            </div>
          )}
        </div>

        {/* Google Fit */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#4285F4] to-[#34A853] flex items-center justify-center">
                <Smartphone className="w-10 h-10 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Google Fit</h3>
                <p className="text-sm text-white/60">Android & WearOS</p>
              </div>
            </div>
            {integration?.google_fit_connected ? (
              <Check className="w-8 h-8 text-[#62D8B5]" />
            ) : (
              <Button
                onClick={handleConnectGoogleFit}
                className="bg-[#62D8B5] hover:bg-[#62D8B5]/90"
              >
                Conectar
              </Button>
            )}
          </div>

          {integration?.google_fit_connected && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Sono</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Frequência cardíaca</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Passos</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <Check className="w-4 h-4 text-[#62D8B5]" />
                <span>Atividades</span>
              </div>
            </div>
          )}
        </div>

        {/* Sincronização */}
        {(integration?.apple_health_connected || integration?.google_fit_connected) && (
          <div className="bg-gradient-to-br from-[#62D8B5]/20 to-[#AEE2FF]/20 border border-[#62D8B5]/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold mb-4">Sincronização</h3>
            
            {lastSync && (
              <p className="text-sm text-white/60 mb-4">
                Última sincronização: {new Date(lastSync).toLocaleString('pt-BR')}
              </p>
            )}

            <Button
              onClick={handleSyncData}
              disabled={syncing}
              className="w-full bg-[#62D8B5] hover:bg-[#62D8B5]/90"
            >
              {syncing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sincronizando...
                </>
              ) : (
                <>
                  <RefreshCw className="w-5 h-5 mr-2" />
                  Sincronizar agora
                </>
              )}
            </Button>

            <p className="text-xs text-white/60 mt-4 text-center">
              Os dados são sincronizados automaticamente a cada 6 horas
            </p>
          </div>
        )}

        {/* Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-bold mb-2">Como funciona?</h3>
          <ul className="space-y-2 text-sm text-white/60">
            <li>• Conecte seu dispositivo (Apple Health ou Google Fit)</li>
            <li>• Autorize o acesso aos dados de saúde</li>
            <li>• Os dados são sincronizados automaticamente</li>
            <li>• Você pode sincronizar manualmente a qualquer momento</li>
            <li>• Todos os dados são criptografados e seguros</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
