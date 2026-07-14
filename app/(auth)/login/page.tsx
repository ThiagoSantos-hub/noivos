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
    <div className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="w-full max-w-md">
        {/* Cabeçalho */}
        <div className="mb-8 text-center flex flex-col items-center">
          <div className="mb-0">
            <div className="relative w-[80px] h-[80px] md:w-[120px] md:h-[120px]">
              <Image
                src="/images/aliancas.png"
                alt="Alianças de casamento"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2 -mt-2" style={{ color: '#1E293B' }}>
            Bem-vindo de Volta
          </h1>
          <p className="text-base" style={{ color: '#64748B' }}>
            Faça login para continuar planejando seu casamento
          </p>
        </div>

        {/* Formulário */}
        <div className="w-full">
          <LoginForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Rodapé */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: '#64748B' }}>
            Ao fazer login, você concorda com nossos termos de serviço.
          </p>
        </div>
      </div>
    </div>
  )
}
