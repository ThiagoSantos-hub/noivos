/**
 * Página de Onboarding - Cadastro do Casal
 * Rota: /cadastro
 * Grupo: (auth) - pública, sem autenticação obrigatória
 */

'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { OnboardingForm } from '@/components/features/OnboardingForm'
import { supabase } from '@/services/supabase'

export default function OnboardingPage() {
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
    password?: string
  }) => {
    setError('')
    setProgress(20)
    setIsLoading(true)

    try {
      // 1. Criar conta no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email_noiva,
        password: data.password || '',
      })

      if (authError) throw new Error(authError.message)
      if (!authData.user) throw new Error('Falha ao criar usuário')

      setProgress(40)

      // 2. Inserir dados na tabela `couples`
      const { error: dbError } = await supabase.from('couples').insert({
        nome_noiva: data.nome_noiva,
        nome_noivo: data.nome_noivo,
        email_noiva: data.email_noiva,
        email_noivo: data.email_noivo,
        wedding_date: data.data_casamento,
        total_budget: data.orcamento_total,
        noiva_user_id: authData.user.id,
        bride_name: data.nome_noiva,
        groom_name: data.nome_noivo,
      })

      if (dbError) throw new Error(dbError.message)

      setProgress(70)

      // 3. Disparar e-mails de boas-vindas via Brevo
      // Não bloqueia o fluxo principal em caso de erro no e-mail
      try {
        fetch('/api/send-welcome-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        }).then(response => {
          if (!response.ok) {
            console.error('Falha ao disparar e-mails de boas-vindas via API')
          }
        }).catch(err => {
          console.error('Erro na chamada da API de e-mail:', err)
        })
      } catch (emailErr) {
        // Apenas loga o erro, sem interromper o cadastro
        console.error('Erro ao tentar disparar e-mails:', emailErr)
      }

      setProgress(100)

      // 3. Criar checkout no Asaas
      const checkoutResponse = await fetch('/api/payments/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const checkoutData = await checkoutResponse.json()

      if (!checkoutResponse.ok) {
        throw new Error(checkoutData.error || 'Erro ao gerar pagamento')
      }

      setProgress(100)

      // Redirecionar para o checkout do Asaas
      setTimeout(() => {
        window.location.href = checkoutData.checkoutUrl
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
    <div className="h-screen flex flex-col overflow-y-auto" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Barra de Progresso */}
      <ProgressBar progress={progress} />

      {/* Conteúdo Principal - Sem centralização vertical fixa para permitir scroll */}
      <div className="flex-1 flex flex-col items-center px-6 py-8 pt-16">
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
              Bem-vindo ao Noivos
            </h1>
            <p className="text-base" style={{ color: '#64748B' }}>
              Vamos começar planejando seu casamento juntos
            </p>
          </div>

          {/* Formulário */}
          <div className="w-full">
            <OnboardingForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
            />
          </div>

          {/* Rodapé */}
          <div className="mt-8 text-center pb-8">
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
