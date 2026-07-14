/**
 * Header - Componente de cabeçalho global com a logo oficial
 * Segue DESIGN-SYSTEM.md
 */

'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeaderProps {
  showLogo?: boolean
  className?: string
}

export function Header({ showLogo = true, className = '' }: HeaderProps) {
  return (
    <header 
      className={`w-full py-4 px-6 flex items-center justify-between bg-white border-b border-slate-100 sticky top-0 z-50 ${className}`}
    >
      <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
        {showLogo && (
          <div className="relative w-8 h-8">
            <Image
              src="/images/aliancas.png"
              alt="Noivos Logo"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        )}
        <span className="text-xl font-bold" style={{ color: '#1E3A8A' }}>
          Noivos
        </span>
      </Link>

      {/* Espaço para navegação futura ou botões de ação */}
      <nav className="flex items-center gap-4">
        {/* Adicionar itens de menu aqui se necessário */}
      </nav>
    </header>
  )
}
