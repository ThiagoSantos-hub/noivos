/**
 * useCouple — hook para buscar e sincronizar dados do casal em tempo real
 * Cancela a subscription quando o componente desmonta (conforme RULES.md)
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'
import { getCoupleByUser, updateCouple } from '@/services/coupleService'
import type { Couple, CoupleUpdatePayload } from '@/types/couple.types'

interface IUseCoupleReturn {
  couple: Couple | null
  isLoading: boolean
  error: string | null
  updateCoupleData: (payload: CoupleUpdatePayload) => Promise<void>
}

export function useCouple(): IUseCoupleReturn {
  const [couple, setCouple] = useState<Couple | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carrega os dados iniciais do casal
  const fetchCouple = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getCoupleByUser()
      setCouple(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Atualiza dados do casal no Supabase e no estado local
  const updateCoupleData = useCallback(
    async (payload: CoupleUpdatePayload): Promise<void> => {
      if (!couple) return

      try {
        setError(null)
        const updated = await updateCouple(couple.id, payload)
        setCouple(updated)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Erro ao salvar'
        setError(message)
        throw err
      }
    },
    [couple]
  )

  useEffect(() => {
    fetchCouple()
  }, [fetchCouple])

  // Subscription em tempo real — atualiza quando o parceiro faz mudanças
  useEffect(() => {
    if (!couple?.id) return

    const channel = supabase
      .channel(`couple-${couple.id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'couples',
          filter: `id=eq.${couple.id}`,
        },
        (payload) => {
          setCouple(payload.new as Couple)
        }
      )
      .subscribe()

    // Cleanup: cancelar subscription quando o componente desmonta
    return () => {
      channel.unsubscribe()
    }
  }, [couple?.id])

  return { couple, isLoading, error, updateCoupleData }
}
