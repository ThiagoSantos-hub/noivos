'use client'

/**
 * VendorList — exibe a lista de fornecedores ou estado vazio
 */

import { VendorCard } from '../VendorCard/VendorCard'
import type { Vendor } from '@/types/vendor.types'

interface IVendorListProps {
  vendors: Vendor[]
  onVendorClick: (vendor: Vendor) => void
}

export function VendorList({ vendors, onVendorClick }: IVendorListProps) {
  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <div className="w-16 h-16 bg-primary-light rounded-full flex items-center justify-center text-primary-DEFAULT mb-4">
          <span className="text-3xl">🤝</span>
        </div>
        <h3 className="text-lg font-bold text-primary-dark mb-2">
          Nenhum fornecedor ainda
        </h3>
        <p className="text-sm text-text-secondary max-w-xs">
          Comece adicionando os fornecedores do seu casamento para controlar os pagamentos.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 px-4 pb-8">
      {vendors.map((vendor) => (
        <VendorCard
          key={vendor.id}
          vendor={vendor}
          onClick={onVendorClick}
        />
      ))}
    </div>
  )
}
