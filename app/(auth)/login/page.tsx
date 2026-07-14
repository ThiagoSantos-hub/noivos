/**
 * Página de Login - Autenticação do casal
 * Rota: /login
 * Grupo: (auth) - pública, sem autenticação obrigatória
 */

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { LoginForm } from '@/components/features/LoginForm'

export default function LoginPage(): React.ReactElement {
  const router = useRouter()
  const [error, setError] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (data: {
    email: string
    password: string
  }): Promise<void> => {
    setError('')
    setIsLoading(true)

    try {
      // TODO: Chamar endpoint POST /auth/login
      // Por enquanto, simular sucesso
      console.log('Dados de login:', data)

      // Simular delay de API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirecionar para o dashboard após sucesso
      setTimeout(() => {
        router.push('/inicio')
      }, 500)
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Erro ao fazer login. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Conteúdo Principal */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Cabeçalho */}
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="mb-1">
              <Image
                src="/images/aliancas.png"
                alt="Alianças de casamento"
                width={120}
                height={120}
              />
            </div>
            <h1 className="text-3xl font-bold mb-2" style={{ color: '#1E293B' }}>
              Bem-vindo de Volta
            </h1>
            <p className="text-base" style={{ color: '#64748B' }}>
              Faça login para continuar planejando seu casamento
            </p>
          </div>

          {/* Formulário */}
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />

          {/* Rodapé */}
          <div className="mt-8 text-center">
            <p className="text-xs" style={{ color: '#64748B' }}>
              Ao fazer login, você concorda com nossos termos de serviço.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
