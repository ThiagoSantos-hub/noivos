/**
 * Button - Componente de botão reutilizável
 * Segue DESIGN-SYSTEM.md com cores e estilos específicos
 */

import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  icon?: React.ReactNode
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  disabled,
  className = '',
  ...props
}: ButtonProps) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 flex items-center justify-center gap-2'

  const variantClasses = {
    primary: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300',
    secondary: 'bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }

  const finalClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button
      disabled={disabled || loading}
      className={finalClasses}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {icon && !loading && icon}
      {label}
    </button>
  )
}
