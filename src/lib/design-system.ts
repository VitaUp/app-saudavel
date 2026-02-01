// Design System - VitaUp Wellness Tech 2025

export const colors = {
  // Cores principais
  background: '#FFFFFF',
  primary: '#AEE2FF',      // Azul-claro
  secondary: '#62D8B5',    // Verde-água
  text: '#0A0A0A',         // Preto suave
  
  // Gradientes
  gradients: {
    primary: 'from-[#AEE2FF] to-[#62D8B5]',
    card: 'from-white to-gray-50',
  }
}

export const spacing = {
  card: 'p-6 sm:p-8',
  section: 'py-8 sm:py-12',
  container: 'px-6 sm:px-8',
}

export const rounded = {
  button: 'rounded-full',
  card: 'rounded-3xl',
  input: 'rounded-2xl',
  icon: 'rounded-2xl',
  small: 'rounded-xl',
}

export const animations = {
  transition: 'transition-all duration-300 ease-in-out',
  hover: 'hover:scale-105 active:scale-95',
  fade: 'animate-in fade-in duration-500',
}

export const typography = {
  h1: 'text-3xl sm:text-4xl font-bold text-[#0A0A0A]',
  h2: 'text-2xl sm:text-3xl font-bold text-[#0A0A0A]',
  h3: 'text-xl sm:text-2xl font-semibold text-[#0A0A0A]',
  body: 'text-base text-[#0A0A0A]/80',
  small: 'text-sm text-[#0A0A0A]/70',
}
