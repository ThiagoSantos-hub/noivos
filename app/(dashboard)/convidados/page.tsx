'use client'

/**
 * ConvidadosPage — Tela de gestão de convidados
 */

import { useState } from 'react'
import { Plus, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { useGuests } from '@/hooks/useGuests'
import { useCouple } from '@/hooks/useCouple'
import { GuestCard, GuestSummary, GuestForm } from '@/components/features'
import type { Guest, GuestGroup, GuestCreatePayload } from '@/types/guest.types'

const GROUPS_CONFIG: Record<GuestGroup, { label: string; icon: string }> = {
  bride_family: { label: 'Família da Noiva', icon: '👰' },
  groom_family: { label: 'Família do Noivo', icon: '🤵' },
  groomsmen_bridesmaids: { label: 'Padrinhos & Madrinhas', icon: '💍' },
}

export default function ConvidadosPage() {
  const { guests, isLoading, error, addGuest, editGuest, removeGuest } = useGuests()
  const { couple, updateCoupleData } = useCouple()
  
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({})

  const filteredGuests = guests.filter((g) =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const guestsByGroup = filteredGuests.reduce((acc, guest) => {
    if (!acc[guest.group]) acc[guest.group] = []
    acc[guest.group].push(guest)
    return acc
  }, {} as Record<GuestGroup, Guest[]>)

  const toggleGroup = (group: string) => {
    setCollapsedGroups(prev => ({ ...prev, [group]: !prev[group] }))
  }

  const handleAddClick = () => {
    setSelectedGuest(undefined)
    setIsFormOpen(true)
  }

  const handleGuestClick = (guest: Guest) => {
    setSelectedGuest(guest)
    setIsFormOpen(true)
  }

  const handleSubmit = async (data: GuestCreatePayload) => {
    if (selectedGuest) {
      await editGuest(selectedGuest.id, data)
    } else {
      await addGuest(data)
    }
  }

  const handleUpdateExpectedTotal = async (total: number) => {
    if (couple) {
      await updateCoupleData({ expected_guests: total })
    }
  }

  return (
    <div className="flex flex-col min-h-full pb-20">
      <title>Convidados — Noivos</title>

      {/* Header fixo */}
      <header className="sticky top-0 z-40 bg-white px-4 pt-6 pb-4 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-text-primary">
            Convidados 👥
          </h1>
          <button
            onClick={handleAddClick}
            className="
              w-10 h-10 bg-success-DEFAULT text-white rounded-full
              flex items-center justify-center shadow-md
              hover:bg-success-dark active:scale-95 transition-all
            "
            aria-label="Adicionar convidado"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar convidado pelo nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="
              w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200
              rounded-full text-sm outline-none focus:border-primary-DEFAULT
              focus:ring-2 focus:ring-primary-light transition-all
            "
          />
        </div>
      </header>

      {/* Conteúdo */}
      <main className="flex-1 px-4 pt-4">
        {isLoading ? (
          <div className="space-y-4">
            <div className="animate-pulse bg-white h-32 rounded-xl shadow-sm border border-gray-100" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-white h-16 rounded-lg shadow-sm border border-gray-100" />
            ))}
          </div>
        ) : error ? (
          <div className="py-12 text-center">
            <p className="text-danger mb-4">{error}</p>
            <button onClick={() => window.location.reload()} className="btn-primary">
              Tentar novamente
            </button>
          </div>
        ) : (
          <>
            <GuestSummary
              guests={guests}
              expectedTotal={couple?.expected_guests || 0}
              onUpdateExpectedTotal={handleUpdateExpectedTotal}
            />

            <div className="space-y-6">
              {(Object.keys(GROUPS_CONFIG) as GuestGroup[]).map((groupKey) => {
                const groupGuests = guestsByGroup[groupKey] || []
                const isCollapsed = collapsedGroups[groupKey]
                const config = GROUPS_CONFIG[groupKey]

                return (
                  <section key={groupKey} className="space-y-3">
                    <button
                      onClick={() => toggleGroup(groupKey)}
                      className="w-full flex justify-between items-center text-primary-dark"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{config.icon}</span>
                        <h3 className="font-bold text-sm uppercase tracking-wider">
                          {config.label}
                          <span className="ml-2 text-text-secondary font-normal lowercase">
                            ({groupGuests.length})
                          </span>
                        </h3>
                      </div>
                      {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                    </button>

                    {!isCollapsed && (
                      <div className="space-y-2">
                        {groupGuests.length === 0 ? (
                          <p className="text-xs text-text-secondary italic py-2 pl-7">
                            Nenhum convidado neste grupo.
                          </p>
                        ) : (
                          groupGuests.map((guest) => (
                            <GuestCard
                              key={guest.id}
                              guest={guest}
                              onClick={handleGuestClick}
                            />
                          ))
                        )}
                      </div>
                    )}
                  </section>
                )
              })}
            </div>
          </>
        )}
      </main>

      {/* Formulário Modal */}
      {isFormOpen && (
        <GuestForm
          guest={selectedGuest}
          onSubmit={handleSubmit}
          onDelete={selectedGuest ? (id) => removeGuest(id) : undefined}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  )
}
