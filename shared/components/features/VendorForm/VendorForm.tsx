'use client'

/**
 * VendorForm — formulário para criar ou editar um fornecedor
 */

import { useState } from 'react'
import { X, Trash2, Loader2 } from 'lucide-react'
import { Button, Input } from '@/components/ui'
import type { Vendor, VendorCategory, VendorCreatePayload } from '@/types/vendor.types'

interface IVendorFormProps {
  vendor?: Vendor
  onSubmit: (data: VendorCreatePayload) => Promise<void>
  onDelete?: (id: string) => Promise<void>
  onClose: () => void
}

const CATEGORIES: { value: VendorCategory; label: string }[] = [
  { value: 'venue', label: 'Local da Festa' },
  { value: 'catering', label: 'Buffet / Comida' },
  { value: 'photography', label: 'Fotografia / Vídeo' },
  { value: 'music', label: 'Música / DJ / Banda' },
  { value: 'flowers', label: 'Flores / Buquê' },
  { value: 'decoration', label: 'Decoração' },
  { value: 'cake', label: 'Bolo / Doces' },
  { value: 'car', label: 'Carro / Transporte' },
  { value: 'ceremony_venue', label: 'Local da Cerimônia' },
  { value: 'other', label: 'Outro' },
]

export function VendorForm({ vendor, onSubmit, onDelete, onClose }: IVendorFormProps) {
  const [name, setName] = useState(vendor?.name || '')
  const [category, setCategory] = useState<VendorCategory>(vendor?.category || 'other')
  const [price, setPrice] = useState(vendor?.price?.toString() || '0')
  const [paidAmount, setPaidAmount] = useState(vendor?.paid_amount?.toString() || '0')
  const [phone, setPhone] = useState(vendor?.phone || '')
  const [notes, setNotes] = useState(vendor?.notes || '')
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      setError('O nome do fornecedor é obrigatório.')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      await onSubmit({
        name,
        category,
        price: parseFloat(price) || 0,
        paid_amount: parseFloat(paidAmount) || 0,
        phone,
        notes,
      })
      onClose()
    } catch (err) {
      setError('Erro ao salvar fornecedor. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!vendor || !onDelete) return
    if (!confirm(`Tem certeza que deseja excluir o fornecedor ${vendor.name}?`)) return

    try {
      setIsDeleting(true)
      await onDelete(vendor.id)
      onClose()
    } catch (err) {
      setError('Erro ao excluir fornecedor.')
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
            {vendor ? 'Editar Fornecedor' : 'Novo Fornecedor'}
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
            label="Nome do fornecedor"
            placeholder="Ex: Buffet Delícias"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as VendorCategory)}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light outline-none transition-all bg-white"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valor Total (R$)"
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Valor Pago (R$)"
              type="number"
              placeholder="0.00"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
            />
          </div>

          <Input
            label="Telefone / Contato"
            placeholder="(00) 00000-0000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-text-primary">Observações</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Detalhes do contrato, parcelas, etc."
              rows={3}
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:border-primary-DEFAULT focus:ring-2 focus:ring-primary-light outline-none transition-all"
            />
          </div>

          <div className="pt-4 flex flex-col gap-3">
            <Button
              label={vendor ? 'Salvar Alterações' : 'Cadastrar Fornecedor'}
              type="submit"
              loading={isSubmitting}
              disabled={isDeleting}
              className="w-full"
            />
            
            {vendor && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting || isDeleting}
                className="flex items-center justify-center gap-2 text-danger text-sm font-semibold py-2 hover:bg-red-50 rounded-md transition-colors"
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                Excluir Fornecedor
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
