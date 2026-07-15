'use client'

/**
 * BottomNav — barra de navegação fixa no rodapé
 * Exibe ícones para as 5 seções principais do app
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, DollarSign, Users, CheckSquare, MoreHorizontal } from 'lucide-react'

interface INavItem {
  href: string
  label: string
  icon: React.ReactNode
  activeIcon?: React.ReactNode
}

const NAV_ITEMS: INavItem[] = [
  {
    href: '/inicio',
    label: 'Início',
    icon: <Home size={22} strokeWidth={1.5} />,
    activeIcon: <Home size={22} strokeWidth={2.5} />,
  },
  {
    href: '/financeiro',
    label: 'Financeiro',
    icon: <DollarSign size={22} strokeWidth={1.5} />,
    activeIcon: <DollarSign size={22} strokeWidth={2.5} />,
  },
  {
    href: '/convidados',
    label: 'Convidados',
    icon: <Users size={22} strokeWidth={1.5} />,
    activeIcon: <Users size={22} strokeWidth={2.5} />,
  },
  {
    href: '/tarefas',
    label: 'Tarefas',
    icon: <CheckSquare size={22} strokeWidth={1.5} />,
    activeIcon: <CheckSquare size={22} strokeWidth={2.5} />,
  },
  {
    href: '/mais',
    label: 'Mais',
    icon: <MoreHorizontal size={22} strokeWidth={1.5} />,
    activeIcon: <MoreHorizontal size={22} strokeWidth={2.5} />,
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav
      aria-label="Navegação principal"
      className="
        fixed bottom-0 left-0 right-0 z-50
        bg-white border-t border-gray-200
        safe-area-inset-bottom
      "
    >
      <ul
        className="flex items-stretch justify-around max-w-lg mx-auto"
        role="list"
      >
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  flex flex-col items-center justify-center gap-1
                  py-2 px-1 min-h-[56px] w-full
                  transition-colors duration-150
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-primary-DEFAULT focus-visible:ring-inset
                  ${
                    isActive
                      ? 'text-primary-dark'
                      : 'text-text-secondary hover:text-primary-DEFAULT'
                  }
                `}
              >
                {/* Ícone */}
                <span aria-hidden="true">
                  {isActive ? (item.activeIcon ?? item.icon) : item.icon}
                </span>

                {/* Label */}
                <span
                  className={`
                    text-[10px] leading-tight font-medium
                    ${isActive ? 'text-primary-dark' : 'text-text-secondary'}
                  `}
                >
                  {item.label}
                </span>

                {/* Indicador de ativo */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="
                      absolute top-0 left-1/2 -translate-x-1/2
                      w-6 h-0.5 bg-primary-dark rounded-full
                    "
                  />
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
