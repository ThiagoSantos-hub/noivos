'use client'

/**
 * Página Mais — menu de Configurações, Meu Plano e Feedback
 */

import Link from 'next/link'
import { Settings, CreditCard, MessageSquare, ChevronRight, LogOut } from 'lucide-react'
import { supabase } from '@/services/supabase'
import { useRouter } from 'next/navigation'

export default function MaisPage() {
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <h1 className="text-2xl font-bold mb-6">Mais</h1>

      <div className="space-y-3">
        {/* Configurações */}
        <Link
          href="/configuracoes"
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Settings size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Configurações</p>
              <p className="text-xs text-text-secondary">Nome do casal e senha</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>

        {/* Meu Plano */}
        <Link
          href="/meu-plano"
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CreditCard size={20} className="text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Meu Plano</p>
              <p className="text-xs text-text-secondary">Pagamento e vencimento</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>

        {/* Feedback */}
        <Link
          href="/feedback"
          className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100 active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <MessageSquare size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-text-primary">Feedback</p>
              <p className="text-xs text-text-secondary">Sugestões e reportar erros</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Link>

        {/* Sair */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-between bg-white p-4 rounded-2xl shadow-lg border border-gray-100 active:scale-[0.98] transition-all mt-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <LogOut size={20} className="text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-red-600">Sair da conta</p>
              <p className="text-xs text-text-secondary">Fazer logout</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}
