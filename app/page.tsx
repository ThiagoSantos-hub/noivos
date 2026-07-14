/**
 * Página Inicial - Landing Page Romântica
 * Rota: /
 * Thiago & Rayana - Nossa História
 */

'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-green-100 overflow-x-hidden">
      {/* Hero Section - Abertura */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/historia/casamento_sonho.jpg"
            alt="Thiago e Rayana - Nosso Sonho"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-3xl">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20">
              <Image src="/images/aliancas.png" alt="Logo Noivos" fill className="object-contain" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-blue-900 mb-4">Noivos</h1>
          <p className="text-xl md:text-2xl font-light text-slate-600 mb-8 italic">
            "O amor nunca falha." — 1 Coríntios 13:8
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="#historia" 
              className="px-8 py-4 bg-blue-900 text-white rounded-full font-bold shadow-xl hover:bg-blue-800 transition-all"
            >
              Conheça nossa história
            </Link>
            <Link 
              href="/login" 
              className="px-8 py-4 border-2 border-blue-900 text-blue-900 rounded-full font-bold hover:bg-blue-50 transition-all"
            >
              Já sou Noivo
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-10 animate-bounce">
          <svg className="w-6 h-6 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Nossa História */}
      <section id="historia" className="py-20 px-6 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-blue-900 mb-4">Thiago & Rayana</h2>
          <div className="h-1 w-24 bg-green-500 mx-auto rounded-full"></div>
        </div>

        {/* Capítulo 1: O Encontro */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="flex-1 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/historia/encontro.jpg" alt="O Encontro" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <span className="text-green-600 font-bold tracking-widest uppercase text-sm">O Começo</span>
            <h3 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Um Encontro de Propósito</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Tudo começou de uma forma moderna, mas guiada por valores antigos. Thiago e Rayana se conheceram em um aplicativo cristão. O que começou com conversas profundas e conexão imediata, logo se tornou algo especial.
            </p>
          </div>
        </div>

        {/* Capítulo 2: O Reencontro */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-12 mb-24">
          <div className="flex-1 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/historia/namoro.jpg" alt="O Namoro" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <span className="text-green-600 font-bold tracking-widest uppercase text-sm">O Reencontro</span>
            <h3 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Caminhos que se Cruzam</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Após um tempo afastados, os caminhos se cruzaram novamente. O reencontro foi a confirmação de que o tempo só serviu para fortalecer o que estava destinado a ser. O namoro começou com a certeza de que a jornada seria eterna.
            </p>
          </div>
        </div>

        {/* Capítulo 3: O Planejamento */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-24">
          <div className="flex-1 relative aspect-[4/3] w-full rounded-3xl overflow-hidden shadow-2xl">
            <Image src="/images/historia/planejamento.jpg" alt="O Planejamento" fill className="object-cover" />
          </div>
          <div className="flex-1">
            <span className="text-green-600 font-bold tracking-widest uppercase text-sm">O Sonho</span>
            <h3 className="text-3xl font-bold text-blue-900 mt-2 mb-4">Planejando o Sim</h3>
            <p className="text-lg text-slate-600 leading-relaxed">
              Um mês de namoro e o coração já falava em casamento. Aos três meses, o buffet já estava alugado. O planejamento intenso nasceu da vontade de celebrar o amor com cada detalhe perfeito. E assim nasceu o <span className="font-bold text-blue-900">Noivos</span>, para ajudar outros casais a viverem essa mesma organização.
            </p>
          </div>
        </div>
      </section>

      {/* Chamada para Ação Final */}
      <section className="bg-slate-50 py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-bold text-blue-900 mb-6">1º de Maio de 2027</h2>
          <p className="text-xl text-slate-600 mb-10">
            Nossa jornada rumo ao altar continua, e queremos que a sua seja tão organizada e especial quanto a nossa.
          </p>
          
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 mb-10">
            <h4 className="text-2xl font-bold text-slate-800 mb-2">Plano Noivos Pro</h4>
            <p className="text-slate-500 mb-6">Tudo o que você precisa na palma da mão</p>
            <div className="text-5xl font-bold text-green-600 mb-6">R$ 9,90<span className="text-lg text-slate-400 font-normal">/mês</span></div>
            <ul className="text-left text-slate-600 space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                Controle financeiro e buffet
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                Lista de convidados e tarefas
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/></svg>
                Acesso compartilhado (Noivo & Noiva)
              </li>
            </ul>
            <Link 
              href="/cadastro" 
              className="block w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              Inicie a nova história de vocês
            </Link>
          </div>
          
          <p className="text-sm text-slate-400">
            Pagamento seguro via Asaas (Pix ou Cartão de Crédito)
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
        <p>© 2026 Noivos App - Criado com amor por Thiago & Rayana</p>
      </footer>
    </div>
  )
}
