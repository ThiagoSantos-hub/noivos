'use client'

/**
 * Página de Convidados - limpa
 */

import { useState, useEffect } from 'react'
import { useCouple } from '@/hooks/useCouple'
import { supabase } from '@/services/supabase'
import { Pencil, Check, X, UserPlus } from 'lucide-react'

const GROUP_LABELS: Record<string, string> = {
  familia_noiva: 'Família da Noiva',
  familia_noivo: 'Família do Noivo',
  convidado_noiva: 'Convidados da Noiva',
  convidado_noivo: 'Convidados do Noivo',
  padrinho: 'Padrinhos do Noivo',
  madrinha: 'Madrinhas da Noiva',
  contratados: 'Contratados (Fotógrafo, Cerimonialista, etc.)',
}

const GROUP_ICONS: Record<string, string> = {
  familia_noiva: '👰‍♀️',
  familia_noivo: '🤵‍♂️',
  convidado_noiva: '👰‍♀️',
  convidado_noivo: '🤵‍♂️',
  padrinho: '🤵‍♂️',
  madrinha: '👰‍♀️',
  contratados: '💼',
}

export default function ConvidadosPage() {
  const { couple, isLoading: coupleLoading, updateCoupleData } = useCouple()
  const [guests, setGuests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState('')
  const [newGuestName, setNewGuestName] = useState('')
  const [editingTotal, setEditingTotal] = useState(false)
  const [expectedTotal, setExpectedTotal] = useState('')

  const loadGuests = async () => {
    if (!couple?.id) return
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: true })

    if (!error && data) setGuests(data)
    setLoading(false)
  }

  useEffect(() => {
    if (couple?.id) {
      loadGuests()
      setExpectedTotal((couple.expected_guests ?? 0).toString())
    }
  }, [couple?.id])

  if (coupleLoading || loading || !couple) return <div className="p-4">Carregando...</div>

  const confirmedCount = guests.filter(g => g.confirmed).length
  const pendingCount = guests.length - confirmedCount
  const expectedGuests = couple.expected_guests ?? 0

  const groupedGuests: Record<string, any[]> = {
    familia_noiva: guests.filter(g => g.group_type === 'familia_noiva'),
    familia_noivo: guests.filter(g => g.group_type === 'familia_noivo'),
    convidado_noiva: guests.filter(g => g.group_type === 'convidado_noiva'),
    convidado_noivo: guests.filter(g => g.group_type === 'convidado_noivo'),
    padrinho: guests.filter(g => g.group_type === 'padrinho'),
    madrinha: guests.filter(g => g.group_type === 'madrinha'),
    contratados: guests.filter(g => g.group_type === 'contratados'),
  }

  const saveExpectedTotal = async () => {
    const newTotal = parseInt(expectedTotal)
    if (isNaN(newTotal) || newTotal < 0) return
    await updateCoupleData({ expected_guests: newTotal })
    setEditingTotal(false)
  }

  const addGuest = async () => {
    if (!newGuestName.trim() || !selectedGroup) return

    const { error } = await supabase.from('guests').insert({
      couple_id: couple.id,
      name: newGuestName.trim(),
      group_type: selectedGroup,
      confirmed: false,
    })

    if (!error) {
      setNewGuestName('')
      setShowForm(false)
      setSelectedGroup('')
      await loadGuests()
    } else {
      alert('Erro ao adicionar. Verifique se o SQL de permissão foi rodado.')
    }
  }

  const toggleConfirm = async (guest: any) => {
    const { error } = await supabase
      .from('guests')
      .update({ confirmed: !guest.confirmed })
      .eq('id', guest.id)

    if (!error) await loadGuests()
  }

  const deleteGuest = async (id: string) => {
    if (!confirm('Remover este convidado?')) return
    await supabase.from('guests').delete().eq('id', id)
    await loadGuests()
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-2xl font-bold">Convidados</h1>
      </div>

      {/* Total de Convidados - Editável */}
      <div className="bg-white p-5 rounded-2xl shadow-2xl border mb-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-text-secondary">TOTAL DE CONVIDADOS</p>
            {!editingTotal ? (
              <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{confirmedCount} / {expectedGuests}</p>
                <button onClick={() => setEditingTotal(true)} className="text-gray-400 hover:text-gray-600">
                  <Pencil size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2 mt-1">
                <input
                  type="number"
                  value={expectedTotal}
                  onChange={(e) => setExpectedTotal(e.target.value)}
                  className="w-24 border rounded-lg px-2 py-1 text-xl font-bold"
                  autoFocus
                />
                <button onClick={saveExpectedTotal} className="p-2 text-green-600"><Check size={20} /></button>
                <button onClick={() => setEditingTotal(false)} className="p-2 text-red-600"><X size={20} /></button>
              </div>
            )}
            <p className="text-xs text-text-secondary mt-1">
              {confirmedCount} confirmados de {expectedGuests} esperados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 text-center">
          <div>
            <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
            <p className="text-xs text-text-secondary">CONFIRMADOS</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            <p className="text-xs text-text-secondary">PENDENTES</p>
          </div>
        </div>
      </div>

      {/* Grupos */}
      {Object.entries(GROUP_LABELS).map(([key, label]) => {
        const groupGuests = groupedGuests[key] || []

        return (
          <div key={key} className="bg-white rounded-2xl shadow border mb-4 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">{GROUP_ICONS[key]}</span>
                <span className="font-semibold">{label}</span>
                <span className="text-sm text-text-secondary">({groupGuests.length})</span>
              </div>
              <button
                onClick={() => {
                  setSelectedGroup(key)
                  setShowForm(true)
                }}
                className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm"
              >
                <UserPlus size={16} /> Adicionar
              </button>
            </div>

            <div className="divide-y">
              {groupGuests.length === 0 ? (
                <div className="px-4 py-4 text-sm text-text-secondary">Nenhum convidado neste grupo.</div>
              ) : (
                groupGuests.map((guest) => (
                  <div key={guest.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                    <span className={guest.confirmed ? 'line-through text-gray-400' : ''}>{guest.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleConfirm(guest)}
                        className={`px-3 py-1 text-xs rounded-full font-medium ${guest.confirmed 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'}`}
                      >
                        {guest.confirmed ? 'Confirmado' : 'Confirmar'}
                      </button>
                      <button onClick={() => deleteGuest(guest.id)} className="text-red-500 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}

      {/* Modal Centralizado */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">Adicionar Convidado</h3>
              <button onClick={() => { setShowForm(false); setSelectedGroup('') }}>
                <X size={22} />
              </button>
            </div>

            <input
              type="text"
              placeholder="Nome do convidado"
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 mb-4 text-lg"
              autoFocus
            />

            <div className="flex gap-3">
              <button
                onClick={addGuest}
                disabled={!newGuestName.trim()}
                className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
              >
                Adicionar
              </button>
              <button
                onClick={() => { setShowForm(false); setSelectedGroup('') }}
                className="px-6 py-3 bg-gray-200 rounded-xl font-medium"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
