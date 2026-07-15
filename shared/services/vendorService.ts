/**
 * vendorService — operações de CRUD na tabela `vendors`
 * Segue o padrão: UI → Hook → Service → Supabase
 */

import { supabase } from './supabase'
import type { Vendor, VendorCreatePayload, VendorUpdatePayload } from '@/types/vendor.types'

/**
 * Busca todos os fornecedores do casal autenticado.
 */
export async function getVendors(): Promise<Vendor[]> {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao buscar fornecedores: ${error.message}`)
  }

  return data as Vendor[]
}

/**
 * Cria um novo fornecedor.
 */
export async function createVendor(payload: VendorCreatePayload): Promise<Vendor> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id

  if (!userId) throw new Error('Usuário não autenticado')

  // Busca o couple_id do usuário
  const { data: coupleData } = await supabase
    .from('couples')
    .select('id')
    .or(`noiva_user_id.eq.${userId},noivo_user_id.eq.${userId}`)
    .single()

  if (!coupleData) throw new Error('Casal não encontrado')

  const { data, error } = await supabase
    .from('vendors')
    .insert({
      ...payload,
      couple_id: coupleData.id,
      status: payload.status || 'hired'
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar fornecedor: ${error.message}`)
  }

  return data as Vendor
}

/**
 * Atualiza um fornecedor existente.
 */
export async function updateVendor(
  id: string,
  payload: VendorUpdatePayload
): Promise<Vendor> {
  const { data, error } = await supabase
    .from('vendors')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar fornecedor: ${error.message}`)
  }

  return data as Vendor
}

/**
 * Remove um fornecedor (soft delete).
 */
export async function deleteVendor(id: string): Promise<void> {
  const { error } = await supabase
    .from('vendors')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir fornecedor: ${error.message}`)
  }
}
