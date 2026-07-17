'use client'

/**
 * CountdownBar com barra animada e visual mais premium
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  getDaysUntil,
  getCountdownProgress,
  getCountdownAlertLevel,
} from '@/utils/formatters'

interface ICountdownBarProps {
  weddingDate: string
  createdAt: string
}

const ALERT_CONFIG = {
  green: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    text: 'text-green-700',
    icon: '🟢',
    message: 'Ótimo! Você tem bastante tempo para se planejar.',
  },
  yellow: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    text: 'text-yellow-700',
    icon: '🟡',
    message: 'Atenção! O casamento está se aproximando. Revise suas pendências.',
  },
  red: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    text: 'text-red-700',
    icon: '🔴',
    message: 'Urgente! Menos de 2 meses para o grande dia. Finalize tudo!',
  },
} as const

export function CountdownBar({ weddingDate, createdAt }: ICountdownBarProps) {
  const { months, days, totalDays, isPast } = useMemo(
    () => getDaysUntil(weddingDate),
    [weddingDate]
  )

  const progress = useMemo(
    () => getCountdownProgress(createdAt, weddingDate),
    [createdAt, weddingDate]
  )

  const alertLevel = useMemo(
    () => getCountdownAlertLevel(totalDays),
    [totalDays]
  )

  const alert = ALERT_CONFIG[alertLevel]

  const countdownText = isPast
    ? 'O grande dia já chegou! 🎉'
    : months > 0
    ? `Faltam ${months} ${months === 1 ? 'mês' : 'meses'} e ${days} ${days === 1 ? 'dia' : 'dias'}!`
    : `Faltam ${days} ${days === 1 ? 'dia' : 'dias'}!`

  return (
    <section className="mx-3 mb-4 p-4 bg-white rounded-2xl shadow-xl border border-gray-200">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-text-primary">⏳ Contagem Regressiva</h2>
        <span className="text-xs text-text-secondary">{progress}% percorrido</span>
      </div>

      <p className="text-lg font-bold text-primary-dark mb-3">
        {countdownText}
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

      {!isPast && (
        <div className={`flex items-start gap-2 px-3 py-2 rounded-xl border text-xs ${alert.bg} ${alert.border} ${alert.text}`}>
          <span>{alert.icon}</span>
          <span>{alert.message}</span>
        </div>
      )}
    </section>
  )
}
