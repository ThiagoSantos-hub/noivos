'use client'

/**
 * PWAInstallPrompt — popup de instalação na primeira entrada
 */

import React, { useState, useEffect } from 'react'
import Image from 'next/image'

const STORAGE_KEY = 'noivos_pwa_dismissed'

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isIOS, setIsIOS] = useState(false)

  useEffect(() => {
    // Já instalado (modo standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true

    if (isStandalone) return

    // Já fechou antes
    if (localStorage.getItem(STORAGE_KEY) === '1') return

    // Detecta iOS
    const ios =
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    setIsIOS(ios)

    // Android / Chrome — captura o evento nativo
    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // iOS ou se o evento não vier — mostra o popup depois de 1.5s
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 1500)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setIsVisible(false)
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      console.log('Instalação:', outcome)
      setDeferredPrompt(null)
      localStorage.setItem(STORAGE_KEY, '1')
      setIsVisible(false)
    } else {
      // iOS ou navegador sem suporte — só fecha (as instruções já estão no texto)
      dismiss()
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 flex flex-col items-center text-center">
        <div className="relative w-20 h-20 mb-4">
          <Image
            src="/images/aliancas.png"
            alt="Noivos"
            fill
            style={{ objectFit: 'contain' }}
          />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-2">
          Instalar o App Noivos
        </h3>

        {isIOS ? (
          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            Toque em{' '}
            <span className="inline-flex items-center px-1.5 py-0.5 bg-gray-100 rounded text-xs font-semibold">
              Compartilhar
            </span>{' '}
            e depois em{' '}
            <strong>“Adicionar à Tela de Início”</strong>
          </p>
        ) : (
          <p className="text-sm text-slate-600 mb-5 leading-relaxed">
            Adicione à tela inicial do seu celular para acessar o planejamento do casamento com um toque.
          </p>
        )}

        <div className="flex w-full gap-3">
          <button
            onClick={dismiss}
            className="flex-1 py-3 text-sm font-semibold text-slate-500 bg-gray-100 rounded-xl"
          >
            Agora não
          </button>

          {!isIOS && (
            <button
              onClick={handleInstallClick}
              className="flex-1 py-3 text-sm font-bold text-white bg-green-600 rounded-xl shadow-lg"
            >
              Instalar
            </button>
          )}

          {isIOS && (
            <button
              onClick={dismiss}
              className="flex-1 py-3 text-sm font-bold text-white bg-green-600 rounded-xl shadow-lg"
            >
              Entendi
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
