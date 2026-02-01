import { supabase } from './supabase';

export interface OnboardingData {
  step: number;
  // Etapa 1 - Dados básicos
  full_name?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  
  // Etapa 2 - Objetivos
  goal?: string;
  activity_level?: string;
  training_location?: string;
  
  // Etapa 3 - Preferências e rotina
  sleep_time?: string;
  wake_time?: string;
  workout_frequency?: number;
  notifications_enabled?: boolean;
  
  // Etapa 4 - Quiz corpo e estilo de vida
  body_feeling?: string;
  daily_impact?: string;
  commitment_level?: string;
  
  // Etapa 5 - Integração smartwatch
  device_type?: string;
  
  // Etapa 6 - Configuração dieta
  dietary_restrictions?: string[];
  preferred_foods?: string[];
  allergies?: string[];
  meals_per_day?: number;
}

export async function saveOnboardingStep(userId: string, step: number, data: Partial<OnboardingData>) {
  try {
    // Atualizar step no profiles
    await supabase
      .from('profiles')
      .update({ onboarding_step: step, updated_at: new Date().toISOString() })
      .eq('id', userId);

    // Salvar dados específicos de cada etapa
    if (step === 1) {
      // Dados básicos em profiles
      await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          age: data.age,
          gender: data.gender,
          height: data.height,
          weight: data.weight,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }

    if (step === 2) {
      // Objetivos em profiles
      await supabase
        .from('profiles')
        .update({
          goal: data.goal,
          activity_level: data.activity_level,
          training_location: data.training_location,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);
    }

    if (step === 3) {
      // Preferências em settings
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingSettings) {
        await supabase
          .from('settings')
          .update({
            sleep_time: data.sleep_time,
            wake_time: data.wake_time,
            workout_frequency: data.workout_frequency,
            notifications_enabled: data.notifications_enabled,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('settings')
          .insert({
            user_id: userId,
            sleep_time: data.sleep_time,
            wake_time: data.wake_time,
            workout_frequency: data.workout_frequency,
            notifications_enabled: data.notifications_enabled
          });
      }
    }

    if (step === 4) {
      // Quiz corpo e estilo de vida
      await supabase
        .from('profiles')
        .update({
          body_feeling: data.body_feeling,
          daily_impact: data.daily_impact,
          commitment_level: data.commitment_level,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      // Salvar em habit_logs
      if (data.body_feeling) {
        await supabase.from('habit_logs').insert({
          user_id: userId,
          habit_type: 'body_feeling',
          response: data.body_feeling
        });
      }
    }

    if (step === 5 && data.device_type) {
      // Integração smartwatch
      await supabase.from('integrations').insert({
        user_id: userId,
        device_type: data.device_type,
        synced_at: new Date().toISOString(),
        is_active: true
      });
    }

    if (step === 6) {
      // Configuração dieta em settings
      const { data: existingSettings } = await supabase
        .from('settings')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (existingSettings) {
        await supabase
          .from('settings')
          .update({
            dietary_restrictions: data.dietary_restrictions,
            preferred_foods: data.preferred_foods,
            allergies: data.allergies,
            meals_per_day: data.meals_per_day,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);
      } else {
        await supabase
          .from('settings')
          .insert({
            user_id: userId,
            dietary_restrictions: data.dietary_restrictions,
            preferred_foods: data.preferred_foods,
            allergies: data.allergies,
            meals_per_day: data.meals_per_day
          });
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao salvar etapa do onboarding:', error);
    return { success: false, error };
  }
}

export async function completeOnboarding(userId: string) {
  try {
    // Marcar onboarding como completo
    await supabase
      .from('profiles')
      .update({
        onboarding_completed: true,
        onboarding_step: 7,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    // Criar registro de gamificação inicial
    const { data: existingGamification } = await supabase
      .from('gamification')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!existingGamification) {
      await supabase.from('gamification').insert({
        user_id: userId,
        vita_points: 100, // Bônus por completar onboarding
        xp: 50,
        level: 1
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Erro ao completar onboarding:', error);
    return { success: false, error };
  }
}

export async function getOnboardingProgress(userId: string) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('onboarding_completed, onboarding_step')
      .eq('id', userId)
      .single();

    if (error) throw error;

    return {
      completed: data?.onboarding_completed || false,
      currentStep: data?.onboarding_step || 0
    };
  } catch (error) {
    console.error('Erro ao buscar progresso do onboarding:', error);
    return { completed: false, currentStep: 0 };
  }
}

export async function generateWorkoutPlan(userId: string) {
  // Buscar dados do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('goal, activity_level, training_location')
    .eq('id', userId)
    .single();

  if (!profile) return;

  // Gerar plano baseado no objetivo
  const workoutPlans = {
    emagrecer: {
      name: 'Plano de Emagrecimento',
      description: 'Treinos focados em queima de gordura e condicionamento',
      exercises: [
        { name: 'Corrida', duration: 30, type: 'cardio' },
        { name: 'Burpees', reps: 15, sets: 3 },
        { name: 'Jump Rope', duration: 10, type: 'cardio' }
      ]
    },
    'ganhar massa': {
      name: 'Plano de Hipertrofia',
      description: 'Treinos focados em ganho de massa muscular',
      exercises: [
        { name: 'Supino', reps: 12, sets: 4 },
        { name: 'Agachamento', reps: 10, sets: 4 },
        { name: 'Levantamento Terra', reps: 8, sets: 3 }
      ]
    },
    manter: {
      name: 'Plano de Manutenção',
      description: 'Treinos balanceados para manter a forma',
      exercises: [
        { name: 'Flexões', reps: 15, sets: 3 },
        { name: 'Agachamento', reps: 15, sets: 3 },
        { name: 'Prancha', duration: 60, sets: 3 }
      ]
    }
  };

  const plan = workoutPlans[profile.goal as keyof typeof workoutPlans] || workoutPlans.manter;

  // Inserir plano no banco
  await supabase.from('workouts').insert({
    user_id: userId,
    name: plan.name,
    description: plan.description,
    duration: 45,
    difficulty: profile.activity_level === 'alto' ? 'avançado' : 'intermediário',
    exercises: plan.exercises
  });
}

export async function generateNutritionPlan(userId: string) {
  // Buscar dados do usuário
  const { data: profile } = await supabase
    .from('profiles')
    .select('goal, weight, height, age, gender')
    .eq('id', userId)
    .single();

  if (!profile) return;

  // Calcular TMB (Taxa Metabólica Basal)
  let tmb = 0;
  if (profile.gender === 'masculino') {
    tmb = 88.362 + (13.397 * profile.weight) + (4.799 * profile.height) - (5.677 * profile.age);
  } else {
    tmb = 447.593 + (9.247 * profile.weight) + (3.098 * profile.height) - (4.330 * profile.age);
  }

  // Ajustar calorias baseado no objetivo
  let targetCalories = tmb * 1.5; // Fator de atividade moderada
  if (profile.goal === 'emagrecer') {
    targetCalories -= 500;
  } else if (profile.goal === 'ganhar massa') {
    targetCalories += 500;
  }

  // Salvar meta calórica em settings
  await supabase
    .from('settings')
    .update({ target_calories: Math.round(targetCalories) })
    .eq('user_id', userId);
}
