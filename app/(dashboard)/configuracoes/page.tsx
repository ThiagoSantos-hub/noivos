'use client'

/**
 * Página de Configurações do Casal
 */

import { useState } from 'react'
import { useCouple } from '@/hooks/useCouple'

export default function ConfiguracoesPage() {
  const { couple, isLoading, error, updateCoupleData } = useCouple()

  const [brideName, setBrideName] = useState('')
  const [groomName, setGroomName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  // Carrega os nomes atuais
  if (couple && brideName === '' && groomName === '') {
    setBrideName(couple.bride_name)
    setGroomName(couple.groom_name)
  }

  const handleSave = async () => {
    if (!couple) return

    setIsSaving(true)
    setMessage('')

    try {
      await updateCoupleData({
        bride_name: brideName.trim(),
        groom_name: groomName.trim(),
      })
      setMessage('Dados salvos com sucesso!')
    } catch (err) {
      setMessage('Erro ao salvar. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="p-4">Carregando...</div>
  if (error) return <div className="p-4 text-red-500">Erro: {error}</div>
  if (!couple) return <div className="p-4">Complete o cadastro primeiro.</div>

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Configurações do Casal</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nome da Noiva</label>
          <input
            type="text"
            value={brideName}
            onChange={(e) => setBrideName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome do Noivo</label>
          <input
            type="text"
            value={groomName}
            onChange={(e) => setGroomName(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full bg-green-600 text-white py-2 rounded-xl font-semibold disabled:opacity-50"
        >
          {isSaving ? 'Salvando...' : 'Salvar Alterações'}
        </button>

        {message && <p className="text-sm text-center text-green-600 mt-2">{message}</p>}
      </div>

      <div className="mt-8 text-xs text-text-secondary">
        <p>Em breve: alteração de senha do casal.</p>
      </div>
    </div>
  )
}
