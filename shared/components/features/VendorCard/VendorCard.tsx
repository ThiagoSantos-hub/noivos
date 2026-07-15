'use client'

/**
 * VendorCard — exibe informações de um fornecedor
 * Inclui barra de progresso do pagamento e valores (total, pago, restante)
 */

import { useMemo } from 'react'
import { Phone, Info } from 'lucide-react'
import { formatCurrency } from '@/utils/formatters'
import type { Vendor } from '@/types/vendor.types'

interface IVendorCardProps {
  vendor: Vendor
  onClick: (vendor: Vendor) => void
}

export function VendorCard({ vendor, onClick }: IVendorCardProps) {
  const total = vendor.price || 0
  const paid = vendor.paid_amount || 0
  const remaining = Math.max(0, total - paid)

  const progress = useMemo(() => {
    if (total <= 0) return 0
    return Math.min(100, Math.round((paid / total) * 100))
  }, [total, paid])

  return (
    <article
      onClick={() => onClick(vendor)}
      className="
        bg-white rounded-lg shadow-sm border border-gray-100 p-4
        hover:shadow-md transition-shadow cursor-pointer
        active:scale-[0.98] transition-transform
      "
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-primary-dark leading-tight">
            {vendor.name}
          </h3>
          <span className="text-xs text-text-secondary uppercase tracking-wider font-medium">
            {vendor.category}
          </span>
        </div>
        {vendor.phone && (
          <a
            href={`tel:${vendor.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="p-2 text-primary-DEFAULT hover:bg-primary-light rounded-full transition-colors"
            aria-label={`Ligar para ${vendor.name}`}
          >
            <Phone size={18} />
          </a>
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Total contratado:</span>
          <span className="font-semibold text-text-primary">{formatCurrency(total)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Já pago:</span>
          <span className="font-semibold text-success-dark">{formatCurrency(paid)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Restante:</span>
          <span className="font-semibold text-danger">{formatCurrency(remaining)}</span>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-text-secondary font-medium">
          <span>Progresso do pagamento</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-success-DEFAULT rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {vendor.notes && (
        <div className="mt-3 flex items-start gap-1 text-xs text-text-secondary italic">
          <Info size={12} className="mt-0.5 flex-shrink-0" />
          <p className="line-clamp-1">{vendor.notes}</p>
        </div>
      )}
    </article>
  )
}
