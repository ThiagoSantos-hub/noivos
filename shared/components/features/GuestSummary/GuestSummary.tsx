'use client'

/**
 * GuestSummary — exibe contadores de convidados e permite editar o total esperado
 */

import { useState } from 'react'
import { Edit2, Check, X } from 'lucide-react'
import type { Guest } from '@/types/guest.types'

interface IGuestSummaryProps {
  guests: Guest[]
  expectedTotal: number
  onUpdateExpectedTotal: (total: number) => Promise<void>
}

export function GuestSummary({ guests, expectedTotal, onUpdateExpectedTotal }: IGuestSummaryProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [tempTotal, setTempTotal] = useState(expectedTotal.toString())
  
  const confirmed = guests.filter(g => g.status === 'confirmed').length
  const pending = guests.filter(g => g.status === 'pending').length
  const declined = guests.filter(g => g.status === 'declined').length
  const registered = guests.length

  const handleSave = async () => {
    const newTotal = parseInt(tempTotal)
    if (!isNaN(newTotal) && newTotal >= 0) {
      await onUpdateExpectedTotal(newTotal)
    }
    setIsEditing(false)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
            Total de Convidados
          </h2>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={tempTotal}
                  onChange={(e) => setTempTotal(e.target.value)}
                  className="w-20 px-2 py-1 text-xl font-bold border-b-2 border-primary-DEFAULT outline-none"
                  autoFocus
                />
                <button onClick={handleSave} className="p-1 text-success-DEFAULT">
                  <Check size={20} />
                </button>
                <button onClick={() => setIsEditing(false)} className="p-1 text-danger">
                  <X size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-primary-dark">
                  {registered} <span className="text-gray-300 font-light">/</span> {expectedTotal}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-text-secondary hover:text-primary-DEFAULT transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              </div>
            )}
          </div>
          <p className="text-xs text-text-secondary mt-1">
            {registered} cadastrados de {expectedTotal} esperados
          </p>
        </div>
        
        <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center text-primary-DEFAULT">
          <span className="text-xl font-bold">👥</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-50">
        <div className="text-center">
          <span className="block text-lg font-bold text-success-dark">{confirmed}</span>
          <span className="text-[10px] text-text-secondary uppercase font-bold">Confirmados</span>
        </div>
        <div className="text-center border-x border-gray-50">
          <span className="block text-lg font-bold text-warning-dark">{pending}</span>
          <span className="text-[10px] text-text-secondary uppercase font-bold">Pendentes</span>
        </div>
        <div className="text-center">
          <span className="block text-lg font-bold text-danger">{declined}</span>
          <span className="text-[10px] text-text-secondary uppercase font-bold">Recusaram</span>
        </div>
      </div>
    </div>
  )
}
