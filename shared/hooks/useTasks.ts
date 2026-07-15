/**
 * useTasks — hook para gerenciar tarefas com sincronização em tempo real
 */

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/services/supabase'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask as deleteTaskService,
} from '@/services/taskService'
import type { Task, TaskCreatePayload, TaskUpdatePayload } from '@/types/task.types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setIsLoading(true)
      const data = await getTasks()
      setTasks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tarefas')
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addTask = async (payload: TaskCreatePayload): Promise<Task> => {
    try {
      const newTask = await createTask(payload)
      setTasks((prev) => [newTask, ...prev])
      return newTask
    } catch (err) {
      throw err
    }
  }

  const editTask = async (id: string, payload: TaskUpdatePayload): Promise<Task> => {
    try {
      const updated = await updateTask(id, payload)
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)))
      return updated
    } catch (err) {
      throw err
    }
  }

  const removeTask = async (id: string): Promise<void> => {
    try {
      await deleteTaskService(id)
      setTasks((prev) => prev.filter((t) => t.id !== id))
    } catch (err) {
      throw err
    }
  }

  const toggleTaskStatus = async (task: Task): Promise<void> => {
    const newStatus = task.status === 'done' ? 'pending' : 'done'
    await editTask(task.id, { status: newStatus })
  }

  useEffect(() => {
    fetchTasks()

    // Realtime subscription — cancela ao desmontar o componente
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        () => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [fetchTasks])

  return {
    tasks,
    isLoading,
    error,
    addTask,
    editTask,
    removeTask,
    toggleTaskStatus,
    refresh: fetchTasks,
  }
}
