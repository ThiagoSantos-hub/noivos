'use client'

/**
 * GuestForm — formulário para criar ou editar um convidado
 */

import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { Guest, GuestStatus, GuestGroup, GuestCreatePayload } from '@/types/guest.types'

interface IGuestFormProps {
  guest?: Guest
  onSubmit: (data: GuestCreatePayload) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose: () => void
}

const GROUPS: { value: GuestGroup; label: string; icon: string }[] = [
  { value: 'bride_family', label: 'Família da Noiva', icon: '👰' },
  { value: 'groom_family', label: 'Família do Noivo', icon: '🤵' },
  { value: 'groomsmen_bridesmaids', label: 'Padrinhos & Madrinhas', icon: '💍' },
]

const STATUSES: { value: GuestStatus; label: string }[] = [
  { value: 'pending', label: 'Pendente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'declined', label: 'Recusou' },
]

export function GuestForm({ guest, onSubmit, onDelete, onClose }: IGuestFormProps) {
  const [name, setName] = useState(guest?.name || '')
  const [phone, setPhone] = useState(guest?.phone || '')
  const [status, setStatus] = useState<GuestStatus>(guest?.status || 'pending')
  const [group, setGroup] = useState<GuestGroup>(guest?.group || 'bride_family')
  const [tableNumber, setTableNumber] = useState(guest?.table_number?.toString() || '')
  const [notes, setNotes] = useState(guest?.notes || '')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !phone) {
      setError('Nome e telefone são obrigatórios.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit({
        name,
        phone,
        status,
        group,
        table_number: tableNumber ? parseInt(tableNumber) : null,
        notes: notes || null,
      })
      onClose()
    } catch (err) {
      setError('Erro ao salvar convidado. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!guest || !onDelete) return
    if (!confirm(`Tem certeza que deseja excluir ${guest.name}?`)) return

    try {
      setIsDeleting(true)
      await onDelete(guest.id)
      onClose()
    } catch (err) {
      setError('Erro ao excluir convidado.')
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
            {guest ? 'Editar Convidado' : 'Novo Convidado'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 text-danger text-sm rounded-md border border-red-100">
              {error}
            </div>
          )}

          <Input
            label="Nome do convidado*"
            placeholder="Ex: Maria Silva"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <Input
            label="Telefone*"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">Status de Presença*</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStatus(s.value)}
                  className={`
                    py-2 px-1 text-xs font-bold rounded-md border transition-all
                    ${status === s.value 
                      ? 'bg-primary-DEFAULT text-white border-primary-DEFAULT shadow-sm' 
                      : 'bg-white text-text-secondary border-gray-200 hover:border-primary-light'}
                  `}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">Grupo*</label>
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as GuestGroup)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light outline-none transition-all bg-white"
            >
              {GROUPS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.icon} {g.label}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Número da Mesa (Opcional)"
            type="number"
            placeholder="Ex: 12"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">Observações (Opcional)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Restrições alimentares, etc."
              rows={2}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              label={guest ? 'Salvar Alterações' : 'Cadastrar Convidado'}
              type="submit"
              loading={isSubmitting}
              disabled={isDeleting}
              className="w-full"
            />
            
            {guest && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="flex items-center justify-center gap-2 text-danger text-sm font-semibold py-2 hover:bg-red-50 rounded-md transition-colors"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Excluir Convidado
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
