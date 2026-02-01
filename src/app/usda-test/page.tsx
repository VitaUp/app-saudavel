'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, Loader2, Info } from 'lucide-react'

interface USDAFood {
  fdcId: number
  description: string
  dataType: string
  foodNutrients: Array<{
    nutrientName: string
    value: number
    unitName: string
  }>
}

export default function USDATestPage() {
  const [query, setQuery] = useState('')
  const [fdcId, setFdcId] = useState('')
  const [searchResults, setSearchResults] = useState<USDAFood[]>([])
  const [detailResult, setDetailResult] = useState<USDAFood | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [apiKey, setApiKey] = useState('')

  // Busca por texto
  const handleSearch = async () => {
    if (!query.trim()) return
    if (!apiKey.trim()) {
      setError('Por favor, insira sua USDA API Key')
      return
    }

    setLoading(true)
    setError('')
    setDetailResult(null)
    
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(query)}&pageSize=10`
      )
      
      if (!response.ok) {
        throw new Error('Erro na busca USDA')
      }

      const data = await response.json()
      setSearchResults(data.foods || [])
    } catch (err: any) {
      setError(err.message)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  // Busca por fdcId
  const handleDetailSearch = async () => {
    if (!fdcId.trim()) return
    if (!apiKey.trim()) {
      setError('Por favor, insira sua USDA API Key')
      return
    }

    setLoading(true)
    setError('')
    setSearchResults([])
    
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes')
      }

      const data = await response.json()
      setDetailResult(data)
    } catch (err: any) {
      setError(err.message)
      setDetailResult(null)
    } finally {
      setLoading(false)
    }
  }

  // Buscar detalhes de um resultado
  const loadDetails = async (id: number) => {
    setFdcId(id.toString())
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/food/${id}?api_key=${apiKey}`
      )
      
      if (!response.ok) {
        throw new Error('Erro ao buscar detalhes')
      }

      const data = await response.json()
      setDetailResult(data)
      setSearchResults([])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const getNutrientValue = (nutrients: any[], name: string) => {
    const nutrient = nutrients?.find((n) => 
      n.nutrientName?.toLowerCase().includes(name.toLowerCase())
    )
    return nutrient ? `${nutrient.value} ${nutrient.unitName}` : 'N/A'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1a1a2e] to-[#0A0A0A] text-white p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#62D8B5] to-[#4CAF50] bg-clip-text text-transparent">
            USDA FoodData Central
          </h1>
          <p className="text-white/60">Teste direto da API USDA</p>
        </div>

        {/* API Key Input */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#62D8B5]" />
            <h2 className="text-lg font-semibold">Configuração</h2>
          </div>
          <Input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Cole sua USDA API Key aqui (obtenha em data.gov)"
            className="bg-white/10 border-white/20 text-white"
          />
          <p className="text-xs text-white/40">
            Obtenha sua chave gratuita em: <a href="https://fdc.nal.usda.gov/api-key-signup.html" target="_blank" className="text-[#62D8B5] hover:underline">fdc.nal.usda.gov/api-key-signup.html</a>
          </p>
        </div>

        {/* Busca por texto */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Buscar alimentos</h2>
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ex: banana, chicken, rice..."
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !apiKey}
              className="bg-gradient-to-r from-[#62D8B5] to-[#4CAF50] hover:opacity-90"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Busca por fdcId */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Buscar por FDC ID</h2>
          <div className="flex gap-2">
            <Input
              value={fdcId}
              onChange={(e) => setFdcId(e.target.value)}
              placeholder="Ex: 1105073"
              className="bg-white/10 border-white/20 text-white"
              onKeyDown={(e) => e.key === 'Enter' && handleDetailSearch()}
            />
            <Button
              onClick={handleDetailSearch}
              disabled={loading || !apiKey}
              className="bg-gradient-to-r from-[#62D8B5] to-[#4CAF50] hover:opacity-90"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Info className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Erro */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Resultados da busca */}
        {searchResults.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Resultados ({searchResults.length})</h2>
            <div className="space-y-3">
              {searchResults.map((food) => (
                <div
                  key={food.fdcId}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all cursor-pointer"
                  onClick={() => loadDetails(food.fdcId)}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{food.description}</h3>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-[#62D8B5]">
                          {getNutrientValue(food.foodNutrients, 'Energy')}
                        </span>
                        <span className="text-white/60">
                          Proteína: {getNutrientValue(food.foodNutrients, 'Protein')}
                        </span>
                        <span className="text-white/60">
                          Carbs: {getNutrientValue(food.foodNutrients, 'Carbohydrate')}
                        </span>
                        <span className="text-white/60">
                          Gordura: {getNutrientValue(food.foodNutrients, 'Total lipid')}
                        </span>
                      </div>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs bg-[#62D8B5]/20 text-[#62D8B5] px-2 py-1 rounded">
                          {food.dataType}
                        </span>
                        <span className="text-xs text-white/60">
                          FDC ID: {food.fdcId}
                        </span>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-[#62D8B5]/50 text-[#62D8B5] hover:bg-[#62D8B5]/10"
                    >
                      Ver detalhes
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detalhes do alimento */}
        {detailResult && (
          <div className="bg-gradient-to-br from-[#62D8B5]/10 to-[#4CAF50]/10 border border-[#62D8B5]/30 rounded-xl p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-[#62D8B5]">{detailResult.description}</h2>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-sm bg-[#62D8B5]/20 text-[#62D8B5] px-3 py-1 rounded-full">
                  {detailResult.dataType}
                </span>
                <span className="text-sm text-white/60">
                  FDC ID: {detailResult.fdcId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-white/60">Energia</p>
                <p className="text-2xl font-bold text-[#62D8B5]">
                  {getNutrientValue(detailResult.foodNutrients, 'Energy')}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-white/60">Proteína</p>
                <p className="text-2xl font-bold">
                  {getNutrientValue(detailResult.foodNutrients, 'Protein')}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-white/60">Carboidratos</p>
                <p className="text-2xl font-bold">
                  {getNutrientValue(detailResult.foodNutrients, 'Carbohydrate')}
                </p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <p className="text-sm text-white/60">Gordura</p>
                <p className="text-2xl font-bold">
                  {getNutrientValue(detailResult.foodNutrients, 'Total lipid')}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold">Todos os nutrientes</h3>
              <div className="bg-white/5 rounded-lg p-4 max-h-96 overflow-y-auto space-y-2">
                {detailResult.foodNutrients?.map((nutrient, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/5">
                    <span className="text-sm text-white/80">{nutrient.nutrientName}</span>
                    <span className="text-sm font-semibold text-[#62D8B5]">
                      {nutrient.value} {nutrient.unitName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estado vazio */}
        {!loading && searchResults.length === 0 && !detailResult && !error && (
          <div className="text-center py-12 text-white/60">
            <p>Configure sua API Key e busque alimentos na base USDA</p>
          </div>
        )}
      </div>
    </div>
  )
}
