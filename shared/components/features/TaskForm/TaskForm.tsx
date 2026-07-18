'use client'

/**
 * TaskForm — versão compacta para caber melhor no celular
 */

import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[85vh]">

        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-base font-bold text-primary-dark">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-text-secondary hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário compacto */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 overflow-y-auto">

          {formError && (
            <div className="p-2.5 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
              {formError}
            </div>
          )}

          {/* Título */}
          <Input
            label="Título *"
            placeholder="Ex: Confirmar cardápio"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Categoria + Status lado a lado */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-text-primary">Categoria</label>
              <div className="flex gap-1.5">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setCategory(opt.value)}
                    className={`
                      flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all
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
              <div className="flex gap-1.5">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStatus(opt.value)}
                    className={`
                      flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all
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
            <div className="flex gap-1.5">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(priority === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all
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
            <div className="flex gap-1.5">
              {ASSIGNEE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAssignee(assignee === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-1.5 px-2 rounded-lg border text-xs font-semibold transition-all
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
          <Input
            label="Data limite"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />

          {/* Observações */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-text-primary">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes, links..."
              rows={2}
              className="
                w-full px-3 py-2 rounded-lg border border-gray-300
                focus:border-green-500 focus:ring-2 focus:ring-green-100
                outline-none text-sm resize-none
              "
            />
          </div>

          {/* Ações */}
          <div className="pt-2 flex flex-col gap-2">
            <Button
              label={task ? 'Salvar Alterações' : 'Criar Tarefa'}
              type="submit"
              loading={isSubmitting}
              disabled={isDeleting}
              className="w-full"
            />

            {task && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="flex items-center justify-center gap-2 text-red-600 text-sm font-semibold py-2"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Excluir Tarefa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
