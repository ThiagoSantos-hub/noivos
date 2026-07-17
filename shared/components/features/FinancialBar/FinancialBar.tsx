'use client'

/**
 * FinancialBar — resumo financeiro do casamento
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

  if (totalBudget <= 0) {
    return (
      <section className="mx-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-text-primary mb-1.5">💰 Financeiro</h2>
        <p className="text-xs text-text-secondary">
          Nenhum orçamento cadastrado ainda.
        </p>
      </section>
    )
  }

  return (
    <section className="mx-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-text-primary">💰 Financeiro</h2>
        <span className="text-[10px] text-text-secondary">{progress}% pago</span>
      </div>

      <p className="text-xs text-text-secondary mb-0.5">
        <span className="font-semibold text-success-dark">{formatCurrency(totalPaid)}</span> pagos de{' '}
        <span className="font-semibold text-text-primary">{formatCurrency(totalBudget)}</span> planejados
      </p>
      <p className="text-xs text-text-secondary mb-2">
        Falta <span className="font-semibold text-primary-dark">{formatCurrency(remaining)}</span>
      </p>

      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2">
        <div className="h-full bg-success-DEFAULT rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      <div className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-md border text-xs ${alert.bg} ${alert.border} ${alert.text}`}>
        <span>{alert.icon}</span>
        <span>{alert.message}</span>
      </div>
    </section>
  )
}
