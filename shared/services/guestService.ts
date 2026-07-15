/**
 * guestService — operações de CRUD na tabela `guests`
 * Segue o padrão: UI → Hook → Service → Supabase
 */

import { supabase } from './supabase'
import type { Guest, GuestCreatePayload, GuestUpdatePayload } from '@/types/guest.types'

/**
 * Busca todos os convidados do casal autenticado.
 */
export async function getGuests(): Promise<Guest[]> {
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .is('deleted_at', null)
    .order('name', { ascending: true })

  if (error) {
    throw new Error(`Erro ao buscar convidados: ${error.message}`)
  }

  return data as Guest[]
}

/**
 * Cria um novo convidado.
 */
export async function createGuest(payload: GuestCreatePayload): Promise<Guest> {
  const { data: sessionData } = await supabase.auth.getSession()
  const userId = sessionData.session?.user.id

  if (!userId) throw new Error('Usuário não autenticado')

  // Busca o couple_id do usuário usando as colunas reais no banco
  const { data: coupleData } = await supabase
    .from('couples')
    .select('id')
    .or(`noiva_user_id.eq.${userId},noivo_user_id.eq.${userId}`)
    .single()

  if (!coupleData) throw new Error('Casal não encontrado')

  const { data, error } = await supabase
    .from('guests')
    .insert({
      ...payload,
      couple_id: coupleData.id
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar convidado: ${error.message}`)
  }

  return data as Guest
}

/**
 * Atualiza um convidado existente.
 */
export async function updateGuest(
  id: string,
  payload: GuestUpdatePayload
): Promise<Guest> {
  const { data, error } = await supabase
    .from('guests')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar convidado: ${error.message}`)
  }

  return data as Guest
}

/**
 * Remove um convidado (soft delete).
 */
export async function deleteGuest(id: string): Promise<void> {
  const { error } = await supabase
    .from('guests')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir convidado: ${error.message}`)
  }
}
