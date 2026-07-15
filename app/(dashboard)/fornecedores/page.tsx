'use client'

/**
 * FornecedoresPage — Tela de gestão de fornecedores
 */

import { useState } from 'react'
import { Plus, Search, Filter } from 'lucide-react'
import { useVendors } from '@/hooks/useVendors'
import { VendorList, VendorForm } from '@/components/features'
import type { Vendor, VendorCreatePayload } from '@/types/vendor.types'

export default function FornecedoresPage() {
  const { vendors, isLoading, error, addVendor, editVendor, removeVendor } = useVendors()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredVendors = vendors.filter((v) =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddClick = () => {
    setSelectedVendor(undefined)
    setIsFormOpen(true)
  }

  const handleVendorClick = (vendor: Vendor) => {
    setSelectedVendor(vendor)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: VendorCreatePayload) => {
    if (selectedVendor) {
      await editVendor(selectedVendor.id, data)
    } else {
      await addVendor(data)
    }
  }

  const handleDelete = async (id: string) => {
    await removeVendor(id)
  }

  return (
    <div className="flex flex-col min-h-full">
      <title>Fornecedores — Noivos</title>

      {/* Header fixo */}
      <header className="sticky top-0 z-40 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">
            Fornecedores 🤝
          </h1>
          <button
            onClick={handleAddClick}
            className="
              w-10 h-10 bg-success-DEFAULT text-white rounded-full
              flex items-center justify-center shadow-md
              hover:bg-success-dark active:scale-95 transition-all
            "
            aria-label="Adicionar fornecedor"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Busca e Filtro */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
            />
            <input
              type="text"
              placeholder="Buscar fornecedor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200
                rounded-full text-sm outline-none focus:border-primary-DEFAULT
                focus:ring-2 focus:ring-primary-light transition-all
              "
            />
          </div>
          <button
            className="
              p-2 bg-gray-50 border border-gray-200 rounded-full
              text-text-secondary hover:text-primary-DEFAULT transition-colors
            "
            aria-label="Filtrar fornecedores"
          >
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 pt-4">
        {isLoading ? (
          <div className="px-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white h-32 rounded-lg shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="px-6 py-12 text-center">
            <p className="text-danger mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Tentar novamente
            </button>
          </div>
        ) : (
          <VendorList
            vendors={filteredVendors}
            onVendorClick={handleVendorClick}
          />
        )}
      </main>

      {/* Formulário Modal */}
      {isFormOpen && (
        <VendorForm
          vendor={selectedVendor}
          onSubmit={handleSubmit}
          onDelete={selectedVendor ? handleDelete : undefined}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
