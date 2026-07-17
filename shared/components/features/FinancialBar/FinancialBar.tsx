'use client'

/**
 * FinancialBar com barra animada e visual mais premium
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
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
      <section className="mx-3 mb-4 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h2 className="text-sm font-semibold text-text-primary mb-2">💰 Financeiro</h2>
        <p className="text-xs text-text-secondary">Nenhum orçamento cadastrado ainda.</p>
      </section>
    )
  }

  return (
    <section className="mx-3 mb-4 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-text-primary">💰 Financeiro</h2>
        <span className="text-xs text-text-secondary">{progress}% pago</span>
      </div>

      <p className="text-xs text-text-secondary mb-1">
        <span className="font-semibold text-success-dark">{formatCurrency(totalPaid)}</span> pagos de{' '}
        <span className="font-semibold text-text-primary">{formatCurrency(totalBudget)}</span>
      </p>
      <p className="text-xs text-text-secondary mb-3">
        Falta <span className="font-semibold text-primary-dark">{formatCurrency(remaining)}</span>
      </p>

      {/* Barra animada */}
      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-3">
        <motion.div
          className="h-full bg-success-DEFAULT rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>

      <div className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs ${alert.bg} ${alert.border} ${alert.text}`}>
        <span>{alert.icon}</span>
        <span>{alert.message}</span>
      </div>
    </section>
  )
}
