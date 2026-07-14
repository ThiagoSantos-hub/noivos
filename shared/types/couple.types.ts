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
  wedding_date: string | null
  wedding_name: string
  invite_token: string
  created_at: string
  updated_at: string
}
