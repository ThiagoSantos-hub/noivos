'use client'

/**
 * CoupleHeader — exibe "Olá, [Noiva] & [Noivo]! 💍"
 * Permite edição inline do nome da noiva e do noivo ao tocar no texto
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

  // Foca o input ao abrir edição
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

    // Sem mudança, apenas fechar
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

  // Confirma ao pressionar Enter, cancela com Escape
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
              inline-block w-36 px-2 py-0.5 text-2xl font-bold
              border-b-2 border-primary-DEFAULT bg-transparent
              text-text-primary outline-none
              focus:border-success-DEFAULT transition-colors
            "
            disabled={isSaving}
          />
          {isSaving ? (
            <Loader2
              size={18}
              className="animate-spin text-text-secondary"
              aria-label="Salvando..."
            />
          ) : (
            <>
              <button
                onClick={confirmEdit}
                aria-label="Confirmar edição"
                className="
                  p-1 rounded-full text-success-DEFAULT
                  hover:bg-green-50 transition-colors min-w-[44px] min-h-[44px]
                  flex items-center justify-center
                "
              >
                <Check size={18} />
              </button>
              <button
                onClick={cancelEditing}
                aria-label="Cancelar edição"
                className="
                  p-1 rounded-full text-danger
                  hover:bg-red-50 transition-colors min-w-[44px] min-h-[44px]
                  flex items-center justify-center
                "
              >
                <X size={18} />
              </button>
            </>
          )}
        </span>
      )
    }

    return (
      <button
        onClick={() => startEditing(field)}
        aria-label={`Editar ${label}: ${value}`}
        className="
          inline-flex items-center gap-1 group
          text-primary-dark font-bold
          hover:text-primary-DEFAULT transition-colors
          focus:outline-none focus:ring-2 focus:ring-primary-DEFAULT
          focus:ring-offset-1 rounded-sm
        "
      >
        <span>{value}</span>
        <Pencil
          size={14}
          className="
            opacity-0 group-hover:opacity-100 group-focus:opacity-100
            transition-opacity text-text-secondary
          "
          aria-hidden="true"
        />
      </button>
    )
  }

  return (
    <header className="px-4 pt-6 pb-4">
      <h1 className="text-2xl font-bold text-text-primary leading-tight">
        Olá,{' '}
        {renderName('bride_name', couple.bride_name, 'nome da noiva')}{' '}
        <span className="text-text-secondary font-normal">&amp;</span>{' '}
        {renderName('groom_name', couple.groom_name, 'nome do noivo')}!{' '}
        <span aria-label="anel de noivado" role="img">
          💍
        </span>
      </h1>

      {saveError && (
        <p
          role="alert"
          className="mt-1 text-sm text-danger"
        >
          {saveError}
        </p>
      )}

      <p className="mt-1 text-sm text-text-secondary">
        Bem-vindos ao painel do casamento
      </p>
    </header>
  )
}
