'use client'

/**
 * Layout do grupo (dashboard) — rotas protegidas
 * Verifica autenticação e exibe o BottomNav em todas as telas do dashboard
 */

import { useRequireAuth } from '@/hooks/useRequireAuth'
import { BottomNav } from '@/components/ui/BottomNav'

interface IDashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: IDashboardLayoutProps) {
  const { isAuthenticated, isLoading } = useRequireAuth()

  // Tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-white"
        aria-label="Verificando autenticação..."
        role="status"
      >
        <div className="flex flex-col items-center gap-3">
          <div
            className="
              w-10 h-10 rounded-full border-4
              border-primary-light border-t-primary-DEFAULT
              animate-spin
            "
            aria-hidden="true"
          />
          <p className="text-sm text-text-secondary">Carregando...</p>
        </div>
      </div>
    )
  }

  // Não renderiza nada enquanto redireciona para /login
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Conteúdo principal — padding-bottom para não ficar atrás do BottomNav */}
      <main className="flex-1 pb-20 max-w-lg mx-auto w-full">
        {children}
      </main>

      {/* Barra de navegação fixa no rodapé */}
      <BottomNav />
    </div>
  )
}
