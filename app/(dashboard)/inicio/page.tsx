'use client'

/**
 * DashboardPage — tela principal com visual mais premium
 */

import { useCouple } from '@/hooks/useCouple'
import { CoupleHeader } from '@/components/features/CoupleHeader'
import { CountdownBar } from '@/components/features/CountdownBar'
import { FinancialBar } from '@/components/features/FinancialBar'

export default function DashboardPage() {
  const { couple, isLoading, error } = useCouple()

  if (isLoading) {
    return <div className="p-4">Carregando...</div>
  }

  if (error) {
    return <div className="p-4 text-red-500">Erro: {error}</div>
  }

  if (!couple) {
    return <div className="p-4">Complete o cadastro.</div>
  }

  return (
    <>
      <title>Início — Noivos</title>

      <CoupleHeader couple={couple} />

      {/* Boas-vindas com sombra forte */}
      <section className="mx-3 mb-4 p-4 bg-white rounded-2xl shadow-2xl border border-gray-200">
        <div className="text-center">
          <p className="text-sm font-medium text-primary-dark mb-1.5">
            Que esse tempo de planejamento seja repleto de amor, sonhos e momentos inesquecíveis.
          </p>
          <p className="text-xs italic text-text-secondary">
            "O amor é paciente, o amor é bondoso. [...] O amor nunca falha."
            <span className="block mt-0.5 not-italic text-[10px]">— 1 Coríntios 13:4,8</span>
          </p>
        </div>
      </section>

      {couple.data_casamento ? (
        <CountdownBar
          weddingDate={couple.data_casamento}
          createdAt={couple.created_at}
        />
      ) : (
        <section className="mx-3 mb-4 p-4 bg-primary-light rounded-2xl border border-blue-200 shadow-md">
          <p className="text-sm text-primary-dark font-medium">
            ⏳ Defina a data do casamento para ver a contagem regressiva!
          </p>
        </section>
      )}

      <FinancialBar
        totalBudget={couple.total_budget ?? 0}
        totalPaid={couple.total_paid ?? 0}
      />
    </>
  )
}
