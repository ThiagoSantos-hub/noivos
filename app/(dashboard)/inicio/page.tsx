'use client'

/**
 * DashboardPage — tela principal do app (/inicio)
 * Exibe cabeçalho editável, countdown e barra financeira
 */

import { useCouple } from '@/hooks/useCouple'
import { CoupleHeader } from '@/components/features/CoupleHeader'
import { CountdownBar } from '@/components/features/CountdownBar'
import { FinancialBar } from '@/components/features/FinancialBar'

export default function DashboardPage() {
  const { couple, isLoading, error, updateCoupleData } = useCouple()

  // Estado de carregamento dos dados do casal
  if (isLoading) {
    return (
      <div
        className="flex flex-col gap-4 px-4 pt-6"
        aria-busy="true"
        aria-label="Carregando dados do casal"
      >
        {/* Skeleton do cabeçalho */}
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded-md w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded-md w-1/2" />
        </div>

        {/* Skeleton do countdown */}
        <div className="animate-pulse bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
          <div className="h-3 bg-gray-100 rounded-full mb-3" />
          <div className="h-10 bg-gray-100 rounded-md" />
        </div>

        {/* Skeleton do financeiro */}
        <div className="animate-pulse bg-white rounded-lg shadow-sm p-4 border border-gray-100">
          <div className="h-5 bg-gray-200 rounded w-1/3 mb-3" />
          <div className="h-4 bg-gray-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
          <div className="h-3 bg-gray-100 rounded-full mb-3" />
          <div className="h-10 bg-gray-100 rounded-md" />
        </div>
      </div>
    )
  }

  // Estado de erro ao buscar dados
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        role="alert"
      >
        <span className="text-4xl mb-4" aria-hidden="true">
          😕
        </span>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Não foi possível carregar os dados
        </h2>
        <p className="text-sm text-text-secondary mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary text-sm px-6 py-2"
        >
          Tentar novamente
        </button>
      </div>
    )
  }

  // Dados do casal não encontrados (casal não criado ainda)
  if (!couple) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center"
        role="status"
      >
        <span className="text-4xl mb-4" aria-hidden="true">
          💍
        </span>
        <h2 className="text-lg font-semibold text-text-primary mb-2">
          Bem-vindo ao Noivos!
        </h2>
        <p className="text-sm text-text-secondary">
          Complete o cadastro do casal para começar a planejar.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Metadados da página */}
      <title>Início — Noivos</title>

      {/* Cabeçalho com nome editável */}
      <CoupleHeader couple={couple} onUpdate={updateCoupleData} />

      {/* Barra de countdown — só exibe se tiver data do casamento */}
      {couple.data_casamento ? (
        <CountdownBar
          weddingDate={couple.data_casamento}
          createdAt={couple.created_at}
        />
      ) : (
        <section
          aria-label="Data do casamento não definida"
          className="mx-4 mb-4 p-4 bg-primary-light rounded-lg border border-blue-200"
        >
          <p className="text-sm text-primary-dark font-medium">
            ⏳ Defina a data do casamento para ver o countdown!
          </p>
        </section>
      )}

      {/* Barra financeira */}
      <FinancialBar
        totalBudget={couple.total_budget ?? 0}
        totalPaid={couple.total_paid ?? 0}
      />
    </>
  )
}
