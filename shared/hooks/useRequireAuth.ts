/**
 * useRequireAuth — redireciona para /login se o usuário não estiver autenticado
 * Usado em layouts e páginas protegidas do dashboard
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/services/supabase'

interface IUseRequireAuthReturn {
  isAuthenticated: boolean
  isLoading: boolean
}

export function useRequireAuth(): IUseRequireAuthReturn {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error || !data.session) {
          router.replace('/login')
          return
        }

        setIsAuthenticated(true)
      } catch {
        router.replace('/login')
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()

    // Listener para mudanças de sessão (logout, expiração)
    const { data: authListener } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.replace('/login')
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [router])

  return { isAuthenticated, isLoading }
}
