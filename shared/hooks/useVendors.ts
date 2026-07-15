/**
 * useVendors — hook para gerenciar fornecedores com sincronização em tempo real
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'
import {
  getVendors,
  createVendor,
  updateVendor,
  deleteVendor as deleteVendorService
} from '@/services/vendorService'
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from '@/types/vendor.types'

export function useVendors() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchVendors = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getVendors()
      setVendors(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar fornecedores')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addVendor = async (payload: VendorCreatePayload) => {
    try {
      const newVendor = await createVendor(payload)
      setVendors((prev) => [newVendor, ...prev])
      return newVendor
    } catch (err) {
      throw err
    }
  }

  const editVendor = async (id: string, payload: VendorUpdatePayload) => {
    try {
      const updated = await updateVendor(id, payload)
      setVendors((prev) => prev.map((v) => (v.id === id ? updated : v)))
      return updated
    } catch (err) {
      throw err
    }
  }

  const removeVendor = async (id: string) => {
    try {
      await deleteVendorService(id)
      setVendors((prev) => prev.filter((v) => v.id !== id))
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchVendors()

    // Realtime subscription
    const channel = supabase
      .channel('vendors-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'vendors' },
        () => {
          fetchVendors()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [fetchVendors])

  return {
    vendors,
    isLoading,
    error,
    addVendor,
    editVendor,
    removeVendor,
    refresh: fetchVendors
  }
}
