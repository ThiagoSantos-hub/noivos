'use client'

/**
 * FinancialBar — exibe o resumo financeiro do casamento
 * Inclui barra de progresso verde e alerta colorido por comprometimento do orçamento
 */

import { useMemo } from 'react'
import { formatCurrency, getFinancialAlertLevel } from '@/utils/formatters'

interface IFinancialBarProps {
  totalBudget: number
  totalPaid: number
}

const ALERT_CONFIG = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: '🟢',
    message: 'Orçamento sob controle! Menos de 50% comprometido.',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: '🟡',
    message: 'Atenção! Entre 50% e 80% do orçamento já comprometido.',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: '🔴',
    message: 'Alerta! Mais de 80% do orçamento comprometido.',
  },
} as const

export function FinancialBar({ totalBudget, totalPaid }: IFinancialBarProps) {
  const remaining = useMemo(
    () => Math.max(0, totalBudget - totalPaid),
    [totalBudget, totalPaid]
  )

  const progress = useMemo(() => {
    if (totalBudget <= 0) return 0
    return Math.min(100, Math.round((totalPaid / totalBudget) * 100))
  }, [totalBudget, totalPaid])

  const alertLevel = useMemo(
    () => getFinancialAlertLevel(totalPaid, totalBudget),
    [totalPaid, totalBudget]
  )

  const alert = ALERT_CONFIG[alertLevel]

  // Caso sem orçamento cadastrado
  if (totalBudget <= 0) {
    return (
      <section
        aria-label="Resumo financeiro"
        className="mx-4 mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
      >
        <h2 className="text-base font-semibold text-text-primary mb-2">
          💰 Financeiro
        </h2>
        <p className="text-sm text-text-secondary">
          Nenhum orçamento cadastrado ainda. Configure nas configurações do casal.
        </p>
      </section>
    )
  }

  return (
    <section
      aria-label="Resumo financeiro do casamento"
      className="mx-4 mb-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100"
    >
      {/* Título da seção */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-semibold text-text-primary">
          💰 Financeiro
        </h2>
        <span className="text-xs text-text-secondary">
          {progress}% pago
        </span>
      </div>

      {/* Resumo em texto */}
      <p className="text-sm text-text-secondary mb-1">
        <span className="font-semibold text-success-dark">
          {formatCurrency(totalPaid)}
        </span>{' '}
        pagos de{' '}
        <span className="font-semibold text-text-primary">
          {formatCurrency(totalBudget)}
        </span>{' '}
        planejados
      </p>
      <p className="text-sm text-text-secondary mb-3">
        Falta{' '}
        <span className="font-semibold text-primary-dark">
          {formatCurrency(remaining)}
        </span>
      </p>

      {/* Barra de progresso */}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${progress}% do orçamento já foi pago`}
        className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3"
      >
        <div
          className="h-full bg-success-DEFAULT rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Alerta de status */}
      <div
        role="status"
        className={`
          flex items-start gap-2 px-3 py-2 rounded-md border text-sm
          ${alert.bg} ${alert.border} ${alert.text}
        `}
      >
        <span aria-hidden="true">{alert.icon}</span>
        <span>{alert.message}</span>
      </div>
    </section>
  )
}
