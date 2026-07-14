import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-6 py-12" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="flex flex-col items-center text-center w-full max-w-md">
        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: '#1E293B' }}>
          Noivos
        </h1>
        <p className="text-lg md:text-xl mb-8" style={{ color: '#64748B' }}>
          O planejamento do seu casamento começa aqui.
        </p>

        <div className="w-full space-y-4">
          <Link
            href="/cadastro"
            className="block w-full py-4 px-6 rounded-xl font-bold text-white text-center text-lg shadow-lg shadow-green-100 transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: '#22C55E' }}
          >
            Começar Agora
          </Link>

          <Link
            href="/login"
            className="block w-full py-4 px-6 rounded-xl font-bold text-center text-lg border-2 transition-all hover:bg-green-50 active:scale-[0.98]"
            style={{ color: '#22C55E', borderColor: '#22C55E' }}
          >
            Fazer Login
          </Link>
        </div>
      </div>
    </div>
  )
}
