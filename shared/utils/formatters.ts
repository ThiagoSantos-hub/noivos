/**
 * formatters — funções utilitárias de formatação
 * Usadas nos componentes do dashboard
 */

/**
 * Formata um valor numérico como moeda brasileira (BRL)
 * Exemplo: 3200 → "R$ 3.200,00"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  }).format(value)
}

/**
 * Calcula a diferença em meses e dias entre hoje e uma data futura
 * Retorna objeto com meses, dias e totalDays
 */
export function getDaysUntil(targetDate: string): {
  months: number
  days: number
  totalDays: number
  isPast: boolean
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const target = new Date(targetDate)
  target.setHours(0, 0, 0, 0)

  const diffMs = target.getTime() - today.getTime()
  const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (totalDays <= 0) {
    return { months: 0, days: 0, totalDays, isPast: true }
  }

  const months = Math.floor(totalDays / 30)
  const remainingDays = totalDays % 30

  return { months, days: remainingDays, totalDays, isPast: false }
}

/**
 * Calcula a porcentagem de progresso entre a data de criação e a data do casamento
 * Retorna um número entre 0 e 100
 */
export function getCountdownProgress(createdAt: string, weddingDate: string): number {
  const start = new Date(createdAt).getTime()
  const end = new Date(weddingDate).getTime()
  const now = Date.now()

  if (now >= end) return 100
  if (now <= start) return 0

  const total = end - start
  const elapsed = now - start

  return Math.min(100, Math.round((elapsed / total) * 100))
}

/**
 * Retorna o nível de alerta baseado nos meses restantes
 */
export function getCountdownAlertLevel(totalDays: number): 'green' | 'yellow' | 'red' {
  const months = totalDays / 30
  if (months > 6) return 'green'
  if (months >= 2) return 'yellow'
  return 'red'
}

/**
 * Retorna o nível de alerta financeiro baseado na porcentagem comprometida
 */
export function getFinancialAlertLevel(
  totalPaid: number,
  totalBudget: number
): 'green' | 'yellow' | 'red' {
  if (totalBudget <= 0) return 'green'
  const percentage = (totalPaid / totalBudget) * 100
  if (percentage < 50) return 'green'
  if (percentage <= 80) return 'yellow'
  return 'red'
}
