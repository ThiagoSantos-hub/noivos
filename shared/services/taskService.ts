/**
 * taskService — operações de CRUD na tabela `tasks`
 * Segue o padrão: UI → Hook → Service → Supabase
 */

import { supabase } from './supabase'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types/task.types'

/**
 * Busca todas as tarefas do casal autenticado (sem soft delete).
 */
export async function getTasks(): Promise<Task[]> {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Erro ao buscar tarefas: ${error.message}`)
  }

  return data as Task[]
}

/**
 * Cria uma nova tarefa vinculada ao casal autenticado.
 */
export async function createTask(payload: TaskCreatePayload): Promise<Task> {
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
    .from('tasks')
    .insert({
      ...payload,
      couple_id: coupleData.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao criar tarefa: ${error.message}`)
  }

  return data as Task
}

/**
 * Atualiza uma tarefa existente.
 */
export async function updateTask(
  id: string,
  payload: TaskUpdatePayload
): Promise<Task> {
  const { data, error } = await supabase
    .from('tasks')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw new Error(`Erro ao atualizar tarefa: ${error.message}`)
  }

  return data as Task
}

/**
 * Remove uma tarefa (soft delete via campo deleted_at).
 */
export async function deleteTask(id: string): Promise<void> {
  const { error } = await supabase
    .from('tasks')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    throw new Error(`Erro ao excluir tarefa: ${error.message}`)
  }
}
