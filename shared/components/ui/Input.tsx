/**
 * Input - Componente de campo de entrada de texto
 * Segue DESIGN-SYSTEM.md com bordas arredondadas e estilos específicos
 */

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

export function Input({
  label,
  error,
  helperText,
  className = '',
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium mb-2" style={{ color: '#1E293B' }}>
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all ${className}`}
        style={{
          backgroundColor: '#FFFFFF',
        }}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-xs" style={{ color: '#64748B' }}>
          {helperText}
        </p>
      )}
    </div>
  )
}
