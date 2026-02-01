'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Search, Loader2, Plus } from 'lucide-react'
import { vitaupAPI, NormalizedFood } from '@/lib/vitaup-api'

interface AddFoodModalProps {
  isOpen: boolean
  onClose: () => void
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  onAddFood: (food: NormalizedFood, servingGrams: number, mealType: string) => void
}

export default function AddFoodModal({ isOpen, onClose, mealType, onAddFood }: AddFoodModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<NormalizedFood[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFood, setSelectedFood] = useState<NormalizedFood | null>(null)
  const [servingGrams, setServingGrams] = useState(100)

  const mealTypeLabels = {
    breakfast: 'Café da manhã',
    lunch: 'Almoço',
    dinner: 'Jantar',
    snack: 'Lanche'
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Tenta buscar por código de barras primeiro (se for numérico)
      if (/^\d+$/.test(searchQuery)) {
        const result = await vitaupAPI.searchFoodByBarcode(searchQuery)
        if (result.foods.length > 0) {
          setSearchResults(result.foods)
          setIsSearching(false)
          return
        }
      }

      // Busca detalhada por texto (USDA)
      const result = await vitaupAPI.searchFoodDetailed(searchQuery)
      setSearchResults(result.foods)
    } catch (error) {
      console.error('Erro ao buscar alimentos:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddFood = () => {
    if (selectedFood) {
      onAddFood(selectedFood, servingGrams, mealType)
      onClose()
      // Reset
      setSearchQuery('')
      setSearchResults([])
      setSelectedFood(null)
      setServingGrams(100)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-20 bottom-20 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:w-full md:max-w-2xl bg-[#1A1A1A] rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                Adicionar - {mealTypeLabels[mealType]}
              </h2>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-6 border-b border-white/10">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Buscar alimento ou código de barras..."
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#62D8B5] transition-colors"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  disabled={isSearching || !searchQuery.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-2xl font-semibold text-white hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Buscando...
                    </>
                  ) : (
                    'Buscar'
                  )}
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="flex-1 overflow-y-auto p-6">
              {searchResults.length === 0 && !isSearching && (
                <div className="text-center text-white/40 py-12">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-40" />
                  <p>Busque por alimentos ou código de barras</p>
                </div>
              )}

              {isSearching && (
                <div className="text-center text-white/40 py-12">
                  <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" />
                  <p>Buscando alimentos...</p>
                </div>
              )}

              <div className="space-y-3">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => setSelectedFood(food)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedFood?.id === food.id
                        ? 'bg-[#62D8B5]/20 border-[#62D8B5]'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {food.image_url && (
                        <img
                          src={food.image_url}
                          alt={food.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{food.name}</h3>
                        {food.brand && (
                          <p className="text-sm text-white/60 mb-2">{food.brand}</p>
                        )}
                        <div className="flex gap-4 text-sm text-white/80">
                          <span>{food.nutrition_per_100g.kcal} kcal</span>
                          <span>P: {food.nutrition_per_100g.protein_g}g</span>
                          <span>C: {food.nutrition_per_100g.carbs_g}g</span>
                          <span>G: {food.nutrition_per_100g.fat_g}g</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer - Serving Selection */}
            {selectedFood && (
              <div className="p-6 border-t border-white/10 bg-[#0A0A0A]">
                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">
                    Quantidade (gramas)
                  </label>
                  <input
                    type="number"
                    value={servingGrams}
                    onChange={(e) => setServingGrams(Number(e.target.value))}
                    min="1"
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-[#62D8B5] transition-colors"
                  />
                </div>

                <div className="flex gap-3 mb-4 text-sm text-white/80">
                  <div className="flex-1 p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-white/60 mb-1">Calorias</p>
                    <p className="font-semibold">
                      {Math.round((selectedFood.nutrition_per_100g.kcal * servingGrams) / 100)} kcal
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-white/60 mb-1">Proteína</p>
                    <p className="font-semibold">
                      {Math.round((selectedFood.nutrition_per_100g.protein_g * servingGrams) / 100)}g
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-white/60 mb-1">Carbos</p>
                    <p className="font-semibold">
                      {Math.round((selectedFood.nutrition_per_100g.carbs_g * servingGrams) / 100)}g
                    </p>
                  </div>
                  <div className="flex-1 p-3 bg-white/5 rounded-xl text-center">
                    <p className="text-white/60 mb-1">Gordura</p>
                    <p className="font-semibold">
                      {Math.round((selectedFood.nutrition_per_100g.fat_g * servingGrams) / 100)}g
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleAddFood}
                  className="w-full py-4 bg-gradient-to-r from-[#62D8B5] to-[#AEE2FF] rounded-2xl font-semibold text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Alimento
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
