'use client'

/**
 * TaskCard — exibe uma tarefa com checkbox de conclusão, badge de prioridade,
 * data limite e responsável. Ao clicar no card (fora do checkbox) abre edição.
 */

import { useCallback } from 'react'
import { Calendar, User } from 'lucide-react'
import type { Task, TaskPriority } from '@/types/task.types'

interface ITaskCardProps {
  task: Task
  onClick: (task: Task) => void
  onToggle: (task: Task) => void
}

const PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; className: string }
> = {
  high: { label: 'Alta', className: 'bg-red-100 text-red-700 border-red-200' },
  medium: { label: 'Média', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  low: { label: 'Baixa', className: 'bg-green-100 text-green-700 border-green-200' },
}

const ASSIGNEE_LABEL: Record<string, string> = {
  bride: 'Noiva',
  groom: 'Noivo',
}

function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${day}/${month}/${year}`
}

export function TaskCard({ task, onClick, onToggle }: ITaskCardProps) {
  const isDone = task.status === 'done'

  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      onToggle(task)
    },
    [task, onToggle]
  )

  const handleCardClick = useCallback(() => {
    onClick(task)
  }, [task, onClick])

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={`
        flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm border
        cursor-pointer transition-all active:scale-[0.99]
        ${isDone ? 'border-gray-100 opacity-70' : 'border-gray-200 hover:border-primary-DEFAULT hover:shadow-md'}
      `}
      aria-label={`Tarefa: ${task.title}`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDone ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`
          flex-shrink-0 mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center
          transition-all focus:outline-none focus:ring-2 focus:ring-success-DEFAULT focus:ring-offset-1
          ${isDone
            ? 'bg-success-DEFAULT border-success-DEFAULT'
            : 'border-gray-300 hover:border-success-DEFAULT'
          }
        `}
      >
        {isDone && (
          <svg
            width="10"
            height="8"
            viewBox="0 0 10 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {/* Conteúdo */}
      <div className="flex-1 min-w-0">
        {/* Título */}
        <p
          className={`
            text-sm font-semibold leading-snug break-words
            ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}
          `}
        >
          {task.title}
        </p>

        {/* Metadados */}
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {/* Badge de prioridade */}
          {task.priority && (
            <span
              className={`
                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border
                ${PRIORITY_CONFIG[task.priority].className}
              `}
            >
              {PRIORITY_CONFIG[task.priority].label}
            </span>
          )}

          {/* Data limite */}
          {task.due_date && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Calendar size={11} aria-hidden="true" />
              {formatDate(task.due_date)}
            </span>
          )}

          {/* Responsável */}
          {task.assignee && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <User size={11} aria-hidden="true" />
              {ASSIGNEE_LABEL[task.assignee]}
            </span>
          )}
        </div>

        {/* Observações */}
        {task.notes && !isDone && (
          <p className="mt-1.5 text-xs text-text-secondary line-clamp-2 break-words">
            {task.notes}
          </p>
        )}
      </div>
    </div>
  )
}
