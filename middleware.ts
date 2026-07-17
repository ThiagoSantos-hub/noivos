import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Middleware básico de proteção de rotas do dashboard.
 *
 * Observação importante:
 * O Supabase client atual está configurado com persistência em localStorage
 * (padrão do @supabase/supabase-js no browser). Por isso este middleware
 * ainda é limitado — ele só consegue ver cookies.
 *
 * Próximo passo recomendado (após este PR):
 * 1. Instalar @supabase/ssr
 * 2. Configurar createServerClient + cookies
 * 3. Atualizar este middleware para validar a sessão de forma confiável
 *
 * Enquanto isso, a proteção client-side (useRequireAuth) continua ativa.
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

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  const isAuthPage = PUBLIC_AUTH_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  )

  // Tenta detectar presença de cookie de sessão do Supabase
  // (quando o client estiver configurado para usar cookies)
  const hasSupabaseCookie = request.cookies
    .getAll()
    .some(
      (cookie) =>
        cookie.name.includes('sb-') &&
        (cookie.name.includes('auth-token') || cookie.name.includes('access-token'))
    )

  // Se for rota protegida e não houver indício de sessão → login
  if (isProtected && !hasSupabaseCookie) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Se já estiver autenticado e tentar acessar login/cadastro → dashboard
  if (isAuthPage && hasSupabaseCookie) {
    return NextResponse.redirect(new URL('/inicio', request.url))
  }

  return NextResponse.next()
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
