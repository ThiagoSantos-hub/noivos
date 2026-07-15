'use client'

/**
 * TarefasPage — Tela de gestão de tarefas do casamento
 * Rota: /tarefas (protegida pelo layout do dashboard)
 *
 * Funcionalidades:
 * - Listagem por categoria (Cerimônia e Festa)
 * - Contagem de tarefas concluídas no topo
 * - Adicionar, editar e excluir tarefas
 * - Marcar como concluída diretamente no card
 * - Sincronização em tempo real entre os dois dispositivos
 */

import { useState, useMemo, useCallback } from 'react'
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useTasks } from '@/hooks/useTasks'
import { TaskCard, TaskForm } from '@/components/features'
import type { Task, TaskCategory, TaskCreatePayload } from '@/types/task.types'

// Configuração das categorias exibidas na tela
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

  // Filtra tarefas pelo termo de busca
  const filteredTasks = useMemo(
    () =>
      tasks.filter((t) =>
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [tasks, searchTerm]
  )

  // Agrupa tarefas por categoria
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

  // Contagem global de concluídas
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

      {/* Header fixo */}
      <header className="sticky top-0 z-40 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-2xl font-bold text-text-primary">
            Tarefas ✅
          </h1>
          <button
            onClick={handleAddClick}
            className="
              w-10 h-10 bg-success-DEFAULT text-white rounded-full
              flex items-center justify-center shadow-md
              hover:bg-success-dark active:scale-95 transition-all
            "
            aria-label="Adicionar nova tarefa"
          >
            <Plus size={24} />
          </button>
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
              <span className="text-xs font-semibold text-success-dark">
                {totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-success-DEFAULT rounded-full transition-all duration-500"
                style={{ width: `${totalCount > 0 ? (doneCount / totalCount) * 100 : 0}%` }}
                role="progressbar"
                aria-valuenow={doneCount}
                aria-valuemin={0}
                aria-valuemax={totalCount}
                aria-label="Progresso das tarefas"
              />
            </div>
          </div>
        )}

        {/* Campo de busca */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="Buscar tarefa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200
              rounded-full text-sm outline-none focus:border-primary-DEFAULT
              focus:ring-2 focus:ring-primary-light transition-all
            "
            aria-label="Buscar tarefa pelo título"
          />
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-1 px-4 pt-4">
        {isLoading ? (
          /* Skeleton de carregamento */
          <div className="space-y-4">
            <div className="animate-pulse bg-white h-8 w-40 rounded-md shadow-sm border border-gray-100" />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-white h-20 rounded-lg shadow-sm border border-gray-100"
              />
            ))}
          </div>
        ) : error ? (
          /* Estado de erro */
          <div className="py-12 text-center">
            <p className="text-danger mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="
                px-6 py-2 bg-primary-dark text-white rounded-full text-sm
                font-semibold hover:bg-primary-DEFAULT transition-colors
              "
            >
              Tentar novamente
            </button>
          </div>
        ) : totalCount === 0 && !searchTerm ? (
          /* Estado vazio */
          <div className="py-16 text-center">
            <p className="text-4xl mb-3">📋</p>
            <h2 className="text-lg font-bold text-text-primary mb-1">
              Nenhuma tarefa ainda
            </h2>
            <p className="text-sm text-text-secondary mb-6">
              Comece adicionando as primeiras tarefas do casamento.
            </p>
            <button
              onClick={handleAddClick}
              className="
                inline-flex items-center gap-2 px-6 py-2.5 bg-success-DEFAULT
                text-white rounded-full text-sm font-semibold shadow-md
                hover:bg-success-dark transition-colors
              "
            >
              <Plus size={18} />
              Adicionar tarefa
            </button>
          </div>
        ) : (
          /* Lista por categoria */
          <div className="space-y-6">
            {(Object.keys(CATEGORIES_CONFIG) as TaskCategory[]).map((categoryKey) => {
              const categoryTasks = tasksByCategory[categoryKey] || []
              const isCollapsed = collapsedCategories[categoryKey]
              const config = CATEGORIES_CONFIG[categoryKey]
              const doneCategoryCount = categoryTasks.filter((t) => t.status === 'done').length

              return (
                <section key={categoryKey} className="space-y-3">
                  {/* Cabeçalho da seção */}
                  <button
                    type="button"
                    onClick={() => toggleCategory(categoryKey)}
                    className="w-full flex justify-between items-center text-primary-dark"
                    aria-expanded={!isCollapsed}
                    aria-controls={`category-${categoryKey}`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg" aria-hidden="true">
                        {config.icon}
                      </span>
                      <h2 className="font-bold text-sm uppercase tracking-wider">
                        {config.label}
                      </h2>
                      <span className="text-text-secondary font-normal text-xs lowercase">
                        ({doneCategoryCount}/{categoryTasks.length})
                      </span>
                    </div>
                    {isCollapsed
                      ? <ChevronDown size={20} aria-hidden="true" />
                      : <ChevronUp size={20} aria-hidden="true" />
                    }
                  </button>

                  {/* Lista de tarefas da categoria */}
                  {!isCollapsed && (
                    <div
                      id={`category-${categoryKey}`}
                      className="space-y-2"
                    >
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

      {/* Modal de formulário */}
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
