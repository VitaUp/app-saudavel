'use client'

import { motion } from 'framer-motion'
import { 
  Apple, 
  Dumbbell, 
  Moon, 
  Trophy, 
  Sparkles,
  Check,
  ArrowRight,
  Star,
  MessageCircle,
  TrendingUp,
  Shield,
  Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LandingPage() {
  const features = [
    {
      icon: Apple,
      title: 'Nutrição Inteligente',
      description: 'Acompanhe suas calorias e macros com IA. Tire foto da refeição e receba análise completa.',
      color: 'from-[#3BAEA0] to-[#2D9B8F]',
    },
    {
      icon: Dumbbell,
      title: 'Treinos Personalizados',
      description: 'Planos de treino adaptados ao seu nível, objetivos e equipamentos disponíveis.',
      color: 'from-[#1E90FF] to-[#1E80EF]',
    },
    {
      icon: Moon,
      title: 'Análise de Sono',
      description: 'Monitore suas fases de sono com integração Apple Watch e WearOS.',
      color: 'from-[#6BB1FF] to-[#3F72FF]',
    },
    {
      icon: Trophy,
      title: 'Gamificação',
      description: 'Ganhe XP, suba de nível, conquiste medalhas e compete com amigos.',
      color: 'from-[#F4C430] to-[#E5B520]',
    },
  ]

  const plans = [
    {
      name: 'Free',
      price: 'Grátis',
      description: 'Para começar sua jornada',
      features: [
        'Dieta básica',
        'Treinos básicos',
        'Sono simples',
        'Hábitos',
        'Gamificação básica',
        'Chat limitado',
      ],
    },
    {
      name: 'VitaUp+',
      price: 'R$ 29,90/mês',
      description: 'Experiência completa',
      popular: true,
      features: [
        'Tudo do Free +',
        'Modo Dark',
        'Chats ilimitados com IA',
        'Macros completos',
        'IA avançada por foto',
        'Treinos premium',
        'Sono completo (fases)',
        'Relatórios detalhados',
        'Integrações completas',
        'WebApp Premium',
      ],
    },
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Perdeu 12kg',
      content: 'O VitaUp mudou minha vida! A Nutri Carol me ajudou a ter uma relação saudável com a comida.',
      rating: 5,
    },
    {
      name: 'João Santos',
      role: 'Ganhou 8kg de massa',
      content: 'Os treinos personalizados e o CoachUp me motivam todos os dias. Resultados incríveis!',
      rating: 5,
    },
    {
      name: 'Ana Costa',
      role: 'Melhorou o sono',
      content: 'Finalmente entendo meu sono! As análises me ajudaram a dormir melhor e ter mais energia.',
      rating: 5,
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#FF6A3D] via-[#1E90FF] to-[#7B61FF] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            {/* Logo */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="inline-block mb-8"
            >
              <div className="w-24 h-24 bg-white/10 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/20">
                <span className="text-5xl font-bold">V+</span>
              </div>
            </motion.div>

            <h1 className="text-5xl sm:text-7xl font-bold mb-6">
              VitaUp
            </h1>
            <p className="text-xl sm:text-2xl mb-4 text-white/90 max-w-3xl mx-auto">
              Seu app completo de saúde, nutrição, treino e bem-estar
            </p>
            <p className="text-lg sm:text-xl mb-12 text-white/80 max-w-2xl mx-auto">
              Com inteligência artificial, gamificação e coaches virtuais que te motivam todos os dias
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/auth">
                <Button
                  size="lg"
                  className="h-14 px-8 bg-white text-[#FF6A3D] hover:bg-white/90 font-semibold text-lg rounded-xl shadow-2xl"
                >
                  Começar Grátis
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 border-2 border-white text-white hover:bg-white/10 font-semibold text-lg rounded-xl"
              >
                Ver Demonstração
              </Button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Grátis para começar</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Sem cartão de crédito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0D0D0D] mb-4">
              Tudo que você precisa em um só lugar
            </h2>
            <p className="text-xl text-[#3B3B3B] max-w-2xl mx-auto">
              Ferramentas completas para transformar sua saúde e bem-estar
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-[#F7F7F7]"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#0D0D0D] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#3B3B3B]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Coaches Section */}
      <section className="py-20 bg-gradient-to-br from-[#F7F7F7] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0D0D0D] mb-4">
              Conheça seus coaches virtuais
            </h2>
            <p className="text-xl text-[#3B3B3B] max-w-2xl mx-auto">
              Inteligência artificial que te entende e te motiva todos os dias
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* CoachUp */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#1E90FF] to-[#7B61FF] rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl mb-6 border border-white/30">
                🧠
              </div>
              <h3 className="text-3xl font-bold mb-3">CoachUp</h3>
              <p className="text-lg text-white/90 mb-4">Seu coach motivacional</p>
              <p className="text-white/80 mb-6">
                Responsável por treino, sono, hábitos e motivação. Tom brasileiro, leve, engraçado e direto.
              </p>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <p className="text-sm italic">
                  "Bora lá! Você consegue! 💪 Vamos com tudo hoje!"
                </p>
              </div>
            </motion.div>

            {/* Nutri Carol */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-[#3BAEA0] to-[#2D9B8F] rounded-3xl p-8 text-white shadow-2xl"
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl mb-6 border border-white/30">
                🥦
              </div>
              <h3 className="text-3xl font-bold mb-3">Nutri Carol</h3>
              <p className="text-lg text-white/90 mb-4">Sua nutricionista</p>
              <p className="text-white/80 mb-6">
                Cuida da sua alimentação com empatia e zero julgamento. Análise de fotos, macros e planos personalizados.
              </p>
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                <p className="text-sm italic">
                  "Que legal! Continue assim! 💚 Você está indo muito bem!"
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0D0D0D] mb-4">
              Planos para você
            </h2>
            <p className="text-xl text-[#3B3B3B] max-w-2xl mx-auto">
              Comece grátis e evolua quando quiser
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`rounded-3xl p-8 ${
                  plan.popular
                    ? 'bg-gradient-to-br from-[#7B61FF] to-[#9B7FFF] text-white shadow-2xl scale-105'
                    : 'bg-white border-2 border-[#F7F7F7] shadow-lg'
                }`}
              >
                {plan.popular && (
                  <div className="inline-block bg-[#F4C430] text-[#0D0D0D] px-4 py-1 rounded-full text-sm font-semibold mb-4">
                    Mais Popular
                  </div>
                )}
                <h3 className={`text-3xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-[#0D0D0D]'}`}>
                  {plan.name}
                </h3>
                <div className={`text-4xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-[#FF6A3D]'}`}>
                  {plan.price}
                </div>
                <p className={`mb-6 ${plan.popular ? 'text-white/80' : 'text-[#3B3B3B]'}`}>
                  {plan.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.popular ? 'text-white' : 'text-[#3BAEA0]'}`} />
                      <span className={plan.popular ? 'text-white/90' : 'text-[#3B3B3B]'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth">
                  <Button
                    className={`w-full h-12 font-semibold text-lg rounded-xl ${
                      plan.popular
                        ? 'bg-white text-[#7B61FF] hover:bg-white/90'
                        : 'bg-gradient-to-r from-[#FF6A3D] to-[#FF8A5D] hover:from-[#FF5A2D] hover:to-[#FF7A4D] text-white'
                    }`}
                  >
                    {plan.name === 'Free' ? 'Começar Grátis' : 'Assinar Agora'}
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-[#F7F7F7] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-[#0D0D0D] mb-4">
              O que nossos usuários dizem
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F4C430] text-[#F4C430]" />
                  ))}
                </div>
                <p className="text-[#3B3B3B] mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-[#0D0D0D]">{testimonial.name}</p>
                  <p className="text-sm text-[#3B3B3B]">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#FF6A3D] via-[#1E90FF] to-[#7B61FF] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-6">
              Pronto para transformar sua vida?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Junte-se a milhares de pessoas que já estão conquistando seus objetivos
            </p>
            <Link href="/auth">
              <Button
                size="lg"
                className="h-14 px-8 bg-white text-[#FF6A3D] hover:bg-white/90 font-semibold text-lg rounded-xl shadow-2xl"
              >
                Começar Agora - É Grátis
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0D0D0D] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="text-2xl font-bold mb-4">VitaUp</div>
              <p className="text-white/70 text-sm">
                Seu app completo de saúde e bem-estar
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white">Planos</a></li>
                <li><a href="#" className="hover:text-white">WebApp</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">FAQ</a></li>
                <li><a href="#" className="hover:text-white">Contato</a></li>
                <li><a href="#" className="hover:text-white">Ajuda</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-white/70">
                <li><a href="#" className="hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white">Privacidade</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-sm text-white/70">
            <p>© 2024 VitaUp. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
