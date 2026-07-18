'use client'

/**
 * TaskForm — bem compacto e centralizado (sem scroll no celular)
 */

import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import type {
  Task,
  TaskCategory,
  TaskPriority,
  TaskAssignee,
  TaskStatus,
  TaskCreatePayload,
} from '@/types/task.types'

interface ITaskFormProps {
  task?: Task
  onSubmit: (data: TaskCreatePayload) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose: () => void
}

const CATEGORY_OPTIONS: { value: TaskCategory; label: string }[] = [
  { value: 'ceremony', label: 'Cerimônia' },
  { value: 'party', label: 'Festa' },
]

const PRIORITY_OPTIONS: { value: TaskPriority; label: string; className: string }[] = [
  { value: 'high', label: 'Alta', className: 'border-red-300 bg-red-50 text-red-700' },
  { value: 'medium', label: 'Média', className: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'low', label: 'Baixa', className: 'border-green-300 bg-green-50 text-green-700' },
]

const ASSIGNEE_OPTIONS: { value: TaskAssignee; label: string }[] = [
  { value: 'bride', label: 'Noiva' },
  { value: 'groom', label: 'Noivo' },
  { value: 'both', label: 'Ambos' },
]

const STATUS_OPTIONS: { value: TaskStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'done', label: 'Concluída' },
]

export function TaskForm({ task, onSubmit, onDelete, onClose }: ITaskFormProps) {
  const [title, setTitle] = useState(task?.title || '')
  const [category, setCategory] = useState<TaskCategory>(task?.category || 'ceremony')
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'pending')
  const [priority, setPriority] = useState<TaskPriority | ''>(task?.priority || '')
  const [assignee, setAssignee] = useState<TaskAssignee | ''>(task?.assignee || '')
  const [dueDate, setDueDate] = useState(task?.due_date || '')
  const [notes, setNotes] = useState(task?.notes || '')

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      setFormError('O título da tarefa é obrigatório.')
      return
    }

    try {
      setIsSubmitting(true)
      setFormError(null)

      await onSubmit({
        title: title.trim(),
        category,
        status,
        priority: priority || null,
        assignee: assignee || null,
        due_date: dueDate || null,
        notes: notes.trim() || null,
      })

      onClose()
    } catch {
      setFormError('Erro ao salvar tarefa. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!task || !onDelete) return
    if (!confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) return

    try {
      setIsDeleting(true)
      await onDelete(task.id)
      onClose()
    } catch {
      setFormError('Erro ao excluir tarefa.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 bg-black/50">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-4 py-2.5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-primary-dark">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-text-secondary hover:bg-gray-100 rounded-full"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulário bem compacto */}
        <form onSubmit={handleSubmit} className="p-3 space-y-2.5">

          {formError && (
            <div className="p-2 bg-red-50 text-red-600 text-xs rounded-md">
              {formError}
            </div>
          )}

          {/* Título */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Título *</label>
            <input
              type="text"
              placeholder="Ex: Confirmar cardápio"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Categoria + Status */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">Categoria</label>
              <div className="flex gap-1">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={`
                      flex-1 py-1.5 rounded-lg border text-[11px] font-semibold
                      ${category === opt.value
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-text-secondary border-gray-300'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">Status</label>
              <div className="flex gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`
                      flex-1 py-1.5 rounded-lg border text-[11px] font-semibold
                      ${status === opt.value
                        ? opt.value === 'done'
                          ? 'bg-green-600 text-white border-green-600'
                          : 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-text-secondary border-gray-300'
                      }
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Prioridade</label>
            <div className="flex gap-1">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(priority === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-1.5 rounded-lg border text-[11px] font-semibold
                    ${priority === opt.value
                      ? opt.className
                      : 'bg-white text-text-secondary border-gray-300'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Responsável</label>
            <div className="flex gap-1">
              {ASSIGNEE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAssignee(assignee === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-1.5 rounded-lg border text-[11px] font-semibold
                    ${assignee === opt.value
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'bg-white text-text-secondary border-gray-300'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Data limite */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Data limite</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Observações</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes..."
              className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Ações */}
          <div className="pt-1 flex flex-col gap-1.5">
            <button
              type="submit"
              disabled={isSubmitting || isDeleting}
              className="w-full py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold shadow-lg disabled:opacity-60"
            >
              {isSubmitting ? 'Salvando...' : task ? 'Salvar Alterações' : 'Criar Tarefa'}
            </button>

            {task && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="flex items-center justify-center gap-1.5 text-red-600 text-xs font-semibold py-1.5"
              >
                {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                Excluir Tarefa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
