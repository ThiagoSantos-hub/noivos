'use client'

/**
 * CoupleHeader — exibe "Olá, [Noiva] & [Noivo]! 💍"
 * Permite edição inline do nome da noiva e do noivo
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Pencil, Check, X, Loader2 } from 'lucide-react'
import type { Couple, CoupleUpdatePayload } from '@/types/couple.types'

interface ICoupleHeaderProps {
  couple: Couple
  onUpdate: (payload: CoupleUpdatePayload) => Promise<void>
}

type EditableField = 'bride_name' | 'groom_name' | null

export function CoupleHeader({ couple, onUpdate }: ICoupleHeaderProps) {
  const [editingField, setEditingField] = useState<EditableField>(null)
  const [editValue, setEditValue] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editingField && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editingField])

  const startEditing = useCallback(
    (field: EditableField) => {
      if (!field) return
      setSaveError(null)
      setEditValue(couple[field] ?? '')
      setEditingField(field)
    },
    [couple]
  )

  const cancelEditing = useCallback(() => {
    setEditingField(null)
    setEditValue('')
    setSaveError(null)
  }, [])

  const confirmEdit = useCallback(async () => {
    if (!editingField) return

    const trimmed = editValue.trim()
    if (!trimmed) {
      setSaveError('O nome não pode ser vazio.')
      return
    }

    if (trimmed === couple[editingField]) {
      cancelEditing()
      return
    }

    try {
      setIsSaving(true)
      setSaveError(null)
      await onUpdate({ [editingField]: trimmed })
      setEditingField(null)
    } catch {
      setSaveError('Erro ao salvar. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }, [editingField, editValue, couple, onUpdate, cancelEditing])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') confirmEdit()
      if (e.key === 'Escape') cancelEditing()
    },
    [confirmEdit, cancelEditing]
  )

  const renderName = (
    field: 'bride_name' | 'groom_name',
    value: string,
    label: string
  ) => {
    const isEditing = editingField === field

    if (isEditing) {
      return (
        <span className="inline-flex items-center gap-1">
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label={`Editar ${label}`}
            className="
              inline-block w-32 px-2 py-0.5 text-xl font-semibold
              border-b-2 border-primary-DEFAULT bg-transparent
              text-text-primary outline-none
              focus:border-success-DEFAULT transition-colors
            "
            disabled={isSaving}
          />
          {isSaving ? (
            <Loader2 size={16} className="animate-spin text-text-secondary" />
          ) : (
            <>
              <button onClick={confirmEdit} className="p-1 text-success-DEFAULT hover:bg-green-50 rounded-full">
                <Check size={16} />
              </button>
              <button onClick={cancelEditing} className="p-1 text-danger hover:bg-red-50 rounded-full">
                <X size={16} />
              </button>
            </>
          )}
        </span>
      )
    }

    return (
      <button
        onClick={() => startEditing(field)}
        className="inline-flex items-center gap-1 group text-primary-dark font-semibold hover:text-primary-DEFAULT transition-colors"
      >
        <span>{value}</span>
        <Pencil size={13} className="opacity-0 group-hover:opacity-100 transition-opacity text-text-secondary" />
      </button>
    )
  }

  return (
    <header className="px-4 pt-5 pb-3">
      <h1 className="text-xl font-bold text-text-primary flex items-center gap-1 flex-wrap">
        Olá,{' '}
        {renderName('bride_name', couple.bride_name, 'nome da noiva')}
        <span className="text-text-secondary font-normal mx-0.5">&</span>
        {renderName('groom_name', couple.groom_name, 'nome do noivo')}!{' '}
        <span>💍</span>
      </h1>

      {saveError && <p className="mt-1 text-xs text-danger">{saveError}</p>}

      <p className="mt-0.5 text-xs text-text-secondary">Bem-vindos ao painel do casamento</p>
    </header>
  )
}
