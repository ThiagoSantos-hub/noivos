/**
 * coupleService — operações de leitura e escrita na tabela `couples`
 * Segue o padrão: UI → Hook → Service → Supabase
 */

import { supabase } from './supabase'
import type { Couple, CoupleUpdatePayload } from '@/types/couple.types'

/**
 * Busca o registro do casal do usuário autenticado.
 * O RLS do Supabase garante que só retorna dados do próprio casal.
 */
export async function getCoupleByUser(): Promise<Couple | null> {
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()

  if (sessionError || !sessionData.session) {
    return null
  }

  const userId = sessionData.session.user.id

  const { data, error } = await supabase
    .from('couples')
    .select('*')
    .or(`partner_1_id.eq.${userId},partner_2_id.eq.${userId}`)
    .single()

  if (error) {
    throw new Error(`Erro ao buscar dados do casal: ${error.message}`)
  }

  return data as Couple
}

/**
 * Atualiza campos do casal no Supabase.
 */
export async function updateCouple(
  coupleId: string,
  payload: CoupleUpdatePayload
): Promise<Couple> {
  const { data, error } = await supabase
    .from('couples')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', coupleId)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar dados do casal: ${error.message}`)
  }

  return data as Couple
}
