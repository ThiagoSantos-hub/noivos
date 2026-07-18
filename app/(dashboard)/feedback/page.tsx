'use client'

/**
 * Página de Feedback — sugestões e reportar erros
 */

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Lightbulb, Bug, Send } from 'lucide-react'

type FeedbackType = 'ideia' | 'bug'

export default function FeedbackPage() {
  const [type, setType] = useState<FeedbackType>('ideia')
  const [message, setMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim()) return

    setIsSending(true)

    // Por enquanto só simula o envio
    // Depois podemos salvar no Supabase ou enviar por e-mail
    await new Promise((resolve) => setTimeout(resolve, 800))

    setIsSending(false)
    setSent(true)
    setMessage('')
  }

  return (
    <div className="p-4 max-w-md mx-auto pb-24">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/mais" className="p-2 -ml-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={22} />
        </Link>
        <h1 className="text-2xl font-bold">Feedback</h1>
      </div>

      {sent ? (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send size={24} className="text-green-600" />
          </div>
          <h2 className="font-bold text-lg mb-2">Obrigado!</h2>
          <p className="text-sm text-text-secondary mb-5">
            Seu feedback foi enviado. Vamos analisar com carinho.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-green-600 font-semibold text-sm"
          >
            Enviar outro feedback
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Tipo de feedback */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <h2 className="font-semibold text-base mb-3">O que você quer enviar?</h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setType('ideia')}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${type === 'ideia'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                <Lightbulb size={24} className={type === 'ideia' ? 'text-purple-600' : 'text-gray-400'} />
                <span className={`text-sm font-semibold ${type === 'ideia' ? 'text-purple-700' : 'text-text-secondary'}`}>
                  Nova ideia
                </span>
                <span className="text-[11px] text-text-secondary text-center">
                  Sugestão de função
                </span>
              </button>

              <button
                type="button"
                onClick={() => setType('bug')}
                className={`
                  flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all
                  ${type === 'bug'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white'
                  }
                `}
              >
                <Bug size={24} className={type === 'bug' ? 'text-red-600' : 'text-gray-400'} />
                <span className={`text-sm font-semibold ${type === 'bug' ? 'text-red-700' : 'text-text-secondary'}`}>
                  Reportar erro
                </span>
                <span className="text-[11px] text-text-secondary text-center">
                  Bug no sistema
                </span>
              </button>
            </div>
          </div>

          {/* Mensagem */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5">
            <label className="block font-semibold text-base mb-2">
              {type === 'ideia' ? 'Descreva sua ideia' : 'Descreva o erro'}
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={
                type === 'ideia'
                  ? 'Ex: Seria legal ter um checklist de fornecedores...'
                  : 'Ex: Quando eu tento adicionar convidado, aparece um erro...'
              }
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-500 resize-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending || !message.trim()}
            className="w-full bg-green-600 text-white py-3.5 rounded-2xl font-bold text-base shadow-lg disabled:opacity-50 active:scale-[0.98] transition-all"
          >
            {isSending ? 'Enviando...' : 'Enviar Feedback'}
          </button>
        </form>
      )}
    </div>
  )
}
