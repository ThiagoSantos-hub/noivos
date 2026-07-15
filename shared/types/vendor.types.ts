/**
 * Tipos relacionados aos fornecedores (vendors)
 */

export type VendorCategory =
  | 'venue'
  | 'catering'
  | 'photography'
  | 'music'
  | 'flowers'
  | 'decoration'
  | 'cake'
  | 'car'
  | 'ceremony_venue'
  | 'other'

export type VendorStatus = 'prospect' | 'negotiating' | 'hired' | 'cancelled'

export interface Vendor {
  id: string
  couple_id: string
  name: string
  category: VendorCategory
  contact_name: string | null
  phone: string | null
  email: string | null
  price: number | null // Valor total contratado
  paid_amount: number | null // Valor já pago
  status: VendorStatus
  notes: string | null
  deleted_at: string | null
  created_at: string
  updated_at: string
}

export interface VendorCreatePayload {
  name: string
  category: VendorCategory
  price: number
  paid_amount: number
  phone?: string | null
  notes?: string | null
  status?: VendorStatus
}

export interface VendorUpdatePayload {
  name?: string
  category?: VendorCategory
  price?: number
  paid_amount?: number
  phone?: string | null
  notes?: string | null
  status?: VendorStatus
}
