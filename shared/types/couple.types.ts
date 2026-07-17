/**
 * Tipos relacionados ao casal (couple)
 * Alinhados com o schema real da tabela `couples` no Supabase
 */

export interface CoupleRegistration {
  nome_noiva: string
  nome_noivo: string
  email_noiva: string
  email_noivo: string
  data_casamento: string // ISO 8601 format: YYYY-MM-DD
  orcamento_total: number
  password?: string
}

export interface CoupleRegistrationResponse {
  success: boolean
  couple?: Couple
  error?: string
}

export interface Couple {
  id: string
  // IDs dos usuários no Supabase Auth
  noiva_user_id: string
  noivo_user_id: string
  // Nomes individuais dos noivos
  nome_noiva: string
  nome_noivo: string
  bride_name: string
  groom_name: string
  // Emails
  email_noiva: string
  email_noivo: string
  // Nome composto do casal (ex: "Casamento de Ana e João")
  wedding_name?: string | null
  data_casamento: string | null
  // Data de criação do casal (para calcular progresso do countdown)
  created_at: string
  updated_at: string
  invite_token?: string | null
  // Campos financeiros
  total_budget: number | null
  total_paid?: number | null
  // Convidados
  expected_guests?: number | null
}

export interface CoupleUpdatePayload {
  bride_name?: string
  groom_name?: string
  nome_noiva?: string
  nome_noivo?: string
  wedding_name?: string
  data_casamento?: string
  total_budget?: number
  total_paid?: number
  expected_guests?: number
}
