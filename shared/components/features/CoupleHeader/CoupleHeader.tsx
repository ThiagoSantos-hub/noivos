'use client'

/**
 * CoupleHeader — exibe o cabeçalho com os nomes do casal de forma simples e bonita
 */

import type { Couple } from '@/types/couple.types'

interface ICoupleHeaderProps {
  couple: Couple
}

export function CoupleHeader({ couple }: ICoupleHeaderProps) {
  return (
    <header className="px-4 pt-5 pb-3">
      <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2 flex-wrap">
        Olá, <span className="font-extrabold">{couple.bride_name}</span>
        <span className="text-text-secondary font-normal mx-0.5">&</span>
        <span className="font-extrabold">{couple.groom_name}</span> !
      </h1>

      <p className="mt-1 text-sm text-text-secondary">
        Bem-vindos ao painel do casamento
      </p>
    </header>
  )
}
