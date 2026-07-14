/**
 * Validações para o formulário de onboarding do casal
 * Segue RULES.md: código em inglês, comentários em português
 */

export interface ValidationErrors {
  nome_noiva?: string
  nome_noivo?: string
  email_noiva?: string
  email_noivo?: string
  data_casamento?: string
  orcamento_total?: string
  emails_match?: string
  password?: string
  confirm_password?: string
}

/**
 * Valida um endereço de email usando regex padrão
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida se uma data é futura (comparada com hoje)
 */
export function isFutureDate(dateString: string): boolean {
  const date = new Date(dateString)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return date > today
}

/**
 * Valida se um valor é um número positivo
 */
export function isPositiveNumber(value: number | string): boolean {
  const num = typeof value === 'string' ? parseFloat(value) : value
  return !isNaN(num) && num > 0
}

/**
 * Valida se dois emails são distintos (case-insensitive)
 */
export function areEmailsDistinct(email1: string, email2: string): boolean {
  return email1.toLowerCase() !== email2.toLowerCase()
}

/**
 * Valida o formulário completo de onboarding
 */
export function validateOnboardingForm(data: {
  nome_noiva: string
  nome_noivo: string
  email_noiva: string
  email_noivo: string
  data_casamento: string
  orcamento_total: string | number
  password?: string
  confirm_password?: string
}): ValidationErrors {
  const errors: ValidationErrors = {}

  // Validar nomes
  if (!data.nome_noiva?.trim()) {
    errors.nome_noiva = 'Nome da noiva é obrigatório'
  }

  if (!data.nome_noivo?.trim()) {
    errors.nome_noivo = 'Nome do noivo é obrigatório'
  }

  // Validar emails
  if (!data.email_noiva?.trim()) {
    errors.email_noiva = 'Email da noiva é obrigatório'
  } else if (!isValidEmail(data.email_noiva)) {
    errors.email_noiva = 'Email da noiva inválido'
  }

  if (!data.email_noivo?.trim()) {
    errors.email_noivo = 'Email do noivo é obrigatório'
  } else if (!isValidEmail(data.email_noivo)) {
    errors.email_noivo = 'Email do noivo inválido'
  }

  // Validar se emails são distintos
  if (
    data.email_noiva?.trim() &&
    data.email_noivo?.trim() &&
    !areEmailsDistinct(data.email_noiva, data.email_noivo)
  ) {
    errors.emails_match = 'Os emails da noiva e do noivo devem ser diferentes'
  }

  // Validar data do casamento
  if (!data.data_casamento?.trim()) {
    errors.data_casamento = 'Data do casamento é obrigatória'
  } else if (!isFutureDate(data.data_casamento)) {
    errors.data_casamento = 'Data do casamento deve ser no futuro'
  }

  // Validar orçamento
  if (!data.orcamento_total) {
    errors.orcamento_total = 'Orçamento total é obrigatório'
  } else if (!isPositiveNumber(data.orcamento_total)) {
    errors.orcamento_total = 'Orçamento deve ser um valor positivo'
  }

  // Validar senha
  if (data.password !== undefined) {
    if (!data.password) {
      errors.password = 'Senha do casal é obrigatória'
    } else if (data.password.length < 6) {
      errors.password = 'A senha deve ter no mínimo 6 caracteres'
    }
  }

  // Validar confirmação de senha
  if (data.confirm_password !== undefined) {
    if (!data.confirm_password) {
      errors.confirm_password = 'Confirmação de senha é obrigatória'
    } else if (data.confirm_password !== data.password) {
      errors.confirm_password = 'As senhas não conferem'
    }
  }

  return errors
}

/**
 * Verifica se há erros de validação
 */
export function hasValidationErrors(errors: ValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined)
}
