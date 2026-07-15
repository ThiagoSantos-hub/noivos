/**
 * Tipos relacionados aos convidados (guests)
 */

export type GuestStatus = 'confirmed' | 'pending' | 'declined'

export type GuestGroup = 'bride_family' | 'groom_family' | 'groomsmen_bridesmaids'

export interface Guest {
  id: string
  couple_id: string
  name: string
  phone: string
  status: GuestStatus
  group: GuestGroup
  table_number: number | null
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface GuestCreatePayload {
  name: string
  phone: string
  status: GuestStatus
  group: GuestGroup
  table_number?: number | null
  notes?: string | null
}

export interface GuestUpdatePayload {
  name?: string
  phone?: string
  status?: GuestStatus
  group?: GuestGroup
  table_number?: number | null
  notes?: string | null
}
