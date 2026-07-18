/**
 * LoginForm - Formulário de login do casal
 */

'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginValidations } from '@/utils'
import type { LoginValidationErrors } from '@/utils/loginValidations'

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
    if (touched[name]) {
      const newErrors = loginValidations.validateLoginForm({
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
    const newErrors = loginValidations.validateLoginForm(formData)
    setErrors(newErrors)
  }

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault()

    const newErrors = loginValidations.validateLoginForm(formData)

    if (loginValidations.hasLoginValidationErrors(newErrors)) {
      setErrors(newErrors)
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

  const isFormValid = !loginValidations.hasLoginValidationErrors(errors)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {externalError && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{externalError}</p>
        </div>
      )}

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
        showPasswordToggle
      />

      <Button
        type="submit"
        label={isLoading ? 'Entrando...' : 'Entrar'}
        disabled={isLoading || !isFormValid}
        loading={isLoading}
        className="w-full h-12"
      />

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
