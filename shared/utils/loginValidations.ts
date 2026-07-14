/**
 * Validações para o formulário de login
 */

export interface LoginValidationErrors {
  email?: string
  password?: string
}

/**
 * Valida um endereço de email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Valida a senha (mínimo 6 caracteres)
 */
export function isValidPassword(password: string): boolean {
  return password.length >= 6
}

/**
 * Valida o formulário de login
 */
export function validateLoginForm(data: {
  email: string
  password: string
}): LoginValidationErrors {
  const errors: LoginValidationErrors = {}

  if (!data.email?.trim()) {
    errors.email = 'Email é obrigatório'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Email inválido'
  }

  if (!data.password?.trim()) {
    errors.password = 'Senha é obrigatória'
  } else if (!isValidPassword(data.password)) {
    errors.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  return errors
}

/**
 * Verifica se há erros de validação
 */
export function hasValidationErrors(errors: LoginValidationErrors): boolean {
  return Object.values(errors).some((error) => error !== undefined)
}
