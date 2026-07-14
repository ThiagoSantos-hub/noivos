import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/images/aliancas.png"
            alt="Alianças de casamento"
            width={120}
            height={120}
          />
        </div>
        <h1 className="text-4xl font-bold mb-4" style={{ color: '#1E293B' }}>
          Noivos
        </h1>
        <p className="text-lg mb-8" style={{ color: '#64748B' }}>
          Planejamento de casamento para noivos
        </p>

        <div className="space-y-4">
          <Link
            href="/cadastro"
            className="block w-full py-3 px-4 rounded-lg font-semibold text-white text-center transition-all"
            style={{ backgroundColor: '#22C55E' }}
          >
            Começar Agora
          </Link>

          <Link
            href="/login"
            className="block w-full py-3 px-4 rounded-lg font-semibold text-center border-2 transition-all"
            style={{ color: '#22C55E', borderColor: '#22C55E' }}
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </main>
  )
}
