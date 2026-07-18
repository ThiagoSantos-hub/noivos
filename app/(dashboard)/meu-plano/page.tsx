'use client'

/**
 * Página Meu Plano — informações de assinatura e pagamento
 */

import Link from 'next/link'
import { ArrowLeft, CreditCard, Calendar, CheckCircle } from 'lucide-react'

export default function MeuPlanoPage() {
  // Dados de exemplo — depois conectamos com o banco real
  const plano = {
    nome: 'Plano Casal',
    valor: 'R$ 29,90',
    periodo: 'mensal',
    status: 'ativo',
    vencimento: '15/08/2026',
    proximoPagamento: '15/08/2026',
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
            <p className="text-sm text-text-secondary">{plano.valor} / {plano.periodo}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <CheckCircle size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-700 capitalize">{plano.status}</span>
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
            <span className="font-semibold text-sm">{plano.valor}</span>
          </div>
        </div>
      </div>

      {/* Botão de pagamento */}
      <button
        className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg active:scale-[0.98] transition-all"
      >
        Pagar agora
      </button>

      <p className="text-xs text-center text-text-secondary mt-4">
        Em breve você poderá gerenciar seu plano e forma de pagamento por aqui.
      </p>
    </div>
  )
}
