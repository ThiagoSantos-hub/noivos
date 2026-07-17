import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/services/supabase/middleware'

/**
 * Middleware de autenticação
 *
 * - Renova a sessão do Supabase automaticamente (cookies)
 * - Protege as rotas do dashboard
 * - Redireciona usuários autenticados que tentam acessar /login ou /cadastro
 */

const PROTECTED_PREFIXES = [
  '/inicio',
  '/convidados',
  '/tarefas',
  '/fornecedores',
  '/padrinhos',
  '/configuracoes',
]

const PUBLIC_AUTH_PATHS = ['/login', '/cadastro']

export async function middleware(request: NextRequest) {
  const { user, supabaseResponse } = await updateSession(request)
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  const isAuthPage = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  // Rota protegida sem usuário autenticado → redireciona para login
  if (isProtected && !user) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usuário autenticado tentando acessar login/cadastro → vai para o dashboard
  if (isAuthPage && user) {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images / public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|manifest.json|sw.js|workbox-).*)',
  ],
}
