/**
 * OnboardingForm - Formulário de cadastro do casal
 * Segue rigorosamente DESIGN-SYSTEM.md
 */

'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import {
  validateOnboardingForm,
  hasValidationErrors,
  ValidationErrors,
} from '@/utils/validations'

interface OnboardingFormProps {
  onSubmit: (data: {
    nome_noiva: string
    nome_noivo: string
    email_noiva: string
    email_noivo: string
    data_casamento: string
    orcamento_total: number
    password?: string
  }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function OnboardingForm({
  onSubmit,
  isLoading = false,
  error: externalError,
}: OnboardingFormProps) {
  const [formData, setFormData] = useState({
    nome_noiva: '',
    nome_noivo: '',
    email_noiva: '',
    email_noivo: '',
    data_casamento: '',
    orcamento_total: '',
    password: '',
    confirm_password: '',
  })

  const [errors, setErrors] = useState<ValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [successMessage, setSuccessMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (touched[name]) {
      const newErrors = validateOnboardingForm({
        ...formData,
        [name]: value,
      })
      setErrors(newErrors)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    // Validar o campo ao sair do foco
    const newErrors = validateOnboardingForm(formData)
    setErrors(newErrors)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validar formulário completo
    const newErrors = validateOnboardingForm({
      ...formData,
      orcamento_total: formData.orcamento_total || '0',
    })

    if (hasValidationErrors(newErrors)) {
      setErrors(newErrors)
      // Marcar todos os campos como tocados para mostrar erros
      setTouched({
        nome_noiva: true,
        nome_noivo: true,
        email_noiva: true,
        email_noivo: true,
        data_casamento: true,
        orcamento_total: true,
        password: true,
        confirm_password: true,
      })
      return
    }

    try {
      setSuccessMessage('')
      await onSubmit({
        nome_noiva: formData.nome_noiva,
        nome_noivo: formData.nome_noivo,
        email_noiva: formData.email_noiva,
        email_noivo: formData.email_noivo,
        data_casamento: formData.data_casamento,
        orcamento_total: parseFloat(formData.orcamento_total),
        password: formData.password,
      })
      setSuccessMessage('Cadastro realizado com sucesso!')
    } catch (err) {
      console.error('Erro ao submeter formulário:', err)
    }
  }

  const isFormValid = !hasValidationErrors(errors)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensagem de erro externa */}
      {externalError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{externalError}</p>
        </div>
      )}

      {/* Mensagem de sucesso */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700">{successMessage}</p>
        </div>
      )}

      {/* Seção: Dados da Noiva */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>
          👰 Dados da Noiva
        </h3>

        <Input
          label="Nome da Noiva"
          name="nome_noiva"
          type="text"
          placeholder="Ex: Maria Silva"
          value={formData.nome_noiva}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nome_noiva ? errors.nome_noiva : undefined}
          disabled={isLoading}
        />

        <Input
          label="Email da Noiva"
          name="email_noiva"
          type="email"
          placeholder="maria@example.com"
          value={formData.email_noiva}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email_noiva ? errors.email_noiva : undefined}
          helperText={touched.email_noiva && !errors.email_noiva ? 'Email válido' : undefined}
          disabled={isLoading}
        />
      </div>

      {/* Seção: Dados do Noivo */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>
          🤵 Dados do Noivo
        </h3>

        <Input
          label="Nome do Noivo"
          name="nome_noivo"
          type="text"
          placeholder="Ex: João Santos"
          value={formData.nome_noivo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.nome_noivo ? errors.nome_noivo : undefined}
          disabled={isLoading}
        />

        <Input
          label="Email do Noivo"
          name="email_noivo"
          type="email"
          placeholder="joao@example.com"
          value={formData.email_noivo}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.email_noivo ? errors.email_noivo : undefined}
          helperText={touched.email_noivo && !errors.email_noivo ? 'Email válido' : undefined}
          disabled={isLoading}
        />

        {/* Validação de emails distintos */}
        {errors.emails_match && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-700">{errors.emails_match}</p>
          </div>
        )}
      </div>

      {/* Seção: Detalhes do Casamento */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>
          💍 Detalhes do Casamento
        </h3>

        <Input
          label="Data do Casamento"
          name="data_casamento"
          type="date"
          value={formData.data_casamento}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.data_casamento ? errors.data_casamento : undefined}
          helperText={touched.data_casamento && !errors.data_casamento && formData.data_casamento ? 'Data válida' : undefined}
          disabled={isLoading}
        />

        <Input
          label="Orçamento Total Planejado (R$)"
          name="orcamento_total"
          type="number"
          placeholder="Ex: 50000"
          value={formData.orcamento_total}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.orcamento_total ? errors.orcamento_total : undefined}
          helperText={touched.orcamento_total && !errors.orcamento_total && formData.orcamento_total ? 'Orçamento válido' : undefined}
          disabled={isLoading}
          step="0.01"
          min="0"
        />
      </div>

      {/* Seção: Senha do Casal */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold" style={{ color: '#1E293B' }}>
          🔐 Segurança do Casal
        </h3>

        <Input
          label="Senha do Casal"
          name="password"
          type="password"
          placeholder="Crie uma senha para o casal"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.password ? errors.password : undefined}
          disabled={isLoading}
        />

        <Input
          label="Confirmar Senha"
          name="confirm_password"
          type="password"
          placeholder="Repita a senha"
          value={formData.confirm_password}
          onChange={handleChange}
          onBlur={handleBlur}
          error={touched.confirm_password ? errors.confirm_password : undefined}
          disabled={isLoading}
        />
      </div>

      {/* Botão de Envio */}
      <Button
        type="submit"
        label={isLoading ? 'Criando conta...' : 'Criar Conta do Casal'}
        disabled={isLoading || !isFormValid}
        loading={isLoading}
        className="w-full h-12"
      />

      {/* Texto de ajuda */}
      <p className="text-center text-xs" style={{ color: '#64748B' }}>
        Ao clicar em "Criar Conta", você concorda com nossos termos de serviço.
      </p>
    </form>
  )
}
