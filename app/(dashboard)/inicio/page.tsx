'use client'

/**
 * DashboardPage — tela principal do app (/inicio)
 * Layout compacto para caber na tela sem scroll
 */

import { useCouple } from '@/hooks/useCouple'
import { CoupleHeader } from '@/components/features/CoupleHeader'
import { CountdownBar } from '@/components/features/CountdownBar'
import { FinancialBar } from '@/components/features/FinancialBar'

export default function DashboardPage() {
  const { couple, isLoading, error, updateCoupleData } = useCouple()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 px-3 pt-4" aria-busy="true">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded-md w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2" />
        </div>
        <div className="animate-pulse bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </div>
        <div className="animate-pulse bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-5 bg-gray-200 rounded w-2/3 mb-2" />
          <div className="h-2.5 bg-gray-100 rounded-full" />
        </div>
        <div className="animate-pulse bg-white rounded-xl shadow-sm p-3 border border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-1" />
          <div className="h-2.5 bg-gray-100 rounded-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center" role="alert">
        <span className="text-3xl mb-3">😕</span>
        <h2 className="text-base font-semibold text-text-primary mb-1.5">Não foi possível carregar os dados</h2>
        <p className="text-xs text-text-secondary mb-3">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary text-xs px-5 py-1.5">
          Tentar novamente
        </button>
      </div>
    )
  }

  if (!couple) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center" role="status">
        <span className="text-3xl mb-3">💍</span>
        <h2 className="text-base font-semibold text-text-primary mb-1.5">Bem-vindo ao Noivos!</h2>
        <p className="text-xs text-text-secondary">Complete o cadastro para começar.</p>
      </div>
    )
  }

  return (
    <>
      <title>Início — Noivos</title>

      <CoupleHeader couple={couple} onUpdate={updateCoupleData} />

      {/* Boas-vindas compacta */}
      <section className="mx-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="text-center">
          <p className="text-sm font-medium text-primary-dark mb-1 leading-snug">
            Que esse tempo de planejamento seja repleto de amor, sonhos e momentos inesquecíveis.
          </p>
          <p className="text-[12px] italic text-text-secondary leading-tight">
            "O amor é paciente, o amor é bondoso. [...] O amor nunca falha."
            <span className="block mt-0.5 not-italic text-[10px]">— 1 Coríntios 13:4,8</span>
          </p>
        </div>
      </section>

      {/* Countdown */}
      {couple.data_casamento ? (
        <CountdownBar
          weddingDate={couple.data_casamento}
          createdAt={couple.created_at}
        />
      ) : (
        <section className="mx-3 mb-3 p-3 bg-primary-light rounded-lg border border-blue-200">
          <p className="text-xs text-primary-dark font-medium">
            ⏳ Defina a data do casamento para ver a contagem regressiva!
          </p>
        </section>
      )}

      {/* Financeiro */}
      <FinancialBar
        totalBudget={couple.total_budget ?? 0}
        totalPaid={couple.total_paid ?? 0}
      />
    </>
  )
}
