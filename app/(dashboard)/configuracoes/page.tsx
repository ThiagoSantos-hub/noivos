'use client'

/**
 * Página de Configurações — nomes do casal + alteração de senha com olhinho
 */

import { useState, useEffect } from 'react'
import { useCouple } from '@/hooks/useCouple'
import { supabase } from '@/services/supabase'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function ConfiguracoesPage() {
  const { couple, isLoading, updateCoupleData } = useCouple()

  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [isSavingNames, setIsSavingNames] = useState(false)
  const [namesMessage, setNamesMessage] = useState('')

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  useEffect(() => {
    if (couple) {
      setBrideName(couple.bride_name || '')
      setGroomName(couple.groom_name || '')
    }
  }, [couple])

  const handleSaveNames = async () => {
    if (!couple) return
    setIsSavingNames(true)
    setNamesMessage('')

    try {
      await updateCoupleData({
        bride_name: brideName.trim(),
        groom_name: groomName.trim(),
      })
      setNamesMessage('Nomes atualizados com sucesso!')
    } catch {
      setNamesMessage('Erro ao salvar. Tente novamente.')
    } finally {
      setIsSavingNames(false)
    }
  }

  const handleChangePassword = async () => {
    setPasswordMessage('')

    if (newPassword.length < 6) {
      setPasswordMessage('A senha precisa ter no mínimo 6 caracteres.')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage('As senhas não coincidem.')
      return
    }

    setIsSavingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setPasswordMessage('Senha alterada com sucesso!')
      setNewPassword('')
      setConfirmPassword('')
    } catch {
      setPasswordMessage('Erro ao alterar senha. Tente novamente.')
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (isLoading) return <div className="p-4">Carregando...</div>
  if (!couple) return <div className="p-4">Complete o cadastro primeiro.</div>

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mais" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      {/* Nomes do casal */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-5">
        <h2 className="font-semibold text-base mb-4">Nome do Casal</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Nome da Noiva</label>
            <input
              type="text"
              value={brideName}
              onChange={(e) => setBrideName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Nome do Noivo</label>
            <input
              type="text"
              value={groomName}
              onChange={(e) => setGroomName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500"
            />
          </div>

          <button
            onClick={handleSaveNames}
            disabled={isSavingNames}
            className="w-full bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md disabled:opacity-50"
          >
            {isSavingNames ? 'Salvando...' : 'Salvar Nomes'}
          </button>

          {namesMessage && (
            <p className={`text-sm text-center ${namesMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {namesMessage}
            </p>
          )}
        </div>
      </div>

      {/* Alterar senha */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
        <h2 className="font-semibold text-base mb-4">Alterar Senha</h2>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Nova senha</label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">Confirmar nova senha</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repita a senha"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 pr-10 text-sm outline-none focus:border-green-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleChangePassword}
            disabled={isSavingPassword}
            className="w-full bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm shadow-md disabled:opacity-50"
          >
            {isSavingPassword ? 'Alterando...' : 'Alterar Senha'}
          </button>

          {passwordMessage && (
            <p className={`text-sm text-center ${passwordMessage.includes('sucesso') ? 'text-green-600' : 'text-red-600'}`}>
              {passwordMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
