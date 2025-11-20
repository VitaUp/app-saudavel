// Paleta de cores do VitaUp
export const colors = {
  light: {
    background: {
      primary: '#FFFFFF',
      secondary: '#F7F7F7',
    },
    text: {
      primary: '#0D0D0D',
      secondary: '#3B3B3B',
    },
    action: '#FF6A3D',
    nutrition: '#3BAEA0',
    premium: '#7B61FF',
    workout: '#1E90FF',
    gamification: '#F4C430',
  },
  dark: {
    background: {
      primary: '#1E1E1E',
      secondary: '#181818',
      card: '#262626',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#D9D9D9',
    },
    action: '#FF6A3D',
    nutrition: '#3BAEA0',
    premium: '#7B61FF',
    workout: '#1E90FF',
    gamification: '#F4C430',
  },
  sleep: {
    background: '#0A1929',
    light: '#6BB1FF',
    deep: '#3F72FF',
    rem: '#A585FF',
  }
}

// Traduções
export const translations = {
  'pt-BR': {
    common: {
      welcome: 'Bem-vindo',
      goodMorning: 'Bom dia',
      goodAfternoon: 'Boa tarde',
      goodEvening: 'Boa noite',
      continue: 'Continuar',
      skip: 'Pular',
      next: 'Próximo',
      back: 'Voltar',
      save: 'Salvar',
      cancel: 'Cancelar',
    },
    auth: {
      login: 'Entrar',
      signup: 'Criar conta',
      email: 'E-mail',
      password: 'Senha',
      fullName: 'Nome completo',
      preferredName: 'Como prefere ser chamado?',
    },
    home: {
      diet: 'Dieta',
      workout: 'Treino',
      sleep: 'Sono',
      habits: 'Hábitos',
      xp: 'XP',
    },
    coaches: {
      coachUp: {
        name: 'CoachUp',
        role: 'Seu coach motivacional',
        redirectToDiet: 'Isso é com a Nutri Carol 🥦💚 Vou te levar pra ela.',
      },
      nutriCarol: {
        name: 'Nutri Carol',
        role: 'Sua nutricionista',
      }
    }
  },
  'en': {
    common: {
      welcome: 'Welcome',
      goodMorning: 'Good morning',
      goodAfternoon: 'Good afternoon',
      goodEvening: 'Good evening',
      continue: 'Continue',
      skip: 'Skip',
      next: 'Next',
      back: 'Back',
      save: 'Save',
      cancel: 'Cancel',
    },
    auth: {
      login: 'Login',
      signup: 'Sign up',
      email: 'Email',
      password: 'Password',
      fullName: 'Full name',
      preferredName: 'How do you prefer to be called?',
    },
    home: {
      diet: 'Diet',
      workout: 'Workout',
      sleep: 'Sleep',
      habits: 'Habits',
      xp: 'XP',
    },
    coaches: {
      coachUp: {
        name: 'CoachUp',
        role: 'Your motivational coach',
        redirectToDiet: "That's for Nutri Carol 🥦💚 I'll take you to her.",
      },
      nutriCarol: {
        name: 'Nutri Carol',
        role: 'Your nutritionist',
      }
    }
  },
  'es': {
    common: {
      welcome: 'Bienvenido',
      goodMorning: 'Buenos días',
      goodAfternoon: 'Buenas tardes',
      goodEvening: 'Buenas noches',
      continue: 'Continuar',
      skip: 'Saltar',
      next: 'Siguiente',
      back: 'Volver',
      save: 'Guardar',
      cancel: 'Cancelar',
    },
    auth: {
      login: 'Iniciar sesión',
      signup: 'Crear cuenta',
      email: 'Correo electrónico',
      password: 'Contraseña',
      fullName: 'Nombre completo',
      preferredName: '¿Cómo prefieres que te llamen?',
    },
    home: {
      diet: 'Dieta',
      workout: 'Entrenamiento',
      sleep: 'Sueño',
      habits: 'Hábitos',
      xp: 'XP',
    },
    coaches: {
      coachUp: {
        name: 'CoachUp',
        role: 'Tu coach motivacional',
        redirectToDiet: 'Eso es con Nutri Carol 🥦💚 Te llevaré con ella.',
      },
      nutriCarol: {
        name: 'Nutri Carol',
        role: 'Tu nutricionista',
      }
    }
  }
}

export function getGreeting(language: 'pt-BR' | 'en' | 'es' = 'pt-BR'): string {
  const hour = new Date().getHours()
  const t = translations[language].common
  
  if (hour < 12) return t.goodMorning
  if (hour < 18) return t.goodAfternoon
  return t.goodEvening
}
