/**
 * Tipos relacionados às tarefas (tasks)
 */

export type TaskStatus = 'pending' | 'done'

export type TaskCategory = 'ceremony' | 'party'

export type TaskPriority = 'high' | 'medium' | 'low'

export type TaskAssignee = 'bride' | 'groom' | 'both'

export interface Task {
  id: string
  couple_id: string
  title: string
  status: TaskStatus
  category: TaskCategory
  priority: TaskPriority | null
  assignee: TaskAssignee | null
  due_date: string | null
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface TaskCreatePayload {
  title: string
  status: TaskStatus
  category: TaskCategory
  priority?: TaskPriority | null
  assignee?: TaskAssignee | null
  due_date?: string | null
  notes?: string | null
}

export interface TaskUpdatePayload {
  title?: string
  status?: TaskStatus
  category?: TaskCategory
  priority?: TaskPriority | null
  assignee?: TaskAssignee | null
  due_date?: string | null
  notes?: string | null
}
