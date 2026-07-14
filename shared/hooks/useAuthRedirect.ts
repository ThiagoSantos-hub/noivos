/**
 * Hook customizado para detectar autenticação e redirecionar
 * Verifica se o usuário já está logado e o redireciona para o dashboard
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuthRedirect(redirectTo: string = '/inicio'): { isLoading: boolean } {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar se existe token de autenticação no localStorage ou cookie
    const checkAuth = async () => {
      try {
        // Verificar localStorage (Supabase armazena aqui)
        const authToken = localStorage.getItem('sb-access-token')
        const authSession = localStorage.getItem('sb-auth-token')

        // Se houver token, o usuário está autenticado
        if (authToken || authSession) {
          // Redirecionar para o dashboard
          router.push(redirectTo)
          return
        }

        // Verificar em cookies (para casos de SSR)
        const cookies = document.cookie.split(';')
        const hasAuthCookie = cookies.some(
          (cookie) =>
            cookie.trim().startsWith('sb-access-token') ||
            cookie.trim().startsWith('sb-auth-token')
        )

        if (hasAuthCookie) {
          router.push(redirectTo)
          return
        }

        // Se não houver autenticação, permitir que a página seja renderizada
        setIsLoading(false)
      } catch (error) {
        // Em caso de erro, permitir que a página seja renderizada
        console.error('Erro ao verificar autenticação:', error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, redirectTo])

  return { isLoading }
}
