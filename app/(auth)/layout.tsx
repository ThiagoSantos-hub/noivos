/**
 * Layout para rotas de autenticação (auth)
 * Aplicado a: /login, /cadastro, /convite/[token]
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {children}
    </div>
  )
}
