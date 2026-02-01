'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Dumbbell, Play, CheckCircle, Clock, Flame } from 'lucide-react';
import BottomNav from '@/components/custom/BottomNav';

interface Workout {
  id: string;
  workout_type: string;
  duration: number;
  calories_burned: number;
  completed: boolean;
  exercises: any[];
  created_at: string;
}

export default function WorkoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [todayStats, setTodayStats] = useState({
    completed: 0,
    total: 0,
    calories: 0,
    duration: 0
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    loadWorkoutData();
  }, [user, router]);

  const loadWorkoutData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar treinos
      const { data: workoutData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      setWorkouts(workoutData || []);

      // Calcular stats de hoje
      const todayWorkouts = (workoutData || []).filter(w => 
        w.created_at.startsWith(today)
      );

      const stats = todayWorkouts.reduce((acc, w) => ({
        completed: acc.completed + (w.completed ? 1 : 0),
        total: acc.total + 1,
        calories: acc.calories + (w.calories_burned || 0),
        duration: acc.duration + (w.duration || 0)
      }), { completed: 0, total: 0, calories: 0, duration: 0 });

      setTodayStats(stats);
    } catch (error) {
      console.error('Erro ao carregar dados de treino:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#1E90FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3B3B3B]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#1E90FF] to-[#1565C0] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Treinos</h1>
          <p className="text-white/90">Seu plano personalizado</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="w-10 h-10 bg-[#1E90FF]/10 rounded-full flex items-center justify-center mb-2">
              <CheckCircle className="w-5 h-5 text-[#1E90FF]" />
            </div>
            <p className="text-xs text-[#3B3B3B] mb-1">Concluídos</p>
            <p className="text-2xl font-bold text-[#0D0D0D]">
              {todayStats.completed}/{todayStats.total}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="w-10 h-10 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-[#FF6A3D]" />
            </div>
            <p className="text-xs text-[#3B3B3B] mb-1">Calorias</p>
            <p className="text-2xl font-bold text-[#0D0D0D]">{todayStats.calories}</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="w-10 h-10 bg-[#3BAEA0]/10 rounded-full flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-[#3BAEA0]" />
            </div>
            <p className="text-xs text-[#3B3B3B] mb-1">Tempo</p>
            <p className="text-2xl font-bold text-[#0D0D0D]">{todayStats.duration}min</p>
          </div>
        </div>
      </div>

      {/* Treino de hoje */}
      <div className="max-w-6xl mx-auto px-4 mb-6">
        <div className="bg-gradient-to-r from-[#1E90FF]/10 to-[#1565C0]/10 rounded-2xl p-6 border border-[#1E90FF]/20">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#1E90FF] rounded-full flex items-center justify-center flex-shrink-0">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-[#0D0D0D] mb-1">Treino de hoje</h3>
              <p className="text-sm text-[#3B3B3B] mb-4">
                Treino de força - Parte superior
              </p>
              <button className="flex items-center gap-2 px-6 py-3 bg-[#1E90FF] text-white rounded-xl hover:bg-[#1565C0] transition-colors font-medium">
                <Play className="w-5 h-5" />
                Iniciar treino
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico */}
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        <h2 className="text-lg font-bold text-[#0D0D0D]">Histórico</h2>

        {workouts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Dumbbell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#3B3B3B] mb-2">Nenhum treino registrado</p>
            <p className="text-sm text-gray-500">Comece seu primeiro treino agora</p>
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.map((workout) => (
              <div key={workout.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2 py-1 rounded ${
                        workout.completed 
                          ? 'text-[#3BAEA0] bg-[#3BAEA0]/10' 
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        {workout.completed ? 'Concluído' : 'Pendente'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0D0D0D] mb-2 capitalize">
                      {workout.workout_type}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-[#3B3B3B]">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {workout.duration} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Flame className="w-4 h-4" />
                        {workout.calories_burned} kcal
                      </span>
                    </div>
                  </div>
                  {workout.completed && (
                    <CheckCircle className="w-6 h-6 text-[#3BAEA0]" />
                  )}
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
