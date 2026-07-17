'use client'

/**
 * CountdownBar — exibe o countdown até o casamento
 */

import { useMemo } from 'react'
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
    <section
      aria-label="Contagem regressiva para o casamento"
      className="mx-3 mb-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-text-primary">
          ⏳ Contagem Regressiva
        </h2>
        <span className="text-[10px] text-text-secondary">
          {progress}% percorrido
        </span>
      </div>

      <p className="text-base font-bold text-primary-dark mb-2">
        {countdownText}
      </p>

      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-2"
      >
        <div
          className="h-full bg-success-DEFAULT rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {!isPast && (
        <div
          role="status"
          className={`flex items-start gap-1.5 px-2.5 py-1.5 rounded-md border text-xs ${alert.bg} ${alert.border} ${alert.text}`}
        >
          <span>{alert.icon}</span>
          <span>{alert.message}</span>
        </div>
      )}
    </section>
  )
}
