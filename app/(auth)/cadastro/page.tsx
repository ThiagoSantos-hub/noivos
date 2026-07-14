/**
 * Página de Onboarding - Cadastro do Casal
 * Rota: /cadastro
 * Grupo: (auth) - pública, sem autenticação obrigatória
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { OnboardingForm } from '@/components/features/OnboardingForm'

export default function OnboardingPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: {
    nome_noiva: string
    nome_noivo: string
    email_noiva: string
    email_noivo: string
    data_casamento: string
    orcamento_total: number
  }) => {
    setError('')
    setProgress(20)
    setIsLoading(true)

    try {
      // TODO: Chamar endpoint POST /auth/register
      // Por enquanto, simular sucesso
      setProgress(50)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setProgress(100)

      // Redirecionar para o dashboard após sucesso
      setTimeout(() => {
        router.push('/inicio')
      }, 500)
    } catch (err) {
      setProgress(0)
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao criar conta. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Barra de Progresso */}
      <ProgressBar progress={progress} />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 pt-16">
        <div className="w-full max-w-md">
          {/* Cabeçalho */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
              💍 Bem-vindo ao Noivos
            </h1>
            <p className="text-base" style={{ color: '#64748B' }}>
              Vamos começar planejando seu casamento juntos
            </p>
          </div>

          {/* Formulário */}
          <OnboardingForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: '#64748B' }}>
              Já tem uma conta?{' '}
              <a
                href="/login"
                className="font-semibold"
                style={{ color: '#22C55E' }}
              >
                Faça login aqui
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
