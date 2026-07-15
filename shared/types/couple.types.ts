/**
 * Tipos relacionados ao casal (couple)
 */

export interface CoupleRegistration {
  nome_noiva: string
  nome_noivo: string
  email_noiva: string
  email_noivo: string
  data_casamento: string // ISO 8601 format: YYYY-MM-DD
  orcamento_total: number
}

export interface CoupleRegistrationResponse {
  success: boolean
  access_token: string
  refresh_token: string
}

export interface Couple {
  id: string
  partner_1_id: string
  partner_2_id: string | null
  // Nomes individuais dos noivos
  bride_name: string
  groom_name: string
  // Nome composto do casal (ex: "Casamento de Ana e João")
  wedding_name: string
  wedding_date: string | null
  // Data de criação do casal (para calcular progresso do countdown)
  created_at: string
  updated_at: string
  invite_token: string
  // Campos financeiros
  total_budget: number | null
  total_paid: number | null
  // Convidados
  expected_guests: number | null
}

export interface CoupleUpdatePayload {
  bride_name?: string
  groom_name?: string
  wedding_name?: string
  wedding_date?: string
  total_budget?: number
  total_paid?: number
  expected_guests?: number
}
