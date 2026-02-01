/**
 * OpenAI Integration
 * Usa modelo gpt-4o para análise nutricional e geração de treinos
 * NUNCA armazena a chave da API no código - usa variável de ambiente
 */

export interface NutritionAnalysis {
  alimentos: Array<{
    nome: string
    quantidade_estimado_g: string
    kcal: string
    macros: {
      carbo_g: string
      proteina_g: string
      gordura_g: string
      fibras_g: string
    }
  }>
  kcal_total: string
  observacoes: string
}

export interface WorkoutPlan {
  semana: Array<{
    dia: string
    treino: {
      nome: string
      tipo: string
      duracao_minutos: number
      calorias_estimadas: number
      exercicios: Array<{
        nome: string
        series: number
        repeticoes: string
        descanso_segundos: number
        observacoes?: string
      }>
    }
  }>
  objetivo: string
  nivel: string
  observacoes: string
}

/**
 * Analisa foto de alimento usando OpenAI Vision
 */
export async function analyzeFood(imageUrl: string): Promise<NutritionAnalysis> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado em análise de alimentos. Analise a imagem e retorne APENAS um JSON válido com a estrutura especificada, sem texto adicional.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta foto de alimento e retorne um JSON com: alimentos (array com nome, quantidade_estimado_g, kcal, macros{carbo_g, proteina_g, gordura_g, fibras_g}), kcal_total, observacoes. Seja preciso nas estimativas.'
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 1000
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  return JSON.parse(content)
}

/**
 * Busca informações nutricionais por texto
 */
export async function searchFood(query: string): Promise<NutritionAnalysis> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um nutricionista especializado. Retorne APENAS um JSON válido com informações nutricionais, sem texto adicional.'
        },
        {
          role: 'user',
          content: `Forneça informações nutricionais para: "${query}". Retorne JSON com: alimentos (array com nome, quantidade_estimado_g, kcal, macros{carbo_g, proteina_g, gordura_g, fibras_g}), kcal_total, observacoes.`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 800
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  return JSON.parse(content)
}

/**
 * Gera plano de treino personalizado baseado no quiz
 */
export async function generateWorkoutPlan(quizData: any): Promise<WorkoutPlan> {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OPENAI_API_KEY não configurada')
  }

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'Você é um personal trainer especializado. Crie planos de treino personalizados baseados no perfil do usuário. Retorne APENAS um JSON válido, sem texto adicional.'
        },
        {
          role: 'user',
          content: `Crie um plano de treino semanal personalizado para: ${JSON.stringify(quizData)}. Retorne JSON com: semana (array de dias com treino{nome, tipo, duracao_minutos, calorias_estimadas, exercicios[nome, series, repeticoes, descanso_segundos, observacoes]}), objetivo, nivel, observacoes.`
        }
      ],
      response_format: { type: 'json_object' },
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.statusText}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  
  return JSON.parse(content)
}
