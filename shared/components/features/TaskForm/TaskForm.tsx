'use client'

/**
 * TaskForm — formulário modal para criar ou editar uma tarefa.
 * Campos: título, data limite, responsável, prioridade, observações, status, categoria.
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
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="px-4 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-lg font-bold text-primary-dark">
            {task ? 'Editar Tarefa' : 'Nova Tarefa'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar formulário"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">

          {/* Mensagem de erro */}
          {formError && (
            <div className="p-3 bg-red-50 text-danger text-sm rounded-md border border-red-100">
              {formError}
            </div>
          )}

          {/* Título */}
          <Input
            label="Título da tarefa *"
            placeholder="Ex: Confirmar cardápio com o buffet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Categoria */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">
              Categoria *
            </label>
            <div className="flex gap-2">
              {CATEGORY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setCategory(opt.value)}
                  className={`
                    flex-1 py-2 px-3 rounded-md border text-sm font-semibold transition-all
                    ${category === opt.value
                      ? 'bg-primary-dark text-white border-primary-dark'
                      : 'bg-white text-text-secondary border-gray-300 hover:border-primary-DEFAULT'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">
              Status *
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`
                    flex-1 py-2 px-3 rounded-md border text-sm font-semibold transition-all
                    ${status === opt.value
                      ? opt.value === 'done'
                        ? 'bg-success-DEFAULT text-white border-success-DEFAULT'
                        : 'bg-primary-dark text-white border-primary-dark'
                      : 'bg-white text-text-secondary border-gray-300 hover:border-primary-DEFAULT'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Prioridade */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">
              Prioridade
            </label>
            <div className="flex gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(priority === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-2 px-3 rounded-md border text-xs font-semibold transition-all
                    ${priority === opt.value
                      ? opt.className
                      : 'bg-white text-text-secondary border-gray-300 hover:border-gray-400'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Responsável */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">
              Responsável
            </label>
            <div className="flex gap-2">
              {ASSIGNEE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAssignee(assignee === opt.value ? '' : opt.value)}
                  className={`
                    flex-1 py-2 px-3 rounded-md border text-sm font-semibold transition-all
                    ${assignee === opt.value
                      ? 'bg-primary-dark text-white border-primary-dark'
                      : 'bg-white text-text-secondary border-gray-300 hover:border-primary-DEFAULT'
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
          <div className="space-y-1.5">
            <label
              htmlFor="task-notes"
              className="text-sm font-semibold text-text-primary"
            >
              Observações
            </label>
            <textarea
              id="task-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes adicionais, links, contatos..."
              rows={3}
              className="
                w-full px-4 py-2 rounded-md border border-gray-300
                focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light
                outline-none transition-all text-sm text-text-primary
                placeholder:text-text-secondary resize-none
              "
            />
          </div>

          {/* Ações */}
          <div className="pt-4 flex flex-col gap-3">
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
                className="
                  flex items-center justify-center gap-2 text-danger text-sm
                  font-semibold py-2 hover:bg-red-50 rounded-md transition-colors
                "
              >
                {isDeleting
                  ? <Loader2 size={16} className="animate-spin" />
                  : <Trash2 size={16} />
                }
                Excluir Tarefa
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
