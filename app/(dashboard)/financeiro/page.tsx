'use client'

/**
 * Página de Financeiro
 */

import { useState } from 'react'
import { useCouple } from '@/hooks/useCouple'
import { formatCurrency } from '@/utils/formatters'

export default function FinanceiroPage() {
  const { couple, isLoading } = useCouple()

  const [expenses, setExpenses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({
    name: '',
    amount: '',
    paid: '',
  })

  if (isLoading || !couple) {
    return <div className="p-4">Carregando...</div>
  }

  const totalBudget = couple.total_budget ?? 0
  const totalPaid = couple.total_paid ?? 0
  const remaining = Math.max(0, totalBudget - totalPaid)
  const progress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  const handleAddExpense = () => {
    if (!newExpense.name || !newExpense.amount) return

    const expense = {
      id: Date.now(),
      name: newExpense.name,
      amount: parseFloat(newExpense.amount),
      paid: parseFloat(newExpense.paid) || 0,
    }

    setExpenses([...expenses, expense])
    setNewExpense({ name: '', amount: '', paid: '' })
    setShowForm(false)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border">
          <p className="text-sm text-text-secondary">Orçamento Total</p>
          <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border">
          <p className="text-sm text-text-secondary">Já Pago</p>
          <p className="text-2xl font-bold text-success-dark">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-lg border">
          <p className="text-sm text-text-secondary">Falta Pagar</p>
          <p className="text-2xl font-bold text-primary-dark">{formatCurrency(remaining)}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1">
          <span>Progresso do pagamento</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-success-DEFAULT transition-all duration-500" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      {/* Botão adicionar despesa */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Despesas</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium"
        >
          + Adicionar Despesa
        </button>
      </div>

      {/* Formulário de nova despesa */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow mb-4 border">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome da despesa"
              value={newExpense.name}
              onChange={(e) => setNewExpense({...newExpense, name: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Valor total"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Já pago"
              value={newExpense.paid}
              onChange={(e) => setNewExpense({...newExpense, paid: e.target.value})}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <button 
            onClick={handleAddExpense}
            className="mt-3 w-full bg-success text-white py-2 rounded-xl font-medium"
          >
            Adicionar
          </button>
        </div>
      )}

      {/* Lista de despesas */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <p className="text-center text-text-secondary py-8">Nenhuma despesa cadastrada ainda.</p>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-4 rounded-2xl shadow border flex justify-between items-center">
              <div>
                <p className="font-medium">{exp.name}</p>
                <p className="text-sm text-text-secondary">
                  {formatCurrency(exp.paid)} / {formatCurrency(exp.amount)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-semibold">{formatCurrency(exp.amount - exp.paid)}</p>
                <p className="text-xs text-text-secondary">restante</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
