/**
 * Cliente Supabase para Server Components, Route Handlers e Server Actions
 * Usa cookies do Next.js para manter a sessão
 */

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll pode ser chamado de um Server Component.
            // Pode ser ignorado com segurança se o middleware estiver
            // renovando as sessões do usuário.
          }
        },
      },
    }
  )
}
