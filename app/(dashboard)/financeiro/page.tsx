'use client'

/**
 * Página de Financeiro - com lógica de Orçamento Planejado + Total de Despesas
 */

import { useState, useEffect } from 'react'
import { useCouple } from '@/hooks/useCouple'
import { supabase } from '@/services/supabase'
import { formatCurrency } from '@/utils/formatters'

export default function FinanceiroPage() {
  const { couple, isLoading: coupleLoading, updateCoupleData } = useCouple()
  const [expenses, setExpenses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [newExpense, setNewExpense] = useState({ name: '', amount: '', paid: '' })

  const loadExpenses = async () => {
    if (!couple?.id) return
    const { data, error } = await supabase
      .from('expenses')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: false })

    if (!error && data) setExpenses(data)
    setLoading(false)
  }

  useEffect(() => {
    if (couple?.id) loadExpenses()
  }, [couple?.id])

  if (coupleLoading || loading || !couple) return <div className="p-4">Carregando...</div>

  const totalPlanned = couple.total_budget ?? 0
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0)
  const totalPaid = expenses.reduce((sum, exp) => sum + (exp.paid_amount || 0), 0)
  const remainingBudget = Math.max(0, totalPlanned - totalExpenses)
  const progress = totalPlanned > 0 ? Math.round((totalPaid / totalPlanned) * 100) : 0

  const handleAddExpense = async () => {
    const amountNum = parseFloat(newExpense.amount)
    const paidNum = parseFloat(newExpense.paid) || 0

    if (!newExpense.name.trim() || isNaN(amountNum) || amountNum <= 0) {
      alert('Preencha o nome e um valor válido.')
      return
    }

    const { error } = await supabase.from('expenses').insert({
      couple_id: couple.id,
      name: newExpense.name.trim(),
      amount: amountNum,
      paid_amount: paidNum,
    })

    if (error) {
      alert('Erro ao salvar despesa.')
      return
    }

    await updateCoupleData({ total_paid: totalPaid + paidNum })

    setNewExpense({ name: '', amount: '', paid: '' })
    setShowForm(false)
    await loadExpenses()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Financeiro</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200">
          <p className="text-sm text-text-secondary mb-1">Orçamento Planejado</p>
          <p className="text-2xl font-bold">{formatCurrency(totalPlanned)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200">
          <p className="text-sm text-text-secondary mb-1">Total de Despesas</p>
          <p className="text-2xl font-bold text-primary-dark">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200">
          <p className="text-sm text-text-secondary mb-1">Já Pago</p>
          <p className="text-2xl font-bold text-success-dark">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-200">
          <p className="text-sm text-text-secondary mb-1">Restante do Orçamento</p>
          <p className="text-2xl font-bold text-primary-dark">{formatCurrency(remainingBudget)}</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm mb-1.5">
          <span>Progresso do pagamento</span>
          <span className="font-semibold">{progress}%</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-success-DEFAULT transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Despesas</h2>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium">+ Adicionar Despesa</button>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-2xl shadow-xl border mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input type="text" placeholder="Nome da despesa" value={newExpense.name} onChange={(e) => setNewExpense({ ...newExpense, name: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Valor total" value={newExpense.amount} onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })} className="border rounded-lg px-3 py-2" />
            <input type="number" placeholder="Já pago" value={newExpense.paid} onChange={(e) => setNewExpense({ ...newExpense, paid: e.target.value })} className="border rounded-lg px-3 py-2" />
          </div>
          <button onClick={handleAddExpense} className="mt-3 w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold">Adicionar Despesa</button>
        </div>
      )}

      <div className="space-y-3">
        {expenses.length === 0 ? (
          <div className="text-center py-8 text-text-secondary">Nenhuma despesa cadastrada ainda.</div>
        ) : (
          expenses.map((exp) => (
            <div key={exp.id} className="bg-white p-4 rounded-2xl shadow-xl border flex justify-between items-center">
              <div className="min-w-0">
                <p className="font-semibold truncate">{exp.name}</p>
                <p className="text-sm text-text-secondary">{formatCurrency(exp.paid_amount || 0)} pagos de {formatCurrency(exp.amount)}</p>
              </div>
              <div className="text-right flex-shrink-0 ml-3">
                <p className="font-bold text-primary-dark">{formatCurrency((exp.amount || 0) - (exp.paid_amount || 0))}</p>
                <p className="text-xs text-text-secondary">restante</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
