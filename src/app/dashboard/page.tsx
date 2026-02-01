'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Activity, Apple, Moon, Target, TrendingUp, Dumbbell, Flame, Award } from 'lucide-react';
import BottomNav from '@/components/custom/BottomNav';

interface DashboardData {
  profile: any;
  todayCalories: number;
  targetCalories: number;
  todayWorkouts: any[];
  lastSleep: any;
  habits: any[];
  gamification: any;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }

    loadDashboardData();
    setGreeting(getGreeting());
  }, [user, router]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Buscar perfil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // Buscar calorias de hoje
      const today = new Date().toISOString().split('T')[0];
      const { data: nutritionLogs } = await supabase
        .from('nutrition_logs')
        .select('calories')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`);

      const todayCalories = nutritionLogs?.reduce((sum, log) => sum + (log.calories || 0), 0) || 0;

      // Buscar settings para target_calories
      const { data: settings } = await supabase
        .from('settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Buscar treinos de hoje
      const { data: workouts } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .limit(3);

      // Buscar último sono
      const { data: sleepLogs } = await supabase
        .from('sleep_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      // Buscar gamificação
      const { data: gamification } = await supabase
        .from('gamification')
        .select('*')
        .eq('user_id', user.id)
        .single();

      setData({
        profile,
        todayCalories,
        targetCalories: settings?.target_calories || 2000,
        todayWorkouts: workouts || [],
        lastSleep: sleepLogs?.[0],
        habits: [],
        gamification
      });
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6A3D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3B3B3B]">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  const caloriesPercentage = data ? (data.todayCalories / data.targetCalories) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#FF6A3D] to-[#FF8C5A] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">
            {greeting}, {data?.profile?.preferred_name || data?.profile?.full_name || 'Usuário'}! 👋
          </h1>
          <p className="text-white/90">Vamos conquistar seus objetivos hoje</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Cards de resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calorias */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#3BAEA0]/10 rounded-xl flex items-center justify-center">
                <Apple className="w-6 h-6 text-[#3BAEA0]" />
              </div>
              <span className="text-sm font-medium text-[#3BAEA0]">
                {Math.round(caloriesPercentage)}%
              </span>
            </div>
            <h3 className="text-sm text-[#3B3B3B] mb-1">Calorias</h3>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {data?.todayCalories || 0}
              <span className="text-sm text-[#3B3B3B] font-normal">
                /{data?.targetCalories || 2000}
              </span>
            </p>
          </div>

          {/* Treinos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#1E90FF]/10 rounded-xl flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-[#1E90FF]" />
              </div>
              <span className="text-sm font-medium text-[#1E90FF]">Hoje</span>
            </div>
            <h3 className="text-sm text-[#3B3B3B] mb-1">Treinos</h3>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {data?.todayWorkouts?.length || 0}
              <span className="text-sm text-[#3B3B3B] font-normal"> planejados</span>
            </p>
          </div>

          {/* Sono */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#6BB1FF]/10 rounded-xl flex items-center justify-center">
                <Moon className="w-6 h-6 text-[#6BB1FF]" />
              </div>
              <span className="text-sm font-medium text-[#6BB1FF]">Última noite</span>
            </div>
            <h3 className="text-sm text-[#3B3B3B] mb-1">Sono</h3>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {data?.lastSleep ? `${Math.floor(data.lastSleep.duration / 60)}h ${data.lastSleep.duration % 60}m` : '--'}
            </p>
          </div>

          {/* XP */}
          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#F4C430]/10 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-[#F4C430]" />
              </div>
              <span className="text-sm font-medium text-[#F4C430]">Nível {data?.gamification?.level || 1}</span>
            </div>
            <h3 className="text-sm text-[#3B3B3B] mb-1">VitaPoints</h3>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {data?.gamification?.vita_points || 0}
            </p>
          </div>
        </div>

        {/* Seção de ações rápidas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0D0D0D] mb-4">Ações rápidas</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push('/nutrition')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#3BAEA0]/5 hover:bg-[#3BAEA0]/10 transition-colors"
            >
              <Apple className="w-8 h-8 text-[#3BAEA0]" />
              <span className="text-sm font-medium text-[#0D0D0D]">Registrar refeição</span>
            </button>

            <button
              onClick={() => router.push('/workout')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#1E90FF]/5 hover:bg-[#1E90FF]/10 transition-colors"
            >
              <Dumbbell className="w-8 h-8 text-[#1E90FF]" />
              <span className="text-sm font-medium text-[#0D0D0D]">Iniciar treino</span>
            </button>

            <button
              onClick={() => router.push('/sleep')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#6BB1FF]/5 hover:bg-[#6BB1FF]/10 transition-colors"
            >
              <Moon className="w-8 h-8 text-[#6BB1FF]" />
              <span className="text-sm font-medium text-[#0D0D0D]">Ver sono</span>
            </button>

            <button
              onClick={() => router.push('/chat')}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-[#FF6A3D]/5 hover:bg-[#FF6A3D]/10 transition-colors"
            >
              <Activity className="w-8 h-8 text-[#FF6A3D]" />
              <span className="text-sm font-medium text-[#0D0D0D]">Falar com CoachUp</span>
            </button>
          </div>
        </div>

        {/* Mensagem do CoachUp */}
        <div className="bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF8C5A]/10 rounded-2xl p-6 border border-[#FF6A3D]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#FF6A3D] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">🧠</span>
            </div>
            <div>
              <h3 className="font-bold text-[#0D0D0D] mb-1">CoachUp diz:</h3>
              <p className="text-[#3B3B3B]">
                Parabéns por completar seu onboarding! Seu plano personalizado está pronto. 
                Vamos começar essa jornada juntos! 💪
              </p>
            </div>
          </div>
        </div>

        {/* Progresso semanal */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0D0D0D] mb-4">Progresso semanal</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#3B3B3B]">Treinos completados</span>
                <span className="text-sm font-medium text-[#1E90FF]">0/3</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#1E90FF] transition-all" style={{ width: '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#3B3B3B]">Meta calórica atingida</span>
                <span className="text-sm font-medium text-[#3BAEA0]">0/7 dias</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#3BAEA0] transition-all" style={{ width: '0%' }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#3B3B3B]">Qualidade do sono</span>
                <span className="text-sm font-medium text-[#6BB1FF]">--</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#6BB1FF] transition-all" style={{ width: '0%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
