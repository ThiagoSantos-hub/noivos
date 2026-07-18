'use client'

/**
 * TaskCard — com estilo 3D (sombra forte)
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
        flex items-start gap-3 p-4 bg-white rounded-2xl shadow-2xl border
        cursor-pointer transition-all active:scale-[0.98]
        ${isDone 
          ? 'border-gray-100 opacity-75' 
          : 'border-gray-200 hover:border-green-400'
        }
      `}
      aria-label={`Tarefa: ${task.title}`}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isDone ? 'Marcar como pendente' : 'Marcar como concluída'}
        className={`
          flex-shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center
          transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1
          shadow-md
          ${isDone
            ? 'bg-green-600 border-green-600'
            : 'border-gray-300 hover:border-green-500 bg-white'
          }
        `}
      >
        {isDone && (
          <svg
            width="12"
            height="10"
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
        <p
          className={`
            text-sm font-semibold leading-snug break-words
            ${isDone ? 'line-through text-text-secondary' : 'text-text-primary'}
          `}
        >
          {task.title}
        </p>

        <div className="flex flex-wrap items-center gap-2 mt-2">
          {task.priority && (
            <span
              className={`
                inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border shadow-sm
                ${PRIORITY_CONFIG[task.priority].className}
              `}
            >
              {PRIORITY_CONFIG[task.priority].label}
            </span>
          )}

          {task.due_date && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <Calendar size={12} />
              {formatDate(task.due_date)}
            </span>
          )}

          {task.assignee && (
            <span className="inline-flex items-center gap-1 text-xs text-text-secondary">
              <User size={12} />
              {ASSIGNEE_LABEL[task.assignee]}
            </span>
          )}
        </div>

        {task.notes && !isDone && (
          <p className="mt-1.5 text-xs text-text-secondary line-clamp-2 break-words">
            {task.notes}
          </p>
        )}
      </div>
    </div>
  )
}
