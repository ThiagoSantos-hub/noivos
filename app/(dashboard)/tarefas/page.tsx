'use client'

/**
 * TarefasPage — botões limpos e sempre visíveis
 */

import { useState, useMemo, useCallback } from 'react'
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard, TaskForm } from '@/components/features'
import type { Task, TaskCategory, TaskCreatePayload } from '@/types/task.types'

const CATEGORIES_CONFIG: Record<TaskCategory, { label: string; icon: string }> = {
  ceremony: { label: 'Cerimônia', icon: '⛪' },
  party: { label: 'Festa', icon: '🎉' },
}

export default function TarefasPage() {
  const { tasks, isLoading, error, addTask, editTask, removeTask, toggleTaskStatus } = useTasks()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({})

  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tasks, searchTerm]
  )

  const tasksByCategory = useMemo(
    () =>
      filteredTasks.reduce(
        (acc, task) => {
          if (!acc[task.category]) acc[task.category] = []
          acc[task.category].push(task)
          return acc
        },
        {} as Record<TaskCategory, Task[]>
      ),
    [filteredTasks]
  )

  const doneCount = useMemo(
    () => tasks.filter((t) => t.status === 'done').length,
    [tasks]
  )

  const totalCount = tasks.length

  const toggleCategory = useCallback((category: string) => {
    setCollapsedCategories((prev) => ({ ...prev, [category]: !prev[category] }))
  }, [])

  const handleAddClick = useCallback(() => {
    setSelectedTask(undefined)
    setIsFormOpen(true)
  }, [])

  const handleTaskClick = useCallback((task: Task) => {
    setSelectedTask(task)
    setIsFormOpen(true)
  }, [])

  const handleSubmit = async (data: TaskCreatePayload) => {
    if (selectedTask) {
      await editTask(selectedTask.id, data)
    } else {
      await addTask(data)
    }
  }

  const handleDelete = async (id: string) => {
    await removeTask(id)
  }

  const handleToggle = useCallback(
    async (task: Task) => {
      await toggleTaskStatus(task)
    },
    [toggleTaskStatus]
  )

  return (
    <div className="flex flex-col min-h-full pb-20">
      <title>Tarefas — Noivos</title>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white px-4 pt-6 pb-4 shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-text-primary">
            Tarefas
          </h1>
        </div>

        {/* Contador de progresso */}
        {!isLoading && totalCount > 0 && (
          <div className="mb-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-text-primary">{doneCount}</span>
                {' de '}
                <span className="font-semibold text-text-primary">{totalCount}</span>
                {' tarefas concluídas'}
              </p>
              <span className="text-xs font-semibold text-green-700">
                {totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}

        {/* Campo de busca */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200
              rounded-xl text-sm outline-none focus:border-green-500
              focus:ring-2 focus:ring-green-100 transition-all shadow-sm
            "
          />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 px-4 pt-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white h-20 rounded-2xl shadow-md border border-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold shadow-lg"
            >
              Tentar novamente
            </button>
          </div>
        ) : totalCount === 0 && !searchTerm ? (
          /* Estado vazio */
          <div className="py-16 text-center">
            <p className="text-5xl mb-4">📋</p>
            <h2 className="text-lg font-bold text-text-primary mb-1">
              Nenhuma tarefa ainda
            </h2>
            <p className="text-sm text-text-secondary mb-8">
              Comece adicionando as primeiras tarefas do casamento.
            </p>
            <button
              onClick={handleAddClick}
              className="
                inline-flex items-center gap-2 px-8 py-3.5 bg-green-600
                text-white rounded-2xl text-base font-bold
                shadow-[0_8px_20px_rgba(22,163,74,0.35)]
                hover:bg-green-700 active:scale-95 transition-all
              "
            >
              <Plus size={22} strokeWidth={2.5} />
              Adicionar tarefa
            </button>
          </div>
        ) : (
          /* Lista por categoria */
          <div className="space-y-6">
            {/* Botão Nova tarefa — sempre visível e com sombra 3D */}
            <div className="flex justify-end">
              <button
                onClick={handleAddClick}
                className="
                  inline-flex items-center gap-2 px-5 py-2.5 bg-green-600
                  text-white rounded-xl text-sm font-semibold
                  shadow-[0_6px_16px_rgba(22,163,74,0.4)]
                  hover:bg-green-700 active:scale-95 transition-all
                "
              >
                <Plus size={18} />
                Nova tarefa
              </button>
            </div>

            {(Object.keys(CATEGORIES_CONFIG) as TaskCategory[]).map((categoryKey) => {
              const categoryTasks = tasksByCategory[categoryKey] || []
              const isCollapsed = collapsedCategories[categoryKey]
              const config = CATEGORIES_CONFIG[categoryKey]
              const doneCategoryCount = categoryTasks.filter((t) => t.status === 'done').length

              return (
                <section key={categoryKey} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full flex justify-between items-center text-primary-dark"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{config.icon}</span>
                      <h2 className="font-bold text-sm uppercase tracking-wider">
                        {config.label}
                      </h2>
                      <span className="text-text-secondary font-normal text-xs lowercase">
                        ({doneCategoryCount}/{categoryTasks.length})
                      </span>
                    </div>
                    {isCollapsed
                      ? <ChevronDown size={20} />
                      : <ChevronUp size={20} />
                    }
                  </button>

                  {!isCollapsed && (
                    <div className="space-y-3">
                      {categoryTasks.length === 0 ? (
                        <p className="text-xs text-text-secondary italic py-2 pl-7">
                          {searchTerm
                            ? 'Nenhuma tarefa encontrada nesta categoria.'
                            : 'Nenhuma tarefa nesta categoria ainda.'
                          }
                        </p>
                      ) : (
                        categoryTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onClick={handleTaskClick}
                            onToggle={handleToggle}
                          />
                        ))
                      )}
                    </div>
                  )}
                </section>
              )
            })}
          </div>
        )}
      </main>

      {isFormOpen && (
        <TaskForm
          task={selectedTask}
          onSubmit={handleSubmit}
          onDelete={selectedTask ? handleDelete : undefined}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
