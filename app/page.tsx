import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex flex-col items-center text-center w-full max-w-md">
        <div className="flex justify-center">
          <div className="relative w-[100px] h-[100px] md:w-[120px] md:h-[120px]">
            <Image
              src="/images/aliancas.png"
              alt="Alianças de casamento"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4 -mt-2" style={{ color: '#1E293B' }}>
          Noivos
        </h1>
        <p className="text-lg mb-8" style={{ color: '#64748B' }}>
          Planejamento de casamento para noivos
        </p>

        <div className="w-full space-y-4">
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
