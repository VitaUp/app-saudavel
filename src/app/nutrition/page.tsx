'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Apple, Plus, Search, TrendingUp, Flame, Droplet } from 'lucide-react';
import BottomNav from '@/components/custom/BottomNav';

interface NutritionLog {
  id: string;
  meal_type: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logged_at: string;
}

export default function NutritionPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [todayStats, setTodayStats] = useState({
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    target: 2000
  });

  useEffect(() => {
    if (!user) {
      router.push('/auth');
      return;
    }
    loadNutritionData();
  }, [user, router]);

  const loadNutritionData = async () => {
    if (!user) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Buscar logs de hoje
      const { data: nutritionLogs } = await supabase
        .from('nutrition_logs')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', `${today}T00:00:00`)
        .lte('logged_at', `${today}T23:59:59`)
        .order('logged_at', { ascending: false });

      setLogs(nutritionLogs || []);

      // Calcular totais
      const totals = (nutritionLogs || []).reduce((acc, log) => ({
        calories: acc.calories + (log.calories || 0),
        protein: acc.protein + (log.protein || 0),
        carbs: acc.carbs + (log.carbs || 0),
        fats: acc.fats + (log.fats || 0)
      }), { calories: 0, protein: 0, carbs: 0, fats: 0 });

      // Buscar meta
      const { data: settings } = await supabase
        .from('settings')
        .select('target_calories')
        .eq('user_id', user.id)
        .single();

      setTodayStats({
        ...totals,
        target: settings?.target_calories || 2000
      });
    } catch (error) {
      console.error('Erro ao carregar dados de nutrição:', error);
    } finally {
      setLoading(false);
    }
  };

  const caloriesPercentage = (todayStats.calories / todayStats.target) * 100;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center pb-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3BAEA0] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#3B3B3B]">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7F7] pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#3BAEA0] to-[#2D9B8F] text-white p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold mb-1">Nutrição</h1>
          <p className="text-white/90">Acompanhe suas refeições</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 -mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-[#0D0D0D]">Calorias de hoje</h3>
            <span className="text-sm font-medium text-[#3BAEA0]">
              {Math.round(caloriesPercentage)}%
            </span>
          </div>
          
          <div className="mb-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-bold text-[#0D0D0D]">{todayStats.calories}</span>
              <span className="text-xl text-[#3B3B3B]">/ {todayStats.target} kcal</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#3BAEA0] to-[#2D9B8F] transition-all"
                style={{ width: `${Math.min(caloriesPercentage, 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div className="text-center">
              <div className="w-10 h-10 bg-[#FF6A3D]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Flame className="w-5 h-5 text-[#FF6A3D]" />
              </div>
              <p className="text-xs text-[#3B3B3B] mb-1">Proteína</p>
              <p className="text-lg font-bold text-[#0D0D0D]">{todayStats.protein}g</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-[#1E90FF]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Apple className="w-5 h-5 text-[#1E90FF]" />
              </div>
              <p className="text-xs text-[#3B3B3B] mb-1">Carboidratos</p>
              <p className="text-lg font-bold text-[#0D0D0D]">{todayStats.carbs}g</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 bg-[#F4C430]/10 rounded-full flex items-center justify-center mx-auto mb-2">
                <Droplet className="w-5 h-5 text-[#F4C430]" />
              </div>
              <p className="text-xs text-[#3B3B3B] mb-1">Gorduras</p>
              <p className="text-lg font-bold text-[#0D0D0D]">{todayStats.fats}g</p>
            </div>
          </div>
        </div>
      </div>

      {/* Refeições */}
      <div className="max-w-6xl mx-auto px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#0D0D0D]">Refeições de hoje</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#3BAEA0] text-white rounded-xl hover:bg-[#2D9B8F] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar
          </button>
        </div>

        {logs.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center">
            <Apple className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-[#3B3B3B] mb-2">Nenhuma refeição registrada hoje</p>
            <p className="text-sm text-gray-500">Comece adicionando sua primeira refeição</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-[#3BAEA0] bg-[#3BAEA0]/10 px-2 py-1 rounded">
                        {log.meal_type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(log.logged_at).toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </span>
                    </div>
                    <h3 className="font-bold text-[#0D0D0D] mb-2">{log.food_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-[#3B3B3B]">
                      <span>{log.calories} kcal</span>
                      <span>P: {log.protein}g</span>
                      <span>C: {log.carbs}g</span>
                      <span>G: {log.fats}g</span>
                    </div>
                  </div>
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
