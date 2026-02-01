'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Moon, TrendingUp, Clock, Star } from 'lucide-react';
import BottomNav from '@/components/custom/BottomNav';

interface SleepLog {
  id: string;
  duration: number;
  quality: string;
  sleep_time: string;
  wake_time: string;
  created_at: string;
}

export default function SleepPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [logs, setLogs] = useState<SleepLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [weeklyAverage, setWeeklyAverage] = useState(0);
  const [lastNight, setLastNight] = useState<SleepLog | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    loadSleepData();
  }, [user, router]);

  const loadSleepData = async () => {
    if (!user) return;

    try {
      // Buscar logs de sono
      const { data: sleepData } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(7);

      setLogs(sleepData || []);

      if (sleepData && sleepData.length > 0) {
        setLastNight(sleepData[0]);
        
        // Calcular média semanal
        const avg = sleepData.reduce((sum, log) => sum + log.duration, 0) / sleepData.length;
        setWeeklyAverage(Math.round(avg));
      }
    } catch (error) {
      console.error('Erro ao carregar dados de sono:', error);
    } finally {
      setLoading(false);
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'excelente': return 'text-[#3BAEA0] bg-[#3BAEA0]/10';
      case 'boa': return 'text-[#1E90FF] bg-[#1E90FF]/10';
      case 'regular': return 'text-[#F4C430] bg-[#F4C430]/10';
      case 'ruim': return 'text-[#FF6A3D] bg-[#FF6A3D]/10';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#6BB1FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3B3B3B]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#6BB1FF] to-[#4A90E2] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Sono</h1>
          <p className="text-white/90">Acompanhe sua qualidade de sono</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-6">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="w-10 h-10 bg-[#6BB1FF]/10 rounded-full flex items-center justify-center mb-2">
              <Moon className="w-5 h-5 text-[#6BB1FF]" />
            </div>
            <p className="text-xs text-[#3B3B3B] mb-1">Última noite</p>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {lastNight ? formatDuration(lastNight.duration) : '--'}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="w-10 h-10 bg-[#3BAEA0]/10 rounded-full flex items-center justify-center mb-2">
              <TrendingUp className="w-5 h-5 text-[#3BAEA0]" />
            </div>
            <p className="text-xs text-[#3B3B3B] mb-1">Média semanal</p>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {weeklyAverage > 0 ? formatDuration(weeklyAverage) : '--'}
            </p>
          </div>
        </div>
      </div>

      {/* Última noite detalhes */}
      {lastNight && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="font-bold text-[#0D0D0D] mb-4">Detalhes da última noite</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#3B3B3B]">Qualidade</span>
                <span className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${getQualityColor(lastNight.quality)}`}>
                  {lastNight.quality}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#3B3B3B]">Dormiu às</span>
                <span className="text-sm font-medium text-[#0D0D0D]">
                  {lastNight.sleep_time}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-[#3B3B3B]">Acordou às</span>
                <span className="text-sm font-medium text-[#0D0D0D]">
                  {lastNight.wake_time}
                </span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-sm text-[#3B3B3B]">Duração total</span>
                <span className="text-lg font-bold text-[#6BB1FF]">
                  {formatDuration(lastNight.duration)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Aviso smartwatch */}
      {logs.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 mb-6">
          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Moon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-900 mb-1">Conecte seu smartwatch</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Para acompanhar automaticamente seu sono, conecte um dispositivo compatível.
                </p>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
                  Conectar dispositivo →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Histórico */}
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        <h2 className="text-lg font-bold text-[#0D0D0D]">Histórico semanal</h2>

        {logs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Moon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#3B3B3B] mb-2">Nenhum registro de sono</p>
            <p className="text-sm text-gray-500">Conecte um smartwatch para começar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">
                      {new Date(log.created_at).toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-2xl font-bold text-[#0D0D0D]">
                      {formatDuration(log.duration)}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full capitalize ${getQualityColor(log.quality)}`}>
                    {log.quality}
                  </span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-[#3B3B3B]">
                  <span className="flex items-center gap-1">
                    <Moon className="w-4 h-4" />
                    {log.sleep_time}
                  </span>
                  <span>→</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {log.wake_time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
