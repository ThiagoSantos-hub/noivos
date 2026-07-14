/**
 * PWAInstallPrompt - Exibe um convite para adicionar o app à tela inicial do celular
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './Button'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      // Impede o mini-infobar do Chrome de aparecer no mobile
      e.preventDefault()
      // Guarda o evento para ser disparado depois
      setDeferredPrompt(e)
      // Mostra o nosso pop-up customizado
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Detecta se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches
    if (isStandalone) {
      setIsVisible(false)
    }

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostra o prompt nativo do navegador
    deferredPrompt.prompt()

    // Aguarda a escolha do usuário
    const { outcome } = await deferredPrompt.userChoice
    console.log(`Usuário escolheu: ${outcome}`)

    // Limpa o evento
    setDeferredPrompt(null)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-6 left-6 right-6 z-[100] animate-bounce-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 p-5 flex flex-col items-center text-center">
        <div className="relative w-16 h-16 mb-3">
          <Image
            src="/images/aliancas.png"
            alt="Noivos Logo"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Instalar o App Noivos
        </h3>
        <p className="text-sm text-slate-600 mb-4">
          Adicione à sua tela inicial para acessar rapidamente o planejamento do seu casamento.
        </p>

        <div className="flex w-full gap-3">
          <button
            onClick={() => setIsVisible(false)}
            className="flex-1 py-3 text-sm font-semibold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors"
          >
            Agora não
          </button>
          <Button
            onClick={handleInstallClick}
            className="flex-1 py-3 text-sm font-bold rounded-xl shadow-lg shadow-green-100"
            style={{ backgroundColor: '#22C55E' }}
          >
            Adicionar à tela
          </Button>
        </div>
      </div>
    </div>
  )
}
