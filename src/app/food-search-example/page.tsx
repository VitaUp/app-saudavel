'use client'

import { useState } from 'react'
import { vitaupAPI, type NormalizedFood } from '@/lib/vitaup-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Barcode, Loader2 } from 'lucide-react'

export default function FoodSearchExample() {
  const [query, setQuery] = useState('')
  const [barcode, setBarcode] = useState('')
  const [results, setResults] = useState<NormalizedFood[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const { foods } = await vitaupAPI.searchFoodAutocomplete(query)
      setResults(foods)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBarcodeSearch = async () => {
    if (!barcode.trim()) return

    setLoading(true)
    setError('')
    
    try {
      const { foods } = await vitaupAPI.searchFoodByBarcode(barcode)
      setResults(foods)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">VitaUp Food Search</h1>

        {/* Busca por texto */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Buscar por nome</h2>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: banana, arroz, frango..."
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#62D8B5] hover:bg-[#62D8B5]/90"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Busca por código de barras */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Buscar por código de barras</h2>
          <div className="flex gap-2">
            <Input
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="Ex: 7891234567890"
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
            />
            <Button
              onClick={handleBarcodeSearch}
              disabled={loading}
              className="bg-[#62D8B5] hover:bg-[#62D8B5]/90"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Barcode className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Resultados */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados ({results.length})</h2>
            <div className="space-y-3">
              {results.map((food) => (
                <div
                  key={food.id}
                  className="bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {food.image_url && (
                      <img
                        src={food.image_url}
                        alt={food.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{food.name}</h3>
                      {food.brand && (
                        <p className="text-sm text-white/60">{food.brand}</p>
                      )}
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-[#62D8B5]">
                          {Math.round(food.nutrition_per_100g.kcal)} kcal
                        </span>
                        <span className="text-white/60">
                          P: {Math.round(food.nutrition_per_100g.protein_g)}g
                        </span>
                        <span className="text-white/60">
                          C: {Math.round(food.nutrition_per_100g.carbs_g)}g
                        </span>
                        <span className="text-white/60">
                          G: {Math.round(food.nutrition_per_100g.fat_g)}g
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs bg-white/10 px-2 py-1 rounded">
                          {food.source}
                        </span>
                        {food.barcode && (
                          <span className="text-xs text-white/60">
                            {food.barcode}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && results.length === 0 && !error && (
          <div className="text-center py-12 text-white/60">
            <p>Busque um alimento por nome ou código de barras</p>
          </div>
        )}
      </div>
    </div>
  )
}
