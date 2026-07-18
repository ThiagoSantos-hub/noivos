'use client'

/**
 * Página de Financeiro - corrigido overflow e adição de despesas
 */

import { useState } from 'react'
import { useCouple } from '@/hooks/useCouple'
import { formatCurrency } from '@/utils/formatters'

export default function FinanceiroPage() {
  const { couple, isLoading } = useCouple()

  const [expenses, setExpenses] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', paid: '' })

  if (isLoading || !couple) {
    return <div className="p-4">Carregando...</div>
  }

  const totalBudget = couple.total_budget ?? 0
  const totalPaid = couple.total_paid ?? 0
  const remaining = Math.max(0, totalBudget - totalPaid)
  const progress = totalBudget > 0 ? Math.round((totalPaid / totalBudget) * 100) : 0

  const handleAddExpense = () => {
    const amountNum = parseFloat(newExpense.amount)
    const paidNum = parseFloat(newExpense.paid) || 0

    if (!newExpense.name.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert('Preencha o nome e um valor válido para a despesa.')
      return
    }

    const expense = {
      id: Date.now(),
      name: newExpense.name.trim(),
      amount: amountNum,
      paid: paidNum,
    }

    setExpenses([...expenses, expense])
    setNewExpense({ name: '', amount: '', paid: '' })
    setShowForm(false)
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>

      {/* Cards de resumo - agora com proteção contra overflow */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 min-w-0">
          <p className="text-sm text-text-secondary mb-1">Orçamento Total</p>
          <p className="text-xl sm:text-2xl font-bold break-words">{formatCurrency(totalBudget)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 min-w-0">
          <p className="text-sm text-text-secondary mb-1">Já Pago</p>
          <p className="text-xl sm:text-2xl font-bold text-success-dark break-words">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200 min-w-0">
          <p className="text-sm text-text-secondary mb-1">Falta Pagar</p>
          <p className="text-xl sm:text-2xl font-bold text-primary-dark break-words">{formatCurrency(remaining)}</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1.5">
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

      {/* Despesas */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Despesas</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium flex items-center gap-1"
        >
          + Adicionar Despesa
        </button>
      </div>

      {/* Formulário */}
      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow-xl border mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Nome da despesa (ex: Buffet)"
              value={newExpense.name}
              onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Valor total"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="number"
              placeholder="Já pago"
              value={newExpense.paid}
              onChange={(e) => setNewExpense({ ...newExpense, paid: e.target.value })}
              className="border rounded-lg px-3 py-2"
            />
          </div>
          <button 
            onClick={handleAddExpense}
            className="mt-3 w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold"
          >
            Adicionar Despesa
          </button>
        </div>
      )}

      {/* Lista */}
      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">
            Nenhuma despesa cadastrada ainda.
          </div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-4 rounded-2xl shadow-xl border flex justify-between items-center">
              <div className="min-w-0">
                <p className="font-semibold truncate">{exp.name}</p>
                <p className="text-sm text-text-secondary">
                  {formatCurrency(exp.paid)} pagos de {formatCurrency(exp.amount)}
                </p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold text-primary-dark">{formatCurrency(exp.amount - exp.paid)}</p>
                <p className="text-xs text-text-secondary">restante</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
