'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { 
  Home as HomeIcon, 
  Apple, 
  Dumbbell, 
  Moon, 
  MessageCircle, 
  User,
  Plus,
  Search,
  Camera,
  Scan,
  Droplet,
  Zap,
  ArrowLeft,
  Loader2,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase-client'
import { analyzeFood, searchFood } from '@/lib/openai'
import type { NutritionLog, MealPhoto } from '@/lib/supabase-client'

export default function DietaPage() {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState('dieta')
  const [userId, setUserId] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [showSearchModal, setShowSearchModal] = useState(false)
  const [showPhotoModal, setShowPhotoModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Dados de exemplo (substituir por dados reais do Supabase)
  const nutritionData = {
    consumed: 1450,
    goal: 2000,
    remaining: 550,
    macros: {
      carbs: { consumed: 150, goal: 250 },
      protein: { consumed: 80, goal: 120 },
      fat: { consumed: 45, goal: 65 }
    }
  }

  const meals = [
    {
      name: 'Café da manhã',
      icon: '☕',
      items: [
        { name: 'Pão integral com queijo', calories: 280 },
        { name: 'Café com leite', calories: 120 }
      ],
      total: 400
    },
    {
      name: 'Almoço',
      icon: '🍽️',
      items: [
        { name: 'Arroz, feijão e frango', calories: 650 }
      ],
      total: 650
    },
    {
      name: 'Jantar',
      icon: '🌙',
      items: [],
      total: 0
    },
    {
      name: 'Lanches',
      icon: '🍎',
      items: [
        { name: 'Banana', calories: 105 },
        { name: 'Castanhas', calories: 295 }
      ],
      total: 400
    }
  ]

  const waterIntake = 6
  const waterGoal = 8

  const caloriesProgress = (nutritionData.consumed / nutritionData.goal) * 100
  const carbsProgress = (nutritionData.macros.carbs.consumed / nutritionData.macros.carbs.goal) * 100
  const proteinProgress = (nutritionData.macros.protein.consumed / nutritionData.macros.protein.goal) * 100
  const fatProgress = (nutritionData.macros.fat.consumed / nutritionData.macros.fat.goal) * 100

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
    }
  }

  const handleSearchFood = async () => {
    if (!userId || !searchQuery.trim()) return

    setIsAnalyzing(true)

    try {
      const result = await searchFood(searchQuery)

      // Salva em nutrition_logs
      for (const alimento of result.alimentos) {
        await supabase
          .from('nutrition_logs')
          .insert({
            user_id: userId,
            meal_type: 'Busca',
            calories: parseInt(alimento.kcal),
            protein_g: parseFloat(alimento.macros.proteina_g),
            carbs_g: parseFloat(alimento.macros.carbo_g),
            fats_g: parseFloat(alimento.macros.gordura_g),
            logged_at: new Date().toISOString()
          })
      }

      alert(`Alimento registrado: ${result.alimentos.map(a => a.nome).join(', ')} - ${result.kcal_total} kcal`)
      setShowSearchModal(false)
      setSearchQuery('')
    } catch (error) {
      console.error('Erro ao buscar alimento:', error)
      alert('Erro ao buscar alimento. Verifique se a variável OPENAI_API_KEY está configurada.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string)
      setShowPhotoModal(true)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyzePhoto = async () => {
    if (!userId || !photoPreview) return

    setIsAnalyzing(true)

    try {
      const result = await analyzeFood(photoPreview)

      // Salva foto em meal_photos
      const { data: photoData } = await supabase
        .from('meal_photos')
        .insert({
          user_id: userId,
          photo_url: photoPreview,
          ai_food_labels: result.alimentos,
          ai_portion_estimate: result,
          calories_estimated: parseFloat(result.kcal_total),
          protein_estimated: result.alimentos.reduce((sum, a) => sum + parseFloat(a.macros.proteina_g), 0),
          carbs_estimated: result.alimentos.reduce((sum, a) => sum + parseFloat(a.macros.carbo_g), 0),
          fat_estimated: result.alimentos.reduce((sum, a) => sum + parseFloat(a.macros.gordura_g), 0)
        })
        .select()
        .single()

      // Salva em nutrition_logs
      for (const alimento of result.alimentos) {
        await supabase
          .from('nutrition_logs')
          .insert({
            user_id: userId,
            meal_type: 'Foto',
            calories: parseInt(alimento.kcal),
            protein_g: parseFloat(alimento.macros.proteina_g),
            carbs_g: parseFloat(alimento.macros.carbo_g),
            fats_g: parseFloat(alimento.macros.gordura_g),
            photo_url: photoPreview,
            logged_at: new Date().toISOString()
          })
      }

      alert(`Alimento identificado: ${result.alimentos.map(a => a.nome).join(', ')} - ${result.kcal_total} kcal`)
      setShowPhotoModal(false)
      setPhotoPreview(null)
    } catch (error) {
      console.error('Erro ao analisar foto:', error)
      alert('Erro ao analisar foto. Verifique se a variável OPENAI_API_KEY está configurada.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    if (tab === 'home') router.push('/home')
    if (tab === 'dieta') router.push('/dieta')
    if (tab === 'treino') router.push('/treino')
    if (tab === 'sono') router.push('/sono')
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#AEE2FF] to-[#62D8B5] p-6 rounded-b-3xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/home')}
            className="text-[#0A0A0A] hover:bg-white/20 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold text-[#0A0A0A]">Nutrição</h1>
          <Button
            size="icon"
            className="bg-white/20 hover:bg-white/30 text-[#0A0A0A] rounded-full border-2 border-white/40"
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Mini Gráfico Circular de Calorias */}
        <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6 border border-white/30">
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 rounded-full bg-white/30 blur-xl" />
              
              <svg className="w-32 h-32 transform -rotate-90 relative z-10">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeOpacity="0.2"
                  strokeWidth="10"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="white"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - caloriesProgress / 100)}`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <span className="text-3xl font-bold text-[#0A0A0A]">{nutritionData.consumed}</span>
                <span className="text-xs text-[#0A0A0A]/70">de {nutritionData.goal}</span>
              </div>
            </div>

            <div className="flex-1 ml-6 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0A0A0A]">Consumido</span>
                <span className="text-sm font-bold text-[#0A0A0A]">{nutritionData.consumed} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0A0A0A]">Meta</span>
                <span className="text-sm font-bold text-[#0A0A0A]">{nutritionData.goal} kcal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0A0A0A]">Restante</span>
                <span className="text-sm font-bold text-[#62D8B5]">{nutritionData.remaining} kcal</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8 space-y-8">
        {/* Macronutrientes */}
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Macronutrientes</h2>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#AEE2FF]" />
                  <span className="font-semibold text-[#0A0A0A]">Carboidratos</span>
                </div>
                <span className="text-sm text-[#0A0A0A]/70">
                  {nutritionData.macros.carbs.consumed}g / {nutritionData.macros.carbs.goal}g
                </span>
              </div>
              <Progress value={carbsProgress} className="h-2.5 bg-[#0A0A0A]/5" />
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#62D8B5]" />
                  <span className="font-semibold text-[#0A0A0A]">Proteínas</span>
                </div>
                <span className="text-sm text-[#0A0A0A]/70">
                  {nutritionData.macros.protein.consumed}g / {nutritionData.macros.protein.goal}g
                </span>
              </div>
              <Progress value={proteinProgress} className="h-2.5 bg-[#0A0A0A]/5" />
            </div>

            <div className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFB84D]" />
                  <span className="font-semibold text-[#0A0A0A]">Gorduras</span>
                </div>
                <span className="text-sm text-[#0A0A0A]/70">
                  {nutritionData.macros.fat.consumed}g / {nutritionData.macros.fat.goal}g
                </span>
              </div>
              <Progress value={fatProgress} className="h-2.5 bg-[#0A0A0A]/5" />
            </div>
          </div>
        </div>

        {/* Refeições do Dia */}
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Refeições do Dia</h2>
          <div className="space-y-4">
            {meals.map((meal, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-5 border-2 border-[#0A0A0A]/5 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#AEE2FF]/20 to-[#62D8B5]/20 flex items-center justify-center text-2xl">
                      {meal.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0A0A0A]">{meal.name}</h3>
                      <p className="text-sm text-[#0A0A0A]/60">{meal.total} kcal</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="rounded-full border-2 border-[#62D8B5] text-[#62D8B5] hover:bg-[#62D8B5] hover:text-white transition-all duration-300"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {meal.items.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-[#0A0A0A]/5">
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center justify-between text-sm">
                        <span className="text-[#0A0A0A]/70">{item.name}</span>
                        <span className="font-semibold text-[#0A0A0A]">{item.calories} kcal</span>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Hidratação */}
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Hidratação</h2>
          <div className="bg-gradient-to-br from-[#AEE2FF]/10 to-[#62D8B5]/10 rounded-2xl p-6 border-2 border-[#AEE2FF]/30">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-[#AEE2FF] flex items-center justify-center">
                  <Droplet className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-[#0A0A0A]">Água</h3>
                  <p className="text-sm text-[#0A0A0A]/60">{waterIntake} de {waterGoal} copos</p>
                </div>
              </div>
              <Button
                size="sm"
                className="bg-[#AEE2FF] hover:bg-[#AEE2FF]/90 text-white rounded-full h-10 w-10 p-0"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex gap-2">
              {Array.from({ length: waterGoal }).map((_, index) => (
                <div
                  key={index}
                  className={`flex-1 h-3 rounded-full transition-all duration-300 ${
                    index < waterIntake
                      ? 'bg-[#AEE2FF] shadow-lg shadow-[#AEE2FF]/50'
                      : 'bg-[#0A0A0A]/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div>
          <h2 className="text-xl font-bold text-[#0A0A0A] mb-5">Adicionar Alimento</h2>
          <div className="grid grid-cols-2 gap-4">
            <Button
              onClick={() => setShowSearchModal(true)}
              variant="outline"
              className="h-28 flex flex-col items-center justify-center gap-3 border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 rounded-2xl transition-all duration-300"
            >
              <Search className="w-8 h-8 text-[#62D8B5]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Buscar</span>
            </Button>

            <Button
              variant="outline"
              className="h-28 flex flex-col items-center justify-center gap-3 border-2 border-[#0A0A0A]/10 hover:border-[#AEE2FF] hover:bg-[#AEE2FF]/5 rounded-2xl transition-all duration-300"
            >
              <Scan className="w-8 h-8 text-[#AEE2FF]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Código de Barras</span>
            </Button>

            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="h-28 flex flex-col items-center justify-center gap-3 border-2 border-[#0A0A0A]/10 hover:border-[#62D8B5] hover:bg-[#62D8B5]/5 rounded-2xl transition-all duration-300"
            >
              <Camera className="w-8 h-8 text-[#62D8B5]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Foto (IA)</span>
            </Button>

            <Button
              variant="outline"
              className="h-28 flex flex-col items-center justify-center gap-3 border-2 border-[#0A0A0A]/10 hover:border-[#AEE2FF] hover:bg-[#AEE2FF]/5 rounded-2xl transition-all duration-300"
            >
              <Zap className="w-8 h-8 text-[#AEE2FF]" />
              <span className="text-sm font-semibold text-[#0A0A0A]">Refeição Rápida</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Modal de Busca */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0A0A0A]">Buscar Alimento</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowSearchModal(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ex: frango grelhado 120g"
              className="w-full bg-[#0A0A0A]/5 border-2 border-[#0A0A0A]/10 rounded-2xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-[#62D8B5]"
              onKeyPress={(e) => e.key === 'Enter' && handleSearchFood()}
            />

            <Button
              onClick={handleSearchFood}
              disabled={isAnalyzing || !searchQuery.trim()}
              className="w-full bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-white font-bold py-3 rounded-2xl"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}

      {/* Modal de Foto */}
      {showPhotoModal && photoPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0A0A0A]">Analisar Foto</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setShowPhotoModal(false)
                  setPhotoPreview(null)
                }}
                className="rounded-full"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <img
              src={photoPreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-2xl mb-4"
            />

            <Button
              onClick={handleAnalyzePhoto}
              disabled={isAnalyzing}
              className="w-full bg-gradient-to-r from-[#AEE2FF] to-[#62D8B5] hover:opacity-90 text-white font-bold py-3 rounded-2xl"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Camera className="w-5 h-5 mr-2" />
                  Analisar
                </>
              )}
            </Button>
          </motion.div>
        </div>
      )}

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-[#0A0A0A]/5 px-6 py-4">
        <div className="flex items-center justify-around max-w-2xl mx-auto">
          <button
            onClick={() => handleTabChange('home')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'home' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <HomeIcon className="w-6 h-6" />
            <span className="text-xs font-semibold">Home</span>
          </button>

          <button
            onClick={() => handleTabChange('dieta')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'dieta' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Apple className="w-6 h-6" />
            <span className="text-xs font-semibold">Dieta</span>
          </button>

          <button
            onClick={() => handleTabChange('treino')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'treino' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Dumbbell className="w-6 h-6" />
            <span className="text-xs font-semibold">Treino</span>
          </button>

          <button
            onClick={() => handleTabChange('sono')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'sono' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <Moon className="w-6 h-6" />
            <span className="text-xs font-semibold">Sono</span>
          </button>

          <button
            onClick={() => handleTabChange('coach')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'coach' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs font-semibold">Coach</span>
          </button>

          <button
            onClick={() => handleTabChange('perfil')}
            className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
              currentTab === 'perfil' ? 'text-[#62D8B5]' : 'text-[#0A0A0A]/40'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-semibold">Perfil</span>
          </button>
        </div>
      </div>
    </div>
  )
}
