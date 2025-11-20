import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('pt-BR')
}

export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

export function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2)
}

export function calculateCalories(
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: number
): number {
  // Fórmula de Harris-Benedict
  let bmr: number
  
  if (gender === 'male') {
    bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
  } else {
    bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
  }
  
  return Math.round(bmr * activityLevel)
}

export function calculateMacros(calories: number, goal: string) {
  let proteinPercent = 0.30
  let carbsPercent = 0.40
  let fatPercent = 0.30
  
  if (goal === 'lose_weight') {
    proteinPercent = 0.35
    carbsPercent = 0.30
    fatPercent = 0.35
  } else if (goal === 'gain_muscle') {
    proteinPercent = 0.35
    carbsPercent = 0.45
    fatPercent = 0.20
  }
  
  return {
    protein: Math.round((calories * proteinPercent) / 4),
    carbs: Math.round((calories * carbsPercent) / 4),
    fat: Math.round((calories * fatPercent) / 9),
  }
}
