'use client'

/**
 * Página Meu Plano — plano promocional R$ 9,90
 */

import Link from 'next/link'
import { ArrowLeft, CreditCard, Calendar, CheckCircle } from 'lucide-react'

export default function MeuPlanoPage() {
  const plano = {
    nome: 'Plano Casal',
    valorOriginal: 'R$ 47,90',
    valorPromocional: 'R$ 9,90',
    periodo: 'mensal',
    status: 'ativo',
    vencimento: '15/08/2026',
  }

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mais" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold">Meu Plano</h1>
      </div>

      {/* Card do plano */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
            <CreditCard size={24} className="text-green-600" />
          </div>
          <div>
            <p className="font-bold text-lg">{plano.nome}</p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">{plano.valorOriginal}</span>
              <span className="text-base font-bold text-green-600">{plano.valorPromocional}</span>
              <span className="text-xs text-text-secondary">/ {plano.periodo}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700 capitalize">{plano.status}</span>
        </div>

        <div className="mt-3 inline-block bg-green-50 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
          Promoção ativa
        </div>
      </div>

      {/* Informações de vencimento */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-5">
        <h2 className="font-semibold text-base mb-4">Pagamento</h2>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-text-secondary">
              <Calendar size={16} />
              <span className="text-sm">Próximo vencimento</span>
            </div>
            <span className="font-semibold text-sm">{plano.vencimento}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Valor</span>
            <div className="text-right">
              <span className="text-xs text-gray-400 line-through mr-2">{plano.valorOriginal}</span>
              <span className="font-bold text-green-600">{plano.valorPromocional}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão de renovar */}
      <button
        className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg active:scale-[0.98] transition-all"
      >
        Renovar
      </button>

      <p className="text-xs text-center text-text-secondary mt-4">
        Em breve você poderá gerenciar seu plano e forma de pagamento por aqui.
      </p>
    </div>
  )
}
