/**
 * useGuests — hook para gerenciar convidados com sincronização em tempo real
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'
import {
  getGuests,
  createGuest,
  updateGuest,
  deleteGuest as deleteGuestService
} from '@/services/guestService'
import type { Guest, GuestCreatePayload, GuestUpdatePayload } from '@/types/guest.types'

export function useGuests() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGuests = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getGuests()
      setGuests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar convidados')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addGuest = async (payload: GuestCreatePayload) => {
    try {
      const newGuest = await createGuest(payload)
      setGuests((prev) => [...prev, newGuest].sort((a, b) => a.name.localeCompare(b.name)))
      return newGuest
    } catch (err) {
      throw err
    }
  }

  const editGuest = async (id: string, payload: GuestUpdatePayload) => {
    try {
      const updated = await updateGuest(id, payload)
      setGuests((prev) => prev.map((g) => (g.id === id ? updated : g)))
      return updated
    } catch (err) {
      throw err
    }
  }

  const removeGuest = async (id: string) => {
    try {
      await deleteGuestService(id)
      setGuests((prev) => prev.filter((g) => g.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchGuests()

    // Realtime subscription
    const channel = supabase
      .channel('guests-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'guests' },
        () => {
          fetchGuests()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [fetchGuests])

  return {
    guests,
    isLoading,
    error,
    addGuest,
    editGuest,
    removeGuest,
    refresh: fetchGuests
  }
}
