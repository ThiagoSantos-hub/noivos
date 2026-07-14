/**
 * LoginForm - Formulário de login do casal
 * Segue rigorosamente DESIGN-SYSTEM.md
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import {
  validateLoginForm,
  hasLoginValidationErrors,
  LoginValidationErrors,
} from '@/utils/loginValidations'

interface ILoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>
  isLoading?: boolean
  error?: string
}

export function LoginForm({
  onSubmit,
  isLoading = false,
  error: externalError,
}: ILoginFormProps): React.ReactElement {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState<LoginValidationErrors>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Limpar erro do campo quando o usuário começa a digitar
    if (touched[name]) {
      const newErrors = validateLoginForm({
        ...formData,
        [name]: value,
      })
      setErrors(newErrors)
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>): void => {
    const { name } = e.target
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }))
    // Validar o campo ao sair do foco
    const newErrors = validateLoginForm(formData)
    setErrors(newErrors)
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()

    // Validar formulário completo
    const newErrors = validateLoginForm(formData)

    if (hasLoginValidationErrors(newErrors)) {
      setErrors(newErrors)
      // Marcar todos os campos como tocados para mostrar erros
      setTouched({
        email: true,
        password: true,
      })
      return
    }

    try {
      await onSubmit({
        email: formData.email,
        password: formData.password,
      })
    } catch (err) {
      console.error('Erro ao submeter formulário:', err)
    }
  }

  const isFormValid = !hasLoginValidationErrors(errors)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mensagem de erro externa */}
      {externalError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{externalError}</p>
        </div>
      )}

      {/* Campo de Email */}
      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="seu@email.com"
        value={formData.email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.email ? errors.email : undefined}
        disabled={isLoading}
      />

      {/* Campo de Senha */}
      <Input
        label="Senha"
        name="password"
        type="password"
        placeholder="••••••••"
        value={formData.password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={touched.password ? errors.password : undefined}
        disabled={isLoading}
      />

      {/* Botão de Envio */}
      <Button
        type="submit"
        label={isLoading ? 'Entrando...' : 'Entrar'}
        disabled={isLoading || !isFormValid}
        loading={isLoading}
        className="w-full h-12"
      />

      {/* Link para cadastro */}
      <div className="text-center">
        <p className="text-sm" style={{ color: '#64748B' }}>
          Não tem conta?{' '}
          <Link
            href="/cadastro"
            className="font-semibold"
            style={{ color: '#22C55E' }}
          >
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </form>
  )
}
