'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, fullName: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Lista de emails especiais
const SPECIAL_ACCOUNTS = {
  owner: ['matheusantanabr16@gmail.com'],
  ceo: ['murilo.brasil.santana@gmail.com'],
  family: [
    'adelinagbrasil@gmail.com',
    'mila.brasil@gmail.com',
    'aimee.brasil.ribeiro@gmail.com',
    'amandagbrasil@gmail.com',
    'mpbrasil@gmail.com',
    'aline.brasil@gmail.com',
    'carolmourapessoal@gmail.com'
  ],
  partner: [
    'ernanecsantana@gmail.com',
    'isabelle.f.costa.ic@gmail.com',
    'sousagabriel_cm@outlook.com',
    'carol.guimaraes.brasil@gmail.com'
  ],
  friend: ['parkermaster564@gmail.com']
}

function getSpecialCategory(email: string): string | null {
  for (const [category, emails] of Object.entries(SPECIAL_ACCOUNTS)) {
    if (emails.includes(email.toLowerCase())) {
      return category
    }
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error

    if (data.user) {
      // Verificar se perfil existe
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      // Se não existe, criar perfil
      if (!profile) {
        const specialCategory = getSpecialCategory(email)
        
        await supabase.from('profiles').insert({
          id: data.user.id,
          email: email,
          plan_type: specialCategory ? 'vitaup_plus' : 'free',
          is_special_account: !!specialCategory,
          special_category: specialCategory
        })
      }

      // Após login, redirecionar para o dashboard
      router.push('/dashboard')
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (error) throw error

    if (data.user) {
      // Criar perfil inicial
      const specialCategory = getSpecialCategory(email)
      
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        plan_type: specialCategory ? 'vitaup_plus' : 'free',
        is_special_account: !!specialCategory,
        special_category: specialCategory,
        onboarding_completed: false // Marca que precisa fazer onboarding
      })

      // Após cadastro, redirecionar para o Quiz 1
      router.push('/quiz-1')
    }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    router.push('/auth')
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
