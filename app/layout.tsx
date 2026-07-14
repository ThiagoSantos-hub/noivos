import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Noivos - Planejamento de Casamento',
  description: 'App de planejamento de casamento para noivos — web + mobile',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
